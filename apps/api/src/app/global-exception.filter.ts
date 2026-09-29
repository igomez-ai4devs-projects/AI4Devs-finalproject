import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CORRELATION_ID_HEADER,
  ErrorCode,
  ErrorEnvelope,
} from '@sport-itsm/shared-contracts';
import { IncidentLogAuthorizationError } from '@sport-itsm/incident-application';
import { resolveCorrelationId } from './correlation-id.util';
import { mapIncidentDomainErrorToDetail } from './incident-domain-error.mapper';
import { RequestValidationException } from './request-validation.exception';

/**
 * Structural, not `express`-typed: `apps/api` has no direct dependency on
 * `express` (only `@nestjs/platform-express` does, transitively), and this
 * ticket adds no new dependency (`T-C1-08` Restricciones). Every framework
 * response object Nest can sit on top of exposes at least this much.
 */
interface MinimalHttpResponse {
  status(statusCode: number): MinimalHttpResponse;
  setHeader(name: string, value: string): MinimalHttpResponse;
  json(body: unknown): void;
}

interface MinimalHttpRequest {
  readonly headers: Readonly<Record<string, string | string[] | undefined>>;
}

/**
 * **The minimum this ticket owes, not `T-C10-40`'s exception filter.**
 * `T-C1-08`'s own Scope cites "the exception filter established in
 * `T-C10-40`" — that ticket does not exist and is not part of this delivery
 * slice (`T-C1-08` Trap 3, reported as a finding). Without *some* filter,
 * `ARCHITECTURE.md` §3.2's `ErrorEnvelope` never gets produced: a
 * `ValidationPipe` rejection would leave Nest's default `{ statusCode,
 * message, error }` shape on the wire, and a thrown `DomainError` would
 * surface as an unhandled `500` with Nest's default body. This class closes
 * exactly the four branches `T-C1-08`'s own scenarios need and no more —
 * `T-C10-40`, when it lands, is free to replace this file outright with a
 * richer, registry-based mapping (`UNAUTHENTICATED`, `NOT_FOUND`, per-context
 * error registries) rather than extend it.
 *
 * Registered globally (`main.ts`, `app.useGlobalFilters`) so every route —
 * not just `IncidentController`'s — gets a contract-shaped response, which is
 * also why the two error mappings this file is not otherwise responsible for
 * (`incident`'s own `DomainError` subtypes) live in their own file
 * (`incident-domain-error.mapper.ts`) rather than inline here: the day a
 * second context needs the same treatment, this class's `catch()` method
 * does not need to change, only the list of mappers it consults would.
 *
 * **One branch this file's own scope did not originally name:**
 * `NotFoundException` — the framework's own exception for an unmatched route
 * (Express has none, Nest raises it before any filter-specific logic runs).
 * `@Catch()` being global means this filter now sits in front of *that* path
 * too; without special-casing it, `apps/api-e2e`'s pre-existing
 * `harness-smoke.feature` (which asserts a bare `404` for `/`,
 * `T-C10-06`) would regress to `500` — discovered by actually running the
 * suite, not asserted from reading the code. `NOT_FOUND` is one of the
 * **original** four seeded codes (`T-C10-11`), so this costs no new contract
 * surface, unlike `INTERNAL_ERROR`.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<MinimalHttpResponse>();
    const request = ctx.getRequest<MinimalHttpRequest>();

    const correlationId = resolveCorrelationId(
      request.headers[CORRELATION_ID_HEADER.toLowerCase()],
    );

    const { status, body } = this.toResponse(exception, correlationId);

    response
      .status(status)
      .setHeader(CORRELATION_ID_HEADER, correlationId)
      .json(body);
  }

  private toResponse(
    exception: unknown,
    correlationId: string,
  ): { status: number; body: ErrorEnvelope } {
    if (exception instanceof RequestValidationException) {
      return {
        status: HttpStatus.BAD_REQUEST,
        body: {
          error: {
            code: ErrorCode.VALIDATION_FAILED,
            details: exception.details,
          },
        },
      };
    }

    if (exception instanceof IncidentLogAuthorizationError) {
      return {
        status: HttpStatus.FORBIDDEN,
        body: { error: { code: ErrorCode.FORBIDDEN } },
      };
    }

    if (exception instanceof NotFoundException) {
      return {
        status: HttpStatus.NOT_FOUND,
        body: { error: { code: ErrorCode.NOT_FOUND } },
      };
    }

    const domainDetail = mapIncidentDomainErrorToDetail(exception);
    if (domainDetail) {
      return {
        status: HttpStatus.BAD_REQUEST,
        body: {
          error: { code: ErrorCode.VALIDATION_FAILED, details: [domainDetail] },
        },
      };
    }

    // Anything else is unexpected: never reflect the underlying error back
    // to the caller (no `message`, no `stack`) — only `Logger` and the
    // correlation id see it (`T-C1-08` verification #5).
    this.logger.error(
      `Unhandled error (correlationId: ${correlationId})`,
      exception instanceof Error ? exception.stack : String(exception),
    );
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: { error: { code: ErrorCode.INTERNAL_ERROR } },
    };
  }
}
