/**
 * `@sport-itsm/incident-domain` — the public API of the `incident` context's
 * domain library (`type:domain`, ARCHITECTURE.md §5.1).
 *
 * This barrel is the library's only legal import surface — never deep-import
 * past it, from inside this library or from any other.
 */
export {
  IncidentReferencePolicy,
  IncidentReferenceSequenceOutOfRangeError,
  IncidentReferencePrefixMismatchError,
} from './lib/incident-reference.policy';
export type { IncidentRepositoryPort } from './lib/incident-repository.port';
export { INCIDENT_REPOSITORY } from './lib/incident-repository.port';
