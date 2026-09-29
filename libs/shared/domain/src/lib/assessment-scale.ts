/**
 * The 1-5 assessment scale shared by Impact and Urgency (`impact_enum` /
 * `urgency_enum`, `DATA-MODEL.md` §3.4).
 *
 * Internal to this library on purpose: it is not exported from the barrel, so
 * no consumer can depend on the two scales being the same one. `ImpactLevel`
 * and `UrgencyLevel` are distinct types precisely so one cannot be passed
 * where the other is expected.
 */
export const ASSESSMENT_SCALE_MIN = 1;
export const ASSESSMENT_SCALE_MAX = 5;

export function isAssessmentLevel(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= ASSESSMENT_SCALE_MIN &&
    value <= ASSESSMENT_SCALE_MAX
  );
}
