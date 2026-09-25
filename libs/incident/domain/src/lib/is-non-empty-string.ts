/**
 * Narrows an unknown value to a string carrying at least one non-whitespace
 * character. Whitespace counts as empty on purpose (`T-C1-05` Trap 2): a
 * short description of `'   '` is exactly as absent as an unset field.
 *
 * Duplicated from `@sport-itsm/shared-util`'s helper of the same name rather
 * than imported: `T-C1-05`'s own verification keeps `incident-domain` at a
 * single dependency edge (`-> shared-domain`), so a second edge to
 * `shared-util` for one four-line predicate is not taken. See
 * `describe-value.ts` for the same trade-off, made for the same reason.
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
