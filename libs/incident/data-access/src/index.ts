/**
 * `@sport-itsm/incident-data-access` — the public API of the `incident` context's
 * data-access library (`type:data-access`, ARCHITECTURE.md §5.1).
 *
 * `T-C1-09` fills this barrel with the first business-facing frontend code in
 * the repository: `IncidentApiService` (the only place that speaks
 * `HttpClient` for Incidents), `IncidentStore` (the signals-based state every
 * later ticket reads from), and the typed error union `IncidentStore`'s error
 * signals carry. `INCIDENT_API_BASE_URL` is exported so `apps/web` — or a
 * future proxy/SSR config — can override the default `'/api'` base without
 * reaching into this library's internals (see the token's own doc comment).
 *
 * Internal `AsyncOperationState` and the error-mapping helpers stay
 * unexported: nothing outside this library constructs a store state or an
 * `IncidentApiError` by hand.
 */
export { IncidentApiService } from './lib/incident-api.service';
export { INCIDENT_API_BASE_URL } from './lib/incident-api-base-url.token';
export { IncidentStore } from './lib/incident.store';
export type {
  IncidentApiError,
  IncidentApiFailure,
  IncidentTransportFailure,
} from './lib/incident-api-error';
