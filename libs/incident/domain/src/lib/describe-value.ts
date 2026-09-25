/**
 * Renders any rejected input for an error message without ever throwing.
 *
 * Duplicated from `@sport-itsm/shared-domain`'s own `domain-error.ts` helper
 * of the same name rather than imported: the kernel keeps it module-private
 * (it is not re-exported from the barrel, `libs/shared/domain/src/index.ts`),
 * and this ticket's Scope forbids touching `libs/shared/**`. Six lines of
 * formatting logic is cheaper to keep in step than to fork a shared-kernel
 * export for.
 */
export function describeValue(value: unknown): string {
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'object' && value !== null)
    return Object.prototype.toString.call(value);
  return String(value);
}
