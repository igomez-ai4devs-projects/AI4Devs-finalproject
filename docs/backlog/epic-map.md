# Epic Map — Sport ITSM

> **Generated:** 2026-09-26 · **HEAD:** `cba9e96` · **PRD last modified:** `uncommitted (working tree)` — the Product Owner's Mode-1 revision of 2026-09-26 (§14.10, `FR-INC-19`, `FR-INC-20`) is not yet committed; the previous map's fixed point was `b129e03` · **Sources:** `docs/product/PRD.md` §5, §7, §8, §10, §12, §14 (working tree) · `CLAUDE.md` §3 · `docs/product/ARCHITECTURE.md` §4–§6, §10 (ADR-014) · the code under `apps/` and `libs/` at `cba9e96`
>
> Drilling an epic against a stale map produces stale counts. If the PRD has moved since the stamp above, **regenerate by invoking `sport-itsm-product-owner` in Mode 2**. Because this edition is stamped against an **uncommitted** PRD, it is correct only until that revision is committed: re-stamp it (no recount needed if the PRD is committed byte-identical) as the last step of the session — see finding **F12**.
>
> **Refresh log.** 2026-09-26 — refreshed for two reasons, both recomputed from source rather than incremented by hand.
>
> 1. **PRD revision (Mode 1, §14.10 — "Incident intake and triage, ADR-014 reconciliation").** Two IDs created, both `Must` and Phase 1: **`FR-INC-19`** (triage gate — Impact, Urgency and affected service required to leave `New`; Impact and Urgency required before any assignment) and **`FR-INC-20`** (configurable maximum untriaged period in `New`, surfaced as "overdue for triage"). Text clarified in place, with no ID, priority or phase change: `FR-INC-01` (origin channel; affected service optional at logging), `FR-INC-04` (no Priority until assessed; matrix version pinned at **first derivation**), `FR-OMN-01` (definition of agent-logged), `FR-OMN-02` (exactly four origin channels, no phone), `NFR-CFG-02` (when a record becomes governed by a configuration). Also touched: §5 (C11 row), §10 (new assumption **A11**), §14.3 (Incident row), §14.9 (151 active `FR-`). Declared `FR-` IDs 150 → **152**, active 149 → **151**, total requirements 187 → **189**, `Must` 109 → **111**.
> 2. **First real code.** Since `b129e03` the repository gained code that satisfies part of five requirements. `CrossCheckAgainstCode()` therefore runs for the first time in this edition, the build-state invariant "everything is 🔴" is **retired**, and the **Findings — PRD vs code** section is live. See **As-built at `cba9e96`** below.

## Provenance & method deviations

This map was produced by the `epic-mapper` skill with the deviations mandated by the Product Owner agent's Mode 2 section. Several of those deviations were written for a workspace with no `libs/` and are now **partly superseded by the code**; each row states what was applied in this run.

| Skill step | Status in this run | Reason |
| --- | --- | --- |
| `CaptureStamp()` | Applied; HEAD `cba9e96`, PRD stamped `uncommitted (working tree)` | The Mode-1 revision this map reads has not been committed. This Mode-2 run had no shell access, so the PRD's last-committed sha could not be re-read; the last committed PRD revision this map line has analyzed is `b129e03`. |
| Read `docs/product/prd.md` | Applied against `docs/product/PRD.md` | Uppercase filename in this repository. |
| Read `CLAUDE.md` §3 + `docs/product/ARCHITECTURE.md` §4–§6, §10 | Applied | This repository's authoritative layer/boundary baseline; ADR-014 is the engineering side of PRD §14.10. |
| `CrossCheckAgainstCode()` | **Applied — first live run** | At `b129e03` there was scaffolding only and the step was correctly skipped. At `cba9e96` there are context libraries (`libs/incident/*`), a domain aggregate, a repository port, a reference policy, migrations and a post-commit dispatcher. Every requirement whose behavior any of that code touches was spot-checked; results are in **Findings — PRD vs code**. |
| PRD **Icon legend** (build states) | **Still absent from the PRD — now a finding, not merely expected** | While nothing was built, an absent legend was correct. With five requirements now 🟡 Partial, this map is the only artifact that records as-built state. See finding **F20**. |
| Build-state invariant ("every requirement is 🔴") | **Retired** | It held while no `libs/` code implemented any requirement. It no longer does. A requirement leaves 🔴 only when code satisfies part of the behavior its `FR-`/`NFR-` states; scaffolding, empty libraries, schema namespaces without tables and mechanisms with no caller still move nothing. |
| `SizeEpics()` | Applied in **greenfield** mode, with delivered foundation noted | Size = full requirement count plus the Nx libraries still to be created. Delivered foundation trims real work inside a band; it moves a band only when the remaining work genuinely changes class. |
| `RecommendOrder()` | Applied as an **architectural build sequence**, now annotated with drill and delivery status | `C10` and `C1` are drilled and in delivery through user-approved vertical slices, which is recorded as a divergence from the suggested order rather than silently absorbed. |

## As-built at `cba9e96`

Verified by reading the code, not inferred from commit messages or ticket status.

| Area | What exists | What it satisfies |
| --- | --- | --- |
| Workspace | Nx 21.6 + pnpm, ESLint flat config with `@nx/enforce-module-boundaries`, Prettier, three-axis tags; `apps/api`, `apps/api-e2e`, `apps/web`, `apps/web-e2e` | No requirement (substrate) |
| `libs/shared/domain` | `Identity`, `TicketReference`, `ImpactLevel`, `UrgencyLevel` (1–5 assessment scale), `Priority` (`P1`–`P4`), `DateTimeRange`, `DomainEvent`, `DomainError`, `ClockPort` + `FixedClock`, `EventPublisherPort` + `EVENT_PUBLISHER`. **No `StateModel` yet** (`T-C10-10`, delivery slice 2). | No requirement on its own (primitives) |
| `libs/shared/contracts` | `ErrorCode`, `ErrorEnvelope`, `PageRequest`/`PageResult`, `CorrelationId` + header | No requirement (substrate for `NFR-USE-05`, not yet consumed by any endpoint) |
| `libs/shared/util` | `Result`, `assertNever`, `isNonEmptyString` | No requirement |
| `libs/shared/ui` | **Does not exist** (`T-C10-12`–`15`, deferred out of slice 1 by user decision) | — |
| `apps/api` | Validated configuration (`@nestjs/config`); TypeORM data source with `synchronize: false` and `migrationsRun: false`; global prefix with `/health/live`/`/health/ready` **excluded but not implemented**; `EventDispatchModule` — the in-process, post-commit, failure-isolating dispatcher (ADR-008, `T-C10-73`) with **no subscriber registered**; an empty `IncidentModule`; a `NODE_ENV=test`-only harness route | No requirement. The dispatcher is the substrate `NFR-AVL-03` and `FR-AUD-01` will rely on; neither is satisfied until a use case publishes and a subscriber records. |
| Migrations | `CreateIamSchemaAndExtensions` (schema `iam`, `citext`, `pg_trgm`) and `CreateIncidentSchema` (schema `incident`). **No table exists in either schema.** | No requirement |
| `libs/identity-access/*` | **Does not exist** | — |
| `libs/incident/*` | All six libraries scaffolded and tagged (`T-C1-01`). Five are empty barrels. `incident/domain` holds: `IncidentRepositoryPort` (`nextIdentity`, `nextReference`, `findById`, `save`) + `INCIDENT_REPOSITORY`; `IncidentReferencePolicy` (`INC` + seven zero-padded digits, typed refusal past `9 999 999` rather than wrap-around); `OriginChannel` (closed set `portal`, `agent_logged`, `email`, `in_app` — no `phone`); the `Incident` aggregate with `log()` enforcing reporter, origin channel, short description (≤255) and detailed description, affected service optional, every assessment slot (`categoryId`, `impact`, `urgency`, `priority`, competition flag, subject, assignment) absent at creation, and an `IncidentLogged` event returned alongside. **No lifecycle state, no persistence adapter, no use case, no HTTP route, no UI.** | Part of `FR-INC-01`, `FR-INC-02`, `FR-OMN-02`, `FR-OMN-04`, `NFR-DAT-01` — all 🟡 Partial, see the PRD-vs-code table |

**Net effect on the map:** 5 requirements move 🔴 → 🟡; none reaches 🟢. `remaining` is still equal to the total for every epic, because a 🟡 requirement is still remaining work.

## Foundation ownership (priced once)

Greenfield sizing double-counts unless shared scaffolding is assigned to exactly one epic. Every other epic is sized assuming this work exists.

| Foundation item | Priced in | As-built at `cba9e96` | Note |
| --- | --- | --- | --- |
| Nx workspace bootstrap, pnpm, ESLint 9 flat config with `@nx/enforce-module-boundaries`, Prettier, the three-axis tag scheme | `C10` | **Built** | `ARCHITECTURE.md` §5.2, §5.5 |
| `apps/api`, `apps/api-e2e`, `apps/web`, `apps/web-e2e` | `C10` | **Built** (shells; `apps/api` now carries config validation, the data source and the event-dispatch module) | Composition root, shell and both Cypress/Cucumber E2E harnesses |
| `libs/shared/domain` (shared kernel) | `C10` | **Partial** — every primitive except `StateModel` | `ARCHITECTURE.md` §4.2. `StateModel` is consumed by `C12` and every lifecycle, including `FR-INC-19`'s gate. |
| `libs/shared/contracts`, `libs/shared/util` | `C10` | **Built** (initial content) | The only FE↔BE coupling (ADR-007) |
| `libs/shared/ui` — the in-house design system | `C10` | **Not built** — deferred out of delivery slice 1 by user decision | ADR-010 |
| PostgreSQL base schema + the TypeORM migration chain | `C10` (chain) · each context (its own schema) | **Chain started** — two migrations, two schemas (`iam`, `incident`), no tables | `CLAUDE.md` §2, §3; ADR-014 rule 3: a column arrives with the migration of the first behavior that writes it |
| Post-commit domain-event dispatcher | `C10` | **Built** (`T-C10-73`), no subscriber | ADR-008. It is the mechanism `C16`, `C17` and `C18` subscribe through. |
| Identity, RBAC and least-privilege enforcement | `C10` | **Not built** | FR-IAM-01/02/03/05. Delivery slice 1 runs with a disposable fixed actor (`T-C10-74`, not yet in code). |
| Session lifetime, step-up re-authentication, user-initiated sign-out | `C10` | Not built | FR-IAM-06, FR-IAM-08 |
| Lawful erasure / anonymization across every record type | `C10` | Not built | FR-IAM-09 — see **F14** |
| The six `incident` libraries, the `incident` schema namespace and `IncidentModule` | `C1` | **Built** (scaffolding and wiring only) | Not shared scaffolding — `C1`'s own context foundation, listed here because it is the first context foundation delivered |

Total target structure across all epics: **~80 libraries + 4 applications** (`ARCHITECTURE.md` §5.1). Delivered at `cba9e96`: 4 applications, 3 of the 4 shared libraries and the 6 `incident` libraries — **13 projects**, none of which is yet a complete implementation of any requirement.

## Summary

| # | Key | PRD | Title | FR | 🔴 | 🟡 | ⚫ | 🟢 | 🔍 | Remaining | Size | Depends on |
| --- | --- | --- | --- | --: | --: | --: | --: | --: | --: | --: | --- | --- |
| 1 | `C10` | §7.10 | Identity & Access Management | 9 | 9 | 0 | 0 | 0 | 0 | **9** | XL | — (anchor) · `C18` (co-phase-0) |
| 2 | `C18` | §7.17 | Audit Trail & Activity History | 6 | 6 | 0 | 0 | 0 | 0 | **6** | M | `C10` |
| 3 | `C12` | §7.12 | Workflow & Automation Engine | 6 | 6 | 0 | 0 | 0 | 0 | **6** | M | `C10`, `C18` |
| 4 | `C14` | §7.13 | Assignment & Queue Management | 5 | 5 | 0 | 0 | 0 | 0 | **5** | M | `C10`, `C7` |
| 5 | `C7` | §7.7 | SLA Management & Escalation | 10 | 10 | 0 | 0 | 0 | 0 | **10** | L | `C10`, `C12`, `C8`, `C16`, `C18` |
| 6 | `C1` | §7.1 | Incident Management | **20** | **18** | **2** | 0 | 0 | 0 | **20** | XL | `C10`, `C12`, `C14`, `C7`, `C18`, `C16`, `C9`, `C11` |
| 7 | `C13` | §7.1.1 | Major Incident Management | 6 | 6 | 0 | 0 | 0 | 0 | **6** | M | `C1`, `C16`, `C7`, `C3`, `C9` |
| 8 | `C8` | §7.8 | Service Catalog Management | 6 | 6 | 0 | 0 | 0 | 0 | **6** | M | `C10`, `C7`, `C15` |
| 9 | `C15` | §7.14 | Approval Engine | 7 | 7 | 0 | 0 | 0 | 0 | **7** | M | `C10`, `C16`, `C18` |
| 10 | `C2` | §7.2 | Service Request Management | 11 | 11 | 0 | 0 | 0 | 0 | **11** | L | `C8`, `C15`, `C7`, `C10`, `C12`, `C14` |
| 11 | `C16` | §7.15 | Notification Framework | 8 | 8 | 0 | 0 | 0 | 0 | **8** | M | `C10`, `C1`, `C2`, `C7`, `C15`, `C13` |
| 12 | `C9` | §7.9 | Knowledge Management & Self-Service Portal | 10 | 10 | 0 | 0 | 0 | 0 | **10** | L | `C10`, `C1`, `C2`, `C3` |
| 13 | `C11` | §7.11 | Omnichannel Intake | 4 | **2** | **2** | 0 | 0 | 0 | **4** | S | `C1`, `C2`, `C10` |
| 14 | `C17` | §7.16 | Reporting, Dashboards & Analytics | 7 | 7 | 0 | 0 | 0 | 0 | **7** | L | `C1`, `C2`, `C7`, `C13`, `C15`, `C4`, `C5`, `C9` |
| 15 | `C6` | §7.6 | Asset & Configuration Management (CMDB) | 8 | 8 | 0 | 0 | 0 | 0 | **8** | L | `C10`, `C18`, `C1` |
| 16 | `C4` | §7.4 | Change Management | 11 | 11 | 0 | 0 | 0 | 0 | **11** | L | `C6`, `C15`, `C5`, `C1`, `C3`, `C12`, `C18` |
| 17 | `C5` | §7.5 | Release & Deployment Management | 8 | 8 | 0 | 0 | 0 | 0 | **8** | L | `C4`, `C6`, `C15`, `C12` |
| 18 | `C3` | §7.3 | Problem Management | 9 | 9 | 0 | 0 | 0 | 0 | **9** | L | `C1`, `C9`, `C4`, `C12` |
| 19 | `NFR` | §8 | Non-Functional Requirements | 38 | **37** | **1** | 0 | 0 | 0 | **38** | XL | all epics |

**Totals:** 19 epics · **189 requirements** (151 functional + 38 non-functional) · 🔴 **184** · 🟡 **5** · 🟢 0 · **189 remaining**.

> **Count note.** §7 declares **152** `FR-` IDs; **151 are active**, matching PRD §14.9. `FR-CHG-07` is retired ("ID retained for traceability and not reused") with priority `—` and is excluded from the `C4` count and from all totals. Two IDs are new since the previous edition, both in `C1`, which goes from 18 to **20**: **`FR-INC-19`** and **`FR-INC-20`**, both born phased (Phase 1, §14.3) as the §14.9 invariant requires. `C10` is **9** (`FR-IAM-01` → `FR-IAM-09`), unchanged — see **F18**. `C11` is **4** (`FR-OMN-01` → `FR-OMN-04`), unchanged by the text clarifications of `FR-OMN-01`/`FR-OMN-02`.

### Requirement distribution by MoSCoW (active functional requirements)

| Priority                                    | Count |    Share |
| ------------------------------------------- | ----: | -------: |
| **M** — Must (MVP)                          |   111 |      74% |
| **S** — Should                              |    29 |      19% |
| **C** — Could                               |     9 |       6% |
| Compound (two or more priorities on one ID) |     2 |       1% |
| Retired (`FR-CHG-07`)                       |     — | excluded |

111 + 29 + 9 + 2 = **151 active**, + 1 retired = **152 declared**. Recounted directly from the §7 tables of the working-tree PRD. The only movement since the previous edition is +2 `Must` (`FR-INC-19`, `FR-INC-20`); no priority changed.

The 2 compound-priority requirements (`FR-OMN-01`, `FR-NOT-06`) are counted once in the epic totals and are recorded as **F3**.

## Suggested drill order

This is an **architectural build sequence**, not a value ranking: dependency depth dominates. It is a recommendation; the Product Owner and the team pick.

**Drill status at `cba9e96`.** `C10` — stories (19) and tickets (74 IDs, 174.5h) exist; `FR-IAM-09` is stories-only and needs rework (**F14**). `C1` — tickets exist (102 tickets, 268.5h); `user-stories.md` is being regenerated by the Business Analyst for `FR-INC-19`/`FR-INC-20` in parallel with this map (**F15**). No other epic is drilled. Delivery runs as three user-approved vertical slices across `C10` and `C1`; slice 1 ("a requester registers an Incident and sees it") is **40.0h** combined (`C10` 9.5h + `C1` 30.5h) and is partially delivered in code (`T-C1-01`, `02`, `03`, `05`; `T-C10-73`).

1. **`C10` — Identity & Access Management.** The phase-0 anchor. `FR-IAM-01` ("authenticate every user before granting access to any function") is a precondition of every other epic. Prerequisite of **18** epics. The epic spans four phases (**F6**): `FR-IAM-01/02/03/05` Phase 0, `FR-IAM-06`/`08`/`09` Phase 1, `FR-IAM-07` Phase 2, `FR-IAM-04` Phase 3. Its foundation is now largely delivered (see **Foundation ownership**); its **requirements** are not — none of the nine has code, and delivery slice 1 deliberately ships with no authentication at all. **Before resuming this epic, read F14.**
2. **`C18` — Audit Trail & Activity History. Recommended next epic to drill.** The dispatcher it subscribes through now exists and the first aggregate already returns `IncidentLogged`, but no subscriber records anything: slice 1 ships `FR-AUD-01` → `04` unsatisfied for Incident creation, an approved deviation. Every further `C1` slice widens the set of events that will have been emitted into nothing. `FR-IAM-05` requires role assignment to be "fully audited", so `C10` and `C18` remain co-phase-0 (**F5**).
3. **`C12` — Workflow & Automation Engine.** Realized as the `StateModel` primitive in `libs/shared/domain` plus per-context configuration (`ARCHITECTURE.md` §4.1). `StateModel` is **not yet built** (`T-C10-10`, delivery slice 2), and it is now on the critical path of **`FR-INC-19`** (the gate reads the state category `new`) and **`FR-INC-20`** (the untriaged period is a time-based rule, `FR-WFL-05`). §14.10 open point 3 — whether placing an unassessed Incident in an intake queue counts as assignment — must be decided before `FR-WFL-03` routing is drilled (**F16**).
4. **`C14` — Assignment & Queue Management.** Resolver Groups live in `identity-access` (`ARCHITECTURE.md` §4.1), so no new libraries. `FR-INC-19` now **gates every assignment path this epic owns** — self-assignment (`FR-QUE-03`) included — until Impact and Urgency are assessed.
5. **`C7` — SLA Management & Escalation.** The upstream supplier to both ticket contexts (Customer-Supplier, `ARCHITECTURE.md` §4.3). `FR-SLA-02` attaches a policy **at creation**, but an Incident now has **no Priority** at creation (`FR-INC-04`, §14.10 D4): which policy applies before the first derivation is §14.10 open point 4 and is undecided (**F16**). That must be settled before `C7` is drilled; `T-C1-07` already hands `SlaPolicyPort.attachFor()` an Incident with `priority: null`.

Remaining sequence, for context: `C1` (in delivery) → `C8` → `C15` → `C2` → `C16` → `C13` → `C9` → `C11` (portal + agent-logged slice only — mostly absorbed by `C1`, see below) → `C17` · then Phase 2: `C6` → `C4` → `C5` → `C3` · `NFR` runs continuously as acceptance criteria on every epic above (PRD §14.1), with its own standalone slice: i18n scaffolding, a11y baseline, health/observability and retention. Erasure (`NFR-SEC-07`) is funded by `FR-IAM-09` and belongs to `C10` (**F13**); `NFR-AVL-04` stays unfunded and produces nothing.

### Reconciliation with the PRD's own phasing (§14) and with the delivery cut

The suggested order **does not override** the PRD's phase plan; it sequences _within_ it.

| Item | PRD §14 | This map | Verdict |
| --- | --- | --- | --- |
| `C10` first | Phase 0 for `FR-IAM-01/02/03/05`; Phase 1 for `FR-IAM-06`/`08`/`09`; Phase 2 for `FR-IAM-07`; Phase 3 for `FR-IAM-04` | Position 1 | **Agree on position; the epic is not phase-atomic** (**F6**). §14.2's own sentence listing the remaining IAM phasing omits `FR-IAM-09` (**F19**). |
| Session controls (`FR-IAM-06`, `FR-IAM-08`) | Phase 1, §14.3; assurance level fixed by §14.8 | Inside `C10` | **Agree.** No `C10` drill may specify server-side session validation. |
| Lawful erasure (`FR-IAM-09`) | Phase 1, §14.3 | Inside `C10` | **Agree, drilled last within the `C10`/`C18` increment** — it carries the only authorized exception to `FR-AUD-03`. |
| SSO (`FR-IAM-04`) | Phase 3, §14.5 | Inside `C10` | **Divergence of granularity** — the `IdentityProviderPort` seam may be cut early as structure; the behavior is Phase 3. |
| **Delivery slices across `C10` + `C1`** | Not a PRD concept | `C1` at position 6 | **Divergence of delivery order, user-approved.** Slice 1 builds `C1` intake ahead of `C18`, `C12`, `C14` and `C7`, with four approved deviations (no authentication, no design system, i18n deferred to per-feature constants, no audit subscriber). The map's order is not rewritten to match: it remains the dependency order, and each deviation is debt against it that later slices repay. |
| **Triage gate and untriaged period (`FR-INC-19`, `FR-INC-20`)** | Phase 1 (MVP), §14.3 Incident row, §14.10 | Inside `C1` | **Agree.** Both depend on `C12` (`StateModel`, `FR-WFL-05`), and `FR-INC-19` constrains `C14` and `C12` assignment paths. `FR-INC-20` has a configuration dependency on assumption **A11**. |
| Scope-rule enforcement at intake (`FR-INC-15`) | Phase 1, `Must` since 2026-09-24 | Inside `C1` | **Agree.** The `C1` ticket index still labels it "unphased" (**F17**). |
| Origin channel and requester identity (`FR-OMN-02`, `FR-OMN-04`) | Phase 1, §14.3 Omnichannel row | Inside `C11` (position 13) | **Resolved in practice by the code:** both are already partially built on the Incident aggregate, inside `C1`'s delivery. Deliver the rest with `C1`/`C2`, not by pulling `C11` forward. |
| `C18` audit trail | Phase 0 (`FR-AUD-01→04`), Phase 1 (`FR-AUD-05`), Phase 2 (`FR-AUD-06`) | Position 2 | **Agree**, not phase-atomic (**F6**). Recommended next drill. |
| Resolver Groups (`C14`) | Phase 0 | Position 4 | **Agree** |
| Core ticket record, reference numbering, categorization taxonomy | Phase 0 (§14.2) vs Phase 1 (§14.3 lists `FR-INC-01 → 13, 18, 19, 20`) | Inside `C1` | **Divergence of granularity** — **F6** still open for `C1`; the ticket index carries `disputed 0/1` for 28 tickets. |
| `C7` SLA before `C1` | Both Phase 1 | `C7` at 5, `C1` at 6 | **Within-phase sequencing, now overtaken by the delivery cut** and by §14.10 open point 4. |
| `C12` Workflow before the first lifecycle | Phase 1 | Position 3 | **Within-phase sequencing** (**F8**) — reinforced: `FR-INC-19` cannot be built without `StateModel`. |
| `C11` Omnichannel | Portal + agent-logged in Phase 1; email + in-app in Phase 3 | Position 13 | **Straddles two phases** (**F3**). |
| Phase 2 block `C6` → `C4` → `C5` → `C3` | Phase 2 | `C6` first | **Refinement** — `FR-CHG-02`/`FR-CHG-05` need CIs. |

---

## Epics

### `C10` · Identity & Access Management (PRD §7.10)

- **Requirements (9):** `FR-IAM-01` 🔴 M · `FR-IAM-02` 🔴 M · `FR-IAM-03` 🔴 M · `FR-IAM-04` 🔴 S · `FR-IAM-05` 🔴 M · `FR-IAM-06` 🔴 S · `FR-IAM-07` 🔴 C · `FR-IAM-08` 🔴 M · `FR-IAM-09` 🔴 M
- **Phase spread (PRD §14):** Phase 0 — `FR-IAM-01/02/03/05` · Phase 1 — `FR-IAM-06`, `FR-IAM-08`, `FR-IAM-09` · Phase 2 — `FR-IAM-07` · Phase 3 — `FR-IAM-04`
- **Text changes this revision:** none in §7.10. `NFR-CFG-02`'s new definition of "governed by a configuration" applies to role and policy configuration this epic owns, but changes no `FR-IAM-*` behavior.
- **What actually remains:** All nine requirements. **Foundation delivered** (see **Foundation ownership**): the workspace, the four applications, `shared/domain` (except `StateModel`), `shared/contracts`, `shared/util`, the start of the migration chain (schema `iam` plus the `citext`/`pg_trgm` extensions, **no tables**) and the generic post-commit dispatcher. **Foundation still to build:** `libs/shared/ui` (the in-house design system), `StateModel`, the five `identity-access` libraries, every `iam` table, and the bootstrap account seed. **Functionally, none of it exists:** authentication with no anonymous surface (`FR-IAM-01`), persona-aligned least-privilege RBAC (`FR-IAM-02`), requester-scoped and competition-scoped visibility (`FR-IAM-03`), the SSO anti-corruption seam (`FR-IAM-04`), audited role assignment (`FR-IAM-05`), inactivity termination and step-up re-authentication under §14.8's device-bounded assurance level (`FR-IAM-06`), user-initiated sign-out (`FR-IAM-08`), denied-authorization recording (`FR-IAM-07`), and lawful erasure (`FR-IAM-09`) with its intake and external-lawfulness gate, the end of authentication for the erased identity, and the rule that open work never defers erasure. Delivery slice 1 runs with a disposable fixed actor (`T-C10-74`, not yet in code) in place of all of this.
- **Depends on:** `C18` (declared — `FR-IAM-05` "fully audited"; mutual, see **F5**)
- **Size:** **XL** — unchanged. The foundation that originally carried the band is now largely delivered, so the band is carried by what remains: the full identity stack (5 libraries, every `iam` table, 71 active tickets / 174.5h of which only `T-C10-73` and the scaffolding tickets are in code), the design system, and `FR-IAM-09`, which reaches into five capabilities.
- **Findings:** **F5**, **F6**, **F14** (`FR-IAM-09` still mid-flight: its stories predate the three gaps closed at `b129e03`, a fourth story is missing, no ticket exists), **F18** (the "7 vs 8 `FR-IAM-*`" finding raised by the Business Analyst is verified and obsolete — this map has counted 9 since 2026-09-24), **F19** (§14.2 omits `FR-IAM-09` from its IAM phasing sentence).

### `C18` · Audit Trail & Activity History (PRD §7.17)

- **Requirements (6):** `FR-AUD-01` 🔴 M · `FR-AUD-02` 🔴 M · `FR-AUD-03` 🔴 M · `FR-AUD-04` 🔴 M · `FR-AUD-05` 🔴 M · `FR-AUD-06` 🔴 S
- **What actually remains:** Everything. Four libraries in the `audit` context (`domain`, `application`, `infrastructure`, `ui`). An append-only `AuditEntry` (`FR-AUD-02`), immutable to every role (`FR-AUD-03`, with the single `FR-IAM-09` exception), requester-visible vs. internal history (`FR-AUD-04`), configuration-change coverage (`FR-AUD-05`) and a retention floor that never defers erasure (`FR-AUD-06`). **New at `cba9e96`:** the mechanism this epic subscribes through (ADR-008 dispatcher) and the first event it will record (`IncidentLogged`, returned by `Incident.log()` with actor, correlation identifier and a JSON-serializable payload) now exist. Neither satisfies any `FR-AUD-*`: nothing publishes yet (no use case) and nothing subscribes. The event already separates **actor** (who logged) from **reporter** (who the Incident is about), which is what `FR-AUD-02` needs.
- **Depends on:** `C10` (declared — `FR-AUD-02` actor identity; mutual, **F5**)
- **Size:** **M** — unchanged.
- **Findings:** **F5**, **F6** (Phase 0 / 1 / 2 spread), **F14** (erasure exception inside audit entries). Delivery slice 1 ships `FR-AUD-01` → `04` unsatisfied for Incident creation, an approved deviation; this is the main reason `C18` is the recommended next drill.

### `C12` · Workflow & Automation Engine (PRD §7.12)

- **Requirements (6):** `FR-WFL-01` 🔴 M · `FR-WFL-02` 🔴 M · `FR-WFL-03` 🔴 M · `FR-WFL-04` 🔴 S · `FR-WFL-05` 🔴 M · `FR-WFL-06` 🔴 M
- **What actually remains:** Everything, and **no new libraries** — `ARCHITECTURE.md` §4.1 realizes C12 as a `StateModel` primitive in `libs/shared/domain` plus per-context configuration. `StateModel` is **not in the shared kernel yet** (`T-C10-10`). This epic delivers the state-model and transition primitive (`FR-WFL-01`), business rules on record events (`FR-WFL-02`), category/subject/channel routing (`FR-WFL-03`), round-robin and skill-based strategies (`FR-WFL-04`), the time-based rule runner (`FR-WFL-05`) and rule-execution recording (`FR-WFL-06`). **Two new obligations from `C1`:** `FR-INC-19` states that its gates apply "whatever lifecycle transitions are configured … configuration can add conditions, never remove these" — so the configurable state model must support **non-removable, product-mandated gates**; and `FR-INC-20` is measured and acted upon **through `FR-WFL-05`**, making the time-based runner an MVP prerequisite of `C1`.
- **Depends on:** `C10` (inferred — the primitive lives in `shared/domain`) · `C18` (declared — `FR-WFL-06`)
- **Size:** **M** — unchanged; the non-removable-gate obligation adds design care, not a band.
- **Findings:** **F8**; **F16** (§14.10 open point 3 — an assignment rule under `FR-WFL-02`/`03` cannot assign an unassessed Incident; whether placing it in an intake queue is "assignment" is undecided).

### `C14` · Assignment & Queue Management (PRD §7.13)

- **Requirements (5):** `FR-QUE-01` 🔴 M · `FR-QUE-02` 🔴 M · `FR-QUE-03` 🔴 M · `FR-QUE-04` 🔴 C · `FR-QUE-05` 🔴 S
- **What actually remains:** Everything, **no new libraries** (`identity-access` context). Resolver Groups (`FR-QUE-01`), the prioritized work list (`FR-QUE-02`), self-assignment (`FR-QUE-03`), category-entitlement guarding (`FR-QUE-04`) and workload visibility (`FR-QUE-05`). **New constraint:** `FR-INC-19` forbids any assignment of an Incident — self-assignment explicitly included — until Impact and Urgency are assessed, and an unassessed Incident has **no Priority** (`FR-INC-04`). `FR-QUE-02` orders "by priority"; how a list ordered by Priority presents Incidents that have none is not stated, and `FR-INC-20` exists precisely because such Incidents fall "outside every Priority-based work list". Recorded under **F16**.
- **Depends on:** `C10` (same bounded context; declared in `ARCHITECTURE.md` §4.1, inferred from the PRD) · `C7` (inferred — `FR-QUE-02` orders by SLA time remaining)
- **Size:** **M** — unchanged.
- **Findings:** straddles Phase 0 (`FR-QUE-01/02/03`) and Phase 3 (`FR-QUE-04/05`); **F16**.

### `C7` · SLA Management & Escalation (PRD §7.7)

- **Requirements (10):** `FR-SLA-01` 🔴 M · `FR-SLA-02` 🔴 M · `FR-SLA-03` 🔴 M · `FR-SLA-04` 🔴 M · `FR-SLA-05` 🔴 M · `FR-SLA-06` 🔴 M · `FR-SLA-07` 🔴 M · `FR-SLA-08` 🔴 M · `FR-SLA-09` 🔴 S · `FR-SLA-10` 🔴 M
- **What actually remains:** Everything. Three libraries (`domain`, `application`, `infrastructure`). Policy definition (`FR-SLA-01`), exactly-one attachment at creation with re-evaluation (`FR-SLA-02`), support schedules (`FR-SLA-03`), recalculation from original creation time (`FR-SLA-04`), breach warnings (`FR-SLA-05`), immutable breach records (`FR-SLA-06`), escalation rules (`FR-SLA-07`), pause/resume (`FR-SLA-08`), OLAs (`FR-SLA-09`) and remaining-time exposure (`FR-SLA-10`). **New tension, not a new requirement:** targets are set per priority (`FR-SLA-01`) and attached at creation (`FR-SLA-02`), but a newly logged Incident now has no Priority until first assessed (`FR-INC-04`). Which policy governs the interval before the first derivation is §14.10 open point 4. The aggregate already stores its creation instant (`loggedAtEpochMs`) as the basis `FR-SLA-04` recalculates from, so the "from original creation time" half is structurally prepared.
- **Depends on:** `C10` (inferred) · `C12` (declared — `FR-SLA-07`, `FR-WFL-05`) · `C8` (declared — `FR-SLA-01`; mutual, **F4**) · `C16` (declared — `FR-NOT-02`) · `C18` (declared — `FR-SLA-04`/`06`)
- **Size:** **L** — unchanged.
- **Findings:** **F4**; **F16** (open point 4 must be decided before this epic is drilled — a drill cannot write `FR-SLA-02`'s acceptance criteria while it is open).

### `C1` · Incident Management (PRD §7.1)

- **Requirements (20):** `FR-INC-01` 🟡 M · `FR-INC-02` 🟡 M · `FR-INC-03` 🔴 M · `FR-INC-04` 🔴 M · `FR-INC-05` 🔴 M · `FR-INC-06` 🔴 M · `FR-INC-07` 🔴 M · `FR-INC-08` 🔴 M · `FR-INC-09` 🔴 M · `FR-INC-10` 🔴 M · `FR-INC-11` 🔴 M · `FR-INC-12` 🔴 M · `FR-INC-13` 🔴 M · `FR-INC-14` 🔴 S · `FR-INC-15` 🔴 M · `FR-INC-16` 🔴 S · `FR-INC-17` 🔴 S · `FR-INC-18` 🔴 M · **`FR-INC-19` 🔴 M** _(new)_ · **`FR-INC-20` 🔴 M** _(new)_
- **Phase spread:** Phase 0/1 disputed — `FR-INC-01/02/03` (**F6**) · Phase 1 — `FR-INC-04 → 13`, `15`, `18`, **`19`, `20`** · Phase 3 — `FR-INC-14`, `16`, `17`
- **Text changes this revision:** `FR-INC-01` — the captured channel is the **origin channel** (`FR-OMN-02`), not a preferred contact means; the affected service is **optional at logging** and required to leave `New`. `FR-INC-04` — no Priority and no default Priority until both Impact and Urgency are assessed; the matrix version is pinned at the **first derivation**, not at logging, and kept for every re-derivation.
- **What actually remains — the two 🟡 requirements:**
  - **`FR-INC-01`.** Built, in `libs/incident/domain` only: `Incident.log()` enforces reporter, origin channel, non-blank short description (≤255) and non-blank detailed description, accepts an optional affected service, and returns `IncidentLogged`. It agrees with the revised text on both clarified points. **Missing:** the affected competition subject and instance (the slot exists, typed as literal `null`, and cannot be set), attachments, server-side rejection of requester-supplied priority-bearing fields, and everything outside the domain — the `incident_ticket` table, the TypeORM adapter, `LogIncidentUseCase`, the HTTP route and both intake surfaces. Nothing can be logged by a user yet.
  - **`FR-INC-02`.** Built: `IncidentReferencePolicy` renders `INC` + seven zero-padded digits and raises a typed error past `9 999 999` instead of wrapping (which would reuse a reference), and `IncidentRepositoryPort.nextReference()` is declared. **Missing:** the database sequence, the immutability trigger and the adapter (`T-C1-04`), and assignment of the reference in the same transaction as creation.
- **What actually remains — everything else (🔴):** the categorization taxonomy and its exit gate (`FR-INC-03`); matrix derivation and justified override (`FR-INC-04` — the aggregate's absent-at-creation Priority agrees with the new "no default" rule but derives nothing); the agent-only competition-in-progress flag (`FR-INC-05`); the configurable lifecycle (`FR-INC-06` — **no state is modelled on the aggregate yet**); resolution gating, clock-stopping pending states, auto-close with rejection window (`07`–`09`); linking, public/internal entries, assignment history, escalation (`10`–`13`); conversion (`14`); scope-rule enforcement (`15`); knowledge suggestion and deflection (`16`); duplicate detection (`17`); FCR (`18`). **New:** the **triage gate** (`FR-INC-19`) — Impact, Urgency (hence Priority) and affected service required to leave `New`, Impact and Urgency required before any assignment by any path, gates that configuration can add to but never remove, and a refusal that names the missing element; and the **untriaged period** (`FR-INC-20`) — a configurable maximum time in `New` without a category, after which the Incident is visibly overdue for triage, acted upon through `FR-WFL-05` rules. Tickets exist for both (`FR-INC-19` traced into `T-C1-49`, `50`, `51`, `73`; `FR-INC-20` is `T-C1-102`), but **no user story yet** (**F15**).
- **Depends on:** `C10` (declared — `FR-IAM-01`/`03`) · `C12` (declared — `FR-INC-06`; **`FR-INC-19`** gates configured transitions and rule-based assignment; **`FR-INC-20`** runs on `FR-WFL-05`) · `C14` (declared — `FR-INC-12`; **`FR-INC-19`** gates `FR-QUE-03` self-assignment) · `C7` (declared — `FR-INC-08`, `FR-SLA-04`) · `C18` (declared — `FR-INC-04`/`05`) · `C16` (declared — `FR-NOT-01`) · `C9` (declared — `FR-INC-16`) · `C11` (declared — `FR-OMN-01`/`02`) · `C6`, `C3` (inferred — `FR-INC-10` links; deferrable to Phase 2)
- **Size:** **XL** — 20 requirements (**17 Must**), the largest active count in §7, 6 libraries (scaffolded, one populated), the core aggregate and the product's signature behavior (`FR-INC-05`). The +2 requirements add two tickets' worth of scope (the triage gate was folded into four existing tickets; `T-C1-102` is new, 2.5h): the band does not move. Delivered so far: 4 of 102 tickets (`T-C1-01`, `02`, `03`, `05`).
- **Findings:** **F6** (Phase 0/1 cut still undecided); **F15** (no stories for `FR-INC-19`/`20`); **F16** (§14.10 open points 1, 2 and 5, plus A11, bind this epic directly — open point 2 in particular means that, as written, **cancelling a duplicate or unfounded Incident still in `New`** requires a category, Impact, Urgency and affected service); **F17** (the ticket index still shows `FR-INC-15`/`16` as unphased).

### `C13` · Major Incident Management (PRD §7.1.1)

- **Requirements (6):** `FR-MIM-01` 🔴 M · `FR-MIM-02` 🔴 M · `FR-MIM-03` 🔴 M · `FR-MIM-04` 🔴 S · `FR-MIM-05` 🔴 S · `FR-MIM-06` 🔴 C
- **What actually remains:** Everything, **no new libraries** (same `incident` context as `C1`). Declaration (`FR-MIM-01`), protocol (`FR-MIM-02`), parent/child propagation (`FR-MIM-03`), communication cadence (`FR-MIM-04`), post-review and Problem gate (`FR-MIM-05`), portal status message (`FR-MIM-06`). `FR-INC-19` does not bind declaration directly, but a Major Incident is declared on an Incident that must already be triaged to have been assigned.
- **Depends on:** `C1` (declared) · `C16` (declared) · `C7` (declared) · `C3` (declared — `FR-MIM-05`) · `C9` (declared — `FR-MIM-06`)
- **Size:** **M** — unchanged.
- **Findings:** **F1**.

### `C8` · Service Catalog Management (PRD §7.8)

- **Requirements (6):** `FR-CAT-01` 🔴 M · `FR-CAT-02` 🔴 M · `FR-CAT-03` 🔴 M · `FR-CAT-04` 🔴 M · `FR-CAT-05` 🔴 M · `FR-CAT-06` 🔴 C
- **What actually remains:** Everything. Six libraries in `service-catalog`. Services and offerings (`FR-CAT-01`), per-offering definition including the dynamic request form (`FR-CAT-02`), publication lifecycle (`FR-CAT-03`), eligibility-filtered presentation (`FR-CAT-04`), search (`FR-CAT-05`), cost/effort metadata (`FR-CAT-06`, Phase 3). `NFR-CFG-02`'s new definition applies: an offering's configuration governs a Service Request from the moment it is first applied.
- **Depends on:** `C10` (declared) · `C7` (declared; mutual, **F4**) · `C15` (declared) · `C12` (inferred — fulfillment workflow)
- **Size:** **M** — may become **L** if the form model is scoped ambitiously.
- **Findings:** **F4**.

### `C15` · Approval Engine (PRD §7.14)

- **Requirements (7):** `FR-APR-01` 🔴 M · `FR-APR-02` 🔴 M · `FR-APR-03` 🔴 M · `FR-APR-04` 🔴 S · `FR-APR-05` 🔴 S · `FR-APR-06` 🔴 C · `FR-APR-07` 🔴 M
- **What actually remains:** Everything. Six libraries in `approval`. Stages (`FR-APR-01`), approver resolution (`FR-APR-02`), decisions (`FR-APR-03`), delegation (`FR-APR-04`), reminders and escalation (`FR-APR-05`), CAB quorum (`FR-APR-06`), immutability (`FR-APR-07`).
- **Depends on:** `C10` (declared) · `C16` (declared) · `C18` (declared) · `C12` (inferred — `FR-APR-05`)
- **Size:** **M** — unchanged.
- **Findings:** **F14** (critical path of an erasure).

### `C2` · Service Request Management (PRD §7.2)

- **Requirements (11):** `FR-SRQ-01` 🔴 M · `FR-SRQ-02` 🔴 M · `FR-SRQ-03` 🔴 M · `FR-SRQ-04` 🔴 M · `FR-SRQ-05` 🔴 M · `FR-SRQ-06` 🔴 M · `FR-SRQ-07` 🔴 M · `FR-SRQ-08` 🔴 M · `FR-SRQ-09` 🔴 M · `FR-SRQ-10` 🔴 S · `FR-SRQ-11` 🔴 M
- **What actually remains:** Everything. Six libraries in `service-request`, a `ServiceRequest` root owning `FulfillmentTask`s; catalog-only origination through the **seven** MVP offerings including the personal-data erasure request (the intake half of `FR-IAM-09`). **Note from the code:** the `OriginChannel` value object was placed in `libs/incident/domain`, not the shared kernel (two consumers are below the "three or more" bar of `ARCHITECTURE.md` §12.2), so `service-request/domain` declares its own — with the same four values `FR-OMN-02` now fixes.
- **Depends on:** `C8` · `C15` · `C7` · `C10` · `C12` · `C14` (all declared) · `C16` (inferred — `FR-SRQ-11`)
- **Size:** **L** — unchanged.
- **Findings:** **F14** (intake half of `FR-IAM-09` has no story).

### `C16` · Notification Framework (PRD §7.15)

- **Requirements (8):** `FR-NOT-01` 🔴 M · `FR-NOT-02` 🔴 M · `FR-NOT-03` 🔴 M · `FR-NOT-04` 🔴 M · `FR-NOT-05` 🔴 M · `FR-NOT-06` 🔴 **M (in-app) / S (email) / C (push)** · `FR-NOT-07` 🔴 C · `FR-NOT-08` 🔴 M
- **What actually remains:** Everything. Four libraries in `notification`. A post-commit subscriber (ADR-008) — the dispatcher it will subscribe through now exists and already proves the failure isolation `NFR-AVL-03` depends on, but binds no notification behavior. **Possible new consumer:** `FR-INC-20` lets the untriaged-period expiry trigger a reminder or escalation "configured through those rules" — if configured as a notification, it becomes an event source for `FR-NOT-02`. The default action is undecided (A11).
- **Depends on:** `C10` (inferred) · `C1`, `C2`, `C7`, `C15`, `C13` (declared) · `C18` (inferred) · D5, D7 (external)
- **Size:** **M** — unchanged.
- **Findings:** **F3**, **F14** (no notification to an erased person).

### `C9` · Knowledge Management & Self-Service Portal (PRD §7.9)

- **Requirements (10):** `FR-KNW-01` 🔴 M · `FR-KNW-02` 🔴 M · `FR-KNW-03` 🔴 M · `FR-KNW-04` 🔴 M · `FR-KNW-05` 🔴 M · `FR-KNW-06` 🔴 S · `FR-KNW-07` 🔴 S · `FR-KNW-08` 🔴 M · `FR-KNW-09` 🔴 S · `FR-KNW-10` 🔴 S
- **What actually remains:** Everything. Six libraries in `knowledge`. `FR-KNW-08` is the whole Self-Service Portal. **Interaction with the code:** delivery slice 1's requester intake form and detail view (`T-C1-10`, `T-C1-101`) are built in `libs/incident/feature`, not in a portal owned here; when `C9` is drilled, the portal must compose those surfaces rather than re-build them.
- **Depends on:** `C10`, `C1`, `C2`, `C7`, `C3` (declared) · `C15` (inferred)
- **Size:** **L** — unchanged.
- **Findings:** none beyond the shared set.

### `C11` · Omnichannel Intake (PRD §7.11)

- **Requirements (4):** `FR-OMN-01` 🔴 **M (portal + agent-logged) / S (email, in-app)** · `FR-OMN-02` 🟡 M · `FR-OMN-03` 🔴 S · `FR-OMN-04` 🟡 M
- **Count verified: 4, unchanged.** The revision changed the text of `FR-OMN-01` (an agent-logged entry is one recorded by an agent from a contact outside the self-service channels — phone, chat or any direct contact) and `FR-OMN-02` (exactly four origin channels — portal, email, in-app, agent-logged; phone and chat are agent-logged; the origin channel is not a preferred contact means). No ID, priority or phase changed. §5's C11 row now names the four channels in the same terms.
- **What actually remains:**
  - **`FR-OMN-02` 🟡.** Built on the Incident side, in the domain only: `OriginChannel` is a closed set of exactly the four PRD values with **no `phone` member**, and `Incident.log()` refuses an Incident without one. **Missing:** persistence (`origin_channel_enum` and the column arrive with `T-C1-06`), the Service Request side, and any reporting read of the value.
  - **`FR-OMN-04` 🟡.** Built on the Incident side, in the domain only: `Incident.log()` refuses an Incident without a reporter, and keeps reporter (who it is about) distinct from actor (who logged it), which the agent-logged path needs. **Missing:** an authenticated identity behind it — delivery slice 1 deliberately supplies a fixed actor — and the Service Request side.
  - **`FR-OMN-01` 🔴.** No inbound adapter exists for any channel. **`FR-OMN-03` 🔴** (email threading, Phase 3).
- **Structure:** no bounded context and no libraries of its own — an adapter concern (`ARCHITECTURE.md` §4.1). **Correction to the previous edition:** it stated that `originChannel` enters the domain "as a value object in `libs/shared/domain`". `ARCHITECTURE.md` §4.1 says only "as a value object"; the code places it in `libs/incident/domain`, with `service-request` to declare its own (**F21**).
- **Depends on:** `C1`, `C2` (declared) · `C10` (declared — `FR-OMN-04`) · D7 (external)
- **Size:** **S** — unchanged.
- **Findings:** **F3**; **F21**.

### `C17` · Reporting, Dashboards & Analytics (PRD §7.16)

- **Requirements (7):** `FR-RPT-01` 🔴 M · `FR-RPT-02` 🔴 M · `FR-RPT-03` 🔴 S · `FR-RPT-04` 🔴 S · `FR-RPT-05` 🔴 M · `FR-RPT-06` 🔴 S · `FR-RPT-07` 🔴 M
- **What actually remains:** Everything. Six libraries in `reporting` (read models only). **New input from `C1`:** `FR-INC-20`'s "overdue for triage" state is operational-dashboard material (`FR-RPT-01`: "unassigned queue depth"), and Incidents with no Priority must be represented in "open tickets by priority" without a default being invented (`FR-INC-04`). Neither adds a requirement here; both must be read by the drill.
- **Depends on:** `C1`, `C2`, `C7`, `C13`, `C15`, `C4`, `C5`, `C9` (declared) · `C6` (inferred)
- **Size:** **L** — unchanged.
- **Findings:** none beyond the shared set.

### `C6` · Asset & Configuration Management — CMDB (PRD §7.6)

- **Requirements (8):** `FR-CMD-01` 🔴 M · `FR-CMD-02` 🔴 M · `FR-CMD-03` 🔴 M · `FR-CMD-04` 🔴 M · `FR-CMD-05` 🔴 M · `FR-CMD-06` 🔴 M · `FR-CMD-07` 🔴 C · `FR-CMD-08` 🔴 C
- **What actually remains:** Everything. Six libraries in `asset-config` (Phase 2). CI model, typed directed relationships, impact analysis, linking, history, drift, asset lifecycle.
- **Depends on:** `C10` (inferred) · `C18` (declared) · `C1` (declared) · D6 (external)
- **Size:** **L** — unchanged.
- **Findings:** none beyond the shared set.

### `C4` · Change Management (PRD §7.4)

- **Requirements (11 active):** `FR-CHG-01` 🔴 M · `FR-CHG-02` 🔴 M · `FR-CHG-03` 🔴 M · `FR-CHG-04` 🔴 M · `FR-CHG-05` 🔴 M · `FR-CHG-06` 🔴 M · **`FR-CHG-07` — retired, excluded** · `FR-CHG-08` 🔴 S · `FR-CHG-09` 🔴 M · `FR-CHG-10` 🔴 M · `FR-CHG-11` 🔴 S · `FR-CHG-12` 🔴 S
- **What actually remains:** Everything. Six libraries in `change` (Phase 2).
- **Depends on:** `C6`, `C15`, `C5`, `C1`, `C3`, `C12`, `C18` (declared)
- **Size:** **L** — unchanged; phase-atomic.
- **Findings:** **F2**.

### `C5` · Release & Deployment Management (PRD §7.5)

- **Requirements (8):** `FR-REL-01` 🔴 M · `FR-REL-02` 🔴 M · `FR-REL-03` 🔴 M · `FR-REL-04` 🔴 M · `FR-REL-05` 🔴 M · `FR-REL-06` 🔴 M · `FR-REL-07` 🔴 S · `FR-REL-08` 🔴 S
- **What actually remains:** Everything. Six libraries in `release` (Phase 2).
- **Depends on:** `C4`, `C6`, `C12` (declared) · `C15` (declared in `ARCHITECTURE.md`; inferred from the PRD) · D6 (external)
- **Size:** **L** — unchanged; phase-atomic.
- **Findings:** none open.

### `C3` · Problem Management (PRD §7.3)

- **Requirements (9):** `FR-PRB-01` 🔴 M · `FR-PRB-02` 🔴 M · `FR-PRB-03` 🔴 M · `FR-PRB-04` 🔴 M · `FR-PRB-05` 🔴 M · `FR-PRB-06` 🔴 M · `FR-PRB-07` 🔴 S · `FR-PRB-08` 🔴 S · `FR-PRB-09` 🔴 C
- **What actually remains:** Everything. Six libraries in `problem` (Phase 2).
- **Depends on:** `C1`, `C13`, `C9`, `C4`, `C12` (declared) · `C17` (inferred — `FR-PRB-09`)
- **Size:** **L** — unchanged.
- **Findings:** none beyond the shared set.

### `NFR` · Non-Functional Requirements (PRD §8)

- **Requirements (38):** all 🔴 except **`NFR-DAT-01` 🟡**.
  - **§8.1 Availability & continuity:** `NFR-AVL-01` · `NFR-AVL-02` · `NFR-AVL-03` · `NFR-AVL-04` · `NFR-AVL-05`
  - **§8.2 Performance & responsiveness:** `NFR-PRF-01` · `NFR-PRF-02` · `NFR-PRF-03` · `NFR-PRF-04`
  - **§8.3 Security & access:** `NFR-SEC-01` · `NFR-SEC-02` · `NFR-SEC-03` · `NFR-SEC-04` · `NFR-SEC-05` · `NFR-SEC-06` · `NFR-SEC-07`
  - **§8.4 Auditability & compliance:** `NFR-AUD-01` · `NFR-AUD-02` · `NFR-AUD-03` · `NFR-AUD-04`
  - **§8.5 Internationalization & localization:** `NFR-I18N-01` · `NFR-I18N-02` · `NFR-I18N-03` · `NFR-I18N-04` · `NFR-I18N-05`
  - **§8.6 Usability & accessibility:** `NFR-USE-01` · `NFR-USE-02` · `NFR-USE-03` · `NFR-USE-04` · `NFR-USE-05`
  - **§8.7 Data quality, retention & scalability:** `NFR-DAT-01` 🟡 · `NFR-DAT-02` · `NFR-DAT-03` · `NFR-DAT-04` · `NFR-DAT-05`
  - **§8.8 Configurability & operability:** `NFR-CFG-01` · `NFR-CFG-02` · `NFR-CFG-03`
    > §8 carries no MoSCoW column — stated as unconditional obligations. A characteristic, not a defect.
- **Text changes this revision:** **`NFR-CFG-02`** now defines when a record is *governed* by a configuration — from the moment that configuration is **first applied** to it, not necessarily at creation — with the Impact × Urgency matrix as the worked example. No count change. The definition binds every configuration consumer, not only `C1`: SLA policies (`C7`), catalog offerings (`C8`), workflows (`C12`), approval chains (`C15`) and notification templates (`C16`) must each state what "first applied" means for their records when drilled.
- **Phasing (PRD §14.1):** the general rule plus Class A (service-level, phase-exit verification), Class B (Phase-0 invariants: `NFR-SEC-02`, `NFR-SEC-05`, `NFR-AUD-01`, `NFR-AUD-02`, `NFR-I18N-01`, `NFR-DAT-01`), Class C (dormant: `NFR-DAT-05`), the explicit floor for `NFR-AVL-03`, and the unfunded `NFR-AVL-04`.
- **What actually remains:** Everything. **`NFR-DAT-01` 🟡** — the Incident reference policy refuses to wrap past its seven-digit ceiling, so a reference can never be reused by overflow; uniqueness and immutability (the sequence and the immutability trigger, `T-C1-04`) and every other record type's references are missing. **Substrate delivered, requirements not satisfied:** the post-commit dispatcher's failure isolation (for `NFR-AVL-03`), the health-route exclusions without health endpoints (for `NFR-CFG-03`), the time port and UTC-instant storage in `DateTimeRange`/`Incident` (for `NFR-I18N-03`). **Deliberate debt (user-approved for delivery slice 1):** user-facing strings are sourced from per-feature constants files rather than `nestjs-i18n`/Transloco, which is below the bar of the Class-B invariant `NFR-I18N-01`; the design system and its a11y baseline (`NFR-USE-03`) are deferred, with hand-built accessible HTML in their place. Standalone build still includes i18n scaffolding, a11y baseline, health/observability and retention.
- **Depends on:** all 18 capability epics (inferred)
- **Size:** **XL by count, nominal** — unchanged; the genuinely standalone slice is much smaller.
- **Findings:** **F10** (resolved in the PRD), **F13**. Slice 1's i18n debt is against a **Class-B** invariant, which §14.1 says binds from Phase 0 on every story: it must be repaid before any slice is declared Phase-1 done.

---

## Epic key map

The key **is** the PRD's own capability ID from the §7 subsection title. No mnemonic is minted, no PRD ID is renumbered, and every key is ≤4 characters. §8 is the single `NFR` epic.

| Key   | PRD section | Bounded context (`ARCHITECTURE.md` §4.1)                 | New Nx libraries | Built at `cba9e96` | Story/ticket ID prefix   |
| ----- | ----------- | -------------------------------------------------------- | ---------------: | -----------------: | ------------------------ |
| `C1`  | §7.1        | `incident`                                               |                6 | 6 (scaffolded; `domain` populated) | `US-C1-nn` / `T-C1-nn`   |
| `C13` | §7.1.1      | `incident` (shared with C1)                              |                0 | — | `US-C13-nn` / `T-C13-nn` |
| `C2`  | §7.2        | `service-request`                                        |                6 | 0 | `US-C2-nn` / `T-C2-nn`   |
| `C3`  | §7.3        | `problem` (phase 2)                                      |                6 | 0 | `US-C3-nn` / `T-C3-nn`   |
| `C4`  | §7.4        | `change` (phase 2)                                       |                6 | 0 | `US-C4-nn` / `T-C4-nn`   |
| `C5`  | §7.5        | `release` (phase 2)                                      |                6 | 0 | `US-C5-nn` / `T-C5-nn`   |
| `C6`  | §7.6        | `asset-config` (phase 2)                                 |                6 | 0 | `US-C6-nn` / `T-C6-nn`   |
| `C7`  | §7.7        | `sla`                                                    |                3 | 0 | `US-C7-nn` / `T-C7-nn`   |
| `C8`  | §7.8        | `service-catalog`                                        |                6 | 0 | `US-C8-nn` / `T-C8-nn`   |
| `C9`  | §7.9        | `knowledge`                                              |                6 | 0 | `US-C9-nn` / `T-C9-nn`   |
| `C10` | §7.10       | `identity-access` + **`shared` kernel + 4 applications** |            5 + 9 | 0 + 7 (4 apps, 3 shared libs) | `US-C10-nn` / `T-C10-nn` |
| `C11` | §7.11       | none — inbound adapter concern (§4.1)                    |                0 | — | `US-C11-nn` / `T-C11-nn` |
| `C12` | §7.12       | none — `StateModel` primitive in `shared/domain` (§4.1)  |                0 | — (`StateModel` not built) | `US-C12-nn` / `T-C12-nn` |
| `C14` | §7.13       | `identity-access` (shared with C10)                      |                0 | — | `US-C14-nn` / `T-C14-nn` |
| `C15` | §7.14       | `approval`                                               |                6 | 0 | `US-C15-nn` / `T-C15-nn` |
| `C16` | §7.15       | `notification`                                           |                4 | 0 | `US-C16-nn` / `T-C16-nn` |
| `C17` | §7.16       | `reporting`                                              |                6 | 0 | `US-C17-nn` / `T-C17-nn` |
| `C18` | §7.17       | `audit`                                                  |                4 | 0 | `US-C18-nn` / `T-C18-nn` |
| `NFR` | §8          | cross-cutting — no context of its own                    |                0 | — | `US-NFR-nn` / `T-NFR-nn` |

> Library counts for the four Phase-2 contexts are **inferred** (six each, by analogy with `incident` and `service-request`); confirm with the architect before those epics are sized for delivery.

## Findings — PRD vs code

First live run of `CrossCheckAgainstCode()`. No ⚫ Broken requirement and no 🔍 Unverified item was found; the PRD carries no build states, so no stated state could be contradicted (see **F20**). Every row below records either a partial build or an agreement/disagreement worth knowing before the next ticket touches the code.

| # | Epic | Requirement | PRD says | Code says | Impact |
| --- | --- | --- | --- | --- | --- |
| **PC1** | `C1` | `FR-INC-01` | Capture reporter, origin channel, short and detailed description, affected service (optional at logging), competition subject and instance, attachments; requester cannot set priority-bearing fields. | `Incident.log()` enforces reporter, origin channel, both descriptions (short ≤255); affected service optional; competition subject is a literal-`null` slot; no attachments; domain only — no table, adapter, use case or route. | **🟡 Partial.** Agrees on every clarified point of §14.10 (D1, D5). |
| **PC2** | `C1` | `FR-INC-02` | Unique human-readable reference at creation, never reused. | `IncidentReferencePolicy` (`INC` + 7 digits, typed refusal instead of wrap-around); `nextReference()` declared on the port. No sequence, trigger or adapter. | **🟡 Partial.** |
| **PC3** | `C1` | `FR-INC-04` | No Priority and no default Priority until both Impact and Urgency are assessed. | The aggregate is created with `impact`, `urgency` and `priority` all absent; no matrix, no derivation. | **Agreement; stays 🔴.** The absent-at-creation slot is compatible with the rule but implements none of the requirement's behavior. |
| **PC4** | `C1` | `FR-INC-06`, `FR-INC-19`, `FR-INC-20` | Lifecycle through configured states; gates on leaving `New`; time in `New` measured. | No lifecycle state on the aggregate — deliberately, pending `StateModel` (`T-C10-10`) and `T-C1-49`/`50`. | **Not a disagreement; all 🔴.** `FR-INC-19`/`20` cannot be built before `StateModel`. |
| **PC5** | `C11` | `FR-OMN-02` | Exactly four origin channels; phone and chat are agent-logged; not a contact preference. | `OriginChannel` = `portal`, `agent_logged`, `email`, `in_app`; no `phone`; mandatory on `Incident.log()`. Incident side, domain only. | **🟡 Partial. Exact agreement** with the revised text. |
| **PC6** | `C11` | `FR-OMN-04` | Requester identity captured; no anonymous submission. | Reporter mandatory in `Incident.log()`, distinct from the acting actor. No authentication behind it (slice 1 uses a fixed actor, not yet in code). | **🟡 Partial.** Not satisfiable end to end until `C10`'s `FR-IAM-01` exists. |
| **PC7** | `NFR` | `NFR-DAT-01` | References unique, immutable, never reused. | Never reused by overflow (policy); uniqueness and immutability not yet enforced (`T-C1-04`). Incident only. | **🟡 Partial.** |
| **PC8** | `C18` | `FR-AUD-01` | Every creation is recorded immutably. | `IncidentLogged` is produced by the aggregate and a post-commit dispatcher exists, but no use case publishes and no subscriber records. | **🔴, approved deviation** for delivery slice 1 (`C10` tickets README, deviation 4). |
| **PC9** | `C1`, `C11` | — (code comments) | §14.10 D1 and D5 decided that the captured channel is the origin channel and that the affected service is optional at logging. | `incident.aggregate.ts` (the `affectedServiceId` doc and `log()` doc) still says "see the reported finding on `FR-INC-01` vs. the schema"; `origin-channel.vo.ts` still asks the Product Owner "to confirm or correct the term". | **Info.** Behavior already agrees with the PRD; only the comments point at findings the PRD has now closed. Tidy them in the next `C1` ticket that touches those files (`T-C1-06` or `T-C1-07`); not a reason for a ticket of its own. |

## Findings — PRD internal consistency and derived-artifact alignment

Reported, not fixed. `docs/product/PRD.md` was not modified by this run, and no `user-stories.md` or ticket was edited.

**Numbering note.** Map finding IDs (`F1`…`F21`, `PC1`…`PC9`) are this document's own namespace. `docs/backlog/C10/user-stories.md` and `docs/backlog/C1/user-stories.md` keep their own `F`-series (`C10`: F13–F22; `C1`: up to F30), which overlap these numbers. Where this map cites a downstream finding, it qualifies it (e.g. "`C10` stories F18").

| # | Severity | Epic(s) | Finding | Impact |
| --- | --- | --- | --- | --- |
| **F1** | Info | `C13` | C13 is nested as `#### 7.1.1` under §7.1, not a top-level §7.x subsection, but carries its own capability ID and `FR-MIM-*` family. | Keyed as its own epic with a dependency on `C1`; no new libraries. No blocker. |
| **F2** | Info | `C4` | `FR-CHG-07` is retired, priority `—`, ID retained and never reused. | Excluded from all counts: 12 declared, **11 active**. |
| **F3** | Low | `C11`, `C16` | Two compound MoSCoW priorities on one ID: `FR-OMN-01` (`M` portal + agent-logged / `S` email, in-app) and `FR-NOT-06` (`M` in-app / `S` email / `C` push). | Every limb is phased explicitly (§14.3, §14.5, §14.6); the IDs are deliberately not split. The 2026-09-26 clarification of `FR-OMN-01` defines agent-logged but does not change its priority split. Story-level split only. |
| **F4** | Medium | `C7`, `C8` | Mutual reference: `FR-SLA-01` targets per Service Offering; `FR-CAT-02` requires each offering to name an SLA policy. | Build the policy registry (`C7`) first; the offering holds an identifier. |
| **F5** | Medium | `C10`, `C18` | Mutual reference at Phase 0: `FR-IAM-05` needs audit; `FR-AUD-02` needs an actor. | Co-deliver as one Phase-0 increment. Delivery slice 1 already departs from this (no auth, no audit subscriber), by approved deviation. |
| **F6** | Medium | `C1`, `C18`, `C10` | Three epics are not phase-atomic. `C1`: §14.2 puts "core ticket record and reference numbering, categorization taxonomy" in Phase 0 while §14.3 lists `FR-INC-01 → 13, 18, 19, 20` in Phase 1 — overlapping, boundary unstated. `C18`: Phase 0 / 1 / 2. `C10`: Phases 0 / 1 / 2 / 3. | **Still open for `C1`** — the ticket index carries 28 tickets (71.0h) as `disputed 0/1`. The §14.10 revision added two more Phase-1 IDs to `C1` without settling the Phase 0/1 cut. A Product Owner decision. |
| **F7** | **Resolved 2026-09-24** | `C4`, `C5`, `C17` | Was: `FR-CHG-11`, `FR-REL-07`, `FR-REL-08` unphased. | All three in Phase 2; Phase 2 exit KPIs are computable from its own requirements. |
| **F8** | Info | `C12` | PRD models C12 as a capability; `ARCHITECTURE.md` §4.1 dissolves it into a `StateModel` primitive plus per-context configuration. | `C12` creates no libraries. `StateModel` is still unbuilt and is now on the critical path of `FR-INC-19`/`20`. |
| **F9** | **CLOSED 2026-09-24** | — | Was: eleven unphased requirements. | Closed structurally by §14.9. **Held again in this revision:** `FR-INC-19` and `FR-INC-20` were born phased, as §14.9 requires. |
| **F10** | **Resolved in the PRD 2026-09-24** | `NFR` | NFR absorption / double-count risk. | §14.1 mandates per-story, phase-exit or no verification by class; the `NFR` epic produces standalone-build stories only. |
| **F13** | Medium — half resolved | `NFR`, `C10` | `NFR-SEC-07` and `NFR-AVL-04` were unfunded. | `NFR-SEC-07` funded by `FR-IAM-09` (`C10`). `NFR-AVL-04` deliberately unfunded (risk R13). |
| **F14** | **High — carried** | `C10`, `C2`, `C8`, `C15`, `C16`, `C18` | `FR-IAM-09` is half-delivered through the backlog: PRD decided (including intake/lawfulness, end of authentication and open-work behavior, `b129e03`); three stories (`US-C10-17/18/19`) predate those three decisions and need adjustment; a fourth story (intake + gating approval) is missing; **no ticket exists** — the `C10` ticket index still sources "16 stories" against a `user-stories.md` that now holds 19. | **Unchanged since the previous edition.** Business Analyst pass over `US-C10-17/18/19` plus the missing story, then tickets. `C10` stories findings F20, F21 and F22 are **already answered by the PRD** (`FR-SRQ-09`'s seventh offering, `A10`, and the three paragraphs added to `FR-IAM-09` at `b129e03`) and should be closed in that pass. |
| **F15** | **Medium — new** | `C1` | **`FR-INC-19` and `FR-INC-20` have tickets but no user stories.** `FR-INC-19` is traced into `T-C1-49`, `50`, `51`, `73`; `FR-INC-20` is `T-C1-102` with `story: —`, correctly flagged there as a gap rather than foundation. `docs/backlog/C1/user-stories.md` at `cba9e96` still reads "18 requirements remaining · 32 stories" and carries `FR-INC-15`/`16` as unphased. | The Business Analyst is regenerating `C1/user-stories.md` in parallel with this map. Once stories exist, the Architect / Tech Lead must re-trace `T-C1-102` (and the four `FR-INC-19` tickets) to them. Until then `FR-INC-19`/`20` have no Gherkin acceptance criteria, which §15.1 (Definition of Ready) requires. |
| **F16** | **Medium — new** | `C1`, `C7`, `C12`, `C14` | **Five §14.10 open points and assumption A11 are undecided**, each binding an epic: (1) untriaged-period value and default action on expiry — A11, `C1` (`FR-INC-20`); (2) whether cancelling or converting an Incident still in `New` is exempt from the `FR-INC-03`/`FR-INC-19` gates — `C1`; (3) whether placing an unassessed Incident in an intake queue is "assignment" — `C12` (`FR-WFL-03`), `C14`; (4) which SLA policy applies before the first Priority derivation — `C7` (`FR-SLA-01`/`02`); (5) how the competition-in-progress uplift applies at logging when Impact is not yet assessed — `C1` (`FR-INC-05`). | Product Owner decisions, correctly recorded in the PRD as open rather than inferred. **Point 2 is the most urgent:** read literally, a duplicate cannot be cancelled from `New` without first being fully triaged, which delivery slice 2 (triage) will hit immediately. Point 4 blocks drilling `C7`; point 1 blocks Phase-1 go-live of `FR-INC-20`, not its build (`T-C1-102` builds fail-fast configuration with no default). |
| **F17** | **Low — new** | `C1` | **The `C1` ticket index and test plan lag the 2026-09-24 phasing.** `docs/backlog/C1/tickets/README.md` still labels block L (`FR-INC-15`) and block M (`FR-INC-16`) "unphased (F9)", lists `unphased (F9)` as a phase value in use, reports "Unphased: 7 tickets · 19.5h" in its by-phase totals, and keeps `C1`-stories finding F23 recommending that `FR-INC-15` be phased into Phase 1 — which the PRD did on 2026-09-24 (`FR-INC-15` Phase 1 `Must`; `FR-INC-16` Phase 3). `C1`-stories finding F26 (whether deflection recording rides with Phase 1) is likewise answered: `FR-INC-16` is Phase 3 as a whole. | Reported to `architect-tech-lead`, after the Business Analyst's regeneration lands (phases are copied verbatim from stories). Estimates are unaffected; only phase labels and the by-phase totals move (block L → Phase 1, block M → Phase 3). |
| **F18** | **Info — verified, obsolete** | `C10` | **`C10` stories F18** reported that the epic map counted **7** `FR-IAM-*` requirements while the PRD had **8**. Verified against the working-tree PRD: §7.10 holds **9** (`FR-IAM-01` → `FR-IAM-09`). The epic map has counted **9** since its 2026-09-24 refresh; the "7" belonged to the 2026-09-06 edition the finding was raised against. | **No correction to this map is needed; the count stands at 9.** Residual drift is in the downstream artifact, not here: `C10/user-stories.md`'s header correctly says 9, but its own F14 row still says "holding only 7 requirements" and its F18 row says "8". Close `C10` stories F18 and correct those two rows in the next Business Analyst pass on `C10` (the same pass **F14** requires). |
| **F19** | **Low — new** | `C10` | **PRD §14.2 omits `FR-IAM-09` from its own IAM phasing sentence.** It reads "The remaining Identity & Access requirements are phased as follows: FR-IAM-06 and FR-IAM-08 in Phase 1 … FR-IAM-07 in Phase 2 … FR-IAM-04 in Phase 3. No Identity & Access requirement is unphased." `FR-IAM-09` **is** phased — §14.3's Identity & Access row names it as Phase 1 — so §14.9's invariant holds. | Wording defect only: the sentence claims completeness and is incomplete. Suggested fix for the next Mode-1 pass: add "FR-IAM-09 in Phase 1" to that sentence. No backlog impact. |
| **F20** | **Medium — new** | all | **Build state now has no owner in the PRD.** The PRD still carries no build-state legend or per-requirement state, while five requirements are 🟡 Partial in code. `prd-author` makes keeping the build state accurate the PRD's job; this map is currently the only record. Separately, the Product Owner agent's Mode-2 instructions (`.claude/agents/`) still state that "there is no `libs/` directory" and that every requirement is 🔴 — both untrue at `cba9e96`; this run applied the code over that instruction. | Product Owner decision: either add the icon legend and per-requirement states to the PRD in the next Mode-1 pass (the skill's default), or record explicitly that the epic map owns as-built state. The agent-definition text is outside this role's edit scope and is reported for whoever maintains `.claude/**`. |
| **F21** | **Info — map corrected** | `C11`, `C2` | The previous edition said `originChannel` enters the domain "as a value object in `libs/shared/domain`". `ARCHITECTURE.md` §4.1 says only "as a value object"; the code places `OriginChannel` in `libs/incident/domain`, justified by `ARCHITECTURE.md` §12.2 (two consumers are below the shared-kernel bar) and `DATA-MODEL.md` (one `origin_channel_enum` per context). | Corrected in this edition. `C2`'s drill must declare its own `OriginChannel` with the same four values rather than import `incident`'s. |

## Findings — drift against upstream sources

| # | Severity | Finding | Impact |
| --- | --- | --- | --- |
| **F11** | Medium | **`readme.md` §1.2 vs PRD §3.3 — event-aware SLA drift.** The upstream capability list (echoed in the Product Owner agent's domain anchor) describes "SLA Management & Escalation (event-aware around live windows)"; the PRD places competition-calendar management and time-based service policies **out of scope**, `FR-CHG-07` is retired for that reason and ADR-006 ratifies it. | This map follows the PRD: no epic contains live-window, calendar or freeze-window work. Recommend updating `readme.md` §1.2 and the agent's domain anchor. |
| **F12** | Info — **recurred** | **The map is again stamped against an uncommitted PRD.** Closed at `b129e03` with a clean tree; recurred now because the Mode-1 revision of 2026-09-26 has not been committed. | Commit the PRD, then re-stamp this map (HEAD and PRD commit only; the counts do not change if the PRD is committed byte-identical). As recorded at `b129e03`: a Mode-2 re-stamp belongs at the end of a session, after the commits. |
