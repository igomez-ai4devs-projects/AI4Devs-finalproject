/**
 * Exhaustiveness assertion for discriminated unions.
 *
 * Placed in the `default` branch of a `switch` over a union, it turns "a member
 * was added and a branch was forgotten" from a runtime surprise into a compile
 * error: once every member is handled, the value reaching this function is
 * `never`, and any unhandled member makes the call fail to type-check.
 *
 * The throw covers the residual runtime case only — types are erased, so a
 * value arriving from outside the type system can still reach here. It signals
 * a programming error, not a domain failure: a domain failure is a `Result`.
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled union member: ${String(value)}`);
}
