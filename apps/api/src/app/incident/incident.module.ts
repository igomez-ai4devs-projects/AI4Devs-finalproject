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
 * every later `incident` ticket would copy. `T-C1-06` was the first ticket
 * to bind a concrete adapter here — `INCIDENT_REPOSITORY` →
 * `TypeOrmIncidentRepository`, unconditionally.
 *
 * **`T-C10-78` moves that binding out.** `INCIDENT_REPOSITORY` and
 * `INCIDENT_READ_REPOSITORY` are no longer provided by this module: which
 * adapter backs them is now a function of `PERSISTENCE_MODE`, decided once by
 * `PersistenceModule.forMode()` (`../../persistence/persistence.module.ts`)
 * from `./incident-persistence.bindings.ts`'s total map, and imported
 * globally by `AppModule` alongside this module (ADR-015 decision 3,
 * `ARCHITECTURE.md` §6.3). Both tokens still resolve for anything in this
 * module that needs them (`LogIncidentUseCase`'s and
 * `GetIncidentByReferenceUseCase`'s `useFactory` bindings below), the same
 * way `EVENT_PUBLISHER` already resolves without this module re-importing
 * `EventDispatchModule` — `PersistenceModule` is `@Global()` too.
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
 * `EVENT_PUBLISHER` is not bound here because it is global
 * (`EventDispatchModule`, `@Global()`) — the same reason `INCIDENT_REPOSITORY`
 * and `INCIDENT_READ_REPOSITORY` no longer need to be either, now that
 * `PersistenceModule` binds them globally too (`T-C10-78`, above). Any test
 * module that composes `IncidentModule` on its own — not through `AppModule`
 * — must import both global modules alongside it for
 * `LogIncidentUseCase`'s factory to resolve
 * (`log-incident.fixed-actor.spec.ts` does exactly that).
 *
 * **`T-C1-100` added the read side**, `GetIncidentByReferenceUseCase`,
 * following the same `useFactory` pattern `LogIncidentUseCase` already
 * established: a framework-free class the composition root constructs,
 * never `@Injectable()`, injected with only the one port its constructor
 * declares (`IncidentReadRepositoryPort`) — nothing about read-only lookup
 * needs `SLA_POLICY`, `EVENT_PUBLISHER` or `CLOCK`. `INCIDENT_READ_REPOSITORY`
 * itself resolves through `PersistenceModule`'s `useExisting:
 * INCIDENT_REPOSITORY` binding (`incident-persistence.bindings.ts`) — one
 * adapter instance, two ports, in either `PersistenceMode` — which is what
 * `incident.module.spec.ts` proves by identity, not by type.
 */
@Module({
  controllers: [IncidentController],
  providers: [
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
