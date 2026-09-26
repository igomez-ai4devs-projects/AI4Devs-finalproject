import { Module } from '@nestjs/common';
import { INCIDENT_REPOSITORY } from '@sport-itsm/incident-domain';
import { TypeOrmIncidentRepository } from '@sport-itsm/incident-infrastructure';

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
 */
@Module({
  providers: [
    { provide: INCIDENT_REPOSITORY, useClass: TypeOrmIncidentRepository },
  ],
})
export class IncidentModule {}
