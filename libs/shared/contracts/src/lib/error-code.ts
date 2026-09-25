/**
 * Machine-readable error codes for the contract-declared error envelope
 * (`ARCHITECTURE.md` §3.2, row *Errors*: "Error codes are part of the
 * contract, error **text** is not").
 *
 * Seeded with exactly the four codes named by `T-C10-11`'s Scope. No other
 * code belongs here yet — `CONFLICT`, `INTERNAL_ERROR`, `LICENSE_REQUIRED`
 * and every identity- or incident-specific code are added by the ticket that
 * first needs them (`T-C10-27` sign-in, `T-C10-48` role assignment,
 * `T-C10-52` role revocation, `T-C10-60` step-up re-authentication, and the
 * `C1` incident tickets). Adding a code here speculatively would violate
 * YAGNI and would also be a guess at a shape those tickets own.
 *
 * Representation: a frozen object literal plus a derived union type, not a
 * TypeScript `enum` and not a `const enum`. See the barrel (`index.ts`) for
 * why — in short, `apps/web` compiles with `isolatedModules: true`, which
 * breaks a cross-module `const enum` value import.
 */
export const ErrorCode = {
  /** No valid credential was presented (missing or invalid `Authorization: Bearer <JWT>`, ARCHITECTURE.md §3.2 row *AuthN*). */
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  /** A valid credential was presented but does not authorize the requested operation. */
  FORBIDDEN: 'FORBIDDEN',
  /** The request body or parameters failed validation; see `ValidationErrorDetail` for the per-field machine detail. */
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  /** The requested resource does not exist, or does not exist for this caller. */
  NOT_FOUND: 'NOT_FOUND',
} as const;

/**
 * The type of a value from {@link ErrorCode}, e.g. the `code` field of
 * {@link ErrorEnvelope}. Kept as a union derived from the object rather than
 * a second declaration, so the two can never drift.
 */
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
