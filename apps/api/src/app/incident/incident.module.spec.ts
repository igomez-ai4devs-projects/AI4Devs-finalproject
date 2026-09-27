import { Test } from '@nestjs/testing';
import {
  INCIDENT_READ_REPOSITORY,
  INCIDENT_REPOSITORY,
} from '@sport-itsm/incident-domain';
import { EventDispatchModule } from '../../event-dispatch/event-dispatch.module';
import { IncidentModule } from './incident.module';

/**
 * `T-C1-100` AC6: "`INCIDENT_REPOSITORY` and `INCIDENT_READ_REPOSITORY`
 * resolve to the same `TypeOrmIncidentRepository` instance, never two
 * separate instances."
 *
 * Proven by identity, not by type: overriding `INCIDENT_REPOSITORY` with a
 * plain stub (same trap `log-incident.fixed-actor.spec.ts` already worked
 * around, `T-C1-100` Trap 3) means neither `TypeOrmIncidentRepository` nor
 * its `DataSource` dependency is ever constructed here — this suite needs no
 * PostgreSQL connection. `INCIDENT_READ_REPOSITORY`'s `useExisting` binding
 * aliases whatever `INCIDENT_REPOSITORY` resolves to, override included, so
 * asserting the two tokens resolve to the identical stub proves the wiring
 * itself (`IncidentModule`'s own doc comment), independent of which class
 * ultimately backs the token in production.
 *
 * `EventDispatchModule` is imported alongside `IncidentModule` for the same
 * reason `log-incident.fixed-actor.spec.ts` already documents:
 * `LogIncidentUseCase`'s factory injects the global `EVENT_PUBLISHER` token,
 * which only resolves through `AppModule` in production; a narrow
 * `Test.createTestingModule` that composes `IncidentModule` alone must import
 * that global module explicitly.
 */
describe('IncidentModule wiring (T-C1-100 AC6)', () => {
  it('resolves INCIDENT_REPOSITORY and INCIDENT_READ_REPOSITORY to the same instance', async () => {
    const stubRepository = { marker: 'single-instance-stub' };

    const moduleRef = await Test.createTestingModule({
      imports: [EventDispatchModule, IncidentModule],
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
});
