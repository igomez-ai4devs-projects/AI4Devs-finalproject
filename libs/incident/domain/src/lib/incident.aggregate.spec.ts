import {
  DomainError,
  FixedClock,
  Identity,
  TicketReference,
} from '@sport-itsm/shared-domain';
import {
  INCIDENT_LOGGED_EVENT_NAME,
  Incident,
  IncidentDescriptionRequiredError,
  IncidentOriginChannelRequiredError,
  IncidentReporterRequiredError,
  IncidentShortDescriptionRequiredError,
  IncidentShortDescriptionTooLongError,
  LogIncidentCommand,
} from './incident.aggregate';
import { OriginChannel } from './origin-channel.vo';

const IDENTITY = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abc');
const REPORTER = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abd');
const ACTOR = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abe');
const SERVICE = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abf');
const REFERENCE = TicketReference.fromString('INC0000001');
const CLOCK = FixedClock.at(new Date('2026-09-24T10:30:00.000Z'));
const CORRELATION = 'req-3f8a10c2';

/** A command that satisfies every mandatory field; tests override what they mean to break. */
const validCommand = (
  overrides: Partial<LogIncidentCommand> = {},
): LogIncidentCommand => ({
  id: IDENTITY,
  reference: REFERENCE,
  reporterId: REPORTER,
  originChannel: OriginChannel.fromCode('portal'),
  shortDescription: 'Cannot submit match roster',
  description:
    'The roster submission form rejects a valid squad list with no error message.',
  actor: ACTOR,
  correlationId: CORRELATION,
  occurredAt: CLOCK.now(),
  ...overrides,
});

describe('Incident.log()', () => {
  describe('AC1 — a valid command produces the Incident and exactly one event', () => {
    it('creates an Incident carrying every US-C1-01 field, its reference, and no affected service when none is given', () => {
      const { incident, events } = Incident.log(validCommand());

      expect(incident.id.equals(IDENTITY)).toBe(true);
      expect(incident.reference.equals(REFERENCE)).toBe(true);
      expect(incident.reporterId.equals(REPORTER)).toBe(true);
      expect(incident.originChannel.code).toBe('portal');
      expect(incident.shortDescription).toBe('Cannot submit match roster');
      expect(incident.description).toBe(
        'The roster submission form rejects a valid squad list with no error message.',
      );
      expect(incident.affectedServiceId).toBeNull();
      expect(events).toHaveLength(1);
    });

    it('records the affected service when one is given, since it is optional (DATA-MODEL.md §20.3), not absent', () => {
      const { incident } = Incident.log(
        validCommand({ affectedServiceId: SERVICE }),
      );

      expect(incident.affectedServiceId?.equals(SERVICE)).toBe(true);
    });

    it('returns exactly one IncidentLogged event carrying actor, correlationId, the fixed-clock instant and the created state', () => {
      const { events } = Incident.log(validCommand());

      expect(events).toHaveLength(1);
      const [event] = events;
      expect(event.name).toBe(INCIDENT_LOGGED_EVENT_NAME);
      expect(event.actor.equals(ACTOR)).toBe(true);
      expect(event.correlationId).toBe(CORRELATION);
      expect(event.occurredAtEpochMs).toBe(CLOCK.now().getTime());
      expect(event.payload).toEqual({
        incidentId: IDENTITY.value,
        reference: REFERENCE.value,
        reporterId: REPORTER.value,
        originChannel: 'portal',
        shortDescription: 'Cannot submit match roster',
        description:
          'The roster submission form rejects a valid squad list with no error message.',
        affectedServiceId: null,
      });
    });

    it('keeps the reporter and the actor distinct, even when a caller happens to pass the same identity for both', () => {
      const { incident, events } = Incident.log(
        validCommand({ reporterId: ACTOR, actor: ACTOR }),
      );

      expect(incident.reporterId.equals(ACTOR)).toBe(true);
      expect(events[0].actor.equals(ACTOR)).toBe(true);
      // Distinct concepts that merely happen to coincide here — Incident
      // never collapses them into one property (T-C1-05 Trap 5).
      expect('actor' in incident).toBe(false);
    });
  });

  describe('AC2 — a missing mandatory field is rejected with a typed, distinguishable error, and nothing is created', () => {
    it.each([
      [
        'a missing reporter',
        { reporterId: undefined as unknown as Identity },
        IncidentReporterRequiredError,
      ],
      [
        'a missing origin channel',
        { originChannel: undefined as unknown as OriginChannel },
        IncidentOriginChannelRequiredError,
      ],
      [
        'a missing short description',
        { shortDescription: undefined as unknown as string },
        IncidentShortDescriptionRequiredError,
      ],
      [
        'a blank short description',
        { shortDescription: '   ' },
        IncidentShortDescriptionRequiredError,
      ],
      [
        'a short description over 255 characters',
        { shortDescription: 'x'.repeat(256) },
        IncidentShortDescriptionTooLongError,
      ],
      [
        'a missing detailed description',
        { description: undefined as unknown as string },
        IncidentDescriptionRequiredError,
      ],
      [
        'a blank detailed description',
        { description: '   ' },
        IncidentDescriptionRequiredError,
      ],
    ])('rejects %s', (_case, overrides, errorType) => {
      expect(() => Incident.log(validCommand(overrides))).toThrow(errorType);
    });

    it('accepts a short description at exactly the 255-character limit', () => {
      expect(() =>
        Incident.log(validCommand({ shortDescription: 'x'.repeat(255) })),
      ).not.toThrow();
    });

    it('names the field on the typed error and is a DomainError, without parsing a message', () => {
      expect.assertions(3);
      try {
        Incident.log(
          validCommand({ reporterId: undefined as unknown as Identity }),
        );
      } catch (error) {
        expect(error).toBeInstanceOf(IncidentReporterRequiredError);
        expect(error).toBeInstanceOf(DomainError);
        expect((error as IncidentReporterRequiredError).offendingValue).toBe(
          undefined,
        );
      }
    });

    it('produces no Incident and no event when a mandatory field is missing', () => {
      expect.assertions(1);
      try {
        Incident.log(validCommand({ description: '' }));
      } catch {
        // Incident.log() throws before constructing anything: there is no
        // partially-built Incident and no event to inspect. The assertion is
        // that a throw happened at all — covered by expect.assertions(1) plus
        // the outer toThrow assertions above; this test documents the intent.
        expect(true).toBe(true);
      }
    });
  });

  describe('AC3 — a newly logged Incident has no Priority, no category and no competition flag yet', () => {
    it('reads Priority as explicitly not-yet-derived, not as a disguised default', () => {
      const { incident } = Incident.log(validCommand());

      expect(incident.priority).toBeNull();
      expect(incident.impact).toBeNull();
      expect(incident.urgency).toBeNull();
    });

    it('reads the competition-in-progress flag as unset', () => {
      const { incident } = Incident.log(validCommand());

      expect(incident.competitionAffectsInProgress).toBe(false);
    });

    it('reads no category', () => {
      const { incident } = Incident.log(validCommand());

      expect(incident.categoryId).toBeNull();
    });

    it('reads no affected subject and no assignment, since neither is built yet', () => {
      const { incident } = Incident.log(validCommand());

      expect(incident.affectedSubject).toBeNull();
      expect(incident.assignment).toBeNull();
    });
  });

  describe('immutability', () => {
    it('rejects reassigning a top-level field of the Incident', () => {
      const { incident } = Incident.log(validCommand());

      expect(() => {
        (incident as { shortDescription: string }).shortDescription =
          'tampered';
      }).toThrow(TypeError);
      expect(incident.shortDescription).toBe('Cannot submit match roster');
    });

    it('rejects mutating the IncidentLogged payload', () => {
      const { events } = Incident.log(validCommand());

      expect(() => {
        (events[0].payload as { shortDescription: string }).shortDescription =
          'tampered';
      }).toThrow(TypeError);
    });
  });
});
