import { Global, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  buildRuntimeDataSourceOptions,
  RUNTIME_ENTITIES,
} from './runtime-data-source-options';

/**
 * Provides the one `DataSource` every context's repository adapters share
 * (`ARCHITECTURE.md` §6.3, `T-C1-06` Trap 4). `@nestjs/typeorm` is **not**
 * installed — this module is the "own provider" alternative that ticket's own
 * Trap 4 allows instead of adding it: a `useFactory` that constructs a
 * `DataSource`, provided under the concrete `DataSource` class itself rather
 * than a bespoke injection token (Nest resolves a constructor parameter typed
 * `DataSource` without one).
 *
 * `@Global()` — every context's repository adapter needs the same one
 * `DataSource` (`TypeOrmIncidentRepository` today, more later), and none of
 * them should have to re-import this module just to reach it, the same
 * reasoning `EventDispatchModule` already applies to `EVENT_PUBLISHER`
 * (`../event-dispatch/event-dispatch.module.ts`).
 *
 * **Deliberately does not call `dataSource.initialize()` here.** `new
 * DataSource(options)` only builds connection options and entity metadata in
 * memory; it opens no socket. Connecting eagerly in this factory — the more
 * literal reading of Trap 4's "the API needs PostgreSQL to boot" — runs on
 * every `NestFactory.create(AppModule)`, including
 * `apps/api/src/testing/test-event-dispatch.harness-gating.spec.ts` (outside
 * this ticket's boundaries, "Lo que NO debes tocar"), which boots `AppModule`
 * with placeholder `POSTGRES_*` values on the stated assumption that no
 * database is ever contacted. `TypeOrmIncidentRepository` (`@sport-itsm/incident-infrastructure`)
 * opens the connection itself instead, lazily, the first time any of its
 * methods is actually called — see that class's own doc comment for the full
 * reasoning and the report's findings for the trade-off this deviation
 * accepts.
 */
@Global()
@Module({
  providers: [
    {
      provide: DataSource,
      useFactory: (): DataSource => {
        const dataSource = new DataSource(buildRuntimeDataSourceOptions());
        Logger.log(
          `PostgreSQL DataSource constructed (not yet connected — connects lazily on first use) with entities: ${RUNTIME_ENTITIES.map(
            (entity) => entity.name,
          ).join(', ')}`,
          DatabaseModule.name,
        );
        return dataSource;
      },
    },
  ],
  exports: [DataSource],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Only fires when `app.enableShutdownHooks()` has been called
   * (`apps/api/src/main.ts`) — otherwise Nest never listens for the OS
   * signals that would trigger it. A no-op when the connection was never
   * opened (`isInitialized` false) — a process that shut down without ever
   * using an incident repository has nothing to close.
   */
  async onApplicationShutdown(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
      Logger.log('PostgreSQL DataSource closed.', DatabaseModule.name);
    }
  }
}
