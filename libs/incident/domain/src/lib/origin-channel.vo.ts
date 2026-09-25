import { DomainError, describeValue } from '@sport-itsm/shared-domain';

/**
 * The closed set of intake channels, `origin_channel_enum` in
 * `DATA-MODEL.md` §3.4 / §20.3. Only `portal` and `agent_logged` are
 * reachable in the MVP (FR-OMN-01); `email` and `in_app` are declared
 * because the native PostgreSQL enum this type mirrors already declares
 * them (`DATA-MODEL.md` §20.3, "Enum `origin_channel_enum`") — a later
 * Omnichannel-expansion ticket wires a use case to them, it does not add
 * them to this closed set.
 *
 * **`phone` is deliberately absent** (Product Owner decision): `FR-OMN-01`
 * enumerates portal, email, in-app and agent-logged "(phone/chat)" — a
 * phone contact is agent-logged, not its own intake channel, and no
 * requirement backs a separate `phone` member. Do not reintroduce it
 * without a PRD change.
 */
export const ORIGIN_CHANNEL_CODES = [
  'portal',
  'agent_logged',
  'email',
  'in_app',
] as const;

export type OriginChannelCode = (typeof ORIGIN_CHANNEL_CODES)[number];

export class InvalidOriginChannelError extends DomainError {
  constructor(offendingValue: unknown) {
    super(
      `OriginChannel must be one of ${ORIGIN_CHANNEL_CODES.join(', ')}; received ${describeValue(offendingValue)}`,
      offendingValue,
    );
  }
}

/**
 * The channel an Incident entered through — reused, not invented, as the
 * "contact channel" `FR-INC-01` and `US-C1-01` ask an Incident to capture.
 *
 * **Why `originChannel` stands in for "contact channel".** Neither the PRD
 * nor `DATA-MODEL.md` defines a "contact channel" concept, and no column
 * carries that name. The closest documented fact is `origin_channel`
 * (`DATA-MODEL.md` §20.3: "Intake channel; `portal` and `agent_logged` in
 * the MVP (FR-OMN-01/02)") — the channel a ticket entered through, not a
 * medium for contacting the reporter back. This ticket adopts that reading
 * rather than inventing an unsupported contact-method enum (email, phone…);
 * see `T-C1-05`'s reported finding for the Product Owner to confirm or
 * correct the term.
 *
 * Declared here, in `incident/domain`, rather than in the shared kernel:
 * `DATA-MODEL.md` §2 places the `OriginChannel` value object on exactly two
 * tables, `incident_ticket` and `sr_request`. Two contexts sit below the
 * "three or more" bar `ARCHITECTURE.md` §12.2 sets for a shared-kernel type,
 * and each context already declares its own `origin_channel_enum` rather
 * than importing one — the same "a shared shape is not a shared meaning"
 * reasoning §6.2 applies to `CompetitionSubject`.
 */
export class OriginChannel {
  private constructor(readonly code: OriginChannelCode) {
    Object.freeze(this);
  }

  /** @throws {InvalidOriginChannelError} when `code` is outside the closed set. */
  static fromCode(code: string): OriginChannel {
    if (!(ORIGIN_CHANNEL_CODES as readonly string[]).includes(code)) {
      throw new InvalidOriginChannelError(code);
    }
    return new OriginChannel(code as OriginChannelCode);
  }

  equals(other: OriginChannel): boolean {
    return this.code === other.code;
  }
}
