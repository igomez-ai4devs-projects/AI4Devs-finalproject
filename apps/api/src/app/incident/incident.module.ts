import { Module } from '@nestjs/common';

/**
 * Composition-root slice for the `incident` bounded context
 * (`ARCHITECTURE.md` §6.3, `PROJECT-STRUCTURE.md`).
 *
 * `T-C1-02` wires this module into `AppModule` empty on purpose: no business
 * provider and no controller exist for `incident` yet, and none is declared
 * here to fill the gap (`docs/backlog/C1/tickets/T-C1-02.md`, AC4 — "no
 * business provider and no controller"). What this ticket *does* fix is the
 * shape every later `incident` ticket copies: a per-context NestJS module,
 * registered once from `AppModule`, whose `providers` array is where port
 * tokens get bound to concrete adapters (ADR-003) — one binding per line,
 * added by the ticket that introduces the port and the adapter together, for
 * example:
 *
 * ```ts
 * providers: [
 *   { provide: INCIDENT_REPOSITORY, useClass: TypeOrmIncidentRepository },
 * ],
 * ```
 *
 * `INCIDENT_REPOSITORY` and `TypeOrmIncidentRepository` do not exist yet
 * (`T-C1-06` introduces the repository port and its TypeORM adapter) — they
 * are named above only as the worked example this module's own doc comment
 * promises, never declared as real providers before their port and adapter
 * exist.
 *
 * `EVENT_PUBLISHER` is not re-imported here: `EventDispatchModule` is
 * `@Global()` (`../event-dispatch/event-dispatch.module.ts`), so it is
 * already available to any provider this module will later declare.
 * `TypeOrmModule` is not connected here either — this ticket does not
 * introduce persistence, and the API still opens no database connection at
 * boot; that arrives with the ticket that adds the first `incident` adapter.
 */
@Module({
  providers: [],
})
export class IncidentModule {}
