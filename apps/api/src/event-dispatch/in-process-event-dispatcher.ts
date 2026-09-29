import { Injectable, Logger } from '@nestjs/common';
import type {
  DomainEvent,
  EventPublisherPort,
} from '@sport-itsm/shared-domain';
import type { EventSubscriber } from './event-subscriber';
import type { EventSubscriptionRegistry } from './event-subscription-registry';

/**
 * The single in-process, post-commit dispatcher (ADR-008,
 * `ARCHITECTURE.md` §5.4/§9). It is the only implementation of
 * `EventPublisherPort` in the application and lives here, in the
 * composition root, exactly as that port's own doc comment requires.
 *
 * **What it is not responsible for: deciding *when* to publish.** A
 * mutating use case commits its own unit of work and calls `publish()`
 * afterwards — that sequencing is the caller's responsibility (see the
 * port's doc comment in `libs/shared/domain`). This class never reads a
 * transaction state and never defers a caller's `publish()` call waiting for
 * one; there is no unit-of-work abstraction to read yet (that boundary is
 * `T-C1-07`'s to build and guarantee — see this ticket's final report).
 *
 * **Dispatch timing.** Subscribers are invoked synchronously, within the
 * same call stack as `publish()`. The ordering guarantee AC1 asks for
 * ("dispatched … strictly after the commit") is already provided by the
 * caller's own sequencing — commit, then call `publish()` — so nothing is
 * gained by this class deferring the actual subscriber calls to a microtask
 * or `setImmediate`; doing so would only make "exactly once, in order"
 * non-deterministic to test, for no requirement that asks for it.
 *
 * **Failure isolation.** A subscriber's own failure never reaches this
 * method's caller and never stops a sibling subscriber for the same event:
 *  - a synchronous `throw` is caught per subscriber;
 *  - a subscriber that returns a rejected `Promise` is never awaited — the
 *    port is `publish(events): void`, not `Promise<void>` — and instead
 *    receives a `.catch()` so Node never sees an unhandled rejection.
 *
 * **No retry.** ADR-008 names retry as a mitigation for the durable/audit
 * side of events (`C18`), not for this in-process mechanism, and this
 * ticket's scope does not ask for one — see this ticket's final report.
 */
@Injectable()
export class InProcessEventDispatcher
  implements EventPublisherPort, EventSubscriptionRegistry
{
  private readonly logger = new Logger(InProcessEventDispatcher.name);
  private readonly subscribersByEventName = new Map<
    string,
    EventSubscriber<object>[]
  >();

  subscribe<TPayload extends object>(
    eventName: string,
    subscriber: EventSubscriber<TPayload>,
  ): void {
    const subscribersForName = this.subscribersByEventName.get(eventName) ?? [];
    subscribersForName.push(subscriber as EventSubscriber<object>);
    this.subscribersByEventName.set(eventName, subscribersForName);
  }

  publish(events: readonly DomainEvent<object>[]): void {
    for (const event of events) {
      this.dispatchOne(event);
    }
  }

  private dispatchOne(event: DomainEvent<object>): void {
    const subscribers = this.subscribersByEventName.get(event.name) ?? [];
    for (const subscriber of subscribers) {
      this.invokeSafely(subscriber, event);
    }
  }

  private invokeSafely(
    subscriber: EventSubscriber<object>,
    event: DomainEvent<object>,
  ): void {
    try {
      const outcome = subscriber(event);
      if (outcome instanceof Promise) {
        outcome.catch((error: unknown) => this.logFailure(event, error));
      }
    } catch (error) {
      this.logFailure(event, error);
    }
  }

  /**
   * Logs the event name and correlation identifier so the failure can be
   * traced back to the request that produced it, and deliberately never the
   * payload: it may carry personal data, and the subscriber that failed had
   * no business leaking it into the log stream.
   */
  private logFailure(event: DomainEvent<object>, error: unknown): void {
    const reason = error instanceof Error ? error.message : String(error);
    this.logger.error(
      `Subscriber failed for event "${event.name}" (correlationId: ${event.correlationId}): ${reason}`,
    );
  }
}
