import { Test } from '@nestjs/testing';
import {
  INCIDENT_READ_REPOSITORY,
  INCIDENT_REPOSITORY,
} from '@sport-itsm/incident-domain';
import { InMemoryIncidentRepository } from '@sport-itsm/incident-infrastructure';
import { PersistenceMode } from '../../config/env.validation';
import { EventDispatchModule } from '../../event-dispatch/event-dispatch.module';
import { PersistenceModule } from '../../persistence/persistence.module';
import { IncidentModule } from './incident.module';

/**
 * `T-C1-100` AC6: "`INCIDENT_REPOSITORY` and `INCIDENT_READ_REPOSITORY`
 * resolve to the same `TypeOrmIncidentRepository` instance, never two
 * separate instances."
 *
 * **`T-C10-78`** moved the binding itself out of `IncidentModule` into
 * `PersistenceModule.forMode()` (`incident-persistence.bindings.ts`), so this
 * suite now composes `IncidentModule` with `PersistenceModule.forMode(
 * PersistenceMode.Memory)` instead of relying on `IncidentModule`'s own
 * (now-removed) repository bindings — the ticket's own AC5.
 *
 * Proven by identity, not by type: overriding `INCIDENT_REPOSITORY` with a
 * plain stub (same trap `log-incident.fixed-actor.spec.ts` already worked
 * around, `T-C1-100` Trap 3) means no real adapter is ever constructed here —
 * this suite needs no live database, in either mode. `INCIDENT_READ_REPOSITORY`'s
 * `useExisting` binding aliases whatever `INCIDENT_REPOSITORY` resolves to,
 * override included, so asserting the two tokens resolve to the identical
 * stub proves the wiring itself (`IncidentModule`'s own doc comment),
 * independent of which class ultimately backs the token in production.
 *
 * `EventDispatchModule` is imported alongside `IncidentModule` for the same
 * reason `log-incident.fixed-actor.spec.ts` already documents:
 * `LogIncidentUseCase`'s factory injects the global `EVENT_PUBLISHER` token,
 * which only resolves through `AppModule` in production; a narrow
 * `Test.createTestingModule` that composes `IncidentModule` alone must import
 * that global module explicitly — and, since `T-C10-78`, the same is true of
 * `PersistenceModule` for `INCIDENT_REPOSITORY`/`INCIDENT_READ_REPOSITORY`.
 */
describe('IncidentModule wiring (T-C1-100 AC6, T-C10-78 AC5)', () => {
  it('resolves INCIDENT_REPOSITORY and INCIDENT_READ_REPOSITORY to the same instance (override)', async () => {
    const stubRepository = { marker: 'single-instance-stub' };

    const moduleRef = await Test.createTestingModule({
      imports: [
        EventDispatchModule,
        PersistenceModule.forMode(PersistenceMode.Memory),
        IncidentModule,
      ],
    })
      .overrideProvider(INCIDENT_REPOSITORY)
      .useValue(stubRepository)
      .compile();

    const repository = moduleRef.get(INCIDENT_REPOSITORY);
    const readRepository = moduleRef.get(INCIDENT_READ_REPOSITORY);

    expect(readRepository).toBe(repository);
    expect(readRepository).toBe(stubRepository);

    await moduleRef.close();
  });

  /**
   * `T-C10-78` AC5, proven rather than assumed: "requiring no live database"
   * is only actually true if the token really resolves to
   * `InMemoryIncidentRepository` in `memory` mode — this case takes no
   * override, so it exercises `PersistenceModule.forMode(PersistenceMode.Memory)`'s
   * real binding end to end.
   */
  it('resolves both tokens to the same InMemoryIncidentRepository instance in memory mode, with no override', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        EventDispatchModule,
        PersistenceModule.forMode(PersistenceMode.Memory),
        IncidentModule,
      ],
    }).compile();

    const repository = moduleRef.get(INCIDENT_REPOSITORY);
    const readRepository = moduleRef.get(INCIDENT_READ_REPOSITORY);

    expect(repository).toBeInstanceOf(InMemoryIncidentRepository);
    expect(readRepository).toBe(repository);

    await moduleRef.close();
  });
});
