/**
 * The only source of "now" in the domain and application layers (ADR-009).
 *
 * No domain or application code calls `new Date()`: time arrives through this
 * port, which is what makes SLA pause/resume, inactivity bounds and business
 * hours deterministically testable, and NFR-AVL-05 provable rather than
 * asserted.
 *
 * It returns a `Date` because that is what the kernel's own temporal factories
 * accept — `DateTimeRange.between(startsAt, endsAt)` — so a caller composes the
 * two without a conversion step. The instant is always UTC; a `Date` carries no
 * zone of its own, and rendering in the user's locale is the client's job
 * (NFR-I18N-03).
 */
export interface ClockPort {
  now(): Date;
}

/**
 * The injection token for `ClockPort` — the interface is erased at runtime,
 * so a wiring container needs a value to key the binding on, exactly the
 * pattern `EVENT_PUBLISHER` uses beside `EventPublisherPort` (`T-C1-07` Trap
 * 3). `ClockPort` itself predates this token: nothing needed a container
 * binding for it until a `type:application` use case (`LogIncidentUseCase`)
 * took it as a constructor dependency. A `Symbol` is plain JavaScript: it
 * names the dependency without importing any framework into the kernel.
 */
export const CLOCK = Symbol('ClockPort');
