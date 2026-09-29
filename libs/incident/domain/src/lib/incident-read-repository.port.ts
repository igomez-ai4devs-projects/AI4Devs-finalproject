import { TicketReference } from '@sport-itsm/shared-domain';
import { Incident } from './incident.aggregate';

/**
 * The outbound port through which a **read-only** use case reaches Incident
 * persistence (`T-C1-99`, `sport-itsm-architecture` §5.4, §6.3;
 * `sport-itsm-engineering-principles` — Interface Segregation).
 *
 * **Why this exists separately from `IncidentRepositoryPort` (Trap 1).** The
 * ticket's own Scope text asks for `findByReference()` to be "added to
 * `IncidentRepositoryPort`" — but that port also declares `save()`,
 * `nextIdentity()` and `nextReference()`. Had `GetIncidentByReferenceUseCase`
 * depended on `IncidentRepositoryPort` directly, its AC3 ("no method on the
 * port it calls can mutate a row") would be false by construction: the type
 * the use case depends on would carry a write method whether or not the use
 * case ever calls it. Declaring this narrower port and making the read use
 * case depend on *only* this interface is what makes AC3 true at the type
 * level, not just true of today's implementation — see
 * `get-incident-by-reference.use-case.spec.ts` for the compile-time proof.
 * This is reported as a deviation from the Scope's literal wording, not
 * silently substituted.
 *
 * **Relationship to `IncidentRepositoryPort` — decided, not left ambiguous:
 * independent interfaces, not one extending the other.** The two share no
 * inheritance relationship. `IncidentRepositoryPort` (`T-C1-05`/`T-C1-06`)
 * already has real implementers outside this ticket's reach — test doubles in
 * `apps/api`, off limits here ("Lo que NO debes tocar") — so widening it by
 * extension would force every one of those implementers to add
 * `findByReference()` too, a change this ticket has no license to make.
 * Keeping the interfaces independent costs one duplicated method signature
 * (this file's own `findByReference`, restated rather than inherited) and
 * buys zero blast radius on every existing `IncidentRepositoryPort`
 * implementer. `TypeOrmIncidentRepository` (`T-C1-99` Trap 5) is the one
 * adapter that implements **both** interfaces explicitly — see that class —
 * and `T-C1-100` binds that single instance to both injection tokens.
 */
export interface IncidentReadRepositoryPort {
  /** The Incident with this reference, or `null` when none exists. Never mutates. */
  findByReference(reference: TicketReference): Promise<Incident | null>;
}

/**
 * The injection token for `IncidentReadRepositoryPort` — same pattern as
 * `INCIDENT_REPOSITORY` beside `IncidentRepositoryPort`: a `Symbol` names the
 * dependency without importing any framework into this domain library.
 * Deliberately a **distinct** token from `INCIDENT_REPOSITORY`, even though
 * `T-C1-100` will bind both to the same `TypeOrmIncidentRepository`
 * instance — the two tokens are what let a future adapter (or a future
 * read-model/CQRS split) satisfy only the read side without also being
 * handed the write side, which is the whole point of segregating the
 * interface in the first place. Wiring either token is `T-C1-100`'s job, not
 * this ticket's (`IncidentModule` is out of scope here).
 */
export const INCIDENT_READ_REPOSITORY = Symbol('IncidentReadRepositoryPort');
