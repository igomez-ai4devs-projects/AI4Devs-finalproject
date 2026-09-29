import {
  ASSESSMENT_SCALE_MAX,
  ASSESSMENT_SCALE_MIN,
  isAssessmentLevel,
} from './assessment-scale';
import { DomainError, describeValue } from './domain-error';

export class InvalidUrgencyLevelError extends DomainError {
  constructor(offendingValue: unknown) {
    super(
      `UrgencyLevel must be an integer between ${ASSESSMENT_SCALE_MIN} and ${ASSESSMENT_SCALE_MAX}; received ${describeValue(offendingValue)}`,
      offendingValue,
    );
  }
}

/** How fast the business needs the ticket resolved, as assessed by an agent. */
export class UrgencyLevel {
  private constructor(readonly value: number) {
    Object.freeze(this);
  }

  /** @throws {InvalidUrgencyLevelError} when `value` is off the 1-5 scale. */
  static fromNumber(value: number): UrgencyLevel {
    if (!isAssessmentLevel(value)) {
      throw new InvalidUrgencyLevelError(value);
    }
    return new UrgencyLevel(value);
  }

  equals(other: UrgencyLevel): boolean {
    return this.value === other.value;
  }
}
