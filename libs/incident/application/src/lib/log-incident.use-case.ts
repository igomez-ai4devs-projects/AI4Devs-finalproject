import {
  ClockPort,
  EventPublisherPort,
  Identity,
  TicketReference,
} from '@sport-itsm/shared-domain';
import {
  Incident,
  IncidentRepositoryPort,
  OriginChannel,
  OriginChannelCode,
  SlaPolicyPort,
} from '@sport-itsm/incident-domain';
import { IncidentActor, IncidentLogAuthorizationError } from './incident-actor';

const LOG_INCIDENT_OPERATION = 'LogIncident';

/**
 * What a caller supplies about the Incident to create — deliberately
 * **without** a `reporterId` field (`T-C1-07` Trap 5, AC2). The reporter is
 * never a value this use case reads off a command: it is always
 * {@link LogIncidentContext.actor}'s own identity. Omitting the field from
 * the type, rather than accepting and then discarding one, is what
 * `T-C1-07`'s Trap 5 calls "the cleanest" option — there is no value here to
 * ignore.
 *
 * `originChannel` and `affectedServiceId` arrive as raw, edge-shaped values
 * (a closed-set code, a plain UUID string) rather than already-built domain
 * value objects: constructing `OriginChannel` / `Identity` — and rejecting an
 * invalid one with the matching typed domain error — is this use case's job,
 * the same way it is `Incident.log()`'s job for the fields that reach that
 * far. `T-C1-08`'s HTTP adapter therefore has no domain type to import; it
 * only has to validate shape (`class-validator`) and pass primitives
 * through.
 */
export interface LogIncidentInput {
  readonly originChannel: OriginChannelCode;
  readonly shortDescription: string;
  readonly description: string;
  readonly affectedServiceId?: string;
}

/**
 * Everything about *who is asking* and *which request this is* — kept apart
 * from {@link LogIncidentInput} because neither value is something the
 * caller reports about the Incident; both describe the execution itself.
 * `actor` is resolved upstream (today, `T-C10-74`'s fixed `Actor`; from
 * `T-C10-39` onward, the real per-request resolver — this use case's
 * signature does not change either way, per `T-C10-74` AC3).
 * `correlationId` is minted by the inbound adapter for its own request, not
 * invented here (`T-C1-07` Trap 3) — this use case has no HTTP request to
 * derive one from and must not fabricate a substitute.
 */
export interface LogIncidentContext {
  readonly actor: IncidentActor;
  readonly correlationId: string;
}

/**
 * What the edge needs back to answer the caller: enough to say "here is your
 * ticket" (`T-C1-08`'s eventual `201 Created` body), never the aggregate
 * itself — an application boundary should not leak domain internals to its
 * caller any more than the domain leaks infrastructure to the application
 * (`T-C1-07` Trap 5).
 */
export interface LogIncidentResult {
  readonly id: Identity;
  readonly reference: TicketReference;
}

/**
 * Logs an Incident on behalf of a requester (`US-C1-01`, `FR-INC-01`).
 *
 * A **framework-free TypeScript class** (`T-C1-07` Trap 3): every dependency
 * arrives through the constructor as a port, nothing here imports
 * `@nestjs/*`, and the composition root is the only code that ever
 * constructs an instance — with `useFactory`, once something wires it
 * (`T-C1-08`; see this ticket's report for why that wiring is deliberately
 * left to that ticket rather than done here).
 *
 * **Call order** (Trap 5), and why:
 * 1. **Authorize first.** `actor.canLogIncidentAsRequester()` is checked
 *    before any port is touched. A denial throws
 *    {@link IncidentLogAuthorizationError} and returns having called neither
 *    the repository nor the publisher — no reference is burned, no event is
 *    produced, for an operation that was never allowed to happen.
 * 2. **Allocate identity and reference.** `nextIdentity()` and
 *    `nextReference()` both come from `IncidentRepositoryPort`, run
 *    concurrently (`Promise.all`, no ordering dependency between the two
 *    values), before the aggregate can be built.
 * 3. **Create the aggregate.** `Incident.log()` receives `occurredAt` from
 *    `ClockPort.now()` — this class is the caller ADR-009 has in mind: it
 *    reads the clock exactly once, right before the fact the timestamp
 *    describes.
 * 4. **Persist.** `IncidentRepositoryPort.save()` is this slice's entire
 *    transaction boundary (`T-C1-07` Trap 2 — see below).
 * 5. **Publish.** `EventPublisherPort.publish()` runs exactly once, right
 *    after `save()` resolved — "after commit" means "after `save()`
 *    resolved" (Trap 2). It runs **before** the SLA step on purpose:
 *    `IncidentLogged` is what audit and notification subscribe to (ADR-008),
 *    so once the Incident exists its event must go out regardless of what
 *    happens next. Ordering it after `attachFor()` would let an SLA-adapter
 *    failure leave a persisted Incident with no event at all — no audit
 *    entry, no notification (FR-AUD-01).
 * 6. **Attach SLA.** `SlaPolicyPort.attachFor()` runs last, after the commit
 *    and after publication — see that port's own doc comment (`T-C1-07`
 *    Trap 4). If it throws, the Incident is persisted and `IncidentLogged`
 *    has already been published; the exception propagates to this method's
 *    caller. This is a *synchronous* dependency of the use case, not a
 *    post-commit subscriber, so ADR-008's subscriber isolation does not
 *    apply to it — a failure here is this use case's own failure, not
 *    something to swallow silently (`sport-itsm-engineering-principles`:
 *    never swallow errors). The consequence: a subscriber acting on
 *    `IncidentLogged` may observe the Incident before its SLA commitment is
 *    attached, which no subscriber in this slice depends on.
 *
 * **No unit of work (`T-C1-07` Trap 2).** Today's write is a single `INSERT`
 * of a single aggregate, already atomic on its own; this class does not
 * introduce a transaction port to guard it (YAGNI — see this ticket's
 * reported finding for when one becomes necessary). `nextReference()`'s
 * `nextval()` is not transactional either (`T-C1-06`): if `save()` fails
 * after a reference was allocated, that reference is burned, never reused —
 * a gap in the sequence, which `DATA-MODEL.md` §3.2 already accepts.
 */
export class LogIncidentUseCase {
  constructor(
    private readonly incidentRepository: IncidentRepositoryPort,
    private readonly slaPolicy: SlaPolicyPort,
    private readonly eventPublisher: EventPublisherPort,
    private readonly clock: ClockPort,
  ) {}

  /**
   * @throws {IncidentLogAuthorizationError} when `context.actor` may not log
   * an Incident as its own reporter.
   */
  async execute(
    input: LogIncidentInput,
    context: LogIncidentContext,
  ): Promise<LogIncidentResult> {
    if (!context.actor.canLogIncidentAsRequester()) {
      throw new IncidentLogAuthorizationError(
        LOG_INCIDENT_OPERATION,
        context.actor.identity.value,
      );
    }

    const [id, reference] = await Promise.all([
      this.incidentRepository.nextIdentity(),
      this.incidentRepository.nextReference(),
    ]);

    const { incident, events } = Incident.log({
      id,
      reference,
      reporterId: context.actor.identity,
      originChannel: OriginChannel.fromCode(input.originChannel),
      shortDescription: input.shortDescription,
      description: input.description,
      affectedServiceId:
        input.affectedServiceId != null
          ? Identity.fromString(input.affectedServiceId)
          : undefined,
      actor: context.actor.identity,
      correlationId: context.correlationId,
      occurredAt: this.clock.now(),
    });

    await this.incidentRepository.save(incident);
    this.eventPublisher.publish(events);
    await this.slaPolicy.attachFor(incident);

    return { id: incident.id, reference: incident.reference };
  }
}
