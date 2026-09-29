/**
 * The outcome of a computation that can fail in a way the caller is expected to
 * handle: either a value, or a typed error.
 *
 * Exceptions stay reserved for exceptional conditions; an expected failure — a
 * rejected transition, an unparsable input — is a value the type system forces
 * the caller to acknowledge before reaching the success payload.
 */
export type Ok<T> = { readonly ok: true; readonly value: T };

export type Err<E> = { readonly ok: false; readonly error: E };

export type Result<T, E> = Ok<T> | Err<E>;

export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });

export const err = <E>(error: E): Err<E> => ({ ok: false, error });

/**
 * `result.ok` already narrows a `Result` inside a conditional. These two guards
 * exist for the positions where that narrowing is unavailable — a predicate
 * passed to `filter`, `every` or `some`.
 */
export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> => result.ok;

export const isErr = <T, E>(result: Result<T, E>): result is Err<E> =>
  !result.ok;
