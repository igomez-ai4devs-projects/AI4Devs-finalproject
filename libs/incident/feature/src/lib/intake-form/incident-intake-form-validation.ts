import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isNonEmptyString } from '@sport-itsm/shared-util';

/**
 * Client-side mirror of the server's `IsNotBlank` decorator
 * (`apps/api/src/app/incident/dto/is-not-blank.validator.ts`), which itself
 * wraps this exact `isNonEmptyString` predicate from `@sport-itsm/shared-util`
 * — reused here rather than restated, since `type:feature` may depend on
 * `type:util` freely (`sport-itsm-architecture` §6).
 *
 * A field this form always sends a value for (even if empty), so
 * `Validators.required` alone is not enough: a whitespace-only value like
 * `'   '` has a non-zero `length` and would pass it, exactly the gap the
 * server's own decorator closes (`log-incident-requester.dto.ts`'s own doc
 * comment). This single validator therefore covers both "empty" and
 * "whitespace-only" — matching the server, where an empty string sent for a
 * *present* field fails `isNotBlank`, never `isDefined` (that rule only fires
 * when the property is missing entirely, which a browser form never does).
 */
export function notBlankValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    isNonEmptyString(control.value) ? null : { notBlank: true };
}

/**
 * The one rule vocabulary this form's messages are keyed on
 * (`incident-messages.ts`), shared by client-side validation and the
 * server's `400` response.
 */
export type IncidentValidationRule = 'isNotBlank' | 'maxLength';

/**
 * Picks the single rule a control's Reactive Forms error object represents,
 * in the same priority order the server evaluates its own decorators
 * (`log-incident-requester.dto.ts`'s own doc comment: blank before
 * too-long). Reactive Forms can report both `notBlank` and `maxlength` on the
 * same control at once — unlike the server, which stops at the first
 * violation per field — so this function restores that same "one detail per
 * violation" rule on the client (`NFR-USE-05`: one "what to do now" message,
 * not a stack of them).
 *
 * Returns `null` when the control has no error this vocabulary recognizes
 * (including a valid control, whose `errors` is `null`).
 */
export function primaryClientRule(
  errors: ValidationErrors | null,
): IncidentValidationRule | null {
  if (!errors) {
    return null;
  }
  if ('notBlank' in errors) {
    return 'isNotBlank';
  }
  if ('maxlength' in errors) {
    return 'maxLength';
  }
  return null;
}
