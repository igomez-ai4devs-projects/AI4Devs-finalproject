import { Incident } from './incident.aggregate';

/**
 * The outbound port through which `incident` asks for an SLA commitment on a
 * just-logged Incident (`ARCHITECTURE.md` §8, `T-C1-07`). Declared here, in
 * `incident`'s own domain, per the three-test rule of `ARCHITECTURE.md` §5.4
 * ("Where a port is declared"): the counterparty is another bounded context
 * (`sla`), so the **consuming** context owns the port (test 2) — `incident`
 * never imports `sla` (§8, ADR-003). The adapter that actually resolves a
 * policy against `sla/application` is `T-C1-58` and lives in `apps/api`,
 * the only place allowed to know both contexts.
 *
 * **Deliberately minimal, and deliberately not what `ARCHITECTURE.md` §6.2
 * or this ticket's own name say — reported as a finding, not silently
 * fixed.** Two discrepancies, both left unresolved here on purpose:
 *
 * 1. **Method name.** `T-C1-07`'s own ticket text asks for `attachFor()`;
 *    `ARCHITECTURE.md` §6.2's `SlaPolicyPort` diagram spells it
 *    `attachPolicyFor(ticketSnapshot): SlaCommitment`. This file follows the
 *    ticket text (`attachFor`) since that is what `T-C1-07`'s own Scope
 *    commits to testing, but the naming split is real and worth the
 *    architect reconciling in one direction.
 * 2. **Return type.** `SlaCommitment` is vocabulary of `C7` (`sla`), which
 *    does not exist yet. Naming it here would invent a cross-context type
 *    this ticket has no authority over and `incident` has no license to
 *    define (§5.4's own port-declaration rule: a port's signature may name
 *    only types the *declaring* context owns, or kernel types). So this
 *    port takes the `Incident` the caller just created and returns nothing
 *    — the minimal shape `T-C1-07`'s Trap 4 asks for — leaving `SlaCommitment`
 *    for `T-C1-58` to introduce in `sla`'s own domain when the adapter is
 *    built, and for the architect to decide whether `incident` should then
 *    receive one back.
 *
 * **When it is called, and what happens if it fails — also `T-C1-07`'s
 * decision, recorded here rather than in the use case, since the trade-off
 * is a property of what this port promises, not of how the use case happens
 * to sequence its calls.** `LogIncidentUseCase` calls `attachFor()` **after**
 * `save()` commits and **after** `publish()` — not before `save()`, as
 * `ARCHITECTURE.md` §8's sequence diagram draws it. Reasoning: `save()` is
 * this slice's only transaction boundary (Trap 2 — no unit-of-work exists),
 * so ordering SLA attachment before `save()` would let a not-yet-real SLA
 * adapter (`T-C1-58` does not exist yet) block an Incident from ever being
 * persisted at all, for a policy question ADR-014 itself calls open (a
 * ticket with `priority: null` — Priority is not derived until block D). A
 * failure to attach SLA is therefore a strictly weaker event than a failure
 * to log the Incident, so it must never be allowed to prevent one. The
 * `IncidentLogged` is published **before** this port is called, so a
 * failure here can never cost the Incident its event — audit and
 * notification subscribers (ADR-008, FR-AUD-01) always learn of a persisted
 * Incident. If `attachFor()` throws, the Incident is persisted, its event is
 * out, and the error propagates to the caller: this port is a direct,
 * synchronous dependency of the use case, not a post-commit event
 * subscriber, so `ARCHITECTURE.md` §9's subscriber-isolation guarantee does
 * not extend to it by construction. What a failed attachment means for the
 * Incident's SLA (retry, isolate, alert) is the follow-up this leaves open
 * once `T-C1-58` makes the adapter real.
 */
export interface SlaPolicyPort {
  /**
   * Attaches whatever SLA commitment applies to the given, already-persisted
   * Incident. Resolves once attachment is done; the port names no return
   * value because `SlaCommitment` is not this context's type to declare (see
   * the finding above).
   */
  attachFor(incident: Incident): Promise<void>;
}

/**
 * The injection token for `SlaPolicyPort` — same pattern as
 * `INCIDENT_REPOSITORY` beside `IncidentRepositoryPort`: a `Symbol` names the
 * dependency without importing any framework into this domain library, and
 * `apps/api` binds it to a real adapter only once `T-C1-58` exists.
 */
export const SLA_POLICY = Symbol('SlaPolicyPort');
