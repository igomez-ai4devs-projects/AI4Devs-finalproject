/**
 * `@sport-itsm/incident-feature` — the public API of the `incident` context's
 * feature library (`type:feature`, ARCHITECTURE.md §5.1).
 *
 * `T-C1-10` fills this barrel with the library's first routed screen: the
 * requester intake form, reachable only through `incidentRoutes`
 * (`apps/web/src/app/app.routes.ts` `loadChildren`s this exact export).
 * `T-C1-103` adds a second export, `HomePageComponent` — the web surface's
 * home page at `/`, `loadComponent`-mounted directly by the shell rather
 * than through `incidentRoutes` (it is not one of this library's own
 * `/incidents`-prefixed screens). The components themselves, the UI-string
 * constants file and the validation helpers stay unexported — they are this
 * library's own internals, reused directly by relative import from inside
 * the library (e.g. by `T-C1-101`), never through this barrel.
 */
export { incidentRoutes } from './lib/incident-routes';
export { HomePageComponent } from './lib/home-page/home-page.component';
