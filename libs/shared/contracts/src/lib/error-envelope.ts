import type { ErrorCode } from './error-code';

/**
 * Per-field validation failure detail.
 *
 * `field` names the offending request property; `rule` is a machine-readable
 * identifier for the violated constraint (e.g. `'REQUIRED'`, `'MAX_LENGTH'`),
 * never a human sentence — ARCHITECTURE.md §3.2 draws the line at *codes*,
 * not text, and that line applies to field-level detail exactly as it does
 * to the top-level `code`. `rule` is deliberately typed as `string`, not a
 * closed union: the concrete rule vocabulary belongs to the validation-
 * decorated DTOs of the ticket that defines each validated field (ADR-007 —
 * decorators live in `apps/api`), and this library must not guess it.
 */
export interface ValidationErrorDetail {
  readonly field: string;
  readonly rule: string;
}

/**
 * The stable, contract-declared error envelope every failed API response
 * carries (`ARCHITECTURE.md` §3.2, row *Errors*). A NestJS exception filter
 * maps domain errors onto this shape; the client maps `code` to a Transloco
 * key and never reads a `message` from the wire, because none exists here —
 * error text is explicitly not part of the contract.
 *
 * `details` is present only for `ErrorCode.VALIDATION_FAILED` and omitted
 * otherwise; it is optional rather than a discriminated union keyed on
 * `code` to avoid speculatively modeling per-code payloads that no ticket
 * has asked for yet (YAGNI) — the four seeded codes have no other detail to
 * carry.
 */
export interface ErrorEnvelope {
  readonly error: {
    readonly code: ErrorCode;
    readonly details?: readonly ValidationErrorDetail[];
  };
}
