import {
  DomainError,
  describeValue,
  DomainEvent,
  Identity,
  ImpactLevel,
  Priority,
  TicketReference,
  UrgencyLevel,
} from '@sport-itsm/shared-domain';
import { isNonEmptyString } from '@sport-itsm/shared-util';
import { OriginChannel, OriginChannelCode } from './origin-channel.vo';

/**
 * `short_description` is `varchar(255)` (`DATA-MODEL.md` §20.3) — enforced
 * here as a domain invariant, not left to the database to reject.
 */
const SHORT_DESCRIPTION_MAX_LENGTH = 255;

/** Raised when `log()` is called with no reporter (`reporter_user_id NOT NULL`). */
export class IncidentReporterRequiredError extends DomainError {
  constructor(offendingValue: unknown) {
    super(
      `Incident.log() requires a reporter; received ${describeValue(offendingValue)}`,
      offendingValue,
    );
  }
}

/** Raised when `log()` is called with no origin channel (`origin_channel NOT NULL`). */
export class IncidentOriginChannelRequiredError extends DomainError {
  constructor(offendingValue: unknown) {
    super(
      `Incident.log() requires an origin channel; received ${describeValue(offendingValue)}`,
      offendingValue,
    );
  }
}

/** Raised when `log()` is called with a blank or missing short description. */
export class IncidentShortDescriptionRequiredError extends DomainError {
  constructor(offendingValue: unknown) {
    super(
      `Incident.log() requires a non-blank short description; received ${describeValue(offendingValue)}`,
      offendingValue,
    );
  }
}

/** Raised when the short description exceeds `varchar(255)` (`DATA-MODEL.md` §20.3). */
export class IncidentShortDescriptionTooLongError extends DomainError {
  constructor(offendingValue: unknown) {
    super(
      `Incident.log() short description must be at most ${SHORT_DESCRIPTION_MAX_LENGTH} characters; received ${describeValue(offendingValue)} (${typeof offendingValue === 'string' ? offendingValue.length : 'n/a'} characters)`,
      offendingValue,
    );
  }
}

/** Raised when `log()` is called with a blank or missing detailed description. */
export class IncidentDescriptionRequiredError extends DomainError {
  constructor(offendingValue: unknown) {
    super(
      `Incident.log() requires a non-blank detailed description; received ${describeValue(offendingValue)}`,
      offendingValue,
    );
  }
}

/** The `IncidentLogged` event name, so a subscriber does not restate the literal. */
export const INCIDENT_LOGGED_EVENT_NAME = 'IncidentLogged';

/**
 * What `IncidentLogged` carries about the state created — a plain,
 * JSON-serializable fact record, never the aggregate itself (the event
 * freezes it, `DomainEvent.record`). Who performed the logging is already on
 * the event (`DomainEvent.actor`, `T-C1-05` Trap 5); this payload states what
 * was created, in the reporter's own terms.
 */
export interface IncidentLoggedPayload {
  readonly incidentId: string;
  readonly reference: string;
  readonly reporterId: string;
  readonly originChannel: OriginChannelCode;
  readonly shortDescription: string;
  readonly description: string;
  readonly affectedServiceId: string | null;
}

/**
 * What a caller supplies to `Incident.log()`. Every value that is I/O or a
 * clock read arrives pre-generated (ADR-005, ADR-009): `id` and `reference`
 * come from `IncidentRepositoryPort.nextIdentity()` /
 * `.nextReference()`, and `occurredAt` from `ClockPort.now()` — `log()`
 * reads neither port itself, matching `DomainEvent.record`'s own
 * `occurredAt: Date` parameter (kernel precedent, not a new decision).
 *
 * `actor` and `reporterId` are kept distinct on purpose (`T-C1-05` Trap 5):
 * the reporter is who the Incident is *about* (`FR-OMN-04`), the actor is
 * who performed the logging action for the event/audit trail — an agent
 * logging on a caller's behalf (`FR-OMN-02`, `US-C1-02`) makes the two
 * different identities; the portal path just happens to make them equal.
 */
export interface LogIncidentCommand {
  readonly id: Identity;
  readonly reference: TicketReference;
  readonly reporterId: Identity;
  readonly originChannel: OriginChannel;
  readonly shortDescription: string;
  readonly description: string;
  /** Optional per `DATA-MODEL.md` §20.3 (`service_id` is nullable) — see the reported finding on `FR-INC-01` vs. the schema. */
  readonly affectedServiceId?: Identity;
  readonly actor: Identity;
  readonly correlationId: string;
  readonly occurredAt: Date;
}

/**
 * `Incident.log()`'s result: the aggregate together with the domain events
 * the operation produced. A plural, uniform `events` array — rather than a
 * single `event` field — keeps every current and future mutating method on
 * `Incident` returning the same shape (`ARCHITECTURE.md` §6.2: "every
 * mutating method returns domain events"), even though creation only ever
 * yields exactly one.
 */
export interface LoggedIncident {
  readonly incident: Incident;
  readonly events: readonly DomainEvent<IncidentLoggedPayload>[];
}

/** The full, frozen state of an `Incident`, held privately behind readonly accessors. */
interface IncidentProps {
  readonly id: Identity;
  readonly reference: TicketReference;
  readonly reporterId: Identity;
  readonly originChannel: OriginChannel;
  readonly shortDescription: string;
  readonly description: string;
  readonly affectedServiceId: Identity | null;
  readonly categoryId: Identity | null;
  readonly impact: ImpactLevel | null;
  readonly urgency: UrgencyLevel | null;
  readonly priority: Priority | null;
  readonly competitionAffectsInProgress: boolean;
  readonly affectedSubject: null;
  readonly assignment: null;
}

/**
 * The `incident` context's aggregate root (`ARCHITECTURE.md` §6.2).
 *
 * Pure by construction: no framework, no ORM, no I/O, and no direct
 * construction of the current instant (`ADR-009`) anywhere in this file —
 * every instant, identity and reference arrives already produced by a port
 * (`ADR-005`).
 *
 * **What this ticket (`T-C1-05`) builds and what it deliberately does not.**
 * Only the creation invariants of `US-C1-01` / `FR-INC-01` and the fields
 * every later block extends. `categoryId`, `impact`, `urgency`, `priority`,
 * `competitionAffectsInProgress`, `affectedSubject` and `assignment` are all
 * declared here — present on every `Incident`, valued absent at creation —
 * precisely so later tickets (`US-C1-07` categorization gate, block D
 * priority derivation, `T-C1-14` competition subject, assignment) add
 * behavior over an existing slot instead of reshaping the aggregate's own
 * constructor and field list. `affectedSubject` and `assignment` are typed
 * as the literal `null` rather than `CompetitionSubject | null` /
 * `ResolverAssignment | null` because neither value object exists yet and
 * this ticket does not invent one for a later ticket to own (`T-C1-05`
 * Scope) — the slot is real, its future type is not.
 *
 * No lifecycle state (`IncidentState` in the §6.2 diagram) is modelled here.
 * `workflow_id` / `state_id` name a *configurable* state model
 * (`FR-INC-06`) driven by `StateModel`, which does not exist yet
 * (`T-C10-10`). `US-C1-07` already talks about "an Incident in `New`" as
 * ubiquitous language, but this ticket's Scope lists exactly which fields
 * later blocks extend and state is not among them — adding a hardcoded
 * `'New'` literal now would anticipate a configuration model this ticket has
 * no visibility into and that a different ticket owns. See the reported
 * finding.
 */
export class Incident {
  readonly id: Identity;
  readonly reference: TicketReference;
  readonly reporterId: Identity;
  readonly originChannel: OriginChannel;
  readonly shortDescription: string;
  readonly description: string;
  readonly affectedServiceId: Identity | null;
  readonly categoryId: Identity | null;
  readonly impact: ImpactLevel | null;
  readonly urgency: UrgencyLevel | null;
  readonly priority: Priority | null;
  readonly competitionAffectsInProgress: boolean;
  readonly affectedSubject: null;
  readonly assignment: null;

  private constructor(props: IncidentProps) {
    this.id = props.id;
    this.reference = props.reference;
    this.reporterId = props.reporterId;
    this.originChannel = props.originChannel;
    this.shortDescription = props.shortDescription;
    this.description = props.description;
    this.affectedServiceId = props.affectedServiceId;
    this.categoryId = props.categoryId;
    this.impact = props.impact;
    this.urgency = props.urgency;
    this.priority = props.priority;
    this.competitionAffectsInProgress = props.competitionAffectsInProgress;
    this.affectedSubject = props.affectedSubject;
    this.assignment = props.assignment;
    Object.freeze(this);
  }

  /**
   * Creates an Incident, enforcing the `US-C1-01` / `FR-INC-01` creation
   * invariants and returning the `IncidentLogged` event alongside it
   * (`ARCHITECTURE.md` §6.2, `FR-AUD-01`).
   *
   * Mandatory fields are exactly the `DATA-MODEL.md` §20.3 `NOT NULL`
   * columns this ticket's scope covers — `reporter_user_id`,
   * `origin_channel`, `short_description`, `description` — checked in that
   * order, guard-clause style, each failure raising its own typed error and
   * producing neither an `Incident` nor an event. `service_id` is nullable
   * in the schema, so `affectedServiceId` is optional here even though
   * `FR-INC-01` lists the affected service among what is captured; see the
   * reported finding.
   *
   * @throws {IncidentReporterRequiredError} when `reporterId` is missing.
   * @throws {IncidentOriginChannelRequiredError} when `originChannel` is missing.
   * @throws {IncidentShortDescriptionRequiredError} when `shortDescription` is missing or blank.
   * @throws {IncidentShortDescriptionTooLongError} when `shortDescription` exceeds 255 characters.
   * @throws {IncidentDescriptionRequiredError} when `description` is missing or blank.
   */
  static log(command: LogIncidentCommand): LoggedIncident {
    if (command.reporterId == null) {
      throw new IncidentReporterRequiredError(command.reporterId);
    }
    if (command.originChannel == null) {
      throw new IncidentOriginChannelRequiredError(command.originChannel);
    }
    if (!isNonEmptyString(command.shortDescription)) {
      throw new IncidentShortDescriptionRequiredError(command.shortDescription);
    }
    if (command.shortDescription.length > SHORT_DESCRIPTION_MAX_LENGTH) {
      throw new IncidentShortDescriptionTooLongError(command.shortDescription);
    }
    if (!isNonEmptyString(command.description)) {
      throw new IncidentDescriptionRequiredError(command.description);
    }

    const affectedServiceId = command.affectedServiceId ?? null;

    const incident = new Incident({
      id: command.id,
      reference: command.reference,
      reporterId: command.reporterId,
      originChannel: command.originChannel,
      shortDescription: command.shortDescription,
      description: command.description,
      affectedServiceId,
      categoryId: null,
      impact: null,
      urgency: null,
      priority: null,
      competitionAffectsInProgress: false,
      affectedSubject: null,
      assignment: null,
    });

    const event = DomainEvent.record<IncidentLoggedPayload>({
      name: INCIDENT_LOGGED_EVENT_NAME,
      occurredAt: command.occurredAt,
      actor: command.actor,
      correlationId: command.correlationId,
      payload: {
        incidentId: incident.id.value,
        reference: incident.reference.value,
        reporterId: incident.reporterId.value,
        originChannel: incident.originChannel.code,
        shortDescription: incident.shortDescription,
        description: incident.description,
        affectedServiceId: incident.affectedServiceId?.value ?? null,
      },
    });

    return { incident, events: [event] };
  }
}
