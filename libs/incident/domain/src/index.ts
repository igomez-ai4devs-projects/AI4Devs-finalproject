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
export {
  ORIGIN_CHANNEL_CODES,
  OriginChannel,
  InvalidOriginChannelError,
} from './lib/origin-channel.vo';
export type { OriginChannelCode } from './lib/origin-channel.vo';
export {
  INCIDENT_LOGGED_EVENT_NAME,
  Incident,
  IncidentReporterRequiredError,
  IncidentOriginChannelRequiredError,
  IncidentShortDescriptionRequiredError,
  IncidentShortDescriptionTooLongError,
  IncidentDescriptionRequiredError,
} from './lib/incident.aggregate';
export type {
  LogIncidentCommand,
  LoggedIncident,
  IncidentLoggedPayload,
} from './lib/incident.aggregate';
