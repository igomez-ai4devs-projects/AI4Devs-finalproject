import { DataSource } from 'typeorm';
import {
  FixedClock,
  Identity,
  TicketReference,
} from '@sport-itsm/shared-domain';
import { Incident, OriginChannel } from '@sport-itsm/incident-domain';
import { IncidentEntity } from './incident.entity';
import { IncidentMapper } from './incident.mapper';
import { NextIncidentReferenceNotImplementedError } from './next-incident-reference-not-implemented.error';
import { TypeOrmIncidentRepository } from './typeorm-incident.repository';

const IDENTITY = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abc');
const REPORTER = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abd');
const ACTOR = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abe');
const REFERENCE = TicketReference.fromString('INC0000001');
const CLOCK = FixedClock.at(new Date('2026-09-24T10:30:00.000Z'));

/** A minimal fake standing in for TypeORM's `Repository<IncidentEntity>`. */
function fakeOrmRepository() {
  return {
    findOne: jest.fn(),
    save: jest.fn(),
  };
}

/**
 * A fake `DataSource` — no PostgreSQL involved. The real connection is
 * exercised only by the separate `integration` target (T-C1-06 Trap 7); this
 * spec is the unit-level proof that `TypeOrmIncidentRepository` calls the
 * right methods with the right arguments. `isInitialized: true` by default so
 * most tests skip the lazy-connect path entirely; the dedicated
 * "lazy connection" suite below overrides it to exercise that path.
 */
function fakeDataSource(
  ormRepository: ReturnType<typeof fakeOrmRepository>,
  overrides: { isInitialized?: boolean; initialize?: jest.Mock } = {},
) {
  return {
    getRepository: jest.fn().mockReturnValue(ormRepository),
    query: jest.fn(),
    isInitialized: overrides.isInitialized ?? true,
    initialize: overrides.initialize ?? jest.fn(),
  } as unknown as DataSource;
}

describe('TypeOrmIncidentRepository', () => {
  describe('nextIdentity()', () => {
    it('wraps the uuidv7() PostgreSQL 18 core function, never a v4 generator (T-C1-06 Trap 5)', async () => {
      const ormRepository = fakeOrmRepository();
      const dataSource = fakeDataSource(ormRepository);
      (dataSource.query as jest.Mock).mockResolvedValue([
        { id: '0192f3a4-5b6c-7d8e-8f90-fedcba987654' },
      ]);
      const repository = new TypeOrmIncidentRepository(dataSource);

      const identity = await repository.nextIdentity();

      expect(dataSource.query).toHaveBeenCalledWith('SELECT uuidv7() AS id');
      expect(
        identity.equals(
          Identity.fromString('0192f3a4-5b6c-7d8e-8f90-fedcba987654'),
        ),
      ).toBe(true);
    });
  });

  describe('nextReference()', () => {
    it('throws NextIncidentReferenceNotImplementedError — the sequence is T-C1-04 (T-C1-06 Trap 5)', async () => {
      const repository = new TypeOrmIncidentRepository(
        fakeDataSource(fakeOrmRepository()),
      );

      await expect(repository.nextReference()).rejects.toThrow(
        NextIncidentReferenceNotImplementedError,
      );
    });
  });

  describe('findById()', () => {
    it('returns null when no row matches', async () => {
      const ormRepository = fakeOrmRepository();
      ormRepository.findOne.mockResolvedValue(null);
      const repository = new TypeOrmIncidentRepository(
        fakeDataSource(ormRepository),
      );

      const result = await repository.findById(IDENTITY);

      expect(ormRepository.findOne).toHaveBeenCalledWith({
        where: { id: IDENTITY.value },
      });
      expect(result).toBeNull();
    });

    it('maps the row through IncidentMapper.toDomain() when found', async () => {
      const entity = new IncidentEntity();
      entity.id = IDENTITY.value;
      entity.reference = REFERENCE.value;
      entity.shortDescription = 'Cannot submit match roster';
      entity.description = 'Details.';
      entity.originChannel = 'portal';
      entity.reporterUserId = REPORTER.value;
      entity.serviceId = null;
      entity.createdAt = CLOCK.now();
      entity.updatedAt = CLOCK.now();
      entity.createdBy = ACTOR.value;
      entity.updatedBy = null;
      entity.version = 1;
      const ormRepository = fakeOrmRepository();
      ormRepository.findOne.mockResolvedValue(entity);
      const repository = new TypeOrmIncidentRepository(
        fakeDataSource(ormRepository),
      );

      const result = await repository.findById(IDENTITY);

      expect(result).toBeInstanceOf(Incident);
      expect(result?.id.equals(IDENTITY)).toBe(true);
      expect(
        result?.originChannel.equals(OriginChannel.fromCode('portal')),
      ).toBe(true);
    });
  });

  describe('save()', () => {
    it('maps the aggregate with IncidentMapper.toEntity() and persists it through the ORM repository', async () => {
      const ormRepository = fakeOrmRepository();
      ormRepository.save.mockResolvedValue(undefined);
      const repository = new TypeOrmIncidentRepository(
        fakeDataSource(ormRepository),
      );
      const { incident } = Incident.log({
        id: IDENTITY,
        reference: REFERENCE,
        reporterId: REPORTER,
        originChannel: OriginChannel.fromCode('portal'),
        shortDescription: 'Cannot submit match roster',
        description: 'Details.',
        actor: ACTOR,
        correlationId: 'req-1',
        occurredAt: CLOCK.now(),
      });

      await repository.save(incident);

      expect(ormRepository.save).toHaveBeenCalledTimes(1);
      const [persisted] = ormRepository.save.mock.calls[0];
      expect(persisted).toEqual(IncidentMapper.toEntity(incident));
    });
  });

  describe('lazy connection — a deliberate deviation from Trap 4 (see the class doc comment)', () => {
    it('never calls dataSource.initialize() when it is already initialized', async () => {
      const ormRepository = fakeOrmRepository();
      ormRepository.findOne.mockResolvedValue(null);
      const initialize = jest.fn();
      const dataSource = fakeDataSource(ormRepository, {
        isInitialized: true,
        initialize,
      });
      const repository = new TypeOrmIncidentRepository(dataSource);

      await repository.findById(IDENTITY);

      expect(initialize).not.toHaveBeenCalled();
    });

    it('initializes exactly once, memoizing concurrent callers onto the same in-flight promise', async () => {
      const ormRepository = fakeOrmRepository();
      ormRepository.findOne.mockResolvedValue(null);
      let resolveInitialize!: (dataSource: DataSource) => void;
      const initialize = jest.fn().mockReturnValue(
        new Promise<DataSource>((resolve) => {
          resolveInitialize = resolve;
        }),
      );
      const dataSource = fakeDataSource(ormRepository, {
        isInitialized: false,
        initialize,
      });
      const repository = new TypeOrmIncidentRepository(dataSource);

      const first = repository.findById(IDENTITY);
      const second = repository.findById(IDENTITY);
      // TypeORM's real `DataSource.initialize()` resolves to the DataSource
      // itself; the fake mirrors that so `ensureInitialized()` has something
      // to call `.getRepository()` on.
      resolveInitialize(dataSource);
      await Promise.all([first, second]);

      expect(initialize).toHaveBeenCalledTimes(1);
    });
  });
});
