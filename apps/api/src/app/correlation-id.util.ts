import { randomUUID } from 'node:crypto';

/**
 * Accepts any RFC 4122 UUID, not the domain kernel's stricter v7-only form
 * (`Identity`, `@sport-itsm/shared-domain`). A correlation identifier is an
 * operational concern, not an aggregate identity — `DATA-MODEL.md`'s
 * `correlation_id uuid` columns fix the value's *shape*, not its version, and
 * a caller-supplied trace id (from an upstream proxy, another service) has no
 * reason to be a v7.
 */
const UUID_FORMAT =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Resolves the correlation id for one request (`T-C1-08` Trap 6): the
 * inbound `CORRELATION_ID_HEADER` value if it is present and UUID-shaped,
 * otherwise a freshly minted one. Used identically by `IncidentController`
 * (to build `LogIncidentContext.correlationId`) and by
 * `GlobalExceptionFilter` (an error has no use case call to derive one from,
 * but still owes the same response header) — one function, not two
 * divergent readings of the same header (DRY).
 *
 * Never throws: an inbound value that fails the shape check is treated the
 * same as no value at all, because minting a substitute is strictly more
 * useful to the caller than rejecting an otherwise-valid request over a
 * tracing header (`ARCHITECTURE.md` §9's correlation logging is best-effort
 * by nature).
 */
export function resolveCorrelationId(headerValue: unknown): string {
  if (typeof headerValue === 'string' && UUID_FORMAT.test(headerValue)) {
    return headerValue;
  }
  return randomUUID();
}
