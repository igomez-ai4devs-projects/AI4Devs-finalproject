import type { DomainEvent } from '@sport-itsm/shared-domain';

/**
 * A handler a context's composition module registers against one event name
 * (`DomainEvent.name`) to react after that event's producer has committed.
 *
 * Generic over the payload on purpose: this file names no event and no
 * bounded context, so any future event producer registers against this same
 * shape without this dispatcher ever importing that producer's vocabulary.
 *
 * A subscriber may fail two different ways, and both are isolated by the
 * dispatcher that invokes it, never by the subscriber itself:
 *  - a synchronous `throw`;
 *  - an asynchronous rejection, returned as a `Promise` this type allows but
 *    the dispatcher never awaits on the caller's behalf.
 */
export type EventSubscriber<TPayload extends object = Record<string, unknown>> =
  (event: DomainEvent<TPayload>) => void | Promise<void>;
