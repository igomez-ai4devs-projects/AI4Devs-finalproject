import {
  Identity,
  ImpactLevel,
  Priority,
  TicketReference,
  UrgencyLevel,
} from '@sport-itsm/shared-domain';
import { IncidentSnapshot, OriginChannel } from '@sport-itsm/incident-domain';
import { toIncidentDetailResponse } from './incident-detail-response.mapper';

const ID = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abc');
const REPORTER_ID = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abd');
const LOGGED_BY = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abe');
const AFFECTED_SERVICE_ID = Identity.fromString(
  '0192f3a4-5b6c-7d8e-8f90-123456789abf',
);
const CATEGORY_ID = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-1234567890aa');

function baseSnapshot(
  overrides: Partial<IncidentSnapshot> = {},
): IncidentSnapshot {
  return {
    id: ID,
    reference: TicketReference.fromString('INC0000123'),
    loggedAtEpochMs: Date.parse('2026-09-26T09:00:00.000Z'),
    loggedBy: LOGGED_BY,
    reporterId: REPORTER_ID,
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
  };
}

describe('toIncidentDetailResponse (T-C1-100)', () => {
  it('maps reference, timestamp, channel and text fields across directly', () => {
    const response = toIncidentDetailResponse(baseSnapshot());

    expect(response.reference).toBe('INC0000123');
    expect(response.loggedAt).toBe('2026-09-26T09:00:00.000Z');
    expect(response.originChannel).toBe('portal');
    expect(response.shortDescription).toBe('Cannot submit match roster');
    expect(response.description).toBe(
      'The roster submission form rejects a valid squad list with no error message.',
    );
  });

  it('never carries the internal id (AC4) — not present under any key', () => {
    const response = toIncidentDetailResponse(baseSnapshot());

    expect(response).not.toHaveProperty('id');
    expect(JSON.stringify(response)).not.toContain(ID.value);
  });

  it('never carries reporterId or loggedBy — internal actor identities, no visibility predicate exists yet (AC4)', () => {
    const response = toIncidentDetailResponse(baseSnapshot());

    expect(response).not.toHaveProperty('reporterId');
    expect(response).not.toHaveProperty('loggedBy');
    expect(JSON.stringify(response)).not.toContain(REPORTER_ID.value);
    expect(JSON.stringify(response)).not.toContain(LOGGED_BY.value);
  });

  it('shows still-empty assessment fields explicitly as null/false, never omitted (Trap 1)', () => {
    const response = toIncidentDetailResponse(baseSnapshot());

    expect(response.categoryId).toBeNull();
    expect(response.impact).toBeNull();
    expect(response.urgency).toBeNull();
    expect(response.priority).toBeNull();
    expect(response.competitionAffectsInProgress).toBe(false);
  });

  it('maps affectedServiceId and categoryId to their string value when present', () => {
    const response = toIncidentDetailResponse(
      baseSnapshot({
        affectedServiceId: AFFECTED_SERVICE_ID,
        categoryId: CATEGORY_ID,
      }),
    );

    expect(response.affectedServiceId).toBe(AFFECTED_SERVICE_ID.value);
    expect(response.categoryId).toBe(CATEGORY_ID.value);
  });

  it('maps impact, urgency and priority to their plain value when assessed', () => {
    const response = toIncidentDetailResponse(
      baseSnapshot({
        impact: ImpactLevel.fromNumber(2),
        urgency: UrgencyLevel.fromNumber(3),
        priority: Priority.fromCode('P2'),
      }),
    );

    expect(response.impact).toBe(2);
    expect(response.urgency).toBe(3);
    expect(response.priority).toBe('P2');
  });

  it('maps competitionAffectsInProgress across directly when true', () => {
    const response = toIncidentDetailResponse(
      baseSnapshot({ competitionAffectsInProgress: true }),
    );

    expect(response.competitionAffectsInProgress).toBe(true);
  });

  it('produces exactly the contract’s field set — no extra, no missing', () => {
    const response = toIncidentDetailResponse(baseSnapshot());

    expect(Object.keys(response).sort()).toEqual(
      [
        'reference',
        'loggedAt',
        'originChannel',
        'shortDescription',
        'description',
        'affectedServiceId',
        'categoryId',
        'impact',
        'urgency',
        'priority',
        'competitionAffectsInProgress',
      ].sort(),
    );
  });
});
