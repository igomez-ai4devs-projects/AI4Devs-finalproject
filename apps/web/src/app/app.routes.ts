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
 * `''` is a real, resolvable default route: it matches, so the router settles on
 * `/` instead of erroring, and the shell renders its `<router-outlet>` with no
 * routed child. `T-C1-10` deliberately leaves it this way rather than
 * redirecting `''` to `/incidents/new`: `apps/web-e2e`'s own
 * `harness-smoke.feature` already asserts the router settles on `/` with no
 * routed child for the bare root, and redirecting it would break that
 * existing, passing scenario for a landing page this ticket's Scope never
 * asked for. Whether `/` should eventually redirect to a real landing page is
 * left to whichever ticket first needs one.
 *
 * `'**'` is the wildcard not-found route. It sends every unmatched URL back to
 * the default route rather than to a dedicated not-found surface, because such a
 * surface is nothing but user-facing copy and hardcoded UI strings are forbidden
 * (CLAUDE.md §3) — its Transloco-keyed page belongs to the `NFR` epic i18n slice
 * that owns Transloco setup. Until `T-C1-101` registers the detail route inside
 * `incidentRoutes` (`libs/incident/feature/src/lib/incident-routes.ts`), a
 * navigation to `/incidents/<reference>` also falls through to this same
 * wildcard and lands back here — expected for now, see that file's own doc
 * comment.
 */
export const appRoutes: Route[] = [
  ...featureRoutes,
  { path: '', pathMatch: 'full', children: [] },
  { path: '**', redirectTo: '' },
];
