import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ErrorCode } from '@sport-itsm/shared-contracts';
import type {
  IncidentDetailResponse,
  IncidentOriginChannel,
  IncidentPriority,
} from '@sport-itsm/shared-contracts';
import { IncidentStore } from '@sport-itsm/incident-data-access';
import {
  INCIDENT_MESSAGES,
  ORIGIN_CHANNEL_LABELS,
  PRIORITY_LABELS,
} from '../incident-messages';
import { formatLoggedAt } from './incident-detail-formatting';

/**
 * The one always-rendered state this component's template switches on
 * (`T-C1-101` Scope: "never an undefined intermediate state", Trap 2: "not
 * three states, more"). A discriminated union, not independent booleans, for
 * the same reason `IncidentStore`'s own internal state is one
 * (`incident.store.ts`'s own doc comment): it makes "loading and errored at
 * once" structurally unrepresentable instead of merely undocumented.
 *
 * `'invalid-reference'` and `'not-found'` are kept apart on purpose — see
 * `INCIDENT_MESSAGES.detail.invalidReferenceMessage`'s own doc comment for
 * why a malformed reference is not folded into "not found".
 */
type IncidentDetailViewState =
  | { readonly kind: 'loading' }
  | { readonly kind: 'invalid-reference' }
  | { readonly kind: 'not-found' }
  | { readonly kind: 'network-error' }
  | { readonly kind: 'server-error'; readonly supportCode: string | null }
  | { readonly kind: 'loaded'; readonly incident: IncidentDetailResponse };

/** True for the one `{ field, rule }` pair `GetIncidentByReferenceParamsDto`'s `@Matches()` can ever report (`apps/api/src/app/incident/dto/get-incident-by-reference-params.dto.ts`). */
function isMalformedReferenceDetail(detail: {
  readonly field: string;
  readonly rule: string;
}): boolean {
  return detail.field === 'reference' && detail.rule === 'matches';
}

/**
 * The routed detail screen for a single Incident (`T-C1-101`, `US-C1-01`,
 * `FR-INC-01`) — the "see it" half of the slice `T-C1-10`'s intake form
 * starts, reached either by that form's post-submit redirect or by a direct
 * visit to `/incidents/{reference}`. Reads exclusively through
 * `IncidentStore` (`T-C1-09`/`T-C1-100`), never `HttpClient` directly.
 *
 * **Two deviations accepted for this slice (ticket's own "Context"
 * section):** no `libs/shared/ui`/`libs/incident/ui` composition yet — the
 * template below is hand-written semantic HTML meeting the same
 * accessibility bar; every string is a reference into `incident-messages.ts`,
 * never a literal.
 *
 * **Out of scope (ticket's own Scope):** no editing action on the Incident,
 * and no in-app navigation *to* this route beyond the post-intake redirect —
 * this component never renders a link to another reference.
 */
@Component({
  selector: 'incident-detail',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.scss',
})
export class IncidentDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly incidentStore = inject(IncidentStore);

  protected readonly messages = INCIDENT_MESSAGES.detail;
  protected readonly originChannelLabels = ORIGIN_CHANNEL_LABELS;
  protected readonly priorityLabels = PRIORITY_LABELS;

  private readonly mainHeadingRef =
    viewChild<ElementRef<HTMLElement>>('mainHeading');

  /**
   * The route's own `:reference` segment (`incident-routes.ts`).
   *
   * **Read via `ActivatedRoute`, not `withComponentInputBinding()` (Trap
   * 3).** The latter is not registered on `apps/web`'s `provideRouter` today
   * (`apps/web/src/app/app.config.ts`), and adding it would be a shell-wide
   * change made for one component's convenience. `ActivatedRoute.paramMap`
   * already gives this component everything Trap 3 asks for — including
   * reacting to the param changing without the component being destroyed
   * (see the constructor's first `effect()` below) — with zero `apps/web`
   * changes. Reported as a finding for whoever next needs
   * `withComponentInputBinding` for a reason that spans more than one
   * component.
   *
   * `requireSync: true`: the router resolves route params before activating
   * a route, so `ActivatedRoute.paramMap` always has a current value the
   * instant this component is constructed — `toSignal` never actually needs
   * a placeholder, and asserting that removes `undefined` from every reader
   * below instead of threading it through each one.
   */
  protected readonly reference = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('reference'))),
    { requireSync: true },
  );

  /**
   * Derives the one view state the template renders from `IncidentStore`'s
   * three independent signals. `detailLoading`, `detailError` and
   * `incidentDetail` can never disagree with each other — they all read the
   * same underlying discriminated state (`IncidentStore`'s own doc comment)
   * — so checking them in this order is equivalent to, but reads simpler
   * than, re-deriving that union from scratch here.
   */
  protected readonly viewState = computed<IncidentDetailViewState>(() => {
    if (this.incidentStore.detailLoading()) {
      return { kind: 'loading' };
    }

    const error = this.incidentStore.detailError();
    if (error !== null) {
      if (error.kind === 'network-error') {
        return { kind: 'network-error' };
      }
      if (error.code === ErrorCode.NOT_FOUND) {
        return { kind: 'not-found' };
      }
      if (
        error.code === ErrorCode.VALIDATION_FAILED &&
        (error.details ?? []).some(isMalformedReferenceDetail)
      ) {
        return { kind: 'invalid-reference' };
      }
      return { kind: 'server-error', supportCode: error.correlationId };
    }

    const incident = this.incidentStore.incidentDetail();
    if (incident !== null) {
      return { kind: 'loaded', incident };
    }

    // The store's own idle state, observable only in the instant between
    // this component's construction and its own constructor effect below
    // actually issuing the first load. Reporting it as "loading" is accurate
    // (a load is about to start in the same tick) and keeps the state space
    // this component's template has to render at exactly the six kinds
    // above — never a seventh, undocumented "nothing yet" case.
    return { kind: 'loading' };
  });

  /**
   * `viewState().incident` narrowed once here, as its own signal, rather than
   * accessed through `@if (viewState().incident; as incident)` inside the
   * template's `@switch` — Angular's template type-checker does not narrow a
   * `@switch (expr.kind)` discriminant back onto `expr` itself the way a
   * TypeScript `switch` statement narrows a local variable, so reading
   * `.incident` directly off `viewState()` in the template would not
   * type-check against the union declared above. This computed signal's own
   * return type (`IncidentDetailResponse | null`) is what the template
   * actually narrows with `@if ( … ; as incident)`.
   */
  protected readonly loadedIncident = computed<IncidentDetailResponse | null>(
    () => {
      const state = this.viewState();
      return state.kind === 'loaded' ? state.incident : null;
    },
  );

  /** Same reasoning as {@link loadedIncident}, for the `'server-error'` state's optional support code. */
  protected readonly serverErrorSupportCode = computed<string | null>(() => {
    const state = this.viewState();
    return state.kind === 'server-error' ? state.supportCode : null;
  });

  constructor() {
    // Starts — and re-starts — the load whenever the route's own reference
    // changes, including a same-route-config transition from one reference
    // to another that the router reuses this component instance for rather
    // than destroying it (Trap 2). `IncidentStore.loadIncidentByReference`
    // sets its state to `'loading'` synchronously before ever subscribing to
    // the HTTP call (`incident.store.ts`'s own doc comment), so `viewState`
    // above can never observe the *previous* reference's `'loaded'` data
    // once this effect fires for a new one — not even for a single frame.
    effect(() => {
      const reference = this.reference();
      if (reference !== null) {
        this.incidentStore.loadIncidentByReference(reference);
      }
    });

    // Moves focus to the main heading every time this component starts
    // showing a (possibly different) reference — both the very first mount,
    // which is how a requester lands here after `T-C1-10`'s post-intake
    // redirect, and a later reused-instance transition to a different
    // reference. Deferred to the next macrotask for the same reason
    // `incident-intake-form.component.ts`'s own `focusErrorSummary` is: the
    // queried element is not guaranteed to exist yet in the instant this
    // effect runs, and focusing nothing is a silent no-op.
    effect(() => {
      this.reference();
      setTimeout(() => this.mainHeadingRef()?.nativeElement.focus());
    });
  }

  protected formatLoggedAt(loggedAt: string): string {
    return formatLoggedAt(loggedAt);
  }

  protected originChannelText(channel: IncidentOriginChannel): string {
    return this.originChannelLabels[channel];
  }

  /**
   * `priority` is `null` for every Incident today (Priority is derived from
   * Impact x Urgency, `FR-INC-04`, and no ticket assesses either yet) — the
   * non-null branch exercises {@link PRIORITY_LABELS} against a real value
   * only once a later ticket sets one, but is written now so this method's
   * behavior never needs revisiting when that day comes.
   */
  protected priorityText(priority: IncidentPriority | null): string {
    return priority === null
      ? this.messages.priorityUnset
      : this.priorityLabels[priority];
  }

  protected impactText(impact: number | null): string {
    return impact === null ? this.messages.impactUnset : String(impact);
  }

  protected urgencyText(urgency: number | null): string {
    return urgency === null ? this.messages.urgencyUnset : String(urgency);
  }

  /**
   * `affectedServiceId`/`categoryId` are raw UUIDs with no name-resolution
   * catalog yet (`incident-messages.ts`'s own doc comment on
   * `affectedServicePresent`/`categoryPresent` — Trap 4, reported as a
   * finding). Never rendering the id itself keeps this plain-language screen
   * from showing a value no requester can act on; `unsetText`/`presentText`
   * are passed in rather than hardcoded so this one method serves both
   * fields without duplicating the null-check.
   */
  protected identifierPresenceText(
    id: string | null,
    unsetText: string,
    presentText: string,
  ): string {
    return id === null ? unsetText : presentText;
  }

  protected competitionAffectsInProgressText(flag: boolean): string {
    return flag ? this.messages.yes : this.messages.no;
  }
}
