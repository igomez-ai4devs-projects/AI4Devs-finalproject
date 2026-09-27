/**
 * `@sport-itsm/incident-infrastructure` — the public API of the `incident` context's
 * infrastructure (outbound adapter) library (`type:infrastructure`, ARCHITECTURE.md §5.1).
 *
 * `IncidentEntity` is exported (not just used internally) because
 * `apps/api`'s composition root must import it **by class reference** to
 * register it on the running API's `DataSource` — the CLI's glob registration
 * does not reach a webpack-bundled `main.js` (`T-C1-06` Trap 3).
 */
export { IncidentEntity } from './lib/incident.entity';
export { IncidentMapper } from './lib/incident.mapper';
export { IncidentMappingError } from './lib/incident-mapping.error';
export { TypeOrmIncidentRepository } from './lib/typeorm-incident.repository';
/**
 * The second `IncidentRepositoryPort`/`IncidentReadRepositoryPort` adapter (`T-C10-77`,
 * ADR-015 decision 2). Only the class is exported — `T-C10-78` binds it to a token, nothing
 * else outside this library needs to construct one or catch its three typed `save()` errors
 * (`in-memory/in-memory-incident-repository.errors.ts`), so they stay unexported (YAGNI).
 */
export { InMemoryIncidentRepository } from './lib/in-memory/in-memory-incident.repository';
