/**
 * Every user-facing string this library's intake screen renders
 * (`T-C1-10` deviation 2, `docs/backlog/C1/tickets/T-C1-10.md`). No template
 * in this library embeds a literal string — every one of them reads from
 * here. `T-C1-101` (the detail screen) extends this same file rather than
 * starting a second one, so a translator — and the eventual Transloco/
 * `nestjs-i18n` migration this file's own existence defers — has exactly one
 * place to find every Incident-context UI string.
 *
 * **Plain language, no ITSM jargon (`NFR-USE-01`).** A requester describes a
 * problem, not a service-management concept: no "ticket", "priority", "SLA",
 * "triage", "incident" (outside this file's own technical comments) ever
 * reaches the screen.
 *
 * **i18n is deferred, not solved.** Nothing here calls Transloco or
 * `nestjs-i18n` — that infrastructure is not part of this delivery slice
 * (`T-C1-10` deviation 2, an explicitly accepted debt against `CLAUDE.md`
 * §3). This file is deliberately the *one* place that debt lives, so paying
 * it off later means replacing this file's values with translation keys,
 * never hunting inline strings across templates.
 */

/** Mirrors `LogIncidentRequesterDto.SHORT_DESCRIPTION_MAX_LENGTH`
 * (`apps/api/src/app/incident/dto/log-incident-requester.dto.ts`), itself a
 * duplicate of `Incident.log()`'s own limit. A third duplication here is not
 * new debt: `T-C1-08` already established that this value has no
 * boundary-safe single source both `apps/api` and a frontend library could
 * import from (`libs/incident/domain` is off-limits to `type:feature` per
 * `sport-itsm-architecture` §6) — reported again for the architect below.
 */
export const SHORT_DESCRIPTION_MAX_LENGTH = 255;

/** The two fields a requester's intake request may carry (`LogIncidentRequesterRequest`) that this form renders a control for. */
export type IncidentIntakeField = 'shortDescription' | 'description';

/** Narrows an arbitrary server-reported `details[].field` to one this form actually renders a control for. */
export function isIncidentIntakeField(
  field: string,
): field is IncidentIntakeField {
  return field === 'shortDescription' || field === 'description';
}

export const INCIDENT_MESSAGES = {
  intakeForm: {
    heading: 'Report a problem',
    intro: 'Tell us what went wrong. We will look into it and keep you posted.',
    fieldsetLegend: 'About the problem',
    shortDescriptionLabel: 'Sum up the problem in a few words',
    shortDescriptionHint: `Up to ${SHORT_DESCRIPTION_MAX_LENGTH} characters.`,
    descriptionLabel: 'What happened?',
    descriptionHint:
      'Describe what you were doing, what you expected, and what happened instead. If this relates to a specific match or competition, mention it here.',
    submitLabel: 'Send report',
    submitPendingLabel: 'Sending report…',
    errorSummaryHeading: 'We could not send your report',
    errorSummaryIntro: 'Please fix the following and try again:',
    supportCodePrefix: 'Support code:',
    networkErrorMessage:
      'We could not reach the server. Check your connection and try again.',
    genericErrorMessage:
      'Something went wrong on our side. Please try again in a moment.',
  },
  /**
   * One message per `{ field, rule }` pair this form can actually produce or
   * receive back from the server (`log-incident-requester.dto.ts`'s three
   * decorators on these two fields: `isDefined`, `isNotBlank`, `isString`,
   * plus `shortDescription`'s own `maxLength`). A pair outside this table —
   * a server rule this form does not know about, or a field it renders no
   * control for (`affectedServiceId`, `whitelistValidation`) — is handled by
   * {@link messageForFieldRule}'s fallback, never by adding a guess here.
   */
  validation: {
    shortDescription: {
      isDefined: 'Sum up the problem in a few words.',
      isNotBlank: 'Sum up the problem in a few words.',
      isString: 'Sum up the problem in a few words.',
      maxLength: `Shorten this to ${SHORT_DESCRIPTION_MAX_LENGTH} characters or fewer.`,
    },
    description: {
      isDefined: 'Describe what happened.',
      isNotBlank: 'Describe what happened.',
      isString: 'Describe what happened.',
    },
  },
} as const;

const GENERIC_FIELD_MESSAGE = 'Please check this field and try again.';

/**
 * Maps one `{ field, rule }` pair to the one plain-language message
 * `NFR-USE-05` requires ("what happened, and what to do about it"). The pair
 * can come from either source this form has: its own client-side validators
 * (`incident-intake-form-validation.ts`, which names its errors after the
 * same rule vocabulary on purpose) or the server's `400 VALIDATION_FAILED`
 * response. Resolving both through this one function means a requester never
 * sees a different message for the same rule depending on which side caught
 * it first.
 *
 * A field or rule this table does not recognize — a server rule added later
 * without this file being updated, or a genuinely unexpected value — falls
 * back to {@link GENERIC_FIELD_MESSAGE} rather than rendering nothing
 * (`T-C1-10` Trap 3: never a silent failure).
 */
export function messageForFieldRule(field: string, rule: string): string {
  const table: Record<string, string> | undefined = (
    INCIDENT_MESSAGES.validation as Record<
      string,
      Record<string, string> | undefined
    >
  )[field];
  return table?.[rule] ?? GENERIC_FIELD_MESSAGE;
}
