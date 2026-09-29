import { isNonEmptyString } from '@sport-itsm/shared-util';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * Edge-side mirror of `isNonEmptyString` (`@sport-itsm/shared-util`) — the
 * exact predicate `Incident.log()` uses to reject a blank `shortDescription`
 * / `description` (`IncidentShortDescriptionRequiredError`,
 * `IncidentDescriptionRequiredError`). `class-validator`'s own
 * `@IsNotEmpty()` only rejects the *literal* empty string; a whitespace-only
 * value (`'   '`) would pass it and reach the aggregate, which is exactly
 * the gap `T-C1-08` Trap 2 asks the DTO to close: "the rejection has to
 * happen at the edge, before the aggregate" — with the domain check kept as
 * the final defense, not the only one.
 *
 * Reuses the domain's own predicate rather than restating "not blank" as a
 * second regex/trim check (DRY) — `apps/api`, the composition root, may
 * depend on `@sport-itsm/shared-util` freely (it already does for other
 * kernel primitives).
 */
export function IsNotBlank(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'isNotBlank',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return isNonEmptyString(value);
        },
        defaultMessage(): string {
          return `${propertyName} must not be blank`;
        },
      },
    });
  };
}
