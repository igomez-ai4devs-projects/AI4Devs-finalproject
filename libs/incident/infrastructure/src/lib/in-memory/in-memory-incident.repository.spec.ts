import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  FixedClock,
  Identity,
  TicketReference,
} from '@sport-itsm/shared-domain';
import {
  Incident,
  IncidentReferencePolicy,
  IncidentReferenceSequenceOutOfRangeError,
  IncidentSnapshot,
  OriginChannel,
} from '@sport-itsm/incident-domain';
import { IncidentMappingError } from '../incident-mapping.error';
import { generateUuidV7 } from './generate-uuid-v7';
import {
  InMemoryIncidentReferenceImmutabilityError,
  InMemoryIncidentReferenceUniquenessError,
  InMemoryIncidentStoreCapacityExceededError,
} from './in-memory-incident-repository.errors';
import { InMemoryIncidentRepository } from './in-memory-incident.repository';

const REPORTER = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abd');
const ACTOR = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abe');
const CLOCK = FixedClock.at(new Date('2026-09-24T10:30:00.000Z'));
const CORRELATION = 'req-in-memory-1';

/** A freshly logged Incident, defaulting to `INC0000001` / a fresh v7 id — override both per test. */
function logIncident(
  overrides: Partial<Parameters<typeof Incident.log>[0]> = {},
): Incident {
  return Incident.log({
    id: Identity.fromString(generateUuidV7()),
    reference: TicketReference.fromString('INC0000001'),
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
}

/** Saves `count` distinct Incidents (`INC0000001`… `INCcount`), returning their ids in order. */
async function fillWithIncidents(
  repository: InMemoryIncidentRepository,
  count: number,
): Promise<Identity[]> {
  const ids: Identity[] = [];
  for (let sequence = 1; sequence <= count; sequence++) {
    const id = Identity.fromString(generateUuidV7());
    const reference = IncidentReferencePolicy.format(sequence);
    await repository.save(
      logIncident({ id, reference, shortDescription: `Incident ${sequence}` }),
    );
    ids.push(id);
  }
  return ids;
}

describe('InMemoryIncidentRepository', () => {
  describe('nextIdentity() (AC1)', () => {
    it('returns a distinct, valid UUID v7 on every call', async () => {
      const repository = new InMemoryIncidentRepository();

      const identities = await Promise.all(
        Array.from({ length: 200 }, () => repository.nextIdentity()),
      );

      identities.forEach((identity) => {
        expect(identity).toBeInstanceOf(Identity);
      });
      const values = identities.map((identity) => identity.value);
      expect(new Set(values).size).toBe(values.length);
    });
  });

  describe('nextReference() (AC2)', () => {
    it('yields INC + seven digits, strictly increasing and never repeated within the instance', async () => {
      const repository = new InMemoryIncidentRepository();

      const references = await Promise.all(
        Array.from({ length: 25 }, () => repository.nextReference()),
      );

      const values = references.map((reference) => reference.value);
      expect(values).toEqual(
        Array.from(
          { length: 25 },
          (_unused, index) => `INC${String(index + 1).padStart(7, '0')}`,
        ),
      );
      expect(new Set(values).size).toBe(values.length);
    });

    it('throws IncidentReferenceSequenceOutOfRangeError on the 10,000,000th call, which never comes back down (Trap 1)', async () => {
      const repository = new InMemoryIncidentRepository();
      const startedAt = Date.now();

      let lastError: unknown;
      for (let call = 0; call < 10_000_000; call++) {
        try {
          await repository.nextReference();
        } catch (error) {
          lastError = error;
        }
      }
      const elapsedMs = Date.now() - startedAt;
      // Reported verbatim in the ticket's report, not asserted here — this is instrumentation,
      // not a behavior check (see Trap 1's own "mídelo primero").
      console.log(
        `[T-C10-77 Trap 1] 10,000,000 x nextReference() took ${elapsedMs}ms`,
      );

      expect(lastError).toBeInstanceOf(
        IncidentReferenceSequenceOutOfRangeError,
      );

      // The 10,000,001st call also throws — the counter already moved past the ceiling and
      // never decrements, so it does not "recover" or reuse a value.
      await expect(repository.nextReference()).rejects.toThrow(
        IncidentReferenceSequenceOutOfRangeError,
      );
    }, 30_000);
  });

  describe('save() / findById() / findByReference() (AC3)', () => {
    it('round-trips every mapped field and returns a fresh aggregate instance on each read', async () => {
      const repository = new InMemoryIncidentRepository();
      const id = Identity.fromString(generateUuidV7());
      const reference = TicketReference.fromString('INC0000001');
      const incident = logIncident({
        id,
        reference,
        shortDescription: 'Cannot submit match roster',
        description: 'Details.',
      });

      await repository.save(incident);

      const byId = await repository.findById(id);
      const byReference = await repository.findByReference(reference);

      expect(byId).toBeInstanceOf(Incident);
      expect(byReference).toBeInstanceOf(Incident);
      expect(byId).not.toBe(byReference);
      expect(byId?.id.equals(id)).toBe(true);
      expect(byId?.reference.equals(reference)).toBe(true);
      expect(byId?.reporterId.equals(REPORTER)).toBe(true);
      expect(byId?.loggedBy.equals(ACTOR)).toBe(true);
      expect(byId?.originChannel.equals(OriginChannel.fromCode('portal'))).toBe(
        true,
      );
      expect(byId?.shortDescription).toBe('Cannot submit match roster');
      expect(byId?.description).toBe('Details.');
      expect(byId?.affectedServiceId).toBeNull();
      expect(byId?.loggedAtEpochMs).toBe(CLOCK.now().getTime());
      expect(byId?.categoryId).toBeNull();
      expect(byId?.impact).toBeNull();
      expect(byId?.urgency).toBeNull();
      expect(byId?.priority).toBeNull();
      expect(byId?.competitionAffectsInProgress).toBe(false);
      expect(byId?.affectedSubject).toBeNull();
      expect(byId?.assignment).toBeNull();

      const byIdAgain = await repository.findById(id);
      expect(byIdAgain).not.toBe(byId);
    });

    it('overwrites the stored snapshot when the same id is saved again with the same reference', async () => {
      const repository = new InMemoryIncidentRepository();
      const id = Identity.fromString(generateUuidV7());
      const reference = TicketReference.fromString('INC0000001');
      await repository.save(
        logIncident({ id, reference, shortDescription: 'Original' }),
      );

      await repository.save(
        logIncident({ id, reference, shortDescription: 'Updated' }),
      );

      const stored = await repository.findById(id);
      expect(stored?.shortDescription).toBe('Updated');
    });
  });

  describe('absence (AC4)', () => {
    it('resolves to null, never throwing, when no Incident matches', async () => {
      const repository = new InMemoryIncidentRepository();

      await expect(
        repository.findById(Identity.fromString(generateUuidV7())),
      ).resolves.toBeNull();
      await expect(
        repository.findByReference(TicketReference.fromString('INC0000099')),
      ).resolves.toBeNull();
    });
  });

  describe('reference uniqueness (AC5)', () => {
    it('rejects a second Incident saved under a reference already indexed to a different id, leaving the first unchanged', async () => {
      const repository = new InMemoryIncidentRepository();
      const firstId = Identity.fromString(generateUuidV7());
      const reference = TicketReference.fromString('INC0000001');
      await repository.save(
        logIncident({
          id: firstId,
          reference,
          shortDescription: 'First incident',
        }),
      );

      const secondId = Identity.fromString(generateUuidV7());

      await expect(
        repository.save(
          logIncident({
            id: secondId,
            reference,
            shortDescription: 'Second incident',
          }),
        ),
      ).rejects.toThrow(InMemoryIncidentReferenceUniquenessError);

      const stillFirst = await repository.findById(firstId);
      expect(stillFirst?.shortDescription).toBe('First incident');
      await expect(repository.findById(secondId)).resolves.toBeNull();
    });
  });

  describe('reference immutability (AC6)', () => {
    it('rejects re-saving a known id with a different reference, leaving the persisted reference unchanged', async () => {
      const repository = new InMemoryIncidentRepository();
      const id = Identity.fromString(generateUuidV7());
      const originalReference = TicketReference.fromString('INC0000001');
      await repository.save(
        logIncident({
          id,
          reference: originalReference,
          shortDescription: 'Original',
        }),
      );

      const differentReference = TicketReference.fromString('INC0000002');

      await expect(
        repository.save(
          logIncident({
            id,
            reference: differentReference,
            shortDescription: 'Changed',
          }),
        ),
      ).rejects.toThrow(InMemoryIncidentReferenceImmutabilityError);

      const stored = await repository.findById(id);
      expect(stored?.reference.equals(originalReference)).toBe(true);
      expect(stored?.shortDescription).toBe('Original');
    });
  });

  describe('capacity ceiling (AC7)', () => {
    it('enforces the 10,000-Incident ceiling on the 10,001st save(), leaving the store unchanged', async () => {
      const repository = new InMemoryIncidentRepository();
      const ids = await fillWithIncidents(repository, 10_000);

      const overflowId = Identity.fromString(generateUuidV7());
      const overflowReference = IncidentReferencePolicy.format(10_001);

      await expect(
        repository.save(
          logIncident({
            id: overflowId,
            reference: overflowReference,
            shortDescription: 'Overflow',
          }),
        ),
      ).rejects.toThrow(InMemoryIncidentStoreCapacityExceededError);

      await expect(repository.findById(overflowId)).resolves.toBeNull();
      const firstStored = await repository.findById(ids[0]);
      expect(firstStored?.shortDescription).toBe('Incident 1');
    }, 20_000);

    it('still allows overwriting a known id at full capacity — never counted against the ceiling (Trap 2)', async () => {
      const repository = new InMemoryIncidentRepository();
      const ids = await fillWithIncidents(repository, 10_000);

      await repository.save(
        logIncident({
          id: ids[0],
          reference: IncidentReferencePolicy.format(1),
          shortDescription: 'Updated at capacity',
        }),
      );

      const stored = await repository.findById(ids[0]);
      expect(stored?.shortDescription).toBe('Updated at capacity');
    }, 20_000);
  });

  describe('Trap 2 — save() checks every rule before mutating the store', () => {
    it('calls IncidentMapper.toEntity() first, so a mapping error leaves nothing saved', async () => {
      const repository = new InMemoryIncidentRepository();
      const id = Identity.fromString(generateUuidV7());
      const reference = TicketReference.fromString('INC0000001');
      const snapshotCarryingUnmappedState: IncidentSnapshot = {
        id,
        reference,
        loggedAtEpochMs: CLOCK.now().getTime(),
        loggedBy: ACTOR,
        reporterId: REPORTER,
        originChannel: OriginChannel.fromCode('portal'),
        shortDescription: 'Cannot submit match roster',
        description: 'Details.',
        affectedServiceId: null,
        // `categoryId` has no column yet (T-C1-06 Scope) — IncidentMapper.toEntity() must
        // reject this before the repository touches its own maps.
        categoryId: Identity.fromString(generateUuidV7()),
        impact: null,
        urgency: null,
        priority: null,
        competitionAffectsInProgress: false,
        affectedSubject: null,
        assignment: null,
      };
      const incidentCarryingUnmappedState = Incident.reconstitute(
        snapshotCarryingUnmappedState,
      );

      await expect(
        repository.save(incidentCarryingUnmappedState),
      ).rejects.toThrow(IncidentMappingError);

      await expect(repository.findById(id)).resolves.toBeNull();
      await expect(repository.findByReference(reference)).resolves.toBeNull();
    });
  });

  describe('Trap 3 — no mutable state shared with the stored snapshot', () => {
    it('rejects mutating a read result, and the next read is unaffected', async () => {
      const repository = new InMemoryIncidentRepository();
      const id = Identity.fromString(generateUuidV7());
      const reference = TicketReference.fromString('INC0000001');
      await repository.save(
        logIncident({ id, reference, shortDescription: 'Original' }),
      );

      const firstRead = await repository.findById(id);
      expect(() => {
        (
          firstRead as unknown as { shortDescription: string }
        ).shortDescription = 'tampered';
      }).toThrow(TypeError);

      const secondRead = await repository.findById(id);
      expect(secondRead).not.toBe(firstRead);
      expect(secondRead?.shortDescription).toBe('Original');
    });

    it('never lets the aggregate handed to save() reach the stored snapshot either', async () => {
      const repository = new InMemoryIncidentRepository();
      const id = Identity.fromString(generateUuidV7());
      const reference = TicketReference.fromString('INC0000001');
      const incident = logIncident({
        id,
        reference,
        shortDescription: 'Original',
      });

      await repository.save(incident);

      // `incident` is already frozen by Incident.log() itself — mutating it is rejected
      // independently of this adapter; the assertion that matters here is the one after,
      // proving the stored snapshot never aliased it in the first place.
      expect(() => {
        (incident as unknown as { shortDescription: string }).shortDescription =
          'tampered';
      }).toThrow(TypeError);

      const stored = await repository.findById(id);
      expect(stored?.shortDescription).toBe('Original');
    });
  });

  describe('Trap 5 — no DataSource ever constructed or imported', () => {
    it('never references typeorm’s DataSource in this adapter’s own source', () => {
      const sourcePath = join(__dirname, 'in-memory-incident.repository.ts');
      const source = readFileSync(sourcePath, 'utf8');

      expect(source).not.toMatch(/DataSource/);
    });
  });
});
