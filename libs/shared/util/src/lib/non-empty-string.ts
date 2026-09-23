/**
 * Narrows an unknown value to a string carrying at least one non-whitespace
 * character.
 *
 * Whitespace counts as empty on purpose: a title of `'   '` satisfies neither a
 * human reader nor a required field, so treating it as present would only move
 * the failure further from its cause.
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
