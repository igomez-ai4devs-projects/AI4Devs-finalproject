import { DataSource } from 'typeorm';
import {
  FixedClock,
  Identity,
  TicketReference,
} from '@sport-itsm/shared-domain';
import { Incident, OriginChannel } from '@sport-itsm/incident-domain';
import { IncidentEntity } from './incident.entity';
import { TypeOrmIncidentRepository } from './typeorm-incident.repository';

/**
 * `T-C1-04`'s acceptance criteria, asserted against a **real** PostgreSQL
 * instance — `incident.incident_reference_seq`,
 * `incident.fn_reject_reference_update()` and
 * `tg_incident_ticket_reference_immutable` only exist once this ticket's
 * migration has run, exactly like `incident-typeorm.integration-spec.ts`
 * (`T-C1-06`). Runs only under the `integration` Nx target, never `test`
 * (`project.json`, `T-C1-06` Trap 7).
 *
 * **AC1 (concurrency).** There is no application-level uniqueness check in
 * this codebase to "remove" (`grep -rn "reference" libs/incident` finds
 * none) — every test below already runs with nothing but the database
 * standing between two concurrent allocations and a collision, so a passing
 * suite here **is** the proof the guarantee is the database's, not the
 * application's.
 *
 * **AC3, narrowed and reported.** The Incident lifecycle has no "cancelled"
 * state yet (`T-C1-50` introduces it) — only the deletion and
 * rollback-never-reuses parts of AC3 are demonstrable today; the
 * cancellation part is reported as not yet testable, per this ticket's own
 * `## Acceptance criteria` and the report's findings.
 */
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env['POSTGRES_HOST'] ?? 'localhost',
  port: Number(process.env['POSTGRES_PORT'] ?? 5499),
  username: process.env['POSTGRES_USER'] ?? 'postgres',
  password: process.env['POSTGRES_PASSWORD'] ?? 'postgres',
  database: process.env['POSTGRES_DB'] ?? 'sport_itsm_e2e',
  synchronize: false,
  migrationsRun: false,
  entities: [IncidentEntity],
});

const REPORTER = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-223456789abd');
const ACTOR = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-223456789abe');
const CLOCK = FixedClock.at(new Date('2026-09-24T10:30:00.000Z'));

function logIncident(
  overrides: { id: Identity; reference: TicketReference },
  correlationId: string,
) {
  const { incident } = Incident.log({
    id: overrides.id,
    reference: overrides.reference,
    reporterId: REPORTER,
    originChannel: OriginChannel.fromCode('portal'),
    shortDescription: 'T-C1-04 reference-sequence proof',
    description:
      'Persisted only to exercise incident_reference_seq guarantees.',
    actor: ACTOR,
    correlationId,
    occurredAt: CLOCK.now(),
  });
  return incident;
}

describe('incident.incident_reference_seq — sequence, immutability trigger and never-reused guarantees (T-C1-04)', () => {
  let repository: TypeOrmIncidentRepository;

  beforeAll(async () => {
    await dataSource.initialize();
    repository = new TypeOrmIncidentRepository(dataSource);
  });

  afterEach(async () => {
    await dataSource.query('DELETE FROM "incident"."incident_ticket"');
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  describe('AC1 — concurrency', () => {
    it('20 Incidents created concurrently (Promise.all over the pool`s separate connections) never share a reference', async () => {
      const concurrency = 20;

      const incidents = await Promise.all(
        Array.from({ length: concurrency }, async (_, index) => {
          const id = await repository.nextIdentity();
          const reference = await repository.nextReference();
          const incident = logIncident(
            { id, reference },
            `req-concurrency-${index}`,
          );
          await repository.save(incident);
          return incident;
        }),
      );

      const referenceValues = incidents.map(
        (incident) => incident.reference.value,
      );
      expect(new Set(referenceValues).size).toBe(concurrency);
    });

    it('a forced INSERT with a duplicate reference is rejected by uq_incident_reference, not by application code', async () => {
      const sharedReference = await repository.nextReference();
      const first = logIncident(
        { id: await repository.nextIdentity(), reference: sharedReference },
        'req-duplicate-1',
      );
      await repository.save(first);

      const second = logIncident(
        { id: await repository.nextIdentity(), reference: sharedReference },
        'req-duplicate-2',
      );

      await expect(repository.save(second)).rejects.toThrow(
        /uq_incident_reference/i,
      );
    });
  });

  describe('AC2 — immutability trigger (DATA-MODEL.md §3.2, M18)', () => {
    it('rejects a direct SQL UPDATE of reference, run as the postgres role (the role every environment connects as)', async () => {
      const id = await repository.nextIdentity();
      const reference = await repository.nextReference();
      await repository.save(logIncident({ id, reference }, 'req-immutable-1'));

      await expect(
        dataSource.query(
          'UPDATE "incident"."incident_ticket" SET "reference" = $1 WHERE "id" = $2',
          ['INC9999998', id.value],
        ),
      ).rejects.toThrow(/immutable/i);
    });

    it('a normal save() of an already-persisted Incident (same reference) does not fire the trigger', async () => {
      const id = await repository.nextIdentity();
      const reference = await repository.nextReference();
      const incident = logIncident({ id, reference }, 'req-immutable-2');
      await repository.save(incident);

      await expect(repository.save(incident)).resolves.toBeUndefined();

      const reloaded = await repository.findById(id);
      expect(reloaded?.reference.equals(reference)).toBe(true);
    });
  });

  describe('AC3 — never reused (deletion and rollback); "cancelled" is not yet representable (T-C1-50)', () => {
    it('deleting a row does not free its reference for reuse — the next allocation is a new value', async () => {
      const id = await repository.nextIdentity();
      const reference = await repository.nextReference();
      await repository.save(logIncident({ id, reference }, 'req-deleted-1'));

      await dataSource.query(
        'DELETE FROM "incident"."incident_ticket" WHERE "id" = $1',
        [id.value],
      );

      const next = await repository.nextReference();
      expect(next.equals(reference)).toBe(false);
    });

    it('a value allocated inside a rolled-back transaction is never reissued — nextval() is not transactional by design', async () => {
      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const [{ next_value: rolledBackValue }] = await queryRunner.query(
        "SELECT nextval('incident.incident_reference_seq') AS next_value",
      );
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      const [{ next_value: nextValue }] = await dataSource.query(
        "SELECT nextval('incident.incident_reference_seq') AS next_value",
      );

      expect(Number(nextValue)).toBeGreaterThan(Number(rolledBackValue));
    });
  });
});
