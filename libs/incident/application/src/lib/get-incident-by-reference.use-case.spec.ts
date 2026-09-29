import {
  FixedClock,
  Identity,
  TicketReference,
} from '@sport-itsm/shared-domain';
import { isOk } from '@sport-itsm/shared-util';
import {
  Incident,
  IncidentReadRepositoryPort,
  IncidentReferencePolicy,
  OriginChannel,
} from '@sport-itsm/incident-domain';
import { GetIncidentByReferenceUseCase } from './get-incident-by-reference.use-case';

const IDENTITY = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abc');
const REPORTER = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abd');
const ACTOR = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abe');
const SERVICE = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abf');
const CLOCK = FixedClock.at(new Date('2026-09-24T10:30:00.000Z'));
const REFERENCE = IncidentReferencePolicy.format(1);

/**
 * AC3's proof (`T-C1-99`): this object carries **only** `findByReference` —
 * no `save`, no `nextIdentity`, no `nextReference`, no `findById`. It is
 * typed exactly as `IncidentReadRepositoryPort`, so if that interface ever
 * grew a mutating member, this literal would fail to compile for missing it,
 * and if `GetIncidentByReferenceUseCase`'s constructor ever widened to demand
 * `IncidentRepositoryPort` instead, passing this narrower object to it would
 * fail to compile for the opposite reason. The test below relies on that
 * compile-time shape, not merely on the stub never being called to write.
 */
class StubReadOnlyRepository implements IncidentReadRepositoryPort {
  private readonly incidentsByReference = new Map<string, Incident>();

  seed(incident: Incident): void {
    this.incidentsByReference.set(incident.reference.value, incident);
  }

  async findByReference(reference: TicketReference): Promise<Incident | null> {
    return this.incidentsByReference.get(reference.value) ?? null;
  }
}

const loggedIncident = () =>
  Incident.log({
    id: IDENTITY,
    reference: REFERENCE,
    reporterId: REPORTER,
    originChannel: OriginChannel.fromCode('portal'),
    shortDescription: 'Cannot submit match roster',
    description:
      'The roster submission form rejects a valid squad list with no error message.',
    affectedServiceId: SERVICE,
    actor: ACTOR,
    correlationId: 'req-3f8a10c2',
    occurredAt: CLOCK.now(),
  }).incident;

describe('GetIncidentByReferenceUseCase', () => {
  let repository: StubReadOnlyRepository;
  let useCase: GetIncidentByReferenceUseCase;

  beforeEach(() => {
    repository = new StubReadOnlyRepository();
    useCase = new GetIncidentByReferenceUseCase(repository);
  });

  describe('AC1 — a persisted Incident is found by its exact reference', () => {
    it('returns the full current state, including the slots this creation ticket leaves empty', async () => {
      repository.seed(loggedIncident());

      const result = await useCase.execute(REFERENCE);

      expect(isOk(result)).toBe(true);
      if (!isOk(result)) {
        throw new Error('expected an ok result');
      }
      expect(result.value.id.equals(IDENTITY)).toBe(true);
      expect(result.value.reference.equals(REFERENCE)).toBe(true);
      expect(result.value.reporterId.equals(REPORTER)).toBe(true);
      expect(result.value.shortDescription).toBe('Cannot submit match roster');
      expect(result.value.affectedServiceId?.equals(SERVICE)).toBe(true);
      // The slots not yet derived (block D / categorization) are visible as
      // such, never omitted from the returned state (T-C1-99 Trap 3).
      expect(result.value.categoryId).toBeNull();
      expect(result.value.impact).toBeNull();
      expect(result.value.urgency).toBeNull();
      expect(result.value.priority).toBeNull();
      expect(result.value.competitionAffectsInProgress).toBe(false);
      expect(result.value.affectedSubject).toBeNull();
      expect(result.value.assignment).toBeNull();
    });

    it('returns a plain snapshot, not the aggregate — no domain methods travel with the result', async () => {
      repository.seed(loggedIncident());

      const result = await useCase.execute(REFERENCE);

      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).not.toBeInstanceOf(Incident);
        expect(
          (result.value as unknown as { toSnapshot?: unknown }).toSnapshot,
        ).toBeUndefined();
      }
    });
  });

  describe('AC2 — no Incident matches the reference', () => {
    it('returns a typed not-found outcome, never throwing', async () => {
      const unknownReference = IncidentReferencePolicy.format(2);

      const result = await useCase.execute(unknownReference);

      expect(isOk(result)).toBe(false);
      if (isOk(result)) {
        throw new Error('expected an error result');
      }
      expect(result.error).toEqual({
        reason: 'INCIDENT_NOT_FOUND',
        reference: unknownReference,
      });
    });

    it('never rejects, for a reference matching no Incident', async () => {
      const unknownReference = IncidentReferencePolicy.format(3);

      await expect(useCase.execute(unknownReference)).resolves.toBeDefined();
    });
  });

  describe('AC3 — runs against a stubbed repository with no HTTP, no database, and no reachable write path', () => {
    it('is constructed from an object literal typed to carry only findByReference() — a compile-time proof, not just a runtime one', () => {
      const readOnlyPort: IncidentReadRepositoryPort = {
        findByReference: async () => null,
      };

      const useCaseFromLiteral = new GetIncidentByReferenceUseCase(
        readOnlyPort,
      );

      expect(useCaseFromLiteral).toBeInstanceOf(GetIncidentByReferenceUseCase);
    });

    it('never touches HTTP or a database — the only dependency is an in-memory stub', async () => {
      repository.seed(loggedIncident());

      await expect(useCase.execute(REFERENCE)).resolves.toBeDefined();
    });
  });
});
