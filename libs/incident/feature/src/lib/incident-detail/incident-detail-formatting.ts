/**
 * The locale every date on the demo web surface is rendered in.
 *
 * **Temporary deviation from `NFR-I18N-03`, decided by the user for the
 * Render demo (slice 1b).** `T-C1-101` originally passed `undefined` here, so
 * the date followed the *browser's* language — which, once `T-C1-104` put the
 * whole surface in Spanish, left an English date ("September 28, 2026 at
 * 8:19 PM") inside an otherwise Spanish page for any reader with an English
 * browser. The date is pinned to Spanish until real i18n lands (Transloco +
 * the locale interceptor), at which point this constant gives way to the
 * app's own selected language — not back to `undefined`.
 *
 * Only the *language* is pinned: the time zone is still the viewer's own (see
 * `formatLoggedAt`), which is the half of `NFR-I18N-03` this keeps.
 */
export const DATE_DISPLAY_LOCALE = 'es-ES';

/**
 * Formats `IncidentDetailResponse.loggedAt` (ISO 8601 UTC,
 * `incident-detail.contract.ts`'s own doc comment) in Spanish
 * (`DATE_DISPLAY_LOCALE`) and in the viewer's own time zone (`NFR-I18N-03`,
 * `T-C1-101` Trap 4) — never the raw ISO string, never a manually-assembled
 * date string.
 *
 * `Date` always renders relative to the runtime's own time zone once
 * constructed from an ISO instant, and no `timeZone` option is passed — exactly
 * the "the client presents it in the viewer's own zone" rule the contract's doc
 * comment already commits to. No formatting options this function does not
 * itself pass (`dateStyle`, `timeStyle`) are hardcoded elsewhere, so a locale
 * change is a one-line edit here.
 */
export function formatLoggedAt(loggedAtIso: string): string {
  return new Intl.DateTimeFormat(DATE_DISPLAY_LOCALE, {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(loggedAtIso));
}
