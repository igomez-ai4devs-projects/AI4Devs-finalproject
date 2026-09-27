/**
 * Wire shapes for requester intake of an Incident (`T-C1-08`, `US-C1-01`,
 * `FR-INC-01`) — `POST /api/incidents`.
 *
 * **Types only (ADR-007).** `apps/api` declares a `class-validator`-decorated
 * DTO in its own tree that structurally `implements` the request type below;
 * this library never imports `class-validator` or any decorator (see this
 * barrel's own doc comment and `T-C1-08`'s reported finding: the ticket's own
 * Scope text asked for the decorated DTO to live here, which ADR-007 and this
 * library's own convention forbid).
 *
 * **Why this is not (yet) `LogIncidentRequest` / `IncidentDetailResponse`.**
 * `ARCHITECTURE.md` §7.1's diagram names those two types for the eventual,
 * full Incident-intake round trip. This ticket declares neither:
 * - The **request** a requester may send is deliberately narrower than any
 *   future "log an Incident" request — it has no `originChannel` (the server
 *   fixes it to `'portal'`, `FR-OMN-02`; a client cannot declare
 *   `agent_logged`) and none of the four priority-bearing fields (Impact,
 *   Urgency, Priority, the competition-in-progress flag — `US-C1-01`,
 *   `NFR-SEC-02`). The agent-intake request (`T-C1-11`) is shaped
 *   differently again (it needs a reporter). A single `LogIncidentRequest`
 *   shared by every intake path would either over-grant the portal path or
 *   under-serve the agent path; this type is named for exactly the actor it
 *   serves instead.
 * - The **response** is deliberately minimal — the reference number only,
 *   nothing else the requester cannot already see (`T-C1-08` AC3). The full
 *   `IncidentDetailResponse` the diagram anticipates belongs to the read-by-
 *   reference route (`T-C1-99`/`T-C1-100`), out of this ticket's scope.
 *
 * Reported as a finding for the architect: confirm whether
 * `LogIncidentRequesterRequest` should be renamed once `T-C1-11`'s
 * agent-intake shape exists, so the two share a naming scheme, and whether
 * `IncidentCreatedResponse` should be absorbed into `IncidentDetailResponse`
 * once `T-C1-100` defines it (a `201` could plausibly return the same shape a
 * later `GET` does) rather than staying its own type indefinitely.
 */

/**
 * What a requester may submit to log an Incident about themselves. Every
 * field a requester cannot be trusted to set is simply **absent** from this
 * type — not accepted and discarded, not defaulted — so the generated
 * `class-validator` DTO in `apps/api` has nothing to `@IsOptional()` around
 * and `forbidNonWhitelisted` rejects it outright if a client sends it anyway
 * (`ValidationPipe`, `ARCHITECTURE.md` §6.3):
 * - `originChannel` — fixed to `'portal'` by the server (`FR-OMN-02`).
 * - `reporterId` — always the caller's own resolved identity.
 * - `impact`, `urgency`, `priority`, the competition-in-progress flag — not
 *   settable at intake by any requester (`US-C1-01`).
 */
export interface LogIncidentRequesterRequest {
  readonly shortDescription: string;
  readonly description: string;
  /** UUID of the affected `Service` (`service-catalog`); optional — `DATA-MODEL.md` §20.3 leaves `service_id` nullable. */
  readonly affectedServiceId?: string;
}

/**
 * What the requester intake route answers with on success (`201`) — only
 * what the requester is already entitled to see: the reference number they
 * can quote back (`TicketReference`, e.g. `INC0000123`). No internal `id`,
 * no reporter, no state — none of it is this response's job to expose, and
 * none of it is withheld data a requester could otherwise read (`T-C1-08`
 * AC3).
 */
export interface IncidentCreatedResponse {
  readonly reference: string;
}
