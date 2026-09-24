import { DomainEvent } from './domain-event';
import { EventPublisherPort } from './event-publisher.port';
import { FixedClock } from './fixed-clock';
import { Identity } from './identity';

const ACTOR = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abc');
const CLOCK = FixedClock.at(new Date('2026-09-24T10:30:00.000Z'));

/** The port is an interface; this is the smallest thing that can satisfy it. */
class RecordingPublisher implements EventPublisherPort {
  readonly published: DomainEvent<object>[] = [];

  publish(events: readonly DomainEvent<object>[]): void {
    this.published.push(...events);
  }
}

const event = (name: string, payload: object) =>
  DomainEvent.record({
    name,
    occurredAt: CLOCK.now(),
    actor: ACTOR,
    correlationId: 'req-3f8a10c2',
    payload,
  });

describe('EventPublisherPort', () => {
  it('is satisfiable by an implementation that names no subscriber', () => {
    const publisher = new RecordingPublisher();

    publisher.publish([event('RoleAssigned', { roleId: 'incident-agent' })]);

    expect(publisher.published).toHaveLength(1);
    expect(publisher.published[0].name).toBe('RoleAssigned');
  });

  it('accepts the batch an operation produced, in order', () => {
    const publisher = new RecordingPublisher();

    publisher.publish([
      event('RoleRevoked', { roleId: 'incident-agent' }),
      event('RoleAssigned', { roleId: 'incident-analyst' }),
    ]);

    expect(publisher.published.map((published) => published.name)).toEqual([
      'RoleRevoked',
      'RoleAssigned',
    ]);
  });

  it('accepts events whose payloads are differently shaped', () => {
    const publisher = new RecordingPublisher();

    publisher.publish([
      event('RoleAssigned', { roleId: 'incident-agent' }),
      event('ScopeGranted', { subject: { kind: 'tournament' } }),
    ]);

    expect(publisher.published).toHaveLength(2);
  });
});
