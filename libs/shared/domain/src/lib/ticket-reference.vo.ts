import { DomainError, describeValue } from './domain-error';

/**
 * Human-readable ticket reference: a three-letter record-type prefix followed
 * by a zero-padded sequence value — `INC0000123`, `SRQ0000045`
 * (`DATA-MODEL.md` §3.2).
 *
 * The prefix set is deliberately **not** enumerated here. Which prefixes exist
 * is each bounded context's vocabulary, and phase-2 contexts add more; the
 * shared kernel owns the shape only. The value is never generated here either:
 * a dedicated PostgreSQL `SEQUENCE` read by the repository adapter is what
 * makes references unique and never reused.
 */
const TICKET_REFERENCE = /^[A-Z]{3}[0-9]{7}$/;

export class InvalidTicketReferenceError extends DomainError {
  constructor(offendingValue: unknown) {
    super(
      `TicketReference must be three uppercase letters followed by seven digits; received ${describeValue(offendingValue)}`,
      offendingValue,
    );
  }
}

/** The reference a requester quotes on the phone. Immutable. */
export class TicketReference {
  private constructor(readonly value: string) {
    Object.freeze(this);
  }

  /**
   * @throws {InvalidTicketReferenceError} when `value` does not match the
   * documented shape.
   */
  static fromString(value: string): TicketReference {
    if (!TICKET_REFERENCE.test(value)) {
      throw new InvalidTicketReferenceError(value);
    }
    return new TicketReference(value);
  }

  /** The record-type prefix, e.g. `INC`. */
  get prefix(): string {
    return this.value.slice(0, 3);
  }

  equals(other: TicketReference): boolean {
    return this.value === other.value;
  }
}
