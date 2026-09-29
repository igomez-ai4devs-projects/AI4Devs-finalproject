import {
  ASSESSMENT_SCALE_MAX,
  ASSESSMENT_SCALE_MIN,
  isAssessmentLevel,
} from './assessment-scale';
import { DomainError, describeValue } from './domain-error';

export class InvalidImpactLevelError extends DomainError {
  constructor(offendingValue: unknown) {
    super(
      `ImpactLevel must be an integer between ${ASSESSMENT_SCALE_MIN} and ${ASSESSMENT_SCALE_MAX}; received ${describeValue(offendingValue)}`,
      offendingValue,
    );
  }
}

/**
 * How widely the incident reaches, as assessed by an agent. The uplift applied
 * when a ticket affects a competition in progress (FR-INC-05) changes which
 * level is assessed; it is not modelled here, and neither is the derivation of
 * Priority from Impact and Urgency, which is configurable (FR-INC-04).
 */
export class ImpactLevel {
  private constructor(readonly value: number) {
    Object.freeze(this);
  }

  /** @throws {InvalidImpactLevelError} when `value` is off the 1-5 scale. */
  static fromNumber(value: number): ImpactLevel {
    if (!isAssessmentLevel(value)) {
      throw new InvalidImpactLevelError(value);
    }
    return new ImpactLevel(value);
  }

  equals(other: ImpactLevel): boolean {
    return this.value === other.value;
  }
}
