import { Injectable } from '@nestjs/common';
import { SlaPolicyPort } from '@sport-itsm/incident-domain';

/**
 * **Provisional. Does nothing until `T-C1-58` binds the real `SlaPolicyPort`
 * adapter against `sla/application`.** `T-C1-08` Trap 5 requires
 * `IncidentModule` to bind `SLA_POLICY` to *something* so
 * `LogIncidentUseCase` has a dependency to resolve — the real adapter is a
 * separate ticket's Scope, not this one's, and this class exists so
 * `IncidentModule` never depends on a token nothing provides.
 *
 * Safe by construction, not by luck: `LogIncidentUseCase` publishes
 * `IncidentLogged` **before** calling `attachFor()` (`log-incident.use-case.ts`
 * Trap 5, step 5 vs. step 6), so this no-op never costs a just-logged
 * Incident its event — audit and notification subscribers still fire. What a
 * "no SLA attached yet" Incident means downstream (nothing reads
 * `SlaCommitment` before `T-C1-58` exists) is that ticket's problem to solve,
 * not this adapter's.
 *
 * **Delete this class outright when `T-C1-58` lands** — do not extend or
 * repurpose it; rebind `SLA_POLICY` in `IncidentModule` to the real adapter
 * in the same change, exactly the migration shape `FixedRequesterActorResolver`
 * documents for `INCIDENT_ACTOR_RESOLVER` / `T-C10-39`.
 */
@Injectable()
export class ProvisionalNoopSlaPolicyAdapter implements SlaPolicyPort {
  async attachFor(): Promise<void> {
    // Intentionally empty: no real SLA adapter exists before T-C1-58.
  }
}
