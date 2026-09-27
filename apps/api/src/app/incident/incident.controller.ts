import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import {
  CORRELATION_ID_HEADER,
  IncidentCreatedResponse,
} from '@sport-itsm/shared-contracts';
import { LogIncidentUseCase } from '@sport-itsm/incident-application';
import { OriginChannelCode } from '@sport-itsm/incident-domain';
import { resolveCorrelationId } from '../correlation-id.util';
import { LogIncidentRequesterDto } from './dto/log-incident-requester.dto';
import {
  INCIDENT_ACTOR_RESOLVER,
  IncidentActorResolver,
} from './incident-actor-resolver';

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
 * `IncidentModule` via `useFactory`, `T-C1-08` Trap 5) and on
 * `IncidentActorResolver` by its `INCIDENT_ACTOR_RESOLVER` token — never on
 * `FixedRequesterActorResolver` by name, so `T-C10-39` repoints the binding
 * without touching this file (`incident-actor-resolver.ts`'s own doc
 * comment).
 */
@Controller('incidents')
export class IncidentController {
  constructor(
    private readonly logIncident: LogIncidentUseCase,
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
   * No `Location` header: the read-by-reference route it would point to
   * (`T-C1-99`/`T-C1-100`) does not exist yet in this delivery slice, and a
   * `Location` aimed at a route that answers `404` would mislead a client
   * more than omitting it (`T-C1-08` Trap 6, decided and reported).
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
}
