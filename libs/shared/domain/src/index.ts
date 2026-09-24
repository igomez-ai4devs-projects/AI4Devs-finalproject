/**
 * `@sport-itsm/shared-domain` — the shared kernel's value primitives.
 *
 * Framework-free by construction (`type:domain` may depend only on `domain`
 * and `util`): no ORM, no HTTP, no I/O, and no clock — the current time
 * reaches the domain through `ClockPort`, never from here.
 *
 * Every type below is an immutable value object built through a static
 * factory that either returns a fully valid instance or throws a `DomainError`
 * subtype naming the invariant it rejected. None of them generates anything:
 * identities come from the repository port (`nextIdentity()`) and references
 * from a database sequence (`DATA-MODEL.md` §3.1, §3.2).
 */
export { DomainError } from './lib/domain-error';
export { Identity, InvalidIdentityError } from './lib/identity';
export {
  TicketReference,
  InvalidTicketReferenceError,
} from './lib/ticket-reference.vo';
export { ImpactLevel, InvalidImpactLevelError } from './lib/impact-level.vo';
export { UrgencyLevel, InvalidUrgencyLevelError } from './lib/urgency-level.vo';
export {
  Priority,
  PRIORITY_CODES,
  InvalidPriorityError,
} from './lib/priority.vo';
export type { PriorityCode } from './lib/priority.vo';
export {
  DateTimeRange,
  InvalidDateTimeRangeError,
} from './lib/date-time-range.vo';
