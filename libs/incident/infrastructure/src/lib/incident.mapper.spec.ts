import {
  FixedClock,
  Identity,
  ImpactLevel,
  Priority,
  TicketReference,
  UrgencyLevel,
} from '@sport-itsm/shared-domain';
import {
  Incident,
  IncidentSnapshot,
  OriginChannel,
} from '@sport-itsm/incident-domain';
import { IncidentEntity } from './incident.entity';
import { IncidentMapper } from './incident.mapper';
import { IncidentMappingError } from './incident-mapping.error';

const IDENTITY = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abc');
const REPORTER = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abd');
const ACTOR = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abe');
const SERVICE = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abf');
const REFERENCE = TicketReference.fromString('INC0000001');
const CLOCK = FixedClock.at(new Date('2026-09-24T10:30:00.000Z'));
const CORRELATION = 'req-3f8a10c2';

/** A freshly logged Incident — every T-C1-06 slot without a column is empty. */
const loggedIncident = (
  overrides: Partial<Parameters<typeof Incident.log>[0]> = {},
): Incident =>
  Incident.log({
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
  }).incident;

const snapshotWith = (
  overrides: Partial<IncidentSnapshot> = {},
): IncidentSnapshot => ({
  id: IDENTITY,
  reference: REFERENCE,
  loggedAtEpochMs: CLOCK.now().getTime(),
  loggedBy: ACTOR,
  reporterId: REPORTER,
  originChannel: OriginChannel.fromCode('portal'),
  shortDescription: 'Cannot submit match roster',
  description:
    'The roster submission form rejects a valid squad list with no error message.',
  affectedServiceId: null,
  categoryId: null,
  impact: null,
  urgency: null,
  priority: null,
  competitionAffectsInProgress: false,
  affectedSubject: null,
  assignment: null,
  ...overrides,
});

describe('IncidentMapper.toEntity()', () => {
  it('maps every T-C1-06 column from the aggregate, with created_at/created_by from loggedAtEpochMs/loggedBy', () => {
    const incident = loggedIncident({ affectedServiceId: SERVICE });

    const entity = IncidentMapper.toEntity(incident);

    expect(entity).toBeInstanceOf(IncidentEntity);
    expect(entity.id).toBe(IDENTITY.value);
    expect(entity.reference).toBe(REFERENCE.value);
    expect(entity.shortDescription).toBe('Cannot submit match roster');
    expect(entity.description).toBe(
      'The roster submission form rejects a valid squad list with no error message.',
    );
    expect(entity.originChannel).toBe('portal');
    expect(entity.reporterUserId).toBe(REPORTER.value);
    expect(entity.serviceId).toBe(SERVICE.value);
    expect(entity.createdAt.getTime()).toBe(CLOCK.now().getTime());
    expect(entity.createdBy).toBe(ACTOR.value);
  });

  it('maps a null affected service through as a null service_id', () => {
    const entity = IncidentMapper.toEntity(loggedIncident());

    expect(entity.serviceId).toBeNull();
  });

  it("sets updated_at to the same instant as created_at and updated_by to null on the aggregate's first save (no update has happened yet)", () => {
    const entity = IncidentMapper.toEntity(loggedIncident());

    expect(entity.updatedAt.getTime()).toBe(entity.createdAt.getTime());
    expect(entity.updatedBy).toBeNull();
  });

  describe('ADR-014 rule 4 — refuses to save a slot incident_ticket has no column for yet', () => {
    it.each([
      [
        'categoryId',
        {
          categoryId: Identity.fromString(
            '0192f3a4-5b6c-7d8e-8f90-1234567890aa',
          ),
        },
      ],
      ['impact', { impact: ImpactLevel.fromNumber(2) }],
      ['urgency', { urgency: UrgencyLevel.fromNumber(3) }],
      ['priority', { priority: Priority.fromCode('P2') }],
      ['competitionAffectsInProgress', { competitionAffectsInProgress: true }],
    ])(
      'throws IncidentMappingError naming "%s" rather than dropping the value',
      (field, overrides) => {
        const incident = Incident.reconstitute(snapshotWith(overrides));

        expect(() => IncidentMapper.toEntity(incident)).toThrow(
          IncidentMappingError,
        );
        try {
          IncidentMapper.toEntity(incident);
          fail('expected IncidentMapper.toEntity to throw');
        } catch (error) {
          expect((error as IncidentMappingError).offendingField).toBe(field);
        }
      },
    );

    it('never mutates or reads incident_ticket when a slot is unmapped — the aggregate is untouched', () => {
      const incident = Incident.reconstitute(
        snapshotWith({ impact: ImpactLevel.fromNumber(1) }),
      );

      expect(() => IncidentMapper.toEntity(incident)).toThrow(
        IncidentMappingError,
      );
      // The aggregate itself is frozen and unaffected by the failed mapping.
      expect(incident.impact?.value).toBe(1);
    });
  });
});

describe('IncidentMapper.toDomain()', () => {
  const rowFor = (overrides: Partial<IncidentEntity> = {}): IncidentEntity => {
    const entity = new IncidentEntity();
    entity.id = IDENTITY.value;
    entity.reference = REFERENCE.value;
    entity.shortDescription = 'Cannot submit match roster';
    entity.description =
      'The roster submission form rejects a valid squad list with no error message.';
    entity.originChannel = 'portal';
    entity.reporterUserId = REPORTER.value;
    entity.serviceId = null;
    entity.createdAt = CLOCK.now();
    entity.updatedAt = CLOCK.now();
    entity.createdBy = ACTOR.value;
    entity.updatedBy = null;
    entity.version = 1;
    Object.assign(entity, overrides);
    return entity;
  };

  it('rebuilds an Incident carrying every persisted field', () => {
    const incident = IncidentMapper.toDomain(rowFor());

    expect(incident.id.equals(IDENTITY)).toBe(true);
    expect(incident.reference.equals(REFERENCE)).toBe(true);
    expect(incident.loggedAtEpochMs).toBe(CLOCK.now().getTime());
    expect(incident.loggedBy.equals(ACTOR)).toBe(true);
    expect(incident.reporterId.equals(REPORTER)).toBe(true);
    expect(incident.originChannel.code).toBe('portal');
    expect(incident.shortDescription).toBe('Cannot submit match roster');
  });

  it('maps a null service_id to a null affected service, and a set one to an Identity', () => {
    expect(IncidentMapper.toDomain(rowFor()).affectedServiceId).toBeNull();
    expect(
      IncidentMapper.toDomain(
        rowFor({ serviceId: SERVICE.value }),
      ).affectedServiceId?.equals(SERVICE),
    ).toBe(true);
  });

  it('reads every slot the table has no column for yet as null/false — the shape of a just-logged Incident (ADR-014, DATA-MODEL.md §8.5)', () => {
    const incident = IncidentMapper.toDomain(rowFor());

    expect(incident.categoryId).toBeNull();
    expect(incident.impact).toBeNull();
    expect(incident.urgency).toBeNull();
    expect(incident.priority).toBeNull();
    expect(incident.competitionAffectsInProgress).toBe(false);
    expect(incident.affectedSubject).toBeNull();
    expect(incident.assignment).toBeNull();
  });

  it('round-trips toEntity -> toDomain back to an equivalent Incident', () => {
    const original = loggedIncident({ affectedServiceId: SERVICE });

    const entity = IncidentMapper.toEntity(original);
    const reloaded = IncidentMapper.toDomain(entity);

    expect(reloaded).toEqual(original);
  });
});
