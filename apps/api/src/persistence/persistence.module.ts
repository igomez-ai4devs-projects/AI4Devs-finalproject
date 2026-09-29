import {
  DynamicModule,
  Global,
  InjectionToken,
  Module,
  Provider,
} from '@nestjs/common';
import { PersistenceMode } from '../config/env.validation';
import { DatabaseModule } from '../database/database.module';
import { incidentPersistenceBindings } from '../app/incident/incident-persistence.bindings';

/**
 * `Nest`'s `exports` array wants injection tokens, not full `Provider`
 * declarations (`DatabaseModule`/`EventDispatchModule` both export tokens
 * only) — this extracts each entry's `provide` key, deduplicated, so a port
 * bound twice for the same token (there is none today) would still export
 * once.
 */
function tokensOf(providers: Provider[]): InjectionToken[] {
  const tokens = providers.map((provider) =>
    'provide' in provider ? provider.provide : provider,
  );
  return [...new Set(tokens)];
}

/**
 * Selection happens **once**, at the composition root, as data — not as
 * scattered conditionals (ADR-015 decision 3, `ARCHITECTURE.md` §6.3).
 *
 * `AppModule` calls `PersistenceModule.forMode(loadEnvironment().PERSISTENCE_MODE)`
 * — the same sanctioned, pre-DI environment read `AppModule` already performs
 * for `TestEventDispatchModule` — and this becomes **the only other place in
 * the codebase that reads `PERSISTENCE_MODE`** (`env.validation.ts` declares
 * it, `data-source.ts` guards the TypeORM CLI with it, both `T-C10-75`; see
 * this ticket's own reported finding on the AC3 wording, which names only
 * those two files and omits this module and `AppModule`'s call site).
 *
 * `@Global()` for the same reason `DatabaseModule` and `EventDispatchModule`
 * already are: every context's repository adapters need
 * `INCIDENT_REPOSITORY`/`INCIDENT_READ_REPOSITORY` (and, later, every other
 * context's own port tokens), and none of them should have to re-import this
 * module just to reach them.
 *
 * `forMode()` concatenates every context's *total* bindings map it is given
 * — today, only `incidentPersistenceBindings` — into its own `providers`/
 * `exports`, and imports `DatabaseModule` **only** when `mode ===
 * PersistenceMode.Postgres`. In `memory` mode, `DatabaseModule` is never
 * imported, so its `DataSource` provider is never constructed and no
 * connection is ever attempted — the one `if (mode === …)` this file is
 * allowed, and the only one that decides whether `DatabaseModule` is part of
 * the graph at all.
 */
@Global()
@Module({})
export class PersistenceModule {
  static forMode(mode: PersistenceMode): DynamicModule {
    const providers: Provider[] = [...incidentPersistenceBindings[mode]];

    return {
      module: PersistenceModule,
      imports: mode === PersistenceMode.Postgres ? [DatabaseModule] : [],
      providers,
      exports: tokensOf(providers),
    };
  }
}
