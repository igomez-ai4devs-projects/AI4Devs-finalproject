/**
 * `@sport-itsm/shared-util` — the public API of the shared pure-helper library.
 *
 * `type:util` is the only library type every other type may depend on, and it
 * may depend on nothing but another `type:util` (ARCHITECTURE.md §5.3). Every
 * export below is therefore framework-free, dependency-free and pure: no
 * framework, no I/O, no clock — time reaches the domain through `ClockPort`,
 * not through this library.
 */
export { assertNever } from './lib/assert-never';
export { isNonEmptyString } from './lib/non-empty-string';
export { err, isErr, isOk, ok } from './lib/result';
export type { Err, Ok, Result } from './lib/result';
