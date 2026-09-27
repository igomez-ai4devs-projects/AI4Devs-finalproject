import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type {
  IncidentCreatedResponse,
  IncidentDetailResponse,
  LogIncidentRequesterRequest,
} from '@sport-itsm/shared-contracts';
import { INCIDENT_API_BASE_URL } from './incident-api-base-url.token';

/**
 * The one place in the frontend that speaks `HttpClient` for Incidents
 * (`T-C1-09`, `ARCHITECTURE.md` §7.1). Thin by construction: it shapes
 * requests and types responses with `libs/shared/contracts`' DTOs and
 * nothing else — no state, no error mapping (`incident-api-error.ts` owns
 * that), no retry/backoff policy. `IncidentStore` is this service's only
 * intended caller; a component that wants Incident data goes through the
 * store, never through this service directly (`type:ui` may not inject
 * `HttpClient` at all — `sport-itsm-architecture` guardrails).
 *
 * Both methods return the raw `HttpClient` `Observable` uninterpreted: a
 * failing request completes with an `HttpErrorResponse` on the `error`
 * channel exactly as `HttpClient` produces it, mapped to
 * {@link IncidentApiError} by the caller (`IncidentStore`), never swallowed
 * here (`T-C1-09` AC2).
 */
@Injectable({ providedIn: 'root' })
export class IncidentApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(INCIDENT_API_BASE_URL);

  /**
   * `POST {baseUrl}/incidents` (`T-C1-08`). Returns only the reference the
   * requester is entitled to see — the contract's own `IncidentCreatedResponse`,
   * nothing this service adds or infers.
   */
  logIncidentAsRequester(
    request: LogIncidentRequesterRequest,
  ): Observable<IncidentCreatedResponse> {
    return this.http.post<IncidentCreatedResponse>(
      `${this.baseUrl}/incidents`,
      request,
    );
  }

  /**
   * `GET {baseUrl}/incidents/{reference}` (`T-C1-100`). `reference` is a
   * plain `string` here, never `TicketReference` — that value object lives in
   * `incident-domain`, `platform:backend`, off-limits to a `type:data-access`
   * library (`T-C1-09` Trap 5); this library trusts the reference syntax the
   * component already rendered and lets the server's own validation reject a
   * malformed one as `400` (surfaced through {@link IncidentApiError} like any
   * other API failure).
   */
  getIncidentByReference(
    reference: string,
  ): Observable<IncidentDetailResponse> {
    return this.http.get<IncidentDetailResponse>(
      `${this.baseUrl}/incidents/${encodeURIComponent(reference)}`,
    );
  }
}
