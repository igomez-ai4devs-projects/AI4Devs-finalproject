/**
 * Base type for every error raised when a kernel invariant is violated.
 *
 * A broken value-object invariant is a programming error at the boundary, not
 * an expected outcome the caller chooses between: it is thrown, never returned
 * as a `Result`. Each invariant gets its own subtype so a caller can tell the
 * failures apart with `instanceof`, without parsing a message.
 */
export abstract class DomainError extends Error {
  protected constructor(
    message: string,
    readonly offendingValue: unknown,
  ) {
    super(message);
    // Subclasses are distinguished by `instanceof`; `name` exists so a log line
    // carries the invariant too, and is set from the actual subclass.
    this.name = new.target.name;
  }
}

/** Renders any rejected input for an error message without ever throwing. */
export function describeValue(value: unknown): string {
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'object' && value !== null)
    return Object.prototype.toString.call(value);
  return String(value);
}
