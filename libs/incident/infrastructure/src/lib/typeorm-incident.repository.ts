import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Identity, TicketReference } from '@sport-itsm/shared-domain';
import { Incident, IncidentRepositoryPort } from '@sport-itsm/incident-domain';
import { IncidentEntity } from './incident.entity';
import { IncidentMapper } from './incident.mapper';
import { NextIncidentReferenceNotImplementedError } from './next-incident-reference-not-implemented.error';

/**
 * The `IncidentRepositoryPort` outbound adapter (`ARCHITECTURE.md` §6.2/§6.3,
 * `T-C1-06`) — the first TypeORM repository, and the first real entity
 * registration, in this codebase.
 *
 * Bound to `INCIDENT_REPOSITORY` only in `apps/api`'s `IncidentModule`
 * (composition root, ADR-005); this class is never imported by
 * `libs/incident/application` or `libs/incident/domain`.
 *
 * Takes the `DataSource` itself as its only constructor dependency — not a
 * pre-resolved `Repository<IncidentEntity>` — because the entity's own
 * `Repository` is trivially obtained from an initialized `DataSource`
 * (`dataSource.getRepository(...)`), and depending on the concrete `DataSource`
 * class lets Nest wire this provider without a bespoke injection token
 * (`T-C1-06` Trap 4 — `@nestjs/typeorm` is not installed).
 *
 * **Connects lazily, on first use — a deliberate deviation from Trap 4's own
 * wording ("the API needs PostgreSQL to boot"), reported rather than silently
 * implemented as written.** `DatabaseModule` constructs the `DataSource`
 * without calling `initialize()`; this class opens the connection itself, the
 * first time any method here actually needs it, and memoizes the in-flight
 * `initialize()` promise so concurrent callers await the same connection
 * instead of racing two `initialize()` calls (TypeORM rejects a second one
 * outright). Eagerly connecting inside `DatabaseModule`'s factory — the more
 * literal reading of Trap 4 — would run `DataSource.initialize()` for every
 * `NestFactory.create(AppModule)`, including
 * `apps/api/src/testing/test-event-dispatch.harness-gating.spec.ts`, which is
 * outside this ticket's boundaries (`apps/api/src/testing/**` — "Lo que NO
 * debes tocar") and boots `AppModule` with placeholder `POSTGRES_*` values on
 * the stated assumption "No database is ever contacted". Confirmed
 * empirically: eager connection makes that suite fail four `NestFactory.create`
 * calls (`ECONNREFUSED`/auth failure against a placeholder connection) and
 * turns `pnpm nx test api` red with no database running — exactly what
 * verification #8 requires to stay green. Lazy connection keeps that
 * pre-existing suite passing (it never touches `INCIDENT_REPOSITORY`) while
 * still opening a real connection the moment any incident use case actually
 * calls this adapter — see the report's findings for the full trade-off.
 */
@Injectable()
export class TypeOrmIncidentRepository implements IncidentRepositoryPort {
  private initializationPromise: Promise<DataSource> | null = null;

  constructor(private readonly dataSource: DataSource) {}

  private ensureInitialized(): Promise<DataSource> {
    if (this.dataSource.isInitialized) {
      return Promise.resolve(this.dataSource);
    }
    this.initializationPromise ??= this.dataSource.initialize();
    return this.initializationPromise;
  }

  private async ormRepository(): Promise<Repository<IncidentEntity>> {
    const dataSource = await this.ensureInitialized();
    return dataSource.getRepository(IncidentEntity);
  }

  /**
   * A UUID v7, read from PostgreSQL 18's core `uuidv7()` function
   * (`DATA-MODEL.md` §3.1, ADR-012) rather than generated in Node:
   * `crypto.randomUUID()` produces a v4, which `Identity.fromString()`
   * rejects outright (`T-C1-06` Trap 5) and which would silently break the
   * B-tree insert-locality property the schema relies on v7 for (§3.1.1) if
   * it did not. No new dependency is introduced — the database is already the
   * source of truth for this value's shape.
   */
  async nextIdentity(): Promise<Identity> {
    const dataSource = await this.ensureInitialized();
    const rows: Array<{ id: string }> = await dataSource.query(
      'SELECT uuidv7() AS id',
    );
    return Identity.fromString(rows[0].id);
  }

  /**
   * @throws {NextIncidentReferenceNotImplementedError} always — see that
   * error's own doc comment. `T-C1-04` replaces this method with a real
   * `nextval('incident.incident_reference_seq')` read.
   */
  async nextReference(): Promise<TicketReference> {
    throw new NextIncidentReferenceNotImplementedError();
  }

  async findById(id: Identity): Promise<Incident | null> {
    const repository = await this.ormRepository();
    const entity = await repository.findOne({
      where: { id: id.value },
    });
    return entity ? IncidentMapper.toDomain(entity) : null;
  }

  /**
   * Insert or update, per the port's own contract
   * (`IncidentRepositoryPort.save()`'s doc comment). `T-C1-06`'s own
   * acceptance criteria only exercise the insert path (log, save, reload);
   * `TypeOrmIncidentRepository` still implements the full port rather than an
   * insert-only subset, since a narrower port is not what `T-C1-03`/`T-C1-05`
   * declared.
   */
  async save(incident: Incident): Promise<void> {
    const entity = IncidentMapper.toEntity(incident);
    const repository = await this.ormRepository();
    await repository.save(entity);
  }
}
