import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import {
  CORRELATION_ID_HEADER,
  IncidentCreatedResponse,
  IncidentDetailResponse,
} from '@sport-itsm/shared-contracts';
import {
  GetIncidentByReferenceUseCase,
  LogIncidentUseCase,
} from '@sport-itsm/incident-application';
import { OriginChannelCode } from '@sport-itsm/incident-domain';
import { TicketReference } from '@sport-itsm/shared-domain';
import { resolveCorrelationId } from '../correlation-id.util';
import { GetIncidentByReferenceParamsDto } from './dto/get-incident-by-reference-params.dto';
import { LogIncidentRequesterDto } from './dto/log-incident-requester.dto';
import {
  INCIDENT_ACTOR_RESOLVER,
  IncidentActorResolver,
} from './incident-actor-resolver';
import { toIncidentDetailResponse } from './incident-detail-response.mapper';

/**
 * Structural, not `express`-typed — same reasoning as
 * `GlobalExceptionFilter`'s own `MinimalHttpResponse`: `apps/api` has no
 * direct `express` dependency, and this ticket adds none (`T-C1-08`
 * Restricciones).
 */
interface MinimalHttpResponse {
  setHeader(name: string, value: string): unknown;
}

/**
 * The requester intake path never lets the client choose its own origin
 * channel (`FR-OMN-02` — a client cannot declare itself `agent_logged`); the
 * server fixes it here, once, rather than accepting and validating a value
 * `LogIncidentRequesterDto` never even declares (`T-C1-08` Trap 2).
 */
const REQUESTER_ORIGIN_CHANNEL: OriginChannelCode = 'portal';

/**
 * `POST /api/incidents` — the first business route of Sport ITSM
 * (`T-C1-08`). Thin by construction (`ARCHITECTURE.md` §3.1: "Controllers are
 * thin inbound adapters only"): it maps the validated DTO onto
 * `LogIncidentInput`, resolves *who* is asking, mints or accepts a
 * correlation id, and hands both to `LogIncidentUseCase`. Every actual
 * decision — authorization, invariants, priority, persistence — happens
 * below this class.
 *
 * Depends on `LogIncidentUseCase` by its own class token (bound in
 * `IncidentModule` via `useFactory`, `T-C1-08` Trap 5), on
 * `GetIncidentByReferenceUseCase` the same way (`T-C1-100`, `IncidentModule`
 * Trap 3), and on `IncidentActorResolver` by its `INCIDENT_ACTOR_RESOLVER`
 * token — never on `FixedRequesterActorResolver` by name, so `T-C10-39`
 * repoints the binding without touching this file (`incident-actor-
 * resolver.ts`'s own doc comment).
 */
@Controller('incidents')
export class IncidentController {
  constructor(
    private readonly logIncident: LogIncidentUseCase,
    private readonly getIncidentByReferenceUseCase: GetIncidentByReferenceUseCase,
    @Inject(INCIDENT_ACTOR_RESOLVER)
    private readonly actorResolver: IncidentActorResolver,
  ) {}

  /**
   * `@Res({ passthrough: true })` is the one way to set a per-request
   * response header dynamically without an `express` type import
   * (`MinimalHttpResponse` above) — `passthrough: true` keeps Nest in charge
   * of the actual response body/status via this method's return value and
   * `@HttpCode`, exactly as if `@Res()` were never used.
   *
   * No `Location` header: `T-C1-08` decided and reported this, and
   * `T-C1-100`'s Scope reaffirms it rather than revisiting it now that the
   * read-by-reference route below exists — this route remains the *target* a
   * future `Location` would point to, not a new source of one.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async logIncidentAsRequester(
    @Body() dto: LogIncidentRequesterDto,
    @Headers(CORRELATION_ID_HEADER) correlationIdHeader: string | undefined,
    @Res({ passthrough: true }) res: MinimalHttpResponse,
  ): Promise<IncidentCreatedResponse> {
    const correlationId = resolveCorrelationId(correlationIdHeader);
    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    const actor = await this.actorResolver.resolveActor();

    const result = await this.logIncident.execute(
      {
        originChannel: REQUESTER_ORIGIN_CHANNEL,
        shortDescription: dto.shortDescription,
        description: dto.description,
        affectedServiceId: dto.affectedServiceId,
      },
      { actor, correlationId },
    );

    // Only what the requester may see (`T-C1-08` AC3) — never the internal
    // `id`, which this route has no justification to expose.
    return { reference: result.reference.value };
  }

  /**
   * `GET /incidents/{reference}` (`T-C1-100`, `US-C1-01`, `FR-INC-01`) — the
   * redirect target `T-C1-08`'s `201` and `T-C1-10`'s form ultimately land on
   * (`T-C1-101`). Never an echo of a request body: the response is the
   * Incident's own persisted state, read fresh from
   * `GetIncidentByReferenceUseCase`.
   *
   * The path parameter reaches this method only through
   * `GetIncidentByReferenceParamsDto` — already proven to match
   * `TicketReference`'s own shape by the global `ValidationPipe` before this
   * method body ever runs (`T-C1-100` Trap 2) — so `TicketReference.fromString()`
   * below can never throw `InvalidTicketReferenceError`; it only re-parses a
   * value already known to be well-formed into the type the use case expects.
   *
   * A well-formed reference matching no Incident (including one with a
   * foreign, non-`INC` prefix, e.g. `SRQ0000001`) is `404`, not `400`
   * (`T-C1-99`'s own decision, reaffirmed by `T-C1-100`'s "Resolved" section):
   * there is nothing wrong with the *shape* of what the caller sent, only with
   * what it refers to.
   */
  @Get(':reference')
  async getIncidentByReference(
    @Param() params: GetIncidentByReferenceParamsDto,
    @Headers(CORRELATION_ID_HEADER) correlationIdHeader: string | undefined,
    @Res({ passthrough: true }) res: MinimalHttpResponse,
  ): Promise<IncidentDetailResponse> {
    const correlationId = resolveCorrelationId(correlationIdHeader);
    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    const reference = TicketReference.fromString(params.reference);
    const result = await this.getIncidentByReferenceUseCase.execute(reference);

    if (!result.ok) {
      // `GlobalExceptionFilter` already recognizes `NotFoundException` and
      // maps it to `{ error: { code: NOT_FOUND } }` (`T-C1-08`) — no new
      // filter code needed (`T-C1-100`'s "Resolved" section).
      throw new NotFoundException();
    }

    return toIncidentDetailResponse(result.value);
  }
}
