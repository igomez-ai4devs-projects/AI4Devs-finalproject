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
    'No hemos podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.',
  genericErrorMessage:
    'Algo ha fallado por nuestra parte. Inténtalo de nuevo en unos minutos.',
  supportCodePrefix: 'Código para soporte:',
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
  /**
   * `T-C1-103`'s home page at `/` — the Render demo's own landing surface, the
   * smallest fragment of the eventual `C9` self-service portal
   * (`FR-KNW-08`). Authored directly in Spanish (not a translation of the
   * sections below: `intakeForm`/`detail`/`validation` stay in English until
   * `T-C1-104`), and in the same plain language `NFR-USE-01` already requires
   * of `intakeForm`/`detail`: no "incidencia"/"ticket"/"SLA"/"prioridad" in
   * the heading or the intro. `linkLabel` is the user's own exact decision —
   * "Reportar un problema" — not a paraphrase.
   */
  home: {
    heading: 'Te damos la bienvenida a Sport ITSM',
    intro:
      'Si algo no funciona como esperabas en la plataforma, cuéntanoslo y lo revisaremos.',
    linkLabel: 'Reportar un problema',
  },
  intakeForm: {
    heading: 'Reportar un problema',
    intro:
      'Cuéntanos qué ha fallado. Lo revisaremos y te mantendremos al tanto.',
    fieldsetLegend: 'Sobre el problema',
    shortDescriptionLabel: 'Resume el problema en pocas palabras',
    shortDescriptionHint: `Hasta ${SHORT_DESCRIPTION_MAX_LENGTH} caracteres.`,
    descriptionLabel: '¿Qué ha pasado?',
    descriptionHint:
      'Describe qué estabas haciendo, qué esperabas que pasara y qué ha pasado en su lugar. Si tiene que ver con un partido o una competición concretos, menciónalo aquí.',
    submitLabel: 'Enviar aviso',
    submitPendingLabel: 'Enviando aviso…',
    errorSummaryHeading: 'No hemos podido enviar tu aviso',
    errorSummaryIntro: 'Corrige lo siguiente e inténtalo de nuevo:',
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
    headingPrefix: 'Aviso',
    pageTitle: 'Tu aviso',
    loadingMessage: 'Cargando tu aviso…',
    notFoundHeading: 'No hemos encontrado este aviso',
    notFoundMessage:
      'No hemos encontrado ningún aviso con esta referencia. Revisa el enlace; también es posible que el aviso ya no exista.',
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
    invalidReferenceHeading: 'Esta referencia no parece válida',
    invalidReferenceMessage:
      'Esta referencia no tiene el formato correcto. Comprueba que has copiado el enlace completo e inténtalo de nuevo.',
    /** Heading shared by the network-error and server-error states — both are unexpected, transient failures, unlike `notFoundHeading`/`invalidReferenceHeading`, which describe a definite, non-transient outcome. */
    errorHeading: 'Algo ha fallado',
    ...COMMON_ERROR_MESSAGES,
    fieldsHeading: 'Lo que tenemos registrado',
    referenceLabel: 'Referencia',
    loggedAtLabel: 'Registrado el',
    originChannelLabel: 'Cómo nos llegó el aviso',
    shortDescriptionLabel: 'Resumen',
    descriptionLabel: 'Descripción completa',
    affectedServiceLabel: 'A qué afecta',
    affectedServiceUnset: 'No indicado',
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
    affectedServicePresent: 'Registrado — el nombre todavía no está disponible',
    categoryLabel: 'Tipo de problema',
    categoryUnset: 'Todavía sin clasificar',
    categoryPresent: 'Registrado — el nombre todavía no está disponible',
    impactLabel: 'Cuánto está afectando esto',
    impactUnset: 'Todavía sin evaluar',
    urgencyLabel: 'Con qué rapidez hay que atenderlo',
    urgencyUnset: 'Todavía sin evaluar',
    priorityLabel: 'Cuándo lo atenderemos',
    priorityUnset: 'Todavía sin decidir',
    competitionAffectsInProgressLabel:
      'Afecta a una competición que está en marcha',
    yes: 'Sí',
    no: 'No, de momento no',
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
      isDefined: 'Resume el problema en pocas palabras.',
      isNotBlank: 'Resume el problema en pocas palabras.',
      isString: 'Resume el problema en pocas palabras.',
      maxLength: `Acórtalo a ${SHORT_DESCRIPTION_MAX_LENGTH} caracteres o menos.`,
    },
    description: {
      isDefined: 'Describe qué ha pasado.',
      isNotBlank: 'Describe qué ha pasado.',
      isString: 'Describe qué ha pasado.',
    },
  },
} as const;

/**
 * Exported (not from the library's barrel — `index.ts` still only exposes
 * `incidentRoutes`/`HomePageComponent`, `T-C1-104` Trap 2) so
 * `incident-intake-form.component.spec.ts` can assert against this constant
 * instead of repeating its Spanish value as a second literal that a future
 * wording tweak could silently desync from.
 */
export const GENERIC_FIELD_MESSAGE = 'Revisa este campo e inténtalo de nuevo.';

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
  portal: 'Formulario web',
  agent_logged: 'Registrado por el equipo de soporte',
  email: 'Correo electrónico',
  in_app: 'Desde la aplicación',
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
  P1: 'Máxima — lo atenderemos lo antes posible',
  P2: 'Alta',
  P3: 'Normal',
  P4: 'Baja',
};
