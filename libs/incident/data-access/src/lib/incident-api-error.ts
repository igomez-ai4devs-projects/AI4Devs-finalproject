import { HttpErrorResponse } from '@angular/common/http';
import {
  CORRELATION_ID_HEADER,
  ErrorCode,
  ValidationErrorDetail,
} from '@sport-itsm/shared-contracts';

/**
 * A failure the API answered with its own contract-declared shape
 * (`ErrorEnvelope`, `ARCHITECTURE.md` §3.2) — a real HTTP response the server
 * sent on purpose, carrying a machine-readable `code`.
 *
 * `details` is `null`, not `undefined`, when absent — `T-C1-09`'s "always
 * defined" rule (Trap 3) applies to every field of the typed error itself,
 * not only to the store's top-level state.
 *
 * `correlationId` is read from the response's own `X-Correlation-Id` header
 * (`T-C1-09` Trap 4) when present, so a support agent can be given a value to
 * search server logs by; `null` when the server did not echo one.
 */
export interface IncidentApiFailure {
  readonly kind: 'api-error';
  readonly code: ErrorCode;
  readonly details: readonly ValidationErrorDetail[] | null;
  readonly correlationId: string | null;
}

/**
 * A failure with **no** API-shaped response to read a `code` from: the
 * request never reached the server (offline, DNS, CORS — Angular reports
 * these as `status === 0`), or a response arrived whose body is not an
 * `ErrorEnvelope` (an intermediary proxy's HTML error page, for instance).
 * Distinguishing this from {@link IncidentApiFailure} is `T-C1-09` AC2/AC5's
 * point: a consumer must never mistake "the server told us `VALIDATION_FAILED`"
 * for "we don't actually know what happened".
 */
export interface IncidentTransportFailure {
  readonly kind: 'network-error';
  readonly status: number;
}

/**
 * The one typed error `IncidentApiService`'s callers ever see — never a bare
 * `HttpErrorResponse`, never `any` (`T-C1-09` Trap 2). No user-facing text
 * lives on either member: only codes and machine detail. Translating
 * `IncidentApiFailure.code` to a message is a `T-C1-10`/`T-C1-101` component
 * concern (Transloco), not this library's.
 */
export type IncidentApiError = IncidentApiFailure | IncidentTransportFailure;

/**
 * Structural guard for "is this response body actually an `ErrorEnvelope`",
 * written by hand rather than imported: `ErrorEnvelope` is a type-only export
 * (ADR-007) with nothing to run at runtime, and this library may not depend
 * on a validation library outside `type:contracts`/`type:util` (§6 matrix).
 * `unknown` in, no `any` anywhere — a body that fails any of these checks
 * (wrong shape, or a `code` string outside {@link ErrorCode}'s seeded set)
 * is treated as {@link IncidentTransportFailure}, never guessed at.
 */
function readErrorEnvelopeCode(body: unknown): ErrorCode | null {
  if (typeof body !== 'object' || body === null || !('error' in body)) {
    return null;
  }
  const { error } = body as { error: unknown };
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return null;
  }
  const { code } = error as { code: unknown };
  const knownCodes: readonly string[] = Object.values(ErrorCode);
  return typeof code === 'string' && knownCodes.includes(code)
    ? (code as ErrorCode)
    : null;
}

function readValidationDetails(
  body: unknown,
): readonly ValidationErrorDetail[] | null {
  const details = (body as { error?: { details?: unknown } }).error?.details;
  return Array.isArray(details)
    ? (details as readonly ValidationErrorDetail[])
    : null;
}

/**
 * Maps an `HttpClient` failure onto the one typed error this library ever
 * hands out (`T-C1-09` Trap 2, AC2, AC5). The only place in this library that
 * inspects an `HttpErrorResponse` — every store method funnels its `error`
 * callback through here instead of building the union inline, so the two
 * call sites (intake, detail) can never drift on what counts as which kind.
 */
export function toIncidentApiError(
  httpError: HttpErrorResponse,
): IncidentApiError {
  const correlationId = httpError.headers.get(CORRELATION_ID_HEADER);
  const code = readErrorEnvelopeCode(httpError.error);

  if (code === null) {
    return { kind: 'network-error', status: httpError.status };
  }

  return {
    kind: 'api-error',
    code,
    details: readValidationDetails(httpError.error),
    correlationId,
  };
}
