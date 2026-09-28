import { Provider } from '@nestjs/common';
import {
  INCIDENT_READ_REPOSITORY,
  INCIDENT_REPOSITORY,
} from '@sport-itsm/incident-domain';
import {
  InMemoryIncidentRepository,
  TypeOrmIncidentRepository,
} from '@sport-itsm/incident-infrastructure';
import { PersistenceMode } from '../../config/env.validation';

/**
 * The `incident` context's total contribution to `PersistenceModule.forMode()`
 * (`T-C10-78`, ADR-015 decision 3, `ARCHITECTURE.md` §6.3).
 *
 * `IncidentModule` (`./incident.module.ts`) used to bind `INCIDENT_REPOSITORY`
 * unconditionally to `TypeOrmIncidentRepository`; that binding — and its
 * `INCIDENT_READ_REPOSITORY` alias — moves here, as **data**, so which adapter
 * backs the port becomes a function of `PersistenceMode` rather than a fact
 * `IncidentModule` hard-codes. `IncidentModule` keeps everything else
 * unchanged (`INCIDENT_ACTOR_RESOLVER`, `SLA_POLICY`, `CLOCK`, the two use
 * cases' `useFactory` bindings).
 *
 * `Record<PersistenceMode, Provider[]>` — not a `switch`/`if` keyed on the
 * mode — is what makes a `PersistenceMode` value added to the enum without a
 * matching entry here a **compile error** (missing property) rather than a
 * runtime `undefined` a later `if` chain would silently fall through on.
 *
 * `postgres`: `TypeOrmIncidentRepository` via `useClass`, exactly
 * `IncidentModule`'s previous binding — it depends on `DataSource`
 * (`typeorm`), provided by `DatabaseModule`, which `PersistenceModule.forMode()`
 * imports only in this mode.
 *
 * `memory`: `InMemoryIncidentRepository` via `useFactory`, not `useClass` —
 * the class takes no constructor dependency (no `DataSource`, nothing to
 * inject), so `useFactory: () => new InMemoryIncidentRepository()` is the
 * direct construction; `useClass` would work identically here but the ticket
 * is explicit about `useFactory`, matching the adapter's own doc comment
 * ("nothing here reads `PERSISTENCE_MODE`, and no token is bound to it in
 * this ticket" — binding is this file's job).
 *
 * Both modes bind `INCIDENT_READ_REPOSITORY` with `useExisting:
 * INCIDENT_REPOSITORY` — one adapter instance, two ports, in either mode,
 * exactly as `IncidentModule`'s own doc comment already documented before
 * this ticket moved the binding here. `useExisting` is what makes the two
 * tokens alias the *same* resolved instance instead of each constructing
 * their own; `incident.module.spec.ts` proves this by identity in `memory`
 * mode after this ticket, precisely because it holds in both modes equally.
 */
export const incidentPersistenceBindings: Record<PersistenceMode, Provider[]> =
  {
    [PersistenceMode.Postgres]: [
      { provide: INCIDENT_REPOSITORY, useClass: TypeOrmIncidentRepository },
      { provide: INCIDENT_READ_REPOSITORY, useExisting: INCIDENT_REPOSITORY },
    ],
    [PersistenceMode.Memory]: [
      {
        provide: INCIDENT_REPOSITORY,
        useFactory: () => new InMemoryIncidentRepository(),
      },
      { provide: INCIDENT_READ_REPOSITORY, useExisting: INCIDENT_REPOSITORY },
    ],
  };
