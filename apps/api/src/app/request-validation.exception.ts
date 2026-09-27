import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';
import type { ValidationErrorDetail } from '@sport-itsm/shared-contracts';

/**
 * Thrown by the global `ValidationPipe`'s `exceptionFactory` (`main.ts`)
 * instead of Nest's own default `BadRequestException` (`{ statusCode,
 * message: string[], error }`, which is not the contract's `ErrorEnvelope`).
 * `GlobalExceptionFilter` recognizes this one type and maps it straight to
 * `{ code: VALIDATION_FAILED, details }` — no re-parsing of `class-validator`
 * output inside the filter.
 *
 * Extends `BadRequestException` (not a bare `Error`) so anything that already
 * expects a Nest `HttpException` upstream — logging middleware, a future
 * interceptor — still sees a `4xx` shape even before the filter runs.
 */
export class RequestValidationException extends BadRequestException {
  constructor(readonly details: readonly ValidationErrorDetail[]) {
    super('Request validation failed');
  }
}

/**
 * Flattens `class-validator`'s `ValidationError[]` into the contract's flat
 * `ValidationErrorDetail[]` — one entry per **property and constraint**
 * (`T-C1-08` Trap 3), not one entry per property: a value failing two
 * constraints at once (e.g. wrong type *and* too long) is reported as two
 * details, since collapsing them would silently drop a violation the client
 * would otherwise never learn about.
 *
 * `rule` is the constraint's own key from `error.constraints` — `isNotEmpty`,
 * `maxLength`, `isUuid`, `whitelistValidation` (the key `forbidNonWhitelisted`
 * produces) — never the human-readable message `class-validator` pairs with
 * it. That key is already "the name of the restriction, a machine
 * identifier" (`T-C1-08` Trap 3's own wording); inventing a second,
 * hand-maintained vocabulary on top of it would be duplication with nothing
 * to show for it (DRY).
 *
 * Recurses into `error.children` so a nested object's own violations are not
 * silently dropped — no DTO in this ticket nests one, but a shallow-only
 * implementation would silently under-report the day one does, which is
 * worse than the few extra lines this costs today.
 */
export function flattenValidationErrors(
  errors: readonly ValidationError[],
  parentPath = '',
): ValidationErrorDetail[] {
  const details: ValidationErrorDetail[] = [];

  for (const error of errors) {
    const field = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    for (const rule of Object.keys(error.constraints ?? {})) {
      details.push({ field, rule });
    }

    if (error.children?.length) {
      details.push(...flattenValidationErrors(error.children, field));
    }
  }

  return details;
}
