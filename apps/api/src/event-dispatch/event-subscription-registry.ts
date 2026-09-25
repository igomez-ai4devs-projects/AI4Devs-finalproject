import type { EventSubscriber } from './event-subscriber';

/**
 * The registration seam of the dispatcher, kept apart from the publish side
 * (`EventPublisherPort`) so a context's composition module — the only code
 * that should ever call `subscribe` — depends on a narrower surface than a
 * use case does (Interface Segregation, `sport-itsm-engineering-principles`).
 * A use case is injected `EventPublisherPort` and sees only `publish`; a
 * module's bootstrap step is injected this interface and sees only
 * `subscribe`. Both are bound to the same dispatcher instance
 * (`event-dispatch.module.ts`).
 *
 * Keyed by `DomainEvent.name` — a plain string, not a subclass, because
 * `DomainEvent` has none — which is what lets a subscriber be registered for
 * an event type this file never imports or knows the shape of beyond
 * `TPayload extends object`.
 */
export interface EventSubscriptionRegistry {
  subscribe<TPayload extends object>(
    eventName: string,
    subscriber: EventSubscriber<TPayload>,
  ): void;
}
