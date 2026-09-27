import type {
  IncidentOriginChannel,
  IncidentPriority,
} from '@sport-itsm/shared-contracts';

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
 * reaches the screen. `T-C1-101` extends this rule to the detail screen: it
 * is also a requester-facing surface (`NFR-USE-01` says "requester-facing
 * surfaces", not "the intake form"), so field labels for `impact`, `urgency`,
 * `priority` and `categoryId` are phrased as plain questions/statements
 * ("How urgent this is", "Not decided yet") rather than the ITSM term itself.
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

/**
 * Three strings both the intake screen and the detail screen need for the
 * same reason: a generic server failure, a dropped connection, and the
 * "here's who to blame" support code. Declared once so `INCIDENT_MESSAGES`
 * never carries the same English sentence under two different keys (DRY) —
 * each screen's own section below spreads this object into its shape.
 */
const COMMON_ERROR_MESSAGES = {
  networkErrorMessage:
    'We could not reach the server. Check your connection and try again.',
  genericErrorMessage:
    'Something went wrong on our side. Please try again in a moment.',
  supportCodePrefix: 'Support code:',
} as const;

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
    ...COMMON_ERROR_MESSAGES,
  },
  /**
   * `T-C1-101`'s detail screen — every string it renders, keyed by the state
   * that shows it. Grouped by concern rather than flattened, so the loading/
   * not-found/invalid-reference/error copy is easy to tell apart from the
   * persisted-field labels below it.
   */
  detail: {
    /** Prefixes the route's own `:reference` value in the main heading (`incident-detail-heading`) — every state renders it, so a requester always knows which report they are looking at, even mid-load or on failure. */
    headingPrefix: 'Report',
    pageTitle: 'Your report',
    loadingMessage: 'Loading your report…',
    notFoundHeading: 'We could not find this report',
    notFoundMessage:
      "We couldn't find a report with this reference. Double-check the link — the report may also no longer exist.",
    /**
     * Deliberately a different message from `notFoundMessage` (Trap 2's own
     * question). A reference failing `GetIncidentByReferenceParamsDto`'s
     * `@Matches()` (`400 VALIDATION_FAILED`, `{ field: 'reference', rule:
     * 'matches' }`) never named a record that could exist — it is not shaped
     * like one. Folding it into "not found" would tell a requester who
     * mistyped or truncated a link that their well-formed reference simply
     * has no report, when the more useful, actionable truth is "check the
     * link itself". Reported as a finding either way, since this is a judgment
     * call with no ticket precedent to follow.
     */
    invalidReferenceHeading: 'This does not look like a valid reference',
    invalidReferenceMessage:
      "This reference isn't in the right format. Check that you copied the whole link and try again.",
    /** Heading shared by the network-error and server-error states — both are unexpected, transient failures, unlike `notFoundHeading`/`invalidReferenceHeading`, which describe a definite, non-transient outcome. */
    errorHeading: 'Something went wrong',
    ...COMMON_ERROR_MESSAGES,
    fieldsHeading: 'What we have on file',
    referenceLabel: 'Reference',
    loggedAtLabel: 'Reported on',
    originChannelLabel: 'How it was reported',
    shortDescriptionLabel: 'Summary',
    descriptionLabel: 'Full description',
    affectedServiceLabel: 'What this affects',
    affectedServiceUnset: 'Not indicated',
    /**
     * Shown instead of the raw `affectedServiceId` UUID when it is present
     * (never yet, in this delivery slice — the intake form sends no such
     * field, see `incident-intake-form.component.ts`'s own doc comment).
     * Reported as a finding: there is no service-catalog lookup yet to turn
     * this id into a name a requester would recognize, so a bare UUID (`AC4`:
     * "no internal identifier" was about `IncidentDetailResponse` shedding
     * storage-level identifiers, but a raw id is just as unreadable to a
     * plain-language reader) is replaced with this honest placeholder rather
     * than either the id itself or a fabricated name.
     */
    affectedServicePresent: 'On file — a name is not available yet',
    categoryLabel: 'Type of problem',
    categoryUnset: 'Not sorted into a type yet',
    categoryPresent: 'On file — a name is not available yet',
    impactLabel: 'How much this is affecting things',
    impactUnset: 'Not assessed yet',
    urgencyLabel: 'How quickly this needs attention',
    urgencyUnset: 'Not assessed yet',
    priorityLabel: "How soon we'll get to it",
    priorityUnset: 'Not decided yet',
    competitionAffectsInProgressLabel:
      'Affecting a competition that is currently in progress',
    yes: 'Yes',
    no: 'No, not currently',
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

/**
 * Plain-language label for each of the four wire values
 * `IncidentDetailResponse.originChannel` can carry (`T-C1-101`, Trap 4). A
 * `Record` over the closed union, not a `switch`, so a fifth channel added to
 * the contract later fails this file at compile time (missing property)
 * instead of silently falling through at runtime.
 */
export const ORIGIN_CHANNEL_LABELS: Record<IncidentOriginChannel, string> = {
  portal: 'Self-service portal',
  agent_logged: 'Logged by a support agent',
  email: 'Email',
  in_app: 'In-app',
};

/**
 * Plain-language label for each of the four `IncidentPriority` codes
 * (`T-C1-101`, Trap 4) — always unreachable today, since `priority` is `null`
 * until Priority is derived from Impact x Urgency (`FR-INC-04`, no ticket
 * assesses it yet), but written now against the closed union rather than left
 * for whichever ticket first sets a non-null value, so this file stays the
 * single place a translator/`architect-tech-lead` can find every string this
 * screen can ever render.
 */
export const PRIORITY_LABELS: Record<IncidentPriority, string> = {
  P1: 'Highest — we will get to this as soon as possible',
  P2: 'High',
  P3: 'Normal',
  P4: 'Low',
};
