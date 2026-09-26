import { Module } from '@nestjs/common';
import { INCIDENT_REPOSITORY } from '@sport-itsm/incident-domain';
import { TypeOrmIncidentRepository } from '@sport-itsm/incident-infrastructure';
import { FixedRequesterActorResolver } from '../../bootstrap/fixed-requester-actor.resolver';
import { INCIDENT_ACTOR_RESOLVER } from './incident-actor-resolver';

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
 */
@Module({
  providers: [
    { provide: INCIDENT_REPOSITORY, useClass: TypeOrmIncidentRepository },
    {
      provide: INCIDENT_ACTOR_RESOLVER,
      useClass: FixedRequesterActorResolver,
    },
  ],
})
export class IncidentModule {}
