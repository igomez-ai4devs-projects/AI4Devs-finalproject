/**
 * Formats `IncidentDetailResponse.loggedAt` (ISO 8601 UTC,
 * `incident-detail.contract.ts`'s own doc comment) into the viewer's own
 * locale and time zone (`NFR-I18N-03`, `T-C1-101` Trap 4) — never the raw ISO
 * string, never a manually-assembled date string.
 *
 * `Intl.DateTimeFormat` with no explicit locale argument resolves to the
 * runtime's default locale (the browser's own language/region in production;
 * Node's/Jest's configured locale in a unit test), and `Date` itself always
 * renders relative to the runtime's own time zone once constructed from an
 * ISO instant — exactly the "the client presents it in the viewer's own
 * zone" rule the contract's doc comment already commits to. No formatting
 * options this function does not itself pass (`dateStyle`, `timeStyle`) are
 * hardcoded elsewhere, so a locale change is a one-line edit here.
 */
export function formatLoggedAt(loggedAtIso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(loggedAtIso));
}
