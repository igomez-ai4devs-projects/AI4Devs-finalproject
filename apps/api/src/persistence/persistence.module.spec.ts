import { PersistenceMode } from '../config/env.validation';
import { DatabaseModule } from '../database/database.module';
import { PersistenceModule } from './persistence.module';

/**
 * `T-C10-78` AC1/AC2's `DatabaseModule`-inclusion mechanic, tested as the
 * pure function it is: `PersistenceModule.forMode(mode)` takes no
 * environment dependency of its own (`AppModule` is what reads
 * `PERSISTENCE_MODE` and passes it in as `mode`), so this suite needs no
 * `jest.isolateModulesAsync` dance, no environment variables, and can import
 * everything statically — the same reason `incident.module.spec.ts` and
 * `log-incident.fixed-actor.spec.ts` need none either
 * (`../app/incident/incident-persistence.bindings.ts`'s own bindings are
 * covered there, by identity, in `memory` mode; this file covers the one
 * thing those two don't: whether `DatabaseModule` itself is part of the
 * returned `imports`).
 */
describe('PersistenceModule.forMode() (T-C10-78 AC1/AC2)', () => {
  it('imports DatabaseModule in postgres mode', () => {
    const dynamicModule = PersistenceModule.forMode(PersistenceMode.Postgres);

    expect(dynamicModule.module).toBe(PersistenceModule);
    expect(dynamicModule.imports).toEqual([DatabaseModule]);
  });

  it('never imports DatabaseModule in memory mode', () => {
    const dynamicModule = PersistenceModule.forMode(PersistenceMode.Memory);

    expect(dynamicModule.module).toBe(PersistenceModule);
    expect(dynamicModule.imports).toEqual([]);
  });
});
