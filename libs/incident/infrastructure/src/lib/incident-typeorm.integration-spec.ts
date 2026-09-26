import { DataSource } from 'typeorm';
import { FixedClock, Identity } from '@sport-itsm/shared-domain';
import {
  Incident,
  IncidentReferencePolicy,
  OriginChannel,
} from '@sport-itsm/incident-domain';
import { IncidentEntity } from './incident.entity';
import { TypeOrmIncidentRepository } from './typeorm-incident.repository';

/**
 * AC1/AC2 of `T-C1-06` — asserted against a **real** PostgreSQL instance, not
 * a mock, exactly as the ticket's acceptance criteria demand. Runs only under
 * the `integration` Nx target (`project.json`), which brings up the
 * ephemeral e2e database (`docker/docker-compose.e2e.yml`, port 5499),
 * applies the real migration chain, runs this file, and tears the stack down
 * unconditionally afterwards (`tools/e2e/teardown-after.mjs`) — never under
 * the Nx-inferred `test` target, which CI's `verify` job runs with no
 * database at all (T-C1-06 Trap 7).
 *
 * Connection values default to the e2e stack's own values so this file works
 * unmodified whether it is driven by the Nx target (which sets these as
 * process env) or run by hand against a manually started
 * `docker-compose.e2e.yml`. Reading `process.env` directly here is a test
 * harness, not application feature code — the same allowance `apps/api-e2e`
 * already exercises.
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

const REPORTER = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abd');
const ACTOR = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abe');
const SERVICE = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abf');
const CLOCK = FixedClock.at(new Date('2026-09-24T10:30:00.000Z'));

describe('TypeOrmIncidentRepository — round trip against real PostgreSQL (T-C1-06 AC1/AC2)', () => {
  let repository: TypeOrmIncidentRepository;

  beforeAll(async () => {
    await dataSource.initialize();
    repository = new TypeOrmIncidentRepository(dataSource);
  });

  afterEach(async () => {
    // Isolation between tests without needing a fresh container per test —
    // the ephemeral e2e database's only tenant is this suite (and, at
    // different times, apps/api-e2e's own suite, never concurrently).
    await dataSource.query('DELETE FROM "incident"."incident_ticket"');
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('AC1 — every field round-trips unchanged through save() then findById()', async () => {
    const identity = await repository.nextIdentity();
    const { incident: logged } = Incident.log({
      id: identity,
      reference: IncidentReferencePolicy.format(1),
      reporterId: REPORTER,
      originChannel: OriginChannel.fromCode('agent_logged'),
      shortDescription: 'Scoreboard freezes during live match updates',
      description:
        'The scoreboard widget stops refreshing after roughly ten minutes and requires a manual reload.',
      affectedServiceId: SERVICE,
      actor: ACTOR,
      correlationId: 'req-integration-1',
      occurredAt: CLOCK.now(),
    });

    await repository.save(logged);
    const reloaded = await repository.findById(identity);

    expect(reloaded).not.toBeNull();
    expect(reloaded).toEqual(logged);
  });

  it('AC2 — a newly logged Incident reloads with no category, Impact, Urgency or Priority, and the competition flag false', async () => {
    const identity = await repository.nextIdentity();
    const { incident: logged } = Incident.log({
      id: identity,
      reference: IncidentReferencePolicy.format(2),
      reporterId: REPORTER,
      originChannel: OriginChannel.fromCode('portal'),
      shortDescription: 'Cannot submit match roster',
      description:
        'The roster submission form rejects a valid squad list with no error message.',
      actor: ACTOR,
      correlationId: 'req-integration-2',
      occurredAt: CLOCK.now(),
    });

    await repository.save(logged);
    const reloaded = await repository.findById(identity);

    expect(reloaded?.categoryId).toBeNull();
    expect(reloaded?.impact).toBeNull();
    expect(reloaded?.urgency).toBeNull();
    expect(reloaded?.priority).toBeNull();
    expect(reloaded?.competitionAffectsInProgress).toBe(false);
    expect(reloaded?.affectedSubject).toBeNull();
    expect(reloaded?.assignment).toBeNull();
  });

  it('findById() returns null for an identity nothing was ever saved under', async () => {
    const identity = await repository.nextIdentity();

    const reloaded = await repository.findById(identity);

    expect(reloaded).toBeNull();
  });

  it('nextIdentity() reads a real, never-repeating UUID v7 from PostgreSQL 18 core (T-C1-06 Trap 5)', async () => {
    const first = await repository.nextIdentity();
    const second = await repository.nextIdentity();

    expect(first.equals(second)).toBe(false);
  });

  it('nextReference() now allocates a real, database-backed reference (T-C1-04 implements incident.incident_reference_seq; superseded T-C1-06 Trap 5 expectation)', async () => {
    const reference = await repository.nextReference();

    expect(reference.prefix).toBe('INC');
  });
});
