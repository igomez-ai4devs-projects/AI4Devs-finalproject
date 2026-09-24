import { isNonEmptyString } from '@sport-itsm/shared-util';
import { DomainError, describeValue } from './domain-error';
import { Identity } from './identity';

export class InvalidDomainEventError extends DomainError {
  constructor(message: string, offendingValue: unknown) {
    super(message, offendingValue);
  }
}

/** What a caller supplies to record an event. */
export interface DomainEventInput<TPayload extends object> {
  readonly name: string;
  readonly occurredAt: Date;
  readonly actor: Identity;
  readonly correlationId: string;
  readonly payload: TPayload;
}

/**
 * Something that happened, stated in the past tense, that other parts of the
 * platform may react to after the fact (ADR-008): a mutating operation returns
 * events, the use case commits the aggregate and publishes afterwards, and
 * audit, notification and reporting are subscribers. A notification outage can
 * therefore not block a ticket.
 *
 * Three properties the type enforces rather than documents:
 *
 * 1. **It never reads the clock.** `occurredAt` is supplied by the caller, who
 *    got it from `ClockPort` (ADR-009). An event that timestamped itself would
 *    be untestable and would put `new Date()` in the domain.
 * 2. **The payload is deeply frozen.** `readonly` stops reassignment of the
 *    property, not mutation of what it points at, and `Object.freeze` stops
 *    only the first level. An event that a subscriber can edit is not a record
 *    of what happened.
 * 3. **The instant is stored as epoch milliseconds**, like `DateTimeRange` and
 *    for the same reason: a stored `Date` stays mutable through `setTime()`
 *    however frozen the object around it is.
 */
export class DomainEvent<TPayload extends object = Record<string, unknown>> {
  private constructor(
    readonly name: string,
    readonly occurredAtEpochMs: number,
    readonly actor: Identity,
    readonly correlationId: string,
    readonly payload: TPayload,
  ) {
    Object.freeze(this);
  }

  /**
   * @throws {InvalidDomainEventError} when the name or the correlation
   * identifier is blank, or the instant is not a valid date.
   */
  static record<TPayload extends object>(
    input: DomainEventInput<TPayload>,
  ): DomainEvent<TPayload> {
    if (!isNonEmptyString(input.name)) {
      throw new InvalidDomainEventError(
        `DomainEvent name must not be blank; received ${describeValue(input.name)}`,
        input.name,
      );
    }
    if (!isNonEmptyString(input.correlationId)) {
      throw new InvalidDomainEventError(
        `DomainEvent correlationId must not be blank; received ${describeValue(input.correlationId)}`,
        input.correlationId,
      );
    }

    const occurredAtEpochMs = input.occurredAt.getTime();
    if (Number.isNaN(occurredAtEpochMs)) {
      throw new InvalidDomainEventError(
        `DomainEvent occurredAt must be a valid date; received ${describeValue(input.occurredAt)}`,
        input.occurredAt,
      );
    }

    return new DomainEvent(
      input.name,
      occurredAtEpochMs,
      input.actor,
      input.correlationId,
      deepFreeze(input.payload),
    );
  }
}

/**
 * Freezes a payload and everything reachable inside it. Pure and defensive: it
 * walks plain objects and arrays, leaves anything already frozen alone, and
 * tolerates cycles.
 */
function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  const asObject = value as unknown as object;
  if (seen.has(asObject)) {
    return value;
  }
  seen.add(asObject);

  for (const nested of Object.values(asObject)) {
    deepFreeze(nested, seen);
  }

  return Object.freeze(value);
}
