import { Test } from '@nestjs/testing';
import {
  GetIncidentByReferenceUseCase,
  LogIncidentInput,
  LogIncidentUseCase,
} from '@sport-itsm/incident-application';
import { INCIDENT_REPOSITORY } from '@sport-itsm/incident-domain';
import { InMemoryIncidentRepository } from '@sport-itsm/incident-infrastructure';
import { BOOTSTRAP_REQUESTER_ID } from '../../bootstrap/bootstrap-identities';
import { PersistenceMode } from '../../config/env.validation';
import { EventDispatchModule } from '../../event-dispatch/event-dispatch.module';
import { PersistenceModule } from '../../persistence/persistence.module';
import {
  INCIDENT_ACTOR_RESOLVER,
  IncidentActorResolver,
} from './incident-actor-resolver';
import { IncidentModule } from './incident.module';

/**
 * `T-C10-78` AC7: "both intake and detail lookup exercised against a
 * `PERSISTENCE_MODE=memory` boot … the detail response matches exactly what
 * was persisted, proving the wiring end to end without a database" — with no
 * HTTP and no environment-variable/module-registry gymnastics needed, since
 * `PersistenceModule.forMode()` takes `mode` as a plain parameter rather than
 * reading the environment itself (`../app.module.ts` is the only file that
 * does).
 *
 * Composed exactly like `./incident.module.spec.ts` and
 * `./log-incident.fixed-actor.spec.ts`: `IncidentModule` provides
 * `LogIncidentUseCase`, `GetIncidentByReferenceUseCase` and
 * `INCIDENT_ACTOR_RESOLVER`; `PersistenceModule.forMode(PersistenceMode.Memory)`
 * provides `INCIDENT_REPOSITORY`/`INCIDENT_READ_REPOSITORY`;
 * `EventDispatchModule` provides the global `EVENT_PUBLISHER`
 * `LogIncidentUseCase`'s factory injects. Every import here is a plain,
 * top-level, static import — deliberately: see
 * `../persistence-mode.boot.spec.ts`'s own doc comment for why this proof
 * lives in its own file rather than alongside that one's
 * `jest.isolateModulesAsync`-based boot spec (mixing a dynamic
 * `import()`/`require()` anywhere in a file with a static import of a
 * workspace library anywhere else in that *same* file trips
 * `@nx/enforce-module-boundaries`'s lazy-loaded-library check for the whole
 * repository).
 */
describe('Incident intake and detail lookup against a memory-mode boot, with no HTTP and no database (T-C10-78 AC7)', () => {
  const VALID_INPUT: LogIncidentInput = {
    originChannel: 'portal',
    shortDescription: 'Scoreboard widget fails to refresh',
    description:
      'The live scoreboard widget on the tournament page stops refreshing after a few minutes and requires a manual reload.',
  };

  it('logs an Incident and reads it back by reference with matching fields', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        EventDispatchModule,
        PersistenceModule.forMode(PersistenceMode.Memory),
        IncidentModule,
      ],
    }).compile();

    try {
      const logIncident = moduleRef.get(LogIncidentUseCase);
      const getIncidentByReference = moduleRef.get(
        GetIncidentByReferenceUseCase,
      );
      const actorResolver = moduleRef.get<IncidentActorResolver>(
        INCIDENT_ACTOR_RESOLVER,
      );
      const repository = moduleRef.get(INCIDENT_REPOSITORY);
      expect(repository).toBeInstanceOf(InMemoryIncidentRepository);

      const actor = await actorResolver.resolveActor();
      const logged = await logIncident.execute(VALID_INPUT, {
        actor,
        correlationId: 'req-t-c10-78-ac7-001',
      });

      const readBack = await getIncidentByReference.execute(logged.reference);

      expect(readBack.ok).toBe(true);
      if (!readBack.ok) {
        throw new Error('unreachable: asserted ok above');
      }
      expect(readBack.value.id.equals(logged.id)).toBe(true);
      expect(readBack.value.reference.equals(logged.reference)).toBe(true);
      expect(readBack.value.shortDescription).toBe(
        VALID_INPUT.shortDescription,
      );
      expect(readBack.value.description).toBe(VALID_INPUT.description);
      expect(readBack.value.reporterId.equals(BOOTSTRAP_REQUESTER_ID)).toBe(
        true,
      );
      expect(readBack.value.loggedBy.equals(BOOTSTRAP_REQUESTER_ID)).toBe(true);
    } finally {
      await moduleRef.close();
    }
  });
});
