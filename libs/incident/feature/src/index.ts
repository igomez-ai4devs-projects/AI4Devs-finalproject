/**
 * `@sport-itsm/incident-feature` — the public API of the `incident` context's
 * feature library (`type:feature`, ARCHITECTURE.md §5.1).
 *
 * `T-C1-10` fills this barrel with the library's first routed screen: the
 * requester intake form, reachable only through `incidentRoutes`
 * (`apps/web/src/app/app.routes.ts` `loadChildren`s this exact export). The
 * component itself, the UI-string constants file and the validation helpers
 * stay unexported — they are this library's own internals, reused directly
 * by relative import from inside the library (e.g. by `T-C1-101`), never
 * through this barrel.
 */
export { incidentRoutes } from './lib/incident-routes';
