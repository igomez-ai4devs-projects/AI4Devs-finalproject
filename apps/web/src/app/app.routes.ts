import { Route } from '@angular/router';

/**
 * Lazy feature slots — the shell's only coupling to the bounded contexts
 * (`ARCHITECTURE.md` §7.1: "BOOT -- lazy loadChildren --> FEAT").
 *
 * `T-C1-10` adds the first entry, exactly the shape this comment already
 * anticipated: one `loadChildren` per context feature lib, nothing else in
 * the shell changes. Every later context repeats the same pattern when its
 * own feature lib lands.
 *
 * Route guards (`authGuard`, `roleGuard` — usability only, never the security
 * boundary) attach to these entries; they are owned by `US-C10-02`.
 */
export const featureRoutes: Route[] = [
  {
    path: 'incidents',
    loadChildren: () =>
      import('@sport-itsm/incident-feature').then((m) => m.incidentRoutes),
  },
];

/**
 * The shell's route table.
 *
 * `''` is a real, resolvable default route. `T-C1-10`/`T-C1-101` left it
 * resolving to no routed child at all — `apps/web-e2e`'s own
 * `harness-smoke.feature` only asserted the router settled on `/`, never that
 * anything rendered there. `T-C1-103` gives it its own page, the same way
 * `featureRoutes` above lazily loads a bounded context's own routed surface:
 * a per-component `loadComponent`, not a `loadChildren`, since this route has
 * exactly one screen and no children of its own. `HomePageComponent` lives in
 * `libs/incident/feature` — the only frontend feature library that exists
 * today — even though this page is not one of that library's own
 * `/incidents`-prefixed screens (see that component's own doc comment); it
 * belongs, eventually, to the `C9` self-service portal epic.
 *
 * `'**'` is the wildcard not-found route. It sends every unmatched URL back to
 * the default route rather than to a dedicated not-found surface, because such a
 * surface is nothing but user-facing copy and hardcoded UI strings are forbidden
 * (CLAUDE.md §3) — its Transloco-keyed page belongs to the `NFR` epic i18n slice
 * that owns Transloco setup. A navigation to an unmatched `/incidents/<segment>`
 * also falls through to this same wildcard and lands back here, same as any
 * other unmatched URL.
 */
export const appRoutes: Route[] = [
  ...featureRoutes,
  {
    path: '',
    loadComponent: () =>
      import('@sport-itsm/incident-feature').then((m) => m.HomePageComponent),
  },
  { path: '**', redirectTo: '' },
];
