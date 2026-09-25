import { DomainEvent } from './domain-event';

/**
 * How a use case hands over the events an operation produced (ADR-008).
 *
 * The contract is publish-only and names no recipient: audit, notification and
 * reporting are subscribers, and a failure to deliver to any of them cannot
 * reach back into the operation that produced the events. That is what buys
 * NFR-AVL-03 — a notification outage does not block ticket intake.
 *
 * It lives in the shared kernel rather than in each context because its whole
 * signature names kernel types only: there is no ubiquitous language here to
 * preserve, so the third test of §5.4 places it here alongside `ClockPort`.
 * Declaring it per context would add identical interfaces and no isolation,
 * since `DomainEvent` is already a kernel type every context imports.
 *
 * Publication happens **after** the aggregate is committed — the use case's
 * responsibility, not this port's — and the in-process dispatcher that
 * implements it belongs to `apps/api`.
 */
export interface EventPublisherPort {
  publish(events: readonly DomainEvent<object>[]): void;
}

/**
 * The injection token for `EventPublisherPort` — the interface is erased at
 * runtime, so a wiring container needs a value to key the binding on.
 *
 * It sits beside the port, per `ARCHITECTURE.md` §6.3 ("a matching `Symbol`
 * injection token exported from the domain lib"), so a `type:application` use
 * case can declare the dependency without reaching into `apps/api`, which no
 * library may depend on (§5.3). A `Symbol` is plain JavaScript: it names the
 * dependency without importing any framework into the kernel.
 */
export const EVENT_PUBLISHER = Symbol('EventPublisherPort');
