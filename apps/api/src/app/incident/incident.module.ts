import { Module } from '@nestjs/common';
import {
  CLOCK,
  EVENT_PUBLISHER,
  EventPublisherPort,
  ClockPort,
} from '@sport-itsm/shared-domain';
import {
  INCIDENT_READ_REPOSITORY,
  INCIDENT_REPOSITORY,
  IncidentReadRepositoryPort,
  IncidentRepositoryPort,
  SLA_POLICY,
  SlaPolicyPort,
} from '@sport-itsm/incident-domain';
import {
  GetIncidentByReferenceUseCase,
  LogIncidentUseCase,
} from '@sport-itsm/incident-application';
import { TypeOrmIncidentRepository } from '@sport-itsm/incident-infrastructure';
import { FixedRequesterActorResolver } from '../../bootstrap/fixed-requester-actor.resolver';
import { SystemClock } from '../system-clock';
import { INCIDENT_ACTOR_RESOLVER } from './incident-actor-resolver';
import { IncidentController } from './incident.controller';
import { ProvisionalNoopSlaPolicyAdapter } from './provisional-noop-sla-policy.adapter';

/**
 * Composition-root slice for the `incident` bounded context
 * (`ARCHITECTURE.md` §6.3, `PROJECT-STRUCTURE.md`).
 *
 * `T-C1-02` wired this module into `AppModule` empty on purpose, as the shape
 * every later `incident` ticket would copy. `T-C1-06` is that first ticket:
 * it introduces the port's first concrete adapter and binds it here, exactly
 * as this module's own doc comment already promised —
 * `INCIDENT_REPOSITORY` → `TypeOrmIncidentRepository`.
 *
 * `TypeOrmIncidentRepository` depends on `DataSource` (`typeorm`), provided
 * globally by `DatabaseModule` (`../../database/database.module.ts`, imported
 * once in `AppModule`) — this module does not re-import it, the same reason
 * `EVENT_PUBLISHER` is not re-imported here either (`EventDispatchModule` is
 * `@Global()`).
 *
 * `INCIDENT_ACTOR_RESOLVER` → `FixedRequesterActorResolver` is `T-C10-74`'s
 * binding, added ahead of `T-C1-08` on purpose: `T-C1-08`'s controller will
 * depend on the token to obtain the `IncidentActor` `LogIncidentUseCase`
 * needs, and a controller depending on an unbound token would fail Nest's
 * own dependency-resolution at boot. This one line is also the whole
 * `T-C10-39` migration path: that ticket repoints it to the real per-request
 * resolver adapter and deletes `FixedRequesterActorResolver` outright — see
 * that class's own doc comment.
 *
 * `T-C1-08` adds the rest: `IncidentController` (the first business HTTP
 * route) and `LogIncidentUseCase` itself, bound with `useFactory` because it
 * is a framework-free class the composition root constructs, never
 * `@Injectable()` (`log-incident.use-case.ts`'s own doc comment). Its two
 * remaining ports:
 * - `CLOCK` → `SystemClock` (`../system-clock.ts`) — no adapter existed
 *   before this ticket; it is the one legitimate `new Date()` call site
 *   (ADR-009).
 * - `SLA_POLICY` → `ProvisionalNoopSlaPolicyAdapter`
 *   (`./provisional-noop-sla-policy.adapter.ts`) — explicitly a placeholder
 *   until `T-C1-58` binds the real adapter against `sla/application`; see
 *   that class's own doc comment for why a no-op cannot lose the
 *   `IncidentLogged` event.
 *
 * `EVENT_PUBLISHER` is not bound here for the same reason `INCIDENT_REPOSITORY`
 * *is*: it is global (`EventDispatchModule`, `@Global()`), so any test module
 * that composes `IncidentModule` on its own — not through `AppModule` — must
 * import `EventDispatchModule` alongside it for `LogIncidentUseCase`'s
 * factory to resolve (`log-incident.fixed-actor.spec.ts` does exactly that).
 *
 * **`T-C1-100` adds the read side.** `INCIDENT_READ_REPOSITORY` is bound with
 * `useExisting: INCIDENT_REPOSITORY`, never a second `useClass:
 * TypeOrmIncidentRepository` — one adapter instance, two ports, exactly
 * `T-C1-99`'s closing note and this ticket's own AC6. `useExisting` (not
 * `useValue`/`useFactory`) is what makes the two tokens alias the *same*
 * resolved instance rather than each constructing their own —
 * `incident.module.spec.ts` proves this by identity, not by type.
 * `GetIncidentByReferenceUseCase` follows the same `useFactory` pattern
 * `LogIncidentUseCase` already established: a framework-free class the
 * composition root constructs, never `@Injectable()`, injected with only the
 * one port its constructor declares (`IncidentReadRepositoryPort`) — nothing
 * about read-only lookup needs `SLA_POLICY`, `EVENT_PUBLISHER` or `CLOCK`.
 */
@Module({
  controllers: [IncidentController],
  providers: [
    { provide: INCIDENT_REPOSITORY, useClass: TypeOrmIncidentRepository },
    { provide: INCIDENT_READ_REPOSITORY, useExisting: INCIDENT_REPOSITORY },
    {
      provide: INCIDENT_ACTOR_RESOLVER,
      useClass: FixedRequesterActorResolver,
    },
    { provide: SLA_POLICY, useClass: ProvisionalNoopSlaPolicyAdapter },
    { provide: CLOCK, useClass: SystemClock },
    {
      provide: LogIncidentUseCase,
      useFactory: (
        incidentRepository: IncidentRepositoryPort,
        slaPolicy: SlaPolicyPort,
        eventPublisher: EventPublisherPort,
        clock: ClockPort,
      ) =>
        new LogIncidentUseCase(
          incidentRepository,
          slaPolicy,
          eventPublisher,
          clock,
        ),
      inject: [INCIDENT_REPOSITORY, SLA_POLICY, EVENT_PUBLISHER, CLOCK],
    },
    {
      provide: GetIncidentByReferenceUseCase,
      useFactory: (incidentReadRepository: IncidentReadRepositoryPort) =>
        new GetIncidentByReferenceUseCase(incidentReadRepository),
      inject: [INCIDENT_READ_REPOSITORY],
    },
  ],
})
export class IncidentModule {}
