/**
 * The request/job correlation identifier.
 *
 * **Also not defined where the ticket attributes it.** `ARCHITECTURE.md`
 * §3.2 does not mention correlation at all; the only correlation reference
 * in the document is §9 ("`nestjs-pino` structured logs with request
 * correlation") and it does not name a wire representation. `DATA-MODEL.md`
 * does define a `correlation_id uuid` column on `audit_entry` and
 * `ntf_dispatch`, described as tying the row "to the `nestjs-pino` request
 * or job log" — normative for the *value's* shape (a UUID), not for how it
 * travels on an HTTP request. This is reported as a finding for the
 * architect alongside the pagination one.
 *
 * Given that, this declares the minimal pair the ticket asks for:
 * - `CorrelationId` — a named alias, not a structural `string`, so a future
 *   DTO can say what a field *is* rather than merely what type it has.
 *   Not branded (no phantom runtime tag): branding is speculative machinery
 *   this ticket has no consumer for yet (YAGNI).
 * - `CORRELATION_ID_HEADER` — the conventional HTTP header carrying it.
 *   `'X-Correlation-Id'` is chosen as the closest existing convention (it is
 *   not `pino-http`'s own default, which generates `req.id` internally
 *   rather than reading an inbound header) and is this ticket's own
 *   decision, not a documented requirement.
 */
export type CorrelationId = string;

export const CORRELATION_ID_HEADER = 'X-Correlation-Id' as const;
