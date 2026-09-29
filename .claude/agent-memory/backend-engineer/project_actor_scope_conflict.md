---
name: actor-scope-conflict
description: identity-access's Actor (T-C10-38) cannot cross into any consuming context under the scope rule — each context declares its own minimal actor view until the architect decides
metadata:
  type: project
---

`T-C10-38` places the real `Actor` type (identity + resolved roles/permissions + scope grants) in
`libs/identity-access/domain`, which does not exist yet. Even once it does, the scope rule
(`ARCHITECTURE.md` §5.3) forbids any other `scope:<context>` from importing `scope:identity-access` —
so no context's use case can ever import that `Actor` directly.

**Why this matters:** every use case that needs to authorize an actor (any privileged operation, not
just `LogIncidentUseCase`) hits this same wall. The pattern applied in `T-C1-07`: declare a minimal,
context-local actor interface in that context's own `type:application` (or `type:domain`, if the
authorization concept is domain-owned there) — just the identity plus a deny-by-default capability
predicate in that context's vocabulary (e.g. `IncidentActor.canLogIncidentAsRequester()`), with a typed
`AuthorizationError` naming the operation, mirroring `T-C10-38`'s spirit without importing its type.

**Reported, not fixed, each time:** this is flagged as a finding for the architect on every ticket that
hits it (`T-C1-07`'s report flagged it first). Two ways it could resolve: the shared kernel grows a
truly context-free actor primitive (unlikely — permissions are `identity-access` vocabulary), or every
context keeps its own anticorruption view and `apps/api` adapts the real `Actor` (`T-C10-39`) into each
one at the composition root, the same pattern as `CompetitionSubjectLookupPort`. Until the architect
decides, expect to repeat the per-context minimal-actor-interface pattern on every ticket that adds
authorization (`T-C1-08`'s controller, any `T-C10-4x` operation, etc.) — do not wait for a resolution
before implementing a ticket's own Scope.

See also [[project_datasource_boot_must_stay_lazy]] for another case of documenting a deliberate,
reported deviation instead of silently "fixing" an upstream design gap.
