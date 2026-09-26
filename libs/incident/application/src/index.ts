/**
 * `@sport-itsm/incident-application` — the public API of the `incident`
 * context's application library (`type:application`, ARCHITECTURE.md §5.1).
 *
 * This barrel is the library's only legal import surface — never deep-import
 * past it, from inside this library or from any other.
 */
export { LogIncidentUseCase } from './lib/log-incident.use-case';
export type {
  LogIncidentInput,
  LogIncidentContext,
  LogIncidentResult,
} from './lib/log-incident.use-case';
export { IncidentLogAuthorizationError } from './lib/incident-actor';
export type { IncidentActor } from './lib/incident-actor';
