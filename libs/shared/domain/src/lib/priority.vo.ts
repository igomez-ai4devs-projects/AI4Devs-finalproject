import { DomainError, describeValue } from './domain-error';

/** The closed priority set, `priority_enum` in `DATA-MODEL.md` §3.4. */
export const PRIORITY_CODES = ['P1', 'P2', 'P3', 'P4'] as const;

export type PriorityCode = (typeof PRIORITY_CODES)[number];

export class InvalidPriorityError extends DomainError {
  constructor(offendingValue: unknown) {
    super(
      `Priority must be one of ${PRIORITY_CODES.join(', ')}; received ${describeValue(offendingValue)}`,
      offendingValue,
    );
  }
}

/**
 * The priority a ticket carries.
 *
 * **It is not derived here.** FR-INC-04 requires Priority to come from a
 * *configurable* Impact x Urgency matrix, which NFR-CFG-01 lets an
 * administrator change without a release — the schema even carries
 * `priority_matrix_id` alongside the value. Encoding a matrix in the shared
 * kernel would freeze configuration as code and drag `incident` vocabulary
 * into `shared`. This type validates the value and nothing more.
 */
export class Priority {
  private constructor(readonly code: PriorityCode) {
    Object.freeze(this);
  }

  /** @throws {InvalidPriorityError} when `code` is outside the closed set. */
  static fromCode(code: string): Priority {
    if (!(PRIORITY_CODES as readonly string[]).includes(code)) {
      throw new InvalidPriorityError(code);
    }
    return new Priority(code as PriorityCode);
  }

  equals(other: Priority): boolean {
    return this.code === other.code;
  }
}
