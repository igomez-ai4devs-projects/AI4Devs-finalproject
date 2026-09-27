import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import type {
  IncidentCreatedResponse,
  IncidentDetailResponse,
  LogIncidentRequesterRequest,
} from '@sport-itsm/shared-contracts';
import { IncidentApiService } from './incident-api.service';
import { IncidentApiError, toIncidentApiError } from './incident-api-error';

/**
 * A single operation's state, discriminated on `status` so "loading" and
 * "error" can never both be true at once and no field is ever read while
 * `undefined` (`T-C1-09` Trap 3 / AC1 / AC2 / AC5). Three plain booleans+data
 * signals were rejected in favor of this one discriminated signal precisely
 * because they can drift out of sync with each other; deriving `loading`,
 * `error` and `data` from a single source with `computed()` makes the
 * combination "loading + error" structurally unrepresentable instead of
 * merely undocumented.
 */
type AsyncOperationState<TData> =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'success'; readonly data: TData }
  | { readonly status: 'error'; readonly error: IncidentApiError };

const IDLE_STATE: AsyncOperationState<never> = { status: 'idle' };

/**
 * The Incident context's one signals-based store (`T-C1-09`,
 * `ARCHITECTURE.md` §7.1) — every later ticket that reads or writes an
 * Incident from the browser (`T-C1-10`'s intake form, `T-C1-101`'s detail
 * screen) goes through this class, never through `IncidentApiService`
 * directly.
 *
 * **Scope: `providedIn: 'root'`.** A single instance for the whole
 * application, not one scoped to a route or feature. Justification: `T-C1-10`
 * submits the intake form and then navigates to `T-C1-101`'s detail route for
 * the reference just created — a route-scoped store would be destroyed on
 * that navigation before the detail screen could read
 * {@link IncidentStore.createdIncidentReference}, forcing the reference
 * through router state or a query param instead. A root singleton lets the
 * two screens share state the simple way. The cost (state persists across
 * unrelated navigations) is not a concern yet: nothing in this delivery slice
 * needs the intake state cleared on navigation away, and the "ignore while
 * loading" rule below already prevents a stale in-flight submit from leaking
 * into a later attempt.
 *
 * **No `effect()`.** Every state transition happens exactly where its
 * trigger is (`logIncidentAsRequester`, `loadIncidentByReference`) — there is
 * no derived state that needs to *react* to another signal changing, so an
 * `effect()` here would only add indirection (`sport-itsm-frontend`:
 * `effect()` sparingly, only with a real reason).
 *
 * **Double-submit (Trap 3).** `logIncidentAsRequester` is a no-op while an
 * intake call is already `loading`. Cancelling the in-flight `POST` instead
 * (unsubscribing from the Observable) would abort the client's *view* of the
 * request but not necessarily the server's processing of a request already
 * in flight — the network layer has no guarantee the server hasn't already
 * received and started acting on it. A second `POST` racing the first would
 * risk creating **two** Incidents for one user action; ignoring the second
 * click while the first is outstanding avoids that risk entirely, at the
 * cost of a rare, harmless no-op if a user double-clicks a submit button.
 *
 * **Detail race condition (Trap 3).** `loadIncidentByReference` tags every
 * call with a monotonically increasing request id and only applies a
 * response whose id matches the *latest* call. If A is requested and then B
 * is requested before A resolves, A's eventual response — success or error —
 * is discarded; only B's outcome is ever written to
 * {@link IncidentStore.incidentDetail} / {@link IncidentStore.detailError}.
 * A plain counter was chosen over RxJS `switchMap` because the store already
 * has no other reason to hold an RxJS pipeline open (`sport-itsm-frontend`:
 * signals first, RxJS sparingly) — `HttpClient`'s Observable already
 * completes after one emission, so a counter is the whole mechanism needed.
 */
@Injectable({ providedIn: 'root' })
export class IncidentStore {
  private readonly incidentApi = inject(IncidentApiService);

  private readonly intakeState =
    signal<AsyncOperationState<IncidentCreatedResponse>>(IDLE_STATE);
  private readonly detailState =
    signal<AsyncOperationState<IncidentDetailResponse>>(IDLE_STATE);

  /** Guards the detail race condition described above; never exposed. */
  private detailRequestSequence = 0;

  /** `true` for exactly the span between an intake `POST` starting and settling. */
  readonly intakeLoading: Signal<boolean> = computed(
    () => this.intakeState().status === 'loading',
  );

  /** The typed intake failure, or `null` when there isn't one — never `undefined` (AC2). */
  readonly intakeError: Signal<IncidentApiError | null> = computed(() => {
    const state = this.intakeState();
    return state.status === 'error' ? state.error : null;
  });

  /**
   * The reference of the Incident just created, for `T-C1-10` to navigate to
   * `T-C1-101`'s detail route with. `null` before a successful intake.
   */
  readonly createdIncidentReference: Signal<string | null> = computed(() => {
    const state = this.intakeState();
    return state.status === 'success' ? state.data.reference : null;
  });

  /** `true` for exactly the span between a detail `GET` starting and settling. */
  readonly detailLoading: Signal<boolean> = computed(
    () => this.detailState().status === 'loading',
  );

  /**
   * The typed detail failure, or `null` when there isn't one. A `404` lands
   * here as `{ kind: 'api-error', code: 'NOT_FOUND', ... }` — it never
   * reaches a caller as a thrown exception (AC5).
   */
  readonly detailError: Signal<IncidentApiError | null> = computed(() => {
    const state = this.detailState();
    return state.status === 'error' ? state.error : null;
  });

  /** The persisted Incident state for `T-C1-101` to render. `null` before a successful load. */
  readonly incidentDetail: Signal<IncidentDetailResponse | null> = computed(
    () => {
      const state = this.detailState();
      return state.status === 'success' ? state.data : null;
    },
  );

  /**
   * Submits requester intake (`T-C1-08`). A no-op while a previous call is
   * still `loading` — see this class's own doc comment for why a second
   * click is ignored rather than cancelling the first.
   */
  logIncidentAsRequester(request: LogIncidentRequesterRequest): void {
    if (this.intakeState().status === 'loading') {
      return;
    }

    this.intakeState.set({ status: 'loading' });
    this.incidentApi.logIncidentAsRequester(request).subscribe({
      next: (data) => this.intakeState.set({ status: 'success', data }),
      error: (httpError: HttpErrorResponse) =>
        this.intakeState.set({
          status: 'error',
          error: toIncidentApiError(httpError),
        }),
    });
  }

  /**
   * Loads an Incident by its reference (`T-C1-100`). Race-safe against a
   * newer call to this same method — see this class's own doc comment.
   */
  loadIncidentByReference(reference: string): void {
    const requestId = ++this.detailRequestSequence;
    this.detailState.set({ status: 'loading' });

    this.incidentApi.getIncidentByReference(reference).subscribe({
      next: (data) => {
        if (requestId !== this.detailRequestSequence) {
          return;
        }
        this.detailState.set({ status: 'success', data });
      },
      error: (httpError: HttpErrorResponse) => {
        if (requestId !== this.detailRequestSequence) {
          return;
        }
        this.detailState.set({
          status: 'error',
          error: toIncidentApiError(httpError),
        });
      },
    });
  }
}
