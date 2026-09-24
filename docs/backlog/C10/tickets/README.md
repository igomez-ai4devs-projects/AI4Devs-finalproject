# Tickets — C10 · Identity & Access Management

> Sources: `docs/backlog/C10/user-stories.md` (16 stories, all greenfield) · `docs/backlog/epic-map.md` (§ `C10`, § **Foundation ownership (priced once)**) · `CLAUDE.md` §3 · `docs/product/ARCHITECTURE.md` §5, §9 · PRD §7.10, §4.3, §14.2
> Test plan: [`../test-plan.md`](../test-plan.md)

**71 ticket IDs issued · 68 represent real work · 171.5h.** Three IDs are **retired** (see below) and carry `0h`; they are never reused. Two tickets exceed the 3h cap — `T-C10-06` and `T-C10-44` — each of which records why in its `## Context`.

**`C10` now spans four phases, not one.** The Product Owner has closed finding **F9** for this epic: `FR-IAM-01/02/03/05` are Phase 0, `FR-IAM-06`/`FR-IAM-08` are Phase 1, `FR-IAM-07` is Phase 2, `FR-IAM-04` (SSO) is Phase 3. `C10` keeps drill position 1 — nothing about the order changes — but its Phase-0 cut is narrower than this file originally assumed. Blocks F, G and H, previously labelled `unphased (F9)`, now carry their real phase; see each block's header and the Totals table.

**Session-model revision, this pass.** `docs/product/PRD.md` §14.8 normatively adopts **device-bounded** termination and sign-out, forbidding any artifact from validating access against a central session record on each request. `T-C10-24` (the `Session` aggregate this epic built against the older reading) is **retired**, along with `T-C10-32` and `T-C10-33` (no backend action survives for sign-out once there is no session to terminate). `T-C10-28`, `T-C10-34`, `T-C10-57`, `T-C10-59` and `T-C10-60` are regenerated against the new reading; `T-C10-25` and `T-C10-26` are corrected to drop the session dependency they carried. See the notes under **Block B** and **Block F**.

22 tickets are **foundation** work with `story: —`. 18 are the whole workspace, priced into `C10` by the epic map and deliberately left storyless by the Business Analyst (finding **F14**); the 19th, `T-C10-68`, is a defect found in that same shipped foundation output; the 20th, `T-C10-69`, is a scope gap found while implementing ADR-013 (deployment) against that same foundation; the 21st, `T-C10-70`, is a verification gap found while implementing `T-C10-07` — the `"types": []` layer-purity setting (`ARCHITECTURE.md` §5.5) is correctly authored but no workspace target ever typechecks against it (§12.3); the 22nd, `T-C10-71`, is a documentation-integrity gap the Architect found in `DATA-MODEL.md` itself while resolving the `T-C10-43`/`T-C10-44` column-drift defect — its own constraint/index identifiers agree across sections by convention only, never checked — see **Block I**, **Block J**, **Block K** and **Block L**.
5 tickets are **blocked**: 4 by **F16**, now partially resolved (the privileged set is the PRD's own list; the `NFR-SEC-06` judgment call stays open), 1 by **F17** (nobody has decided where a denied authorization is recorded).

The numbering **is** the implementation order. `T-C10-01` is built first. Where the order departs from the story sequence, the reason is stated below the affected block. A **retired** ticket is the one exception: its number is not built at all, and the note explaining why sits in the ticket's own file rather than here.

## Reading a ticket

| Field | Meaning |
|---|---|
| `story` | The `US-C10-nn` it serves, or `—` for foundation work or a retired ticket |
| `foundation` | `true` when no story backs it; the owning source is cited in its `## Context` |
| `retired` | `true` for a ticket whose entire design was invalidated by a later decision (here, PRD §14.8) rather than corrected. The file explains why and is kept, not deleted, so the ID is never reused. |
| `layer` | DDD layer per `ARCHITECTURE.md` §5.3 |
| `platform` | `backend` / `frontend` / `shared` — stated for every ticket, and load-bearing where `agent` is `—` |
| `agent` | `backend-engineer`, `frontend-engineer`, `ci-cd-expert` for Docker/CI/per-project tooling (`T-C10-68` is this epic's first use, `T-C10-69` its second, `T-C10-70` its third, `T-C10-71` its fourth), or `—` for workspace tooling and E2E test code that predates a named owner for that kind of work |
| `phase` | `0`, `1`, `2` or `3` per PRD §14.2–§14.5 (finding **F9** closed for `C10`), or `—` for a retired ticket |
| `blocked_by` | The finding that must be resolved before the ticket is real work |

---

## Block A · Workspace foundation — 17 tickets · 45.5h · all `foundation: true`, phase 0

Source: epic map, **Foundation ownership (priced once)**. Nothing else in this epic — or in the other 18 epics — compiles until this block lands.

| # | Title | Layer | Agent | Est. |
|---|---|---|---|---:|
| [T-C10-01](T-C10-01.md) | Bootstrap the Nx workspace with pnpm and strict TypeScript | workspace tooling | — (shared) | 3h |
| [T-C10-02](T-C10-02.md) | ESLint 9 flat config, Prettier 3 and the three-axis tag scheme | workspace tooling | — (shared) | 2h |
| [T-C10-03](T-C10-03.md) | Encode the type constraint matrix and the scope/platform rules | workspace tooling | — (shared) | 3h |
| [T-C10-04](T-C10-04.md) | Scaffold `apps/api` — NestJS 11 composition root with validated configuration | app | backend-engineer | 3h |
| [T-C10-05](T-C10-05.md) | Scaffold `apps/web` — Angular 20 standalone shell | app | frontend-engineer | 3h |
| [T-C10-06](T-C10-06.md) | Scaffold `apps/api-e2e` and `apps/web-e2e` — Cypress 15.20 + Cucumber harnesses | e2e harness | — (shared) | 4h |
| [T-C10-07](T-C10-07.md) | `libs/shared/util` — pure helper library | util | backend-engineer | 1h |
| [T-C10-08](T-C10-08.md) | `libs/shared/domain` — identity and ticket kernel primitives | domain | backend-engineer | 3h |
| [T-C10-09](T-C10-09.md) | `libs/shared/domain` — `DomainEvent`, `EventPublisherPort` and `ClockPort` | domain | backend-engineer | 2h |
| [T-C10-10](T-C10-10.md) | `libs/shared/domain` — `StateModel` and transition rules | domain | backend-engineer | 2.5h |
| [T-C10-11](T-C10-11.md) | `libs/shared/contracts` — baseline DTO, enum and error-code surface | contracts | backend-engineer | 2h |
| [T-C10-12](T-C10-12.md) | `libs/shared/ui` — design tokens and theming layer | ui | frontend-engineer | 3h |
| [T-C10-13](T-C10-13.md) | `libs/shared/ui` — form primitives | ui | frontend-engineer | 3h |
| [T-C10-14](T-C10-14.md) | `libs/shared/ui` — overlay primitive, focus trap/restore and `aria-live` announcer | ui | frontend-engineer | 3h |
| [T-C10-15](T-C10-15.md) | `libs/shared/ui` — table, badge and state primitives | ui | frontend-engineer | 3h |
| [T-C10-16](T-C10-16.md) | The TypeORM data source and its database connection configuration | infrastructure | backend-engineer | 2h |
| [T-C10-17](T-C10-17.md) | Base migration chain and the bootstrap migration | infrastructure | backend-engineer | 3h |

**Order note.** The tag scheme (`T-C10-02`) precedes the boundary matrix (`T-C10-03`) because the matrix is expressed in those tags, and both precede every project so that the first illegal import fails the build rather than review. `libs/shared/ui` is four tickets because with no third-party component library every primitive is hand-built; it lands before the first screen (`T-C10-31`), which is exactly why the epic map prices the design system into `C10`.

**Not priced here.** Structured logging, health probes, Swagger, the `nestjs-i18n` bootstrap, the Transloco catalogue and the a11y baseline belong to the `NFR` epic standalone slice (epic map, *Suggested drill order*). Tickets that consume them declare the dependency instead of rebuilding it.

---

## Block B · Identity core — 17 ticket IDs (14 active + 3 retired) · 35h · phase 0, one Phase 1 exception

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C10-18](T-C10-18.md) | Scaffold the five `identity-access` libraries with their tags | — (foundation) | workspace scaffolding | — (shared) | 2h |
| [T-C10-19](T-C10-19.md) | `User` aggregate and identity value objects | US-C10-01 | domain | backend-engineer | 3h |
| [T-C10-20](T-C10-20.md) | `IdentityProviderPort` and the domain identity result | US-C10-09 | domain | backend-engineer | 2h |
| [T-C10-21](T-C10-21.md) | `UserRepositoryPort`, the TypeORM user entity, mapper and migration | US-C10-01 | infrastructure | backend-engineer | 3h |
| [T-C10-22](T-C10-22.md) | Local-credential adapter with bcrypt verification | US-C10-09 | infrastructure | backend-engineer | 2.5h |
| [T-C10-23](T-C10-23.md) | Bind exactly one `IdentityProviderPort` adapter from validated configuration | US-C10-09 | app | backend-engineer | 2h |
| [T-C10-24](T-C10-24.md) | ~~`Session` aggregate, `SessionRepositoryPort`, entity and migration~~ — **RETIRED** | US-C10-03 | — | — | 0h |
| [T-C10-25](T-C10-25.md) | `AuthenticateUser` use case | US-C10-01 | application | backend-engineer | 3h |
| [T-C10-26](T-C10-26.md) | `TokenIssuerPort` and the `@nestjs/jwt` adapter | US-C10-01 | domain port + infrastructure | backend-engineer | 3h |
| [T-C10-27](T-C10-27.md) | Sign-in HTTP adapter and the sign-in contracts | US-C10-01 | infrastructure + contracts | backend-engineer | 2.5h |
| [T-C10-28](T-C10-28.md) | Global JWT guard with opt-in exemption | US-C10-02 | infrastructure | backend-engineer | 2h |
| [T-C10-29](T-C10-29.md) | API-E2E proof that the API exposes no anonymous surface | US-C10-02 | e2e (`apps/api-e2e`) | — (backend) | 2h |
| [T-C10-30](T-C10-30.md) | Angular auth interceptor, token store and router guard | US-C10-02 | data-access + app | frontend-engineer | 3h |
| [T-C10-31](T-C10-31.md) | Sign-in screen | US-C10-01 | feature | frontend-engineer | 3h |
| [T-C10-32](T-C10-32.md) | ~~`SignOutSession` use case~~ — **RETIRED** | US-C10-03 | — | — | 0h |
| [T-C10-33](T-C10-33.md) | ~~Sign-out HTTP adapter and contract~~ — **RETIRED** | US-C10-03 | — | — | 0h |
| [T-C10-34](T-C10-34.md) | Web sign-out action | US-C10-03 | feature + data-access | frontend-engineer | 2h — **phase 1** |

**Order note — the port before the adapter.** `US-C10-09` is scheduled inside phase 0 even though `FR-IAM-04` is Phase 3 (PRD §14.5), because the story also traces `FR-IAM-01`: the port and the **local** adapter are what make phase-0 authentication work. This is finding **F19** applied, and confirmed rather than reopened by this pass — see `T-C10-20`'s own `## Context`. Only the SSO half (`US-C10-10`, block H) waits for Phase 3.

**Resolved this pass — `T-C10-24`, `T-C10-32`, `T-C10-33` retired; `T-C10-25`, `T-C10-26`, `T-C10-28`, `T-C10-34` corrected.** A previous revision of this README carried a standing finding here: `T-C10-24` built exactly the stored, per-request-checked session record `DATA-MODEL.md` §6.4/§18 (finding M11) said should not exist, and it existed only because this epic's own stories then required it. That contradiction is now resolved **upstream, in the PRD**, not by this role: §14.8 (a new normative subsection) adopts device-bounded termination outright and rewrites `US-C10-03` to match. `T-C10-24` is retired as a direct consequence — see its own file for the full reasoning — and every ticket that depended on it is corrected: `T-C10-25`/`T-C10-26` no longer create or reference a session, `T-C10-28` no longer validates one, and `T-C10-32`/`T-C10-33` (the sign-out use case and its HTTP adapter) are retired alongside `T-C10-24`, because there is nothing server-side left for either to do — `T-C10-34` absorbs the whole of `US-C10-03` as a client-only ticket, one phase later than the rest of this block (Phase 1, PRD §14.3). `T-C10-57`, `T-C10-59` and `T-C10-60` (block F) are regenerated for the same reason; see the note there.

---

## Block C · RBAC — 6 tickets · 15h · phase 0

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C10-35](T-C10-35.md) | `Role` and `Permission` domain model with the PRD §4.3 catalog | US-C10-04 | domain | backend-engineer | 3h |
| [T-C10-36](T-C10-36.md) | Role and permission persistence and the eight-role seed migration | US-C10-04 | infrastructure | backend-engineer | 3h |
| [T-C10-37](T-C10-37.md) | Translatable role labels with stable identifiers | US-C10-04 | infrastructure (i18n) | backend-engineer | 1.5h |
| [T-C10-38](T-C10-38.md) | Deny-by-default authorization predicates | US-C10-05 | domain | backend-engineer | 3h |
| [T-C10-39](T-C10-39.md) | `Actor` assembly with per-request server-side permission resolution | US-C10-05 | application + app | backend-engineer | 3h |
| [T-C10-40](T-C10-40.md) | Map `AuthorizationError` to `403` in the API exception filter | US-C10-05 | infrastructure | backend-engineer | 1.5h |

**Order note — one deliberate departure from the story blocks.** `US-C10-12` requires a revoked role to lose its power immediately *because permissions are resolved server-side per request*. That is the same mechanism `US-C10-05` needs in order to hand a fully resolved `Actor` to a use case. Built in block E it would mean writing the guard twice — once trusting token claims, then rewriting it — so it is built once here, in `T-C10-39`, which is why that ticket carries `FR-IAM-05` alongside `FR-IAM-02`. Block E then owns only the revocation itself and its safeguard.

---

## Block D · Record visibility — 6 tickets · 16.5h · phase 0

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C10-41](T-C10-41.md) | Requester-scoped visibility predicate and the `ScopeRestriction` result | US-C10-06 | domain | backend-engineer | 3h |
| [T-C10-42](T-C10-42.md) | Not-found-indistinguishable outcome on direct-identifier access | US-C10-06 | application | backend-engineer | 1.5h |
| [T-C10-43](T-C10-43.md) | Competition and league scope grants in the domain | US-C10-07 | domain | backend-engineer | 3h |
| [T-C10-44](T-C10-44.md) | TypeORM persistence and migration for scope grants | US-C10-07 | infrastructure | backend-engineer | 3.5h |
| [T-C10-45](T-C10-45.md) | Organizer competition-scoped visibility rule | US-C10-07 | domain | backend-engineer | 2.5h |
| [T-C10-46](T-C10-46.md) | League Administrator scope resolved through the league | US-C10-08 | domain | backend-engineer | 3h |

**Scope note — finding F15.** `FR-IAM-03` is observable only through records that `C10` does not own. Every ticket here is written against the **predicate and the scope restriction it yields**, provable by Jest unit tests with no ticket aggregate present. End-to-end proof over real Incidents and Service Requests lands with `C1` and `C2` and must not be expected of this epic acceptance run.

**Defect fix — `T-C10-43`/`T-C10-44`, two passes, +1h over the original estimate on each.** Pass one: `ScopeGrant` carried no temporal validity, contradicting `DATA-MODEL.md` §6.3/§20.1's `valid_from`/`valid_to`/`ck_iam_competition_scope_validity` and forcing `T-C10-44` to invent them in infrastructure. `T-C10-43` now declares `validPeriod` as the kernel's `DateTimeRange` (`ARCHITECTURE.md` §4.2, already shipped by `T-C10-08`) plus `isActiveAt`; `T-C10-44` maps that pair and — because the table is append-only and a grant can be superseded — makes its uniqueness constraint partial (`WHERE valid_to IS NULL`) rather than absolute, mirroring `iam_user_role`'s `uq_iam_user_role_active`. Pass two, verified column-by-column against `DATA-MODEL.md` §20.1: the table is `iam.iam_competition_scope`, not `identity_access.scope_grant`, and its subject is **two** nullable columns (`subject_external_id`, `subject_label` — the R10/NFR-AVL-03 free-text fallback), not the single `target` field both tickets assumed; the active-grant uniqueness constraint is `uq_iam_competition_scope_active UNIQUE (user_id, subject_type, scope_kind, COALESCE(subject_external_id, subject_label)) WHERE valid_to IS NULL`, where the `COALESCE` is load-bearing against Postgres's default `NULLS DISTINCT`. `T-C10-44` now exceeds the 3h cap (3.5h); the reason — three corrections landing on one migration/entity/test-harness that splitting would only serialize — is recorded in its own `## Context`. Neither ticket's story, requirement or shape changed; both are still unimplemented, so both were corrected directly rather than left to drift.

**Defect fix — schema-naming drift.** `T-C10-17`, `T-C10-21`, `T-C10-36`, `T-C10-44` and `T-C10-63` (plus this `test-plan.md`) named their tables under a schema `identity_access` — the Nx bounded-context slug — instead of the Postgres schema `DATA-MODEL.md` §6/§20.1 actually declares, `iam`. Fixed in `T-C10-17` (the bootstrap migration that names the schema, and the drift's root cause), `T-C10-21` (`iam.iam_user`), `T-C10-36` (`iam.iam_role`/`iam_role_permission`/`iam_user_role`) and `T-C10-63` (naming convention only — the table itself remains undecided, finding **F17**). No estimate changed for any of these; correcting a string in an unimplemented migration is not new scope. (`T-C10-24` — the sixth ticket this fix originally excluded, pending an architecture decision — is now moot: it is retired outright, see **Block B**.)

---

## Block E · Role administration — 9 tickets · 23.5h · phase 0

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C10-47](T-C10-47.md) | `AssignRoleToUser` use case, idempotent and authorization-guarded | US-C10-11 | application | backend-engineer | 3h |
| [T-C10-48](T-C10-48.md) | Role-assignment contract and validated API adapter | US-C10-11 | infrastructure + contracts | backend-engineer | 2.5h |
| [T-C10-49](T-C10-49.md) | `identity-access/data-access` — users and roles store | US-C10-11 | data-access | frontend-engineer | 2.5h |
| [T-C10-50](T-C10-50.md) | Role administration screen | US-C10-11 | feature | frontend-engineer | 3h |
| [T-C10-51](T-C10-51.md) | `RevokeRoleFromUser` use case with the last-administrator safeguard | US-C10-12 | application | backend-engineer | 3h |
| [T-C10-52](T-C10-52.md) | Role-revocation API adapter and contract | US-C10-12 | infrastructure + contracts | backend-engineer | 1.5h |
| [T-C10-53](T-C10-53.md) | Web revoke action and the explicit no-entitlements state | US-C10-12 | feature + data-access | frontend-engineer | 2.5h |
| [T-C10-54](T-C10-54.md) | `RoleAssigned` and `RoleRevoked` domain events | US-C10-13 | domain | backend-engineer | 2.5h |
| [T-C10-55](T-C10-55.md) | Post-commit event dispatch with failure isolation | US-C10-13 | application + app | backend-engineer | 3h |

**Boundary with `C18` — finding F5.** `US-C10-13` stops at **publishing** the domain event. Persisting and rendering it as an `AuditEntry` is `C18` (`FR-AUD-01`, `FR-AUD-02`) and **no `C18` ticket is written here**. `T-C10-54` and `T-C10-55` declare the event shape and the post-commit dispatch that `C18` subscribes to, and are complete without that subscriber — their acceptance scenarios use a test subscriber. `C10` publishes; `C18` records.

**Defect fix — `T-C10-47` and `T-C10-51` now name `ClockPort`.** Both wrote a `NOT NULL` `iam.iam_user_role` timestamp (`granted_at`, `revoked_at`) with no stated source — the gap `ADR-009` and `T-C10-08`'s AC2 exist to close, and the same gap fixed in `T-C10-65` (block H) for provisioning. No estimate change: this names an already-necessary port, it does not add scope.

---

## Block F · Session lifecycle — 6 tickets · 13h · phase 1

| # | Title | Story | Layer | Agent | Est. | Blocked |
|---|---|---|---|---|---:|---|
| [T-C10-56](T-C10-56.md) | Configurable inactivity window and maximum session lifetime, with fail-fast validation | US-C10-14 | infrastructure | backend-engineer | 2h | |
| [T-C10-57](T-C10-57.md) | Maximum session lifetime is the token's own expiry — no sliding, no server-tracked window | US-C10-14 | infrastructure (token issuance) | backend-engineer | 1.5h | |
| [T-C10-58](T-C10-58.md) | Web inactivity warning with a stay-signed-in action, entirely on the device | US-C10-14 | feature + data-access | frontend-engineer | 2.5h | |
| [T-C10-59](T-C10-59.md) | Privileged-operation declaration marker and registry | US-C10-15 | domain + application | backend-engineer | 1.5h | **F16** |
| [T-C10-60](T-C10-60.md) | Re-authentication proves only the current attempt — per-request credential check, nothing stored | US-C10-15 | application + infrastructure | backend-engineer | 3h | **F16** |
| [T-C10-61](T-C10-61.md) | Web step-up re-authentication prompt | US-C10-15 | feature + data-access | frontend-engineer | 2.5h | **F16** |

**Phase note — finding F9, closed.** `FR-IAM-06` is Phase 1 (PRD §14.3). This block no longer carries `phase: unphased`.

**Session-model revision, this pass — `T-C10-57`, `T-C10-59`, `T-C10-60` regenerated; not retired.** All three depended on `T-C10-24`'s `Session` aggregate (block B, now retired) for a stored, time-bounded record: a sliding inactivity window on `T-C10-57`, and a "step-up-verified" mark checked against a configured window on `T-C10-59`/`T-C10-60`. PRD §14.8 forbids exactly that shape — proof must authorize only the attempt it accompanies, never a stretch of time that follows it, and inactivity has no server-side record at all. `T-C10-57` is now a much smaller ticket: the maximum session lifetime is simply the token's own `exp` (`T-C10-26`), and this ticket only proves nothing extends it. `T-C10-59` keeps only the declaration marker/registry (never depended on a session), while `T-C10-60` moves the actual re-authentication check to a per-request credential attached to the privileged call itself, verified synchronously, with nothing written anywhere for reuse. Estimates fell across the board (`T-C10-57` 3h→1.5h, `T-C10-59` 3h→1.5h) except `T-C10-60`, whose mechanism changed shape but not size.

**Blocking note — finding F16, partially resolved.** `FR-IAM-06`'s own text now states the privileged set directly — role grant/revocation, reference-data and policy configuration, and every `NFR-SEC-06`-restricted operation — so `US-C10-15` quotes the PRD rather than proposing a set. **Still open:** whether every `NFR-SEC-06`-restricted Admin Console screen counts is a judgment call, not settled by the wording alone. The mechanism (`T-C10-59` to `T-C10-61`) is fully buildable; only the full membership of the set is not fixed.

---

## Block G · Denied-authorization recording — 2 tickets · 5h · phase 2

| # | Title | Story | Layer | Agent | Est. | Blocked |
|---|---|---|---|---|---:|---|
| [T-C10-62](T-C10-62.md) | `AuthorizationDenial` record produced by the deciding predicate | US-C10-16 | domain + application | backend-engineer | 2.5h | **F16** |
| [T-C10-63](T-C10-63.md) | Denial sink adapter and its destination | US-C10-16 | infrastructure — destination undecided | backend-engineer | 2.5h | **F17** |

**Phase note — finding F9, closed.** `FR-IAM-07` is Phase 2 (PRD §14.4) — "the accountability phase." This block does **not** travel with the Phase 0/1 work in blocks A–F; it opens once Phase 2 does.

**`T-C10-63` is not implementable as written.** `FR-IAM-07` never says where a denial is recorded, and it does not fit the `AuditEntry` shape of `FR-AUD-02` — no previous value, no new value, no natural record reference. The **Architect** must choose between a `C18` audit entry and a dedicated `identity-access` security log, with the Product Owner confirming retention and access. If the decision is deferred, `US-C10-16` ships only as far as `T-C10-62` — record produced, port unbound — and `FR-IAM-07` remains unsatisfied. That state must be reported, not silently accepted.

---

## Block H · SCMS SSO — 4 tickets · 9.5h · phase 3

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C10-64](T-C10-64.md) | SCMS SSO adapter behind `IdentityProviderPort` | US-C10-10 | infrastructure | backend-engineer | 3h |
| [T-C10-65](T-C10-65.md) | Just-in-time provisioning with the default least-privilege role | US-C10-10 | application | backend-engineer | 3h |
| [T-C10-66](T-C10-66.md) | Profile refresh preserving locally assigned roles | US-C10-10 | application | backend-engineer | 2h |
| [T-C10-67](T-C10-67.md) | Typed identity-provider-unreachable error | US-C10-10 | infrastructure + apps/api | backend-engineer | 1.5h |

**Last by design, phase note — finding F9, closed.** `FR-IAM-04` is a `S` (Should) requirement, now explicitly **Phase 3** (PRD §14.5), and depends on the SCMS identity provider being available (PRD assumption A2, dependency D1). Block B already built the seam (`T-C10-20`, finding **F19**), so this block is an adapter swap selected by configuration — no use case changes.

**Defect fix — `T-C10-65` now names `ClockPort`.** It writes three mandatory timestamps (the new user's `created_at`, the default grant's `granted_at`, the `UserProvisioned` event's occurrence timestamp) with no previously stated source — same gap and same fix as `T-C10-47`/`T-C10-51` in block E. No estimate change.

---

## Block I · Workspace defect cleanup — 1 ticket · 0.5h · `foundation: true`, phase 0

| # | Title | Layer | Agent | Est. |
|---|---|---|---|---:|
| [T-C10-68](T-C10-68.md) | Remove the two `@nx/js` targets `apps/api/project.json` can never run | workspace tooling | ci-cd-expert | 0.5h |

**Numbered last, not scheduled last.** `T-C10-68` is a defect in the output of `T-C10-04` (Block A, done and committed), found after that ticket shipped — it has no forward dependency and blocks nothing, so unlike the rest of this README the ticket number is **not** its implementation order. It may be picked up any time after `T-C10-04` lands, including immediately; it was appended here, at the next free ID, rather than inserted into Block A, because ticket IDs are stable and Block A's `T-C10-01`–`T-C10-17` are already implemented.

---

## Block J · Deployable migration packaging — 1 ticket · 3h · `foundation: true`, phase 0

| # | Title | Layer | Agent | Est. |
|---|---|---|---|---:|
| [T-C10-69](T-C10-69.md) | Compile the data source and migrations into the deployable API image | workspace tooling (apps/api build pipeline + docker/backend) | ci-cd-expert | 3h |

**A scope gap in Block A, not a defect in it.** `T-C10-16` and `T-C10-17` (Block A) wire the data source and the migration chain for local `ts-node` use and explicitly exclude `docker/**`. Implementing `ADR-013` (deployment: migrations run as Render's pre-deploy command, *inside* the deployed image) surfaced that neither ticket — nor any other — produces a compiled data source or compiled migrations the image can run, and `docker/backend/Dockerfile` already carries a comment marking the spot. Unlike `T-C10-68`, this is not a defect in already-shipped output: it is missing scope, found before `T-C10-16`/`T-C10-17` are implemented. It is numbered last for the same reason `T-C10-68` is — ticket IDs are stable and appended at the next free ID — but it belongs, logically, immediately after `T-C10-17` in Block A, and must be **implemented** after both: it compiles what they produce and adds nothing on its own. It blocks no other ticket in this epic; nothing deploys until `ADR-013`'s pipeline is exercised for real, which is outside `C10`.

**Ownership split, not a shared ticket.** The local half (`apps/api/src/data-source.ts`, the migration files, the extension-agnostic glob convention) stays `backend-engineer`'s, inside `T-C10-16`/`T-C10-17` — both were widened slightly (no estimate change) to fix that glob convention once, since `T-C10-69` depends on it. The deployable half (a new `apps/api` build target, the `docker/backend/Dockerfile` `COPY`, the production migration script) is `ci-cd-expert`'s alone, matching who already owns `docker/**`, the workflow, and — per the `T-C10-68` precedent — per-project `project.json` build targets. One ticket spanning both agents was rejected: the two halves are reviewed against different correctness criteria (TypeScript/domain correctness vs. build-and-image correctness) by people who don't overlap, so forcing them into a single ticket would not have been "one reviewable unit," it would have been two units wearing one ID.

---

## Block K · Library typecheck enforcement — 1 ticket · 2h · `foundation: true`, phase 0

| # | Title | Layer | Agent | Est. |
|---|---|---|---|---:|
| [T-C10-70](T-C10-70.md) | `typecheck` target for library projects — close the CI gap on layer purity | build tooling (`nx.json` target inference + CI gate) | ci-cd-expert | 2h |

**A verification gap, not a defect in shipped code.** `T-C10-07` (Block A) correctly set `"types": []` in `libs/shared/util/tsconfig.lib.json` per `ARCHITECTURE.md` §5.5; the gap is that no workspace target ever reads that file — a `--bundler=none` library has no `build` target, and Jest compiles specs through `tsconfig.spec.json`, never `tsconfig.lib.json`. `ARCHITECTURE.md` §12.3 names this explicitly as a known follow-up rather than selling it as resolved. It is not a `T-C10-68`-style defect in already-shipped output, and not a `T-C10-69`-style scope gap surfaced by a downstream ADR — it is a verification gap: the policy is correctly authored, nothing was ever wired to check it. Numbered last for the same reason `T-C10-68` and `T-C10-69` are — ticket IDs are stable and appended at the next free ID — but it belongs, logically, immediately after `T-C10-07` and before `T-C10-08`, both in Block A: CI should enforce layer purity from the first context-bearing library onward, not after a dozen libraries exist to retrofit.

**No ownership split.** Unlike `T-C10-69`, this ticket does not span two agents. Retrofitting `libs/shared/util`, adding the Nx target-inference plugin and updating the CI `run-many` invocation are all `ci-cd-expert`'s per-project `project.json`/`nx.json`/`.github/workflows/` ownership; no domain or application code changes, so `backend-engineer` has no stake in this ticket.

---

## Block L · `DATA-MODEL.md` documentation-integrity check — 1 ticket · 3h · `foundation: true`, phase 0

| # | Title | Layer | Agent | Est. |
|---|---|---|---|---:|
| [T-C10-71](T-C10-71.md) | Mechanical cross-check of `DATA-MODEL.md` constraint and index identifiers | build tooling (`tools/` script + CI gate) | ci-cd-expert | 3h |

**A different failure mode from Block K, approved separately.** `T-C10-70` closes a gap between a written policy and a compiler that could enforce it but doesn't. `T-C10-71` closes a gap between **two copies of the same fact inside one document**: `DATA-MODEL.md` states every constraint/index identifier in up to three places (narrative §5–§15, the indexes catalog §16, the entity dictionary §20), and the Architect measured 45 such identifiers with zero mechanical agreement check between their copies — verified today by two real drifts in one turn (`uq_sla_policy_scope`'s narrative copy lagging the dictionary's `NULLS NOT DISTINCT`; `ix_iam_user_role_active` spelled two ways on the exact sibling table this epic's own `T-C10-44` fix was modeled on). Neither is this ticket's to fix — that is the Architect's, in the document itself — this ticket only builds the detector, mirroring `tools/boundary-probes/verify.mjs` (`T-C10-03`) in shape and in its self-proving pattern (a deliberate probe, caught, reverted).

**Not a story gap and not a shipped-code defect.** Like `T-C10-70`, this is tooling that makes an already-correct intent enforceable; unlike `T-C10-68`/`T-C10-69`, nothing here was built wrong or left unbuilt — the document's *content* is the Architect's to fix, this ticket's job is only to make the next drift impossible to miss.

---

## Totals

| Block | Ticket IDs | Hours | Phase |
|---|--:|--:|---|
| A · Workspace foundation | 17 | 45.5 | 0 |
| B · Identity core | 17 (14 active + 3 retired) | 35.0 | 0, one Phase 1 exception (`T-C10-34`) |
| C · RBAC | 6 | 15.0 | 0 |
| D · Record visibility | 6 | 16.5 | 0 |
| E · Role administration | 9 | 23.5 | 0 |
| F · Session lifecycle | 6 | 13.0 | 1 |
| G · Denied-authorization recording | 2 | 5.0 | 2 |
| H · SCMS SSO | 4 | 9.5 | 3 |
| I · Workspace defect cleanup | 1 | 0.5 | 0 |
| J · Deployable migration packaging | 1 | 3.0 | 0 |
| K · Library typecheck enforcement | 1 | 2.0 | 0 |
| L · `DATA-MODEL.md` documentation-integrity check | 1 | 3.0 | 0 |
| **Total** | **71** | **171.5** | |

**Retired (`retired: true`): 3 ticket IDs · 0h** — `T-C10-24`, `T-C10-32`, `T-C10-33` (all block B), all consequences of PRD §14.8. Not reused; excluded from every count below.

Foundation (`story: —`): **22 tickets · 56h** — all of block A, plus `T-C10-18`, plus `T-C10-68` (block I), `T-C10-69` (block J), `T-C10-70` (block K) and `T-C10-71` (block L) — unaffected by this pass, no foundation ticket touches the session model.

By phase: **Phase 0: 55 tickets · 142.0h** (blocks A, C, D, E, I, J, K, L, plus block B minus its 3 retired IDs and minus `T-C10-34`) · **Phase 1: 7 tickets · 15.0h** (`T-C10-34` + block F) · **Phase 2: 2 tickets · 5.0h** (block G) · **Phase 3: 4 tickets · 9.5h** (block H). `C10` is no longer a Phase-0-only epic; it is now the least phase-atomic epic in `docs/backlog/epic-map.md`, and its drill position (1st) is unaffected.

By agent: `backend-engineer` 45 · `frontend-engineer` 13 · `ci-cd-expert` 4 · `—` 6 · **retired 3**. (Before this pass: `backend-engineer` 48, all-`—` categories unchanged; the 3 retired IDs were all `backend-engineer`'s.) The six `—` tickets are three workspace-tooling tickets, the two scaffolding tickets that span both platforms, and one API-E2E spec — work that belongs to neither dev agent, so each names its layer and platform instead. `T-C10-68` is the first ticket in this epic to name `ci-cd-expert` explicitly, for per-project `project.json` target ownership, `T-C10-69` its second, `T-C10-70` its third, and `T-C10-71` its fourth — see the note below the Reading-a-ticket table if that agent is not yet recognised by whoever picks this up.
