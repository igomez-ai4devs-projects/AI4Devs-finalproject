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
