import { DomainEvent, InvalidDomainEventError } from './domain-event';
import { DomainError } from './domain-error';
import { FixedClock } from './fixed-clock';
import { Identity } from './identity';

const ACTOR = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abc');
const CLOCK = FixedClock.at(new Date('2026-09-24T10:30:00.000Z'));
const CORRELATION = 'req-3f8a10c2';

const recordRoleAssigned = (payload: object = { roleId: 'incident-agent' }) =>
  DomainEvent.record({
    name: 'RoleAssigned',
    occurredAt: CLOCK.now(),
    actor: ACTOR,
    correlationId: CORRELATION,
    payload,
  });

describe('DomainEvent', () => {
  it('records what happened, when, who caused it and under which operation', () => {
    const event = recordRoleAssigned();

    expect(event.name).toBe('RoleAssigned');
    expect(event.occurredAtEpochMs).toBe(CLOCK.now().getTime());
    expect(event.actor.equals(ACTOR)).toBe(true);
    expect(event.correlationId).toBe(CORRELATION);
  });

  describe('payload immutability', () => {
    it('rejects a mutation of a top-level field', () => {
      const event = recordRoleAssigned();

      expect(() => {
        (event.payload as { roleId: string }).roleId = 'tampered';
      }).toThrow(TypeError);
      expect((event.payload as { roleId: string }).roleId).toBe(
        'incident-agent',
      );
    });

    it('rejects a mutation nested below the first level', () => {
      const event = recordRoleAssigned({ grant: { scope: { kind: 'owner' } } });

      expect(() => {
        (
          event.payload as { grant: { scope: { kind: string } } }
        ).grant.scope.kind = 'tampered';
      }).toThrow(TypeError);
    });

    it('rejects a mutation inside an array', () => {
      const event = recordRoleAssigned({ roleIds: ['a', 'b'] });

      expect(() => {
        (event.payload as { roleIds: string[] }).roleIds.push('c');
      }).toThrow(TypeError);
    });

    it('does not leave the caller a handle on the stored payload', () => {
      const payload = { roleId: 'incident-agent' };
      const event = recordRoleAssigned(payload);

      expect(() => {
        payload.roleId = 'tampered';
      }).toThrow(TypeError);
      expect((event.payload as { roleId: string }).roleId).toBe(
        'incident-agent',
      );
    });

    it('tolerates a payload that references itself', () => {
      const cyclic: Record<string, unknown> = { roleId: 'incident-agent' };
      cyclic['self'] = cyclic;

      expect(() => recordRoleAssigned(cyclic)).not.toThrow();
    });
  });

  it('is itself immutable', () => {
    const event = recordRoleAssigned();

    expect(() => {
      (event as { name: string }).name = 'Tampered';
    }).toThrow(TypeError);
  });

  describe('rejects invalid input', () => {
    it.each([
      ['a blank name', { name: '   ' }],
      ['an empty name', { name: '' }],
      ['a blank correlation id', { correlationId: '  ' }],
    ])('rejects %s', (_case, override) => {
      expect(() =>
        DomainEvent.record({
          name: 'RoleAssigned',
          occurredAt: CLOCK.now(),
          actor: ACTOR,
          correlationId: CORRELATION,
          payload: {},
          ...override,
        }),
      ).toThrow(InvalidDomainEventError);
    });

    it('rejects an invalid instant, and the error is a DomainError', () => {
      expect.assertions(2);

      try {
        DomainEvent.record({
          name: 'RoleAssigned',
          occurredAt: new Date('not a date'),
          actor: ACTOR,
          correlationId: CORRELATION,
          payload: {},
        });
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidDomainEventError);
        expect(error).toBeInstanceOf(DomainError);
      }
    });
  });

  it('never reads the clock itself: the instant is the one it was given', () => {
    const earlier = FixedClock.at(new Date('2020-01-01T00:00:00.000Z'));
    const event = DomainEvent.record({
      name: 'RoleRevoked',
      occurredAt: earlier.now(),
      actor: ACTOR,
      correlationId: CORRELATION,
      payload: {},
    });

    expect(event.occurredAtEpochMs).toBe(earlier.now().getTime());
  });
});
