/**
 * Machine-readable error codes for the contract-declared error envelope
 * (`ARCHITECTURE.md` §3.2, row *Errors*: "Error codes are part of the
 * contract, error **text** is not").
 *
 * Seeded with exactly the four codes named by `T-C10-11`'s Scope, plus one
 * fifth added by `T-C1-08`: `INTERNAL_ERROR`. `CONFLICT`, `LICENSE_REQUIRED`
 * and every identity- or incident-specific code are still deferred to the
 * ticket that first needs them (`T-C10-27` sign-in, `T-C10-48` role
 * assignment, `T-C10-52` role revocation, `T-C10-60` step-up
 * re-authentication). Adding a code here speculatively would violate YAGNI
 * and would also be a guess at a shape those tickets own.
 *
 * **Why `INTERNAL_ERROR` is the one exception, added ahead of a ticket that
 * names it (`T-C1-08` finding, reported for `architect-tech-lead` to
 * ratify).** `T-C1-08` builds the first (deliberately minimal) global
 * exception filter — the real one is `T-C10-40`'s, which does not exist yet.
 * That filter must answer *something* contract-shaped for an error it does
 * not otherwise recognize, and none of the four seeded codes describes "an
 * unexpected server failure" without misleading the client (`FORBIDDEN` and
 * `NOT_FOUND` assert something false about the request; `VALIDATION_FAILED`
 * would tell a client to fix a request that was never the problem). This
 * comment already anticipated the name before this ticket existed — see the
 * paragraph above, which named `INTERNAL_ERROR` as a future addition — so
 * `T-C1-08` is "the ticket that first needs it", not a ticket inventing a
 * new one unprompted. `T-C10-40` is free to fold this into a richer taxonomy;
 * it does not have to invent the first entry from nothing.
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
  /** An unexpected server-side failure; never carries `details`, never leaks the underlying error (`T-C1-08`). */
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

/**
 * The type of a value from {@link ErrorCode}, e.g. the `code` field of
 * {@link ErrorEnvelope}. Kept as a union derived from the object rather than
 * a second declaration, so the two can never drift.
 */
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
