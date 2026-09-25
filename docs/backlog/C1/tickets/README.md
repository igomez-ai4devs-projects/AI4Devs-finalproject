# Tickets — C1 · Incident Management

> Sources: `docs/backlog/C1/user-stories.md` (32 stories, all greenfield) · `docs/backlog/epic-map.md` (§ `C1`, § **Foundation ownership (priced once)**) · `docs/backlog/C10/tickets/` (the workspace foundation, already ticketed) · `CLAUDE.md` §3 · `docs/product/ARCHITECTURE.md` §5, §6.2, §8, §9 · PRD §7.1, §14
> Test plan: [`../test-plan.md`](../test-plan.md)

**102 tickets · 268.5h · five tickets now exceed the 3h cap, each with a recorded exception.** One ticket added this pass (`T-C1-102`, `FR-INC-20`, no story yet) on top of the three added by the previous pass (`T-C1-99`–`101`, block O, "see it — detail by reference") and the `T-C1-09`/`T-C1-10` re-cut for delivery slice 1 — see **Delivery slices** below.
**2 tickets are foundation** work with `story: —` — the six `incident` libraries and the context schema/module wiring. `T-C1-102` also carries `story: —` but is **not** foundation (it has a persona and observable behavior); see its own `## Context` and the **third pass** note below.
**12 tickets are blocked** by six findings: **F24** (1), **F25** (2), **F27** (1), **F28** (2), **F29** (3), **F30** (3). None of those decisions is made in this backlog.

**This pass — ADR-014 (`ARCHITECTURE.md` §10) and `DATA-MODEL.md` §8.5/M14–M16.** `incident_ticket`'s assessment, matrix-version and lifecycle columns are nullable in the target schema, a matrix version is pinned at an Incident's **first derivation** rather than at creation, and every column arrives with the migration of the first behavior that writes it, backfilled exactly where it lands `NOT NULL` on a table that already has rows. Nine tickets changed to carry this out; net effect **+2.5h** (263.5h → 266.0h), all inside blocks B (net 0h — one ticket lighter, one heavier), D, E, F and I:

| Ticket | Change | Est. |
|---|---|---:|
| `T-C1-06` | Scope narrowed to exactly the first `DATA-MODEL.md` §8.5 column group (`id`, `reference`, `short_description`, `description`, `origin_channel` — enum without `phone` — `reporter_user_id`, `service_id`, audit/version columns); gains the mapper's null-read / reject-on-save rule for every not-yet-introduced slot; a new "reload gives null/false, no lifecycle column" AC; and a flagged, unresolved `ci-cd-expert` risk (first entity ever registered, webpack bundles only `dist/apps/api`). | 3h → 3h |
| `T-C1-04` | No longer creates the `reference` column (moved to `T-C1-06`, whose migration now needs it to prove "every field round-trips"); keeps only the sequence, the adapter, the concurrency proof and an **open architect finding** — `DATA-MODEL.md` §3.7 bans policy triggers but names no other way to enforce immutability "at the database level". | 3h → 2.5h |
| `T-C1-07` | Note only: this slice's use case sets no lifecycle state (none exists yet) and hands `SlaPolicyPort.attachFor()` an Incident with `priority: null`, which is `C7`'s open question, not this ticket's. | 3h → 3h |
| `T-C1-11` | Gains the `logged_by_user_id` migration (nullable, no backfill) and a flagged build-order question: its own existing AC has an agent recording Impact/Urgency at logging, ahead of the columns and mutators `T-C1-30` (block D) introduces. | 2.5h → 3h |
| `T-C1-21` | Confirmed, not changed in substance: this is the `category_id` migration (nullable, no backfill), now cited against ADR-014/§8.5 explicitly. | 3h → 3h |
| `T-C1-27` | "Applied at creation" corrected to "applied at first derivation" throughout (Context, Scope, AC1) — an unassessed Incident has no Priority and is governed by no matrix yet (§8.5, M15). | 3h → 3h |
| `T-C1-30` | Now also carries the assessment-columns migration (`base_impact`, `assessed_impact`, `urgency`, `priority`, `priority_overridden`, `priority_override_justification`, `priority_matrix_id` + four `CHECK`s) — chosen over `T-C1-27` because this is the first behavior that writes them. Recorded cap exception: splitting the migration from its only writer is an artificial split. | 3h → 3.5h |
| `T-C1-43` | **Gap found and closed:** no block-E ticket owned the `competition_affects` + `competition_*` + `ck_incident_competition_flag` migration. Assigned here — the only write path for the flag. Recorded cap exception, same reasoning as `T-C1-30`. | 3h → 3.5h |
| `T-C1-49` | Gains two Product Owner–mandated exit-from-`New` gates (Impact **and** Urgency assessed; affected Service set) composed alongside the existing categorization gate, plus a recorded, deliberately unresolved dependency: no ticket yet owns "an Incident cannot stay in `New` uncategorized indefinitely" — the Product Owner is drafting that rule into the PRD now. Recorded cap exception. | 3h → 3.5h |
| `T-C1-50` | Confirmed as the lifecycle migration: `workflow_id`/`state_id`/`state_category` added nullable, backfilled (seeded initial state + one creation `incident_state_transition` row per existing ticket), then `SET NOT NULL`, plus `ck_incident_resolution` and `ck_incident_categorized_beyond_new`. Recorded cap exception. | 3h → 3.5h |
| `T-C1-51` | AC and Context wording only: the composed gate list now names the two new `T-C1-49` gates alongside the categorization gate. | 2.5h → 2.5h |
| `T-C1-73` | Gains the assignment-side half of the Impact/Urgency rule: assignment (first or repeat) is refused while either is unassessed. | 2.5h → 3h |

Of the three Product Owner decisions relayed by the pass above, two are now numbered: the exit-from-`New` and assignment gates landed as **`FR-INC-19`**, and the "no indefinite `New`" rule landed as **`FR-INC-20`**, both in `PRD.md` §14.10, in the same wave as `ADR-014`'s own second pass below. `phone` dropped from `origin_channel_enum` is confirmed by the PRD's own `FR-OMN-02` wording. Only `loggedAt`/`loggedBy` feeding `created_at`/`created_by` remains unnumbered — correctly so, since it is an ADR-014 persistence rule (rule 4), never a product requirement.

**Second pass — `FR-INC-19`/`FR-INC-20` land in the PRD (§14.10); `DATA-MODEL.md` gains `state_category = 'new'` (M17) and the reference-immutability trigger is decided (M18).** In parallel with this pass, the Product Owner added `FR-INC-19` (the triage gate, now numbered) and `FR-INC-20` (the untriaged-period rule, now numbered, still dependent on undecided **PRD assumption A11**), and the architect updated `DATA-MODEL.md` (§3.2, §3.5, §3.7, §8.1, §8.5, §16, §18 M14–M18, §19, §20.3) and `ARCHITECTURE.md`'s `ADR-014`. Seven tickets changed and one is new; net effect **+2.5h** (266.0h → 268.5h):

| Ticket | Change | Est. |
|---|---|---:|
| `T-C1-04` | Closes the open architect finding from the first pass: the immutability mechanism is decided (a column-immutability guard trigger, M18). Migration now explicitly creates `incident.incident_reference_seq` (`NO CYCLE`), `incident.fn_reject_reference_update()` and `tg_incident_ticket_reference_immutable`; `down` drops all three. AC rewritten to a direct SQL `UPDATE` run **as `postgres`** (the role every environment connects as), proving the trigger and not a `REVOKE`. Order re-justified rather than changed: `T-C1-06`'s own round-trip AC is `INSERT`+`SELECT` only, never an `UPDATE` of `reference`, so it does not need this ticket's trigger to exist first — see finding **H2** below. Deciding the mechanism removed the exploratory scope the first pass carried for three candidate mechanisms. | 2.5h → 2h |
| `T-C1-06` | Adds `update: false` to the `reference` mapping — defence in depth alongside `T-C1-04`'s trigger (M18). Context cross-references the closed H2 finding. | 3h → 3h |
| `T-C1-49` | "Product Owner decisions... not yet a numbered FR" replaced by an explicit `FR-INC-19` citation; adds that the domain must read the non-configurable state **category** `new` (M17), never a state's configurable code; the "no indefinite `New`" rule is now `FR-INC-20`, delegated to the new `T-C1-102` rather than left as an unidentified pending dependency. | 3.5h → 3.5h |
| `T-C1-50` | `state_category_enum` gains `new` (M17); adds `ck_incident_workflow_state_new_is_initial`; backfill target corrected from `open` to `new`; `ck_incident_categorized_beyond_new` renamed and widened to **`ck_incident_triaged_beyond_new`** (category, Impact, Urgency, Priority and Service, per `FR-INC-19`), confirmed as the last of the three migrations it reads from; gap found and closed — `ix_incident_untriaged` and `ix_incident_worklist` added (`DATA-MODEL.md` §16 specified them from the first pass; no ticket had built either). | 3.5h → 3.5h |
| `T-C1-51` | "Pending a PRD update" replaced by an explicit `FR-INC-19` citation. | 2.5h → 2.5h |
| `T-C1-72` | **Corrected this pass:** the persisted `incident_ticket.assigned_group_id`/`assigned_user_id`/`assigned_at` columns and `ck_incident_assessed_before_assignment` were never this ticket's — `DATA-MODEL.md` lists them on `incident_ticket`, not on the append-only history table this ticket migrates, and ADR-014 rule 3 puts a column's migration with its first writer. Moved to `T-C1-73`. This ticket keeps the value object, the append-only history and its own migration, with its AC re-scoped to the aggregate's in-memory derivation. | 3h → 3h |
| `T-C1-73` | Gains the migration `T-C1-72` no longer carries: `assigned_group_id`, `assigned_user_id`, `assigned_at` + `ck_incident_assessed_before_assignment`, sequenced after `T-C1-30`. "Pending a PRD update" replaced by `FR-INC-19`. Recorded cap exception, same reasoning as `T-C1-30`/`T-C1-43`/`T-C1-49`/`T-C1-50`. | 3h → 3.5h |
| `T-C1-102` (**new**) | `FR-INC-20`'s mechanism: validated, fail-fast-at-boot configuration for the untriaged period (no in-code default — PRD assumption A11 is undecided) and an "overdue for triage" query over `T-C1-50`'s `ix_incident_untriaged`. `story: —`; reported as a finding for `business-analyst` — see the test plan's own Findings note. | — → 2.5h |

**`FR-INC-19` was deliberately *not* given its own new ticket.** The task that prompted this pass asked whether to widen `T-C1-25` to `FR-INC-19` or mint a new ticket. Verified against the tickets: `FR-INC-19`'s exit-from-`New` gate is already `T-C1-49`'s (Impact/Urgency/Service, composed with `T-C1-25`'s own categorization gate) and its DB check is `T-C1-50`'s; its assignment gate is `T-C1-73`'s domain guard and `ck_incident_assessed_before_assignment`. Minting a fourth ticket or widening `T-C1-25` (which is specifically `FR-INC-03`'s categorization gate, not the assessment/Service gates `FR-INC-19` adds) would have duplicated existing scope. The correction made instead was tracing: `FR-INC-19` is now in the `requirements:` front matter of `T-C1-49`, `T-C1-50`, `T-C1-51` and `T-C1-73`.

**`T-C1-11`'s flagged build-order question is resolved, not moved.** Its own AC on an agent recording Impact/Urgency at logging cannot literally persist before `T-C1-30`'s mutators exist — and `T-C1-06`'s mapper (ADR-014 rule 4) would reject a save that tried. Resolution: the command accepts and authorizes the values but does not yet forward them to the aggregate; the Incident persists exactly as unassessed as `T-C1-06`/`T-C1-07` already produce. Wiring the dormant fields once `T-C1-30` ships is flagged as a finding for the architect, since `T-C1-30`'s own ticket does not currently mention picking them up. No estimate change (3h).

**Delivery is now cut by vertical slice, not by block order — see Delivery slices below.** The Product Owner has re-cut delivery across `C1` and `C10` into three thin, end-to-end slices, approved by the user. **No ticket file changed and no ID moved for this.** The claim that used to stand here — *"the numbering is the implementation order"* — is corrected: the numbering is stable and mostly reflects a reasonable build order **within** a block, but which slice ships first is a delivery decision, not something this file's ID order ever decided. `T-C1-01` is still the first ticket **of Block A**; it is not necessarily the first ticket built end to end. Where the order departs from the story sequence **within a block**, the reason is stated below that block, exactly as before.

## Delivery slices

Approved by the user, from the Product Owner's cut. Three vertical, end-to-end slices, each following one Incident from a requester's action to what an agent or the requester sees next — rather than the horizontal, layer-by-layer blocks below. Full cross-epic detail (including the `C10` side of each slice) is in `docs/backlog/C10/tickets/README.md`'s own **Delivery slices** section; this table is the `C1` half.

**Slice 1 superseded this pass — reduced to "register an Incident and see it," the urgent cut.** The user narrowed the goal to the smallest possible walking skeleton (no real auth, no design system, no i18n), and the Product Owner re-cut slice 1 accordingly. Slices 2 and 3 are unchanged.

| Slice | Story, in one line | `C1` tickets |
|---|---|---|
| **1** (superseded, new cut) | A requester registers an Incident **and sees it** | `T-C1-01`–`03`, `05`, `06`, `04` — **in that order**, not ID order: see the Order note below Block B (finding **H2**) — `07`, `08`, `09` (widened, see Block B note), `10` (narrowed, see Block B note), `99`, `100`, `101` (all three new, block O) |
| **2** (unchanged) | An agent triages and moves it | `T-C1-20`–`25`, `49`–`52` |
| **3** (unchanged) | It is resolved and the requester confirms | `T-C1-53`–`64` |

**This slice's `C1` total, recalculated from the files: 13 tickets · 30.5h** (was 31.0h after the first ADR-014 pass, 31.5h before it; `T-C1-04` dropped a further 0.5h this second pass — deciding the immutability mechanism removed exploratory scope, see the second-pass table above). Combined with the `C10` side (`docs/backlog/C10/tickets/README.md`), the whole slice is **40.0h**. `C10`'s own README stated a stale `41.0h` figure through both `C1` passes — **corrected in this pass** (see that document's own Delivery slices section) since the discrepancy was flagged, not fixed, by the previous pass. An earlier pass of this note double-counted `T-C10-72` (a seed migration nothing in this slice reads, since authentication is deferred and `Incident.reporter_user_id` is a soft reference with no foreign key) and reported 43.0h; that ticket moved back out of the slice — see `C10`'s README, block M.

**Four deviations the user has explicitly approved for this slice** — full detail in `C10`'s **Delivery slices** section, since two of the four are `C10`-owned (no real auth; the audit-subscriber window). The two that land on `C1` tickets directly:

1. **Design system deferred, accessibility is not.** `T-C1-10` and `T-C1-101` write hand-built semantic HTML meeting WCAG 2.1 AA without any `libs/incident/ui`/`libs/shared/ui` primitive. `T-C1-10`'s AC3 is left in place as a **known-pending criterion** — see its own note.
2. **i18n deferred to a per-feature constants file.** `T-C1-08`, `T-C1-10`, `T-C1-100` and `T-C1-101` source every user-facing string from one exported constants file per feature lib, never `nestjs-i18n`/Transloco yet — the user has explicitly accepted this as debt against `CLAUDE.md` §3.

**Everything else in this README ships after these three**, in whatever phase/block order the rest of this document already states — not orphaned, just later. That is most of the epic: the rest of blocks B and C, and all of blocks D through N.

## Reading a ticket

| Field | Meaning |
|---|---|
| `story` | The `US-C1-nn` it serves, or `—` for foundation work |
| `foundation` | `true` when no story backs it; the owning source is cited in its `## Context` |
| `layer` | DDD layer per `ARCHITECTURE.md` §5.3 |
| `platform` | `backend` / `frontend` / `shared` — stated for every ticket, and load-bearing where `agent` is `—` |
| `agent` | `backend-engineer`, `frontend-engineer`, or `—` for workspace scaffolding and E2E test code, which neither dev agent owns |
| `phase` | Copied verbatim from the story. Four values are in use: `disputed 0/1 (F6)`, `1 (MVP)`, `unphased (F9)`, `3 (§14.5)` |
| `blocked_by` | The finding that must be resolved before the ticket is real work |

**Phases are read, not derived.** Every `C1` story carries a `Phase:` field and it is copied verbatim. **The Phase 0/1 cut of finding F6 is not resolved here** — PRD §14.2 places `FR-INC-01/02/03` in Phase 0 while §14.3 places `FR-INC-01 → 13, 18` in the Phase 1 MVP, overlapping without stating the boundary. That is a Product Owner decision. `US-C1-01` → `US-C1-07`, and the foundation that must land with them, carry `disputed 0/1`.

## What this epic does **not** pay for

The epic map assigns shared scaffolding to exactly one epic. **`C10` owns all of it** and has already ticketed it at `T-C10-01` → `T-C10-17`: the Nx workspace, pnpm, the ESLint flat config with `@nx/enforce-module-boundaries`, Prettier, the three-axis tag scheme, the four applications, `libs/shared/{contracts,domain,ui,util}`, the in-house design system, and the PostgreSQL base schema with its TypeORM migration chain. **No ticket here rebuilds any of it.** What `C1` does own is the six `incident` libraries (`ARCHITECTURE.md` §5.1; epic map, *What actually remains*) and the context schema namespace and module wiring — block A.

## Context boundaries — the expensive mistake this epic could make

`C1` depends on nine epics and almost none of them exist. Every seam below delivers **only the Incident side**, declares the dependency in the ticket `## Context`, and implements none of the other half.

| Seam | Owned elsewhere | What `C1` delivers |
|---|---|---|
| SLA clock (`US-C1-17`) | `C7` — the clock arithmetic, targets and schedules | Pause/resume **signals** (`T-C1-57`) and the `apps/api` adapter that is the only object knowing both contexts (`T-C1-58`). **`incident` never imports `sla`** (`ARCHITECTURE.md` §8), proved by a lint probe in `T-C1-01`. |
| Configurable transitions (`US-C1-15`) | `C12` — the configuration mechanism; `C10` — the `StateModel` primitive | An instantiation of `StateModel` for Incidents (`T-C1-49`). **No workflow engine is built** (ADR-001). |
| Major Incident (`US-C1-20`) | `C13` — declaration, protocol, cadence, closure | The parent reference only (`T-C1-84`). **No `FR-MIM-*` ticket exists in this epic.** |
| Problem / Change / Release / CI (`US-C1-21`) | `C3`, `C4`, `C5`, `C6` — all Phase 2, none deployed | The typed reference and its explicit degradation (`T-C1-81`, `T-C1-85`). |
| Resolver Groups and escalation trigger (`US-C1-24/25/26`) | `C14` — groups and membership; `C7`/`C12` — raising the SLA threshold event (`FR-SLA-07`, `FR-WFL-05`) | Groups are **referenced, never defined**; `C1` executes the escalation **action** on receiving the event (`T-C1-78`). |
| Incident ↔ Service Request conversion (`US-C1-27`) | `C2` — the Service Request side | The Incident side only (`T-C1-93` → `T-C1-95`). The two must ship together; `FR-INC-14` is not satisfied by this epic alone. |
| Knowledge suggestions and deflection (`US-C1-29/30`) | `C9` — search, ranking, article model | A port call and the deflection recording (`T-C1-89`, `T-C1-91`). |
| Notifications and audit entries | `C16`, `C18` | `C1` **publishes** domain events post-commit; those epics record and deliver. No `C16` or `C18` ticket is written here. |

---

## Block A · Incident context foundation — 2 tickets · 4.5h · phase disputed 0/1 (F6)

Source: `ARCHITECTURE.md` §5.1 and §5.5; epic map § `C1`, *What actually remains*. Nothing story-derived compiles until this lands.

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C1-01](T-C1-01.md) | Scaffold the six `incident` libraries with their three-axis tags | — (foundation) | workspace scaffolding | — (shared) | 2.5h |
| [T-C1-02](T-C1-02.md) | `incident` schema namespace and the `IncidentModule` composition root | — (foundation) | infrastructure + app | backend-engineer | 2h |

**Phase note.** These two carry `disputed 0/1` rather than a phase of their own: foundation must land with whichever slice ships first, and that slice is the disputed one. They do not resolve **F6**; they inherit it.

---

## Block B · Base record and intake — 17 tickets · 46.0h · phase disputed 0/1 (F6)

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C1-03](T-C1-03.md) | `TicketReference` policy and the `nextReference()` repository port | US-C1-05 | domain | backend-engineer | 2h |
| [T-C1-04](T-C1-04.md) | Reference-number sequence, immutability trigger, adapter and concurrency proof | US-C1-05 | infrastructure | backend-engineer | 2h |
| [T-C1-05](T-C1-05.md) | `Incident` aggregate root and its creation invariants | US-C1-01 | domain | backend-engineer | 3h |
| [T-C1-06](T-C1-06.md) | TypeORM `Incident` entity, mapper, repository adapter and migration | US-C1-01 | infrastructure | backend-engineer | 3h |
| [T-C1-07](T-C1-07.md) | `LogIncidentUseCase` for a requester, reporter taken from the session | US-C1-01 | application | backend-engineer | 3h |
| [T-C1-08](T-C1-08.md) | Intake contracts and server-side rejection of priority-bearing fields | US-C1-01 | contracts + infrastructure | backend-engineer | 2.5h |
| [T-C1-09](T-C1-09.md) | `incident/data-access` — Incident API service and signal store | US-C1-01 | data-access | frontend-engineer | 2.5h |
| [T-C1-10](T-C1-10.md) | Requester intake form — plain language, mobile, WCAG 2.1 AA | US-C1-01 | feature + ui | frontend-engineer | 3h |
| [T-C1-11](T-C1-11.md) | `LogIncidentOnBehalfUseCase` — reporter, contact channel and acting actor | US-C1-02 | application + infrastructure | backend-engineer | 3h |
| [T-C1-12](T-C1-12.md) | Agent single-flow intake surface with no loss of typed data | US-C1-02 | feature | frontend-engineer | 3h |
| [T-C1-13](T-C1-13.md) | Reporter lookup with an explicit reporter-must-exist path | US-C1-02 | feature + data-access | frontend-engineer | 2.5h |
| [T-C1-14](T-C1-14.md) | `CompetitionSubject` value object over the twelve-value closed subject type | US-C1-03 | domain | backend-engineer | 2.5h |
| [T-C1-15](T-C1-15.md) | `CompetitionSubjectLookupPort`, SCMS anti-corruption adapter and free-text fallback | US-C1-03 | domain + infrastructure | backend-engineer | 3h |
| [T-C1-16](T-C1-16.md) | Competition subject picker with an explicit unresolved-reference mode | US-C1-03 | feature + ui | frontend-engineer | 2.5h |
| [T-C1-17](T-C1-17.md) | `Attachment` entity, `AttachmentStoragePort` and migration | US-C1-04 | domain + infrastructure | backend-engineer | 3h |
| [T-C1-18](T-C1-18.md) | Attachment upload use case: configured limits and visibility inheritance | US-C1-04 | application | backend-engineer | 3h |
| [T-C1-19](T-C1-19.md) | Attachment upload and list UI | US-C1-04 | feature + ui | frontend-engineer | 2.5h |

**Order note — `US-C1-05` before `US-C1-01`.** Reference numbering is built first even though it is the fifth story. `US-C1-05` requires the reference to be assigned **in the same transaction** as creation, so no Incident can ever exist without one; building intake first would create records that then need a retrofitted number and a data migration to give them one.

**Order note — finding H2, `T-C1-04` after `T-C1-06`, not before it.** This block's table lists `T-C1-03 → 04 → 05 → 06` because that is ID order, but `T-C1-04` no longer creates or touches any column on `incident_ticket` at all — since the first ADR-014 pass, `T-C1-06`'s own table-creating migration carries `reference` (ADR-014 forced the move: a table-creating migration that omitted it would leave rows with no reference). Building `T-C1-04` at its ID position would create a sequence for a column that does not exist yet. The real build order is **`03 → 05 → 06 → 04`**: the port (`03`), the aggregate (`05`), the Incident table with its `reference` column (`06`), then the sequence, the immutability trigger, the `nextReference()` adapter and the concurrency proof (`04`). No ticket file changes and no ID moves — the table above stays in ID order as an index; the corrected order is what **Delivery slices** (above) and any implementer must follow.

**Re-verified this second pass — `T-C1-06` writing a row before `T-C1-04`'s trigger exists is safe.** `DATA-MODEL.md` §8.5 now decided the immutability mechanism (a trigger, M18) and states it must exist "in the table-creating migration, or in a migration that runs before the first code path able to write a row." `T-C1-06`'s own round-trip acceptance criterion does write a row — but only through an `INSERT` and a `SELECT`, never an `UPDATE` of `reference`, so it never exercises the one thing the trigger guards against. The trigger only has to precede the first **production-reachable** write path, `T-C1-07`'s `LogIncidentUseCase`, which already sits after `T-C1-04` in this order. `CREATE TRIGGER … ON incident.incident_ticket` also cannot run before the table exists, which rules out the alternative of moving `T-C1-04` ahead of `T-C1-06` — that would be a circular dependency, not a reordering. The order stands as `03 → 05 → 06 → 04`, unchanged from the first pass; only the justification is restated more precisely. See `T-C1-04`'s and `T-C1-06`'s own `## Context` for the full reasoning.

**Blocked — F29.** `T-C1-10`, `T-C1-14` and `T-C1-16` carry `blocked_by: F29`. `FR-INC-01` is ambiguous about whether a requester may set the **structured** competition subject. This backlog reads it as *requesters supply free text, agents set the structured reference*. If the Product Owner confirms the opposite, the requester form, the picker placement and the permission on the subject write all change. Everything else in the block is unaffected.

**Two `C10` dependencies this block needs, both closed this pass, neither a `C1` file change.** `T-C1-07` already declared `EventPublisherPort` generically, but the only ticket that built the dispatcher behind it (`T-C10-55`) was, until now, written entirely against role-administration events — extracted to `C10`'s `T-C10-73`, generic over `DomainEvent`. Separately, this slice ships with **no authentication at all** (a later, stricter cut than the one that first closed this note — not even a fixed-user sign-in): `T-C1-07`'s `Actor` parameter is unchanged, but it is now supplied by `C10`'s disposable `T-C10-74`, a single class in the composition root, rather than resolved from a session that no longer exists in this slice. **No seeded row backs it in this slice** — `iam.iam_user` is not part of it, because with authentication deferred nothing ever reads that table (`Incident.reporter_user_id` is a soft reference, no foreign key). `T-C10-74` simply declares the fixed id itself for now; `C10`'s `T-C10-72` takes over that constant later, when it ships with the identity stack and a real row exists to match it.

**Widened / narrowed this pass — `T-C1-09` and `T-C1-10`, and where "see it" moved.** "See it" is now a separate capability (block O: `T-C1-99`, `100`, `101`), not part of this form. `T-C1-09` (+0.5h) gains the `GET /incidents/{reference}` call block O's use case needs. `T-C1-10` (−0.5h) drops the design-system composition it was never going to get in this slice, replaced by hand-built semantic HTML, and its final acceptance criterion changes from "the reference number is shown" to "the shell navigates to the detail route" — the echo-the-`POST` approach is explicitly rejected in favor of reading back what was actually persisted. See each ticket's own `## Context` for the full reasoning, including the two deviations the user accepted and the one criterion (`T-C1-10`'s `aria-live` citation) left deliberately pending.

---

## Block C · Categorization — 6 tickets · 15.5h · phase disputed 0/1 (F6)

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C1-20](T-C1-20.md) | Category → Subcategory → Item taxonomy aggregate | US-C1-06 | domain | backend-engineer | 2.5h |
| [T-C1-21](T-C1-21.md) | Taxonomy persistence, translatable labels, historical integrity and migration | US-C1-06 | infrastructure | backend-engineer | 3h |
| [T-C1-22](T-C1-22.md) | Taxonomy administration use cases and the in-use delete refusal | US-C1-06 | application | backend-engineer | 3h |
| [T-C1-23](T-C1-23.md) | Taxonomy administration screen | US-C1-06 | feature | frontend-engineer | 3h |
| [T-C1-24](T-C1-24.md) | Category picker on the intake and triage surfaces | US-C1-06 | ui + data-access | frontend-engineer | 2h |
| [T-C1-25](T-C1-25.md) | Categorization gate on exit from `New` | US-C1-07 | domain | backend-engineer | 2h |

**Order note — historical integrity ships with the schema.** `NFR-DAT-03` requires an Incident to keep the category identifier it was created with when a node is renamed. That is a persistence property — a reference to a stable identifier rather than a copied label — so it belongs to `T-C1-21` rather than to a later ticket that could only fix it by migration.

---

## Block D · Prioritization — 10 tickets · 26.5h · phase 1 (MVP)

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C1-26](T-C1-26.md) | Impact × Urgency matrix aggregate with the total-coverage invariant | US-C1-09 | domain | backend-engineer | 2.5h |
| [T-C1-27](T-C1-27.md) | Matrix persistence, configuration versioning, migration and fail-fast boot validation | US-C1-09 | infrastructure + app | backend-engineer | 3h |
| [T-C1-28](T-C1-28.md) | Matrix configuration screen | US-C1-09 | feature | frontend-engineer | 3h |
| [T-C1-29](T-C1-29.md) | `PriorityCalculator` domain service | US-C1-08 | domain | backend-engineer | 2.5h |
| [T-C1-30](T-C1-30.md) | Server-side derivation, the not-yet-derived state and `PriorityChanged` | US-C1-08 | domain + application + infrastructure | backend-engineer | 3.5h |
| [T-C1-31](T-C1-31.md) | Server-authoritative Priority in the web client | US-C1-08 | data-access + feature | frontend-engineer | 2h |
| [T-C1-32](T-C1-32.md) | Priority override domain rule: mandatory justification, derived value retained | US-C1-10 | domain | backend-engineer | 2.5h |
| [T-C1-33](T-C1-33.md) | `OverridePriorityUseCase`, permission gate, persistence and contracts | US-C1-10 | application + infrastructure | backend-engineer | 3h |
| [T-C1-34](T-C1-34.md) | Return to the derived value and the documented precedence rule | US-C1-10 | application | backend-engineer | 2h |
| [T-C1-35](T-C1-35.md) | Priority override UI with justification capture | US-C1-10 | feature + ui | frontend-engineer | 2.5h |

**Order note — `US-C1-09` before `US-C1-08`.** The matrix is configured before the derivation is written, reversing the story order. `US-C1-08` requires the derivation to fail fast when the matrix is missing or incomplete; writing the calculator first would mean writing it against a hardcoded matrix and then removing that matrix, which is the exact fallback `US-C1-09` forbids.

**Blocked — F30.** `T-C1-32` and `T-C1-34` carry `blocked_by: F30`. The override of `FR-INC-04` and the re-derivation of `FR-INC-05` can contradict each other and the PRD does not say which wins. The stories assume the override stands until an agent explicitly returns the Incident to the derived value. `T-C1-32` puts that rule in **one named predicate** so the decision is a one-line change, not a rewrite.

---

## Block E · Competition-in-progress flag — 13 tickets · 33.5h · phase 1 (MVP)

The signature behavior of the product. The epic map calls `C1` *the only epic that owns a domain-differentiating behavior* and names this one. `FR-INC-05` has five falsifiable properties and each has its own ticket: mandatory justification forced in the domain (`T-C1-39`), a configurable Impact uplift that **re-derives** Priority through the matrix and never writes a Priority (`T-C1-36`, `T-C1-40`), deterministic ceiling behavior (`T-C1-41`), set/change/clear audited with the causal chain in **one** event (`T-C1-42`, `T-C1-46`), and agent-only-never-automatic (`T-C1-43` → `T-C1-45`).

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C1-36](T-C1-36.md) | Configurable Impact uplift expressed against the Impact scale | US-C1-14 | domain | backend-engineer | 2h |
| [T-C1-37](T-C1-37.md) | Uplift persistence, version pinning, boot validation and audit event | US-C1-14 | infrastructure | backend-engineer | 2.5h |
| [T-C1-38](T-C1-38.md) | Uplift administration screen | US-C1-14 | feature | frontend-engineer | 2.5h |
| [T-C1-39](T-C1-39.md) | `CompetitionImpactFlag` value object with mandatory justification | US-C1-11 | domain | backend-engineer | 2.5h |
| [T-C1-40](T-C1-40.md) | The uplift raises assessed Impact and Priority is re-derived through the matrix | US-C1-11 | domain | backend-engineer | 2.5h |
| [T-C1-41](T-C1-41.md) | Deterministic behavior at the Impact-scale ceiling | US-C1-11 | domain | backend-engineer | 2h |
| [T-C1-42](T-C1-42.md) | One causal event carrying flag, justification, Impact and Priority transitions | US-C1-11 | domain + application | backend-engineer | 2.5h |
| [T-C1-43](T-C1-43.md) | `SetCompetitionInProgressFlagUseCase` — the only write path, agent-authorized | US-C1-12 | application + infrastructure | backend-engineer | 3.5h |
| [T-C1-44](T-C1-44.md) | Server-side rejection of the flag field on every requester-reachable path | US-C1-12 | contracts + infrastructure | backend-engineer | 2.5h |
| [T-C1-45](T-C1-45.md) | No automated write path exists — the system-actor refusal proof | US-C1-12 | domain + application | backend-engineer | 3h |
| [T-C1-46](T-C1-46.md) | Clearing the flag removes the uplift and re-derives Priority | US-C1-13 | domain + application | backend-engineer | 3h |
| [T-C1-47](T-C1-47.md) | Flag and Priority-override interaction rule, with its explicit test | US-C1-13 | domain | backend-engineer | 2h |
| [T-C1-48](T-C1-48.md) | Flag set, change and clear UI with justification and visible history | US-C1-13 | feature + ui | frontend-engineer | 3h |

**Order note — `US-C1-14` before `US-C1-11`.** The uplift is configured before the flag applies it. `US-C1-11` requires the assessed Impact to be raised **by the configured amount**; with no configuration the flag would be written against a constant and then rewritten, and the ceiling question of **F24** would not even be well-posed.

**`T-C1-45` is the most important ticket in the epic.** `US-C1-12` makes *never automatically* a falsifiable property rather than a comment: no automated code path writes the flag, the write is refused for a system actor, and a caller enumeration proves there is exactly one caller. `T-C1-78` — the SLA-threshold escalation, the one automated path in this epic that touches an Incident — is explicitly covered by that assertion.

**Blocked — F24 (`T-C1-41`) and F30 (`T-C1-47`).** The ceiling behavior is undefined at the top of the Impact scale: nobody has said whether the uplift clamps or the flag is refused. The ticket forbids a silent no-op and forces a deterministic typed outcome, but **does not choose** — that is a Product Owner decision. `T-C1-47` consumes the same disputed precedence predicate as block D.

---

## Block F · Lifecycle — 10 tickets · 28h · phase 1 (MVP)

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C1-49](T-C1-49.md) | Incident state model over the shared `StateModel` primitive | US-C1-15 | domain | backend-engineer | 3.5h |
| [T-C1-50](T-C1-50.md) | Transition-rule configuration: persistence, migration and hot reload | US-C1-15 | infrastructure | backend-engineer | 3.5h |
| [T-C1-51](T-C1-51.md) | `TransitionIncidentUseCase` with typed refusal and terminal-state protection | US-C1-15 | application | backend-engineer | 2.5h |
| [T-C1-52](T-C1-52.md) | Lifecycle actions on the agent Incident view | US-C1-15 | feature + ui | frontend-engineer | 3h |
| [T-C1-53](T-C1-53.md) | Resolution-code list: configurable, stable identifiers, translatable labels | US-C1-16 | domain + infrastructure | backend-engineer | 2.5h |
| [T-C1-54](T-C1-54.md) | `ResolveIncidentUseCase` gated on resolution code and notes | US-C1-16 | domain + application | backend-engineer | 2.5h |
| [T-C1-55](T-C1-55.md) | Re-resolution after a reopen, with the previous resolution retained | US-C1-16 | domain | backend-engineer | 2h |
| [T-C1-56](T-C1-56.md) | Resolution form with code selection and notes | US-C1-16 | feature + ui | frontend-engineer | 2.5h |
| [T-C1-57](T-C1-57.md) | Clock pause and resume signals, with per-state pause-behavior configuration | US-C1-17 | domain + application + infrastructure | backend-engineer | 3h |
| [T-C1-58](T-C1-58.md) | `SlaPolicyAdapter` pause/resume wiring and restart-safe accounting | US-C1-17 | app | backend-engineer | 3h |

**Boundary note — the `sla` seam.** `T-C1-57` publishes **signals only**; `T-C1-58` is the `apps/api` adapter, *the only object that knows both contexts* (`ARCHITECTURE.md` §8). The clock arithmetic, the support schedule and the target recalculation are `C7` and **are not written here**. `T-C1-01` includes a lint probe asserting that no `scope:incident` project can import `scope:sla`, so the boundary is enforced by the build rather than by review.

---

## Block G · Closure — 6 tickets · 15h · phase 1 (MVP)

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C1-59](T-C1-59.md) | Confirmation window opened at resolution through `ClockPort` | US-C1-18 | domain | backend-engineer | 2h |
| [T-C1-60](T-C1-60.md) | Confirm and reject use cases, with rejection marked as a reopen | US-C1-18 | application | backend-engineer | 3h |
| [T-C1-61](T-C1-61.md) | Requester-only authorization and the expired-window refusal | US-C1-18 | application | backend-engineer | 2.5h |
| [T-C1-62](T-C1-62.md) | Requester confirm / reject surface on the portal | US-C1-18 | feature + data-access | frontend-engineer | 2.5h |
| [T-C1-63](T-C1-63.md) | Auto-close rule, configurable period and system-actor attribution | US-C1-19 | application + infrastructure | backend-engineer | 3h |
| [T-C1-64](T-C1-64.md) | API-E2E: the auto-close boundary on a deterministic clock | US-C1-19 | e2e (`apps/api-e2e`) | — (backend) | 2h |

**Note — this block discharges a `C10` deferral.** `C10` finding **F15** recorded that `FR-IAM-03` could only be proved at predicate level there, because the records it filters belong to `C1` and `C2`. `T-C1-61` is the Incident-side end-to-end proof.

---

## Block H · Collaboration — 7 tickets · 18.5h · phase 1 (MVP)

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C1-65](T-C1-65.md) | `IncidentEntry`, `NoteVisibility` and the internal-by-default rule, with persistence | US-C1-22 | domain + infrastructure | backend-engineer | 3h |
| [T-C1-66](T-C1-66.md) | Add-entry use cases for agent and requester, with visibility authorization | US-C1-22 | application | backend-engineer | 3h |
| [T-C1-67](T-C1-67.md) | Internal work notes absent from every outbound payload | US-C1-22 | application + infrastructure | backend-engineer | 3h |
| [T-C1-68](T-C1-68.md) | Entry-type immutability after creation | US-C1-22 | domain | backend-engineer | 1.5h |
| [T-C1-69](T-C1-69.md) | Agent entry timeline with a visible public / internal distinction | US-C1-22 | feature + ui | frontend-engineer | 3h |
| [T-C1-70](T-C1-70.md) | Requester comment thread — mobile, WCAG 2.1 AA | US-C1-23 | feature + ui | frontend-engineer | 3h |
| [T-C1-71](T-C1-71.md) | API-E2E: a requester never receives an internal work note on any channel | US-C1-22 | e2e (`apps/api-e2e`) | — (backend) | 2h |

**Blocked — F27 (`T-C1-68`).** Nothing says whether an entry type can be changed after creation. Internal made public is a **disclosure**; public made internal is a **retraction** of something the requester may already have been notified about. The story recommends immutability with correction by a new entry; the ticket builds that recommendation in one place and names the finding, but the rule is the Product Owner call.

---

## Block I · Assignment and escalation — 7 tickets · 19.5h · phase 1 (MVP)

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C1-72](T-C1-72.md) | `ResolverAssignment` and the append-only assignment history | US-C1-24 | domain + infrastructure | backend-engineer | 3h |
| [T-C1-73](T-C1-73.md) | `ReassignIncidentUseCase`, the `IncidentAssigned` event and the assignment migration | US-C1-24 | application + domain + infrastructure | backend-engineer | 3.5h |
| [T-C1-74](T-C1-74.md) | Reassignment UI showing the full assignment path | US-C1-24 | feature + ui | frontend-engineer | 2.5h |
| [T-C1-75](T-C1-75.md) | Functional escalation as a distinct kind, with its permission gate | US-C1-25 | domain + application | backend-engineer | 3h |
| [T-C1-76](T-C1-76.md) | Escalated state visible in the agent work list | US-C1-25 | feature + ui | frontend-engineer | 2h |
| [T-C1-77](T-C1-77.md) | Hierarchical escalation to the management contact | US-C1-26 | domain + application | backend-engineer | 2.5h |
| [T-C1-78](T-C1-78.md) | SLA-threshold escalation as a system-actor action, idempotent per threshold | US-C1-26 | application | backend-engineer | 3h |

**Boundary note.** Resolver Groups and management contacts are `C14` / `C10` and are **referenced through a port bound at the composition root, never imported**. Raising the SLA threshold event is `FR-SLA-07` (`C7`) and `FR-WFL-05` (`C12`); `T-C1-78` only performs the **action** on receiving it — and is one of the automated paths `T-C1-45` asserts can never touch the competition flag.

**Corrected this second pass — the `assigned_*` migration moved from `T-C1-72` to `T-C1-73`.** `DATA-MODEL.md` §8.1 lists `incident_ticket.assigned_group_id`/`assigned_user_id`/`assigned_at` and `ck_incident_assessed_before_assignment` as columns and a check on `incident_ticket` itself, not on the append-only `incident_assignment_history` table `T-C1-72` migrates. ADR-014 rule 3 ("a column arrives with the first behavior that writes it") puts the migration with `T-C1-73`'s `ReassignIncidentUseCase`, the only writer — the same reasoning already used to place the assessment-columns migration on `T-C1-30` rather than `T-C1-27`'s matrix ticket, and the competition-flag migration on `T-C1-43` rather than a sibling block-E domain ticket. `T-C1-72` keeps its value object and its own history-table migration; `T-C1-73` now also carries a recorded 3h-cap exception, consistent with the other four.

---

## Block J · First Contact Resolution — 2 tickets · 5.5h · phase 1 (MVP)

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C1-79](T-C1-79.md) | FCR derived from assignment history and resolving tier | US-C1-32 | domain | backend-engineer | 2.5h |
| [T-C1-80](T-C1-80.md) | FCR recorded at resolution as a derived, non-settable fact, including the reopen rule | US-C1-32 | application + infrastructure | backend-engineer | 3h |

**Order note — FCR after block I, not at its story number.** `US-C1-32` is the last story but FCR is **derived from the assignment history** of `US-C1-24`. It cannot be built before `T-C1-72` exists, so it sits here rather than at the end of the epic.

**Blocked — F28.** `FR-INC-18` never defines *the first interaction*, so FCR has no testable definition. Both tickets deliver the two unambiguous conditions — no reassignment, resolved by L1 — and isolate the interaction boundary behind one predicate that returns an explicit **undefined** outcome rather than a guessed one. `FR-INC-18` cannot be claimed satisfied until the Product Owner settles it.

---

## Block K · Linking — 5 tickets · 13h · phase 1 (MVP)

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C1-81](T-C1-81.md) | `IncidentLink` — typed reference, direction and cycle prevention | US-C1-20 | domain | backend-engineer | 3h |
| [T-C1-82](T-C1-82.md) | Link persistence, migration and bidirectional read | US-C1-20 | infrastructure | backend-engineer | 2.5h |
| [T-C1-83](T-C1-83.md) | Link and unlink use cases with permission and audit events | US-C1-20 | application | backend-engineer | 2.5h |
| [T-C1-84](T-C1-84.md) | Parent Major Incident reference — Incident side only | US-C1-20 | domain + application | backend-engineer | 2h |
| [T-C1-85](T-C1-85.md) | Link surface with explicit degradation for undeployed target kinds | US-C1-21 | feature + ui | frontend-engineer | 3h |

**Boundary note — `C13` and the Phase 2 contexts.** `T-C1-84` stores the parent Major Incident reference and nothing else: declaration, protocol, cadence, propagation and closure gating are `FR-MIM-01` → `FR-MIM-06` and belong to `C13`. **No `FR-MIM-*` ticket exists in this epic.** `T-C1-85` degrades explicitly for Problem, Change, Release and Configuration Item targets, whose contexts (`C3`, `C4`, `C5`, `C6`) are Phase 2 and undeployed.

---

## Block L · Scope rule at intake — 3 tickets · 8.5h · phase unphased (F9)

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C1-86](T-C1-86.md) | Scope-detection rules as configuration data | US-C1-28 | domain + infrastructure | backend-engineer | 3h |
| [T-C1-87](T-C1-87.md) | Intake evaluation: reject or flag before the record is created, with the redirection recorded | US-C1-28 | application | backend-engineer | 3h |
| [T-C1-88](T-C1-88.md) | Redirect surface at intake with the offered path | US-C1-28 | feature + ui | frontend-engineer | 2.5h |

**Blocked — F25.** `FR-INC-15` says *reject **or** flag* without deciding, and never says where the detection rules live. This backlog assumes both are configuration; the assumption needs Product Owner confirmation, and hardcoding either would make the mitigation of risk **R1** unmaintainable.

**Sequence risk — F23, carried into the risk list below.** This block is the declared mitigation of the highest-rated product risk, and it is **unphased while the intake it protects is Phase 1**.

---

## Block M · Knowledge suggestions and deflection — 4 tickets · 11h · phase unphased (F9)

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C1-89](T-C1-89.md) | `KnowledgeSuggestionPort` and its degraded-availability contract | US-C1-29 | domain + infrastructure | backend-engineer | 2.5h |
| [T-C1-90](T-C1-90.md) | Suggestions at intake — keyboard-navigable, announced, non-blocking | US-C1-29 | feature + ui | frontend-engineer | 3h |
| [T-C1-91](T-C1-91.md) | `DeflectionRecord` — domain, persistence, minimal-data rule and the recording use case | US-C1-30 | domain + application + infrastructure | backend-engineer | 3h |
| [T-C1-92](T-C1-92.md) | Abandonment detection at intake and the suggestions-shown marker | US-C1-30 | feature + data-access | frontend-engineer | 2.5h |

**Boundary note.** Search, ranking and the article model are `C9`. `C1` calls a port and records the deflection; **no `C9` ticket is written here**, and the null adapter of `T-C1-89` keeps intake working while `C9` does not exist (`NFR-AVL-03`).

---

## Block N · Phase 3 — 6 tickets · 16h · phase 3 (§14.5)

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C1-93](T-C1-93.md) | Conversion domain rule: reference and history preserved, state-equivalence refusal | US-C1-27 | domain | backend-engineer | 3h |
| [T-C1-94](T-C1-94.md) | `ConvertIncidentUseCase` — Incident side only, with the conversion event | US-C1-27 | application | backend-engineer | 3h |
| [T-C1-95](T-C1-95.md) | Conversion action in the agent UI, with the `C2` dependency declared | US-C1-27 | feature + ui | frontend-engineer | 2h |
| [T-C1-96](T-C1-96.md) | Duplicate-detection query: same service and subject inside a configurable window | US-C1-31 | domain + infrastructure | backend-engineer | 3h |
| [T-C1-97](T-C1-97.md) | Detection as proposals: agent accept and dismiss recorded, dismissals not repeated | US-C1-31 | application | backend-engineer | 2.5h |
| [T-C1-98](T-C1-98.md) | Duplicate-proposal UI at logging and triage | US-C1-31 | feature + ui | frontend-engineer | 2.5h |

**Boundary note — `FR-INC-14` is not deliverable by this epic alone.** `US-C1-27` states that the Service Request side belongs to `C2` and *the two must ship together*. `T-C1-94` binds a refusing stub when `C2` is absent, so no operator can convert into nothing; the requirement stays unsatisfied until `C2` ships its half, and that must be reported at the epic review rather than quietly closed.

---

## Block O · See it — detail by reference — 3 tickets · 5h · phase disputed 0/1 (F6) — **delivery slice 1**

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C1-99](T-C1-99.md) | `GetIncidentByReference` use case and the repository's read method | US-C1-01 | domain + application | backend-engineer | 1.5h |
| [T-C1-100](T-C1-100.md) | `GET /incidents/{reference}` route and its response contract | US-C1-01 | contracts + infrastructure | backend-engineer | 1.5h |
| [T-C1-101](T-C1-101.md) | Incident detail component — plain HTML, reference-routed | US-C1-01 | feature + ui | frontend-engineer | 2h |

**New this pass — decision 4 of the minimal delivery-slice-1 cut.** "See it" is detail by reference, not an echo of the `POST` response: an echo shows what the requester typed, not what the server actually persisted, which proves nothing about the write path. Sequenced after `T-C1-05`/`T-C1-06` (the aggregate and its persistence, which this block extends with a read method) and reachable only by redirect from `T-C1-10`'s successful submission — there is no other route to this block yet. Numbered last for the usual reason: ticket IDs are stable and appended at the next free ID; it belongs, logically, immediately after `T-C1-06` inside block B.

**One dependency flagged, not resolved — see `T-C1-100`'s own `## Context`.** `T-C1-08` sources its exception-filter mapping from `T-C10-40`, which is not part of this delivery slice. `T-C1-100`'s `404` mapping needs *some* filter to exist. This is reported for the Product Owner / Architect, not decided here.

---

## Block P · Untriaged-period visibility — 1 ticket · 2.5h · phase 1 (MVP)

| # | Title | Story | Layer | Agent | Est. |
|---|---|---|---|---|---:|
| [T-C1-102](T-C1-102.md) | Untriaged-period configuration and the "overdue for triage" indicator | — (no story yet, `FR-INC-20`) | application + infrastructure | backend-engineer | 2.5h |

**New this pass — `FR-INC-19`/`FR-INC-20` (PRD §14.10).** `FR-INC-20` requires an Incident to become visibly overdue for triage past a configurable maximum period in `New`. Numbered last, at the next free ID, because ticket IDs are stable and appended — it belongs, logically, right after `T-C1-50` (block F), whose `state_category = 'new'` and `ix_incident_untriaged` it depends on. **Not foundation work** (`FR-INC-20` has a persona and observable behavior), but no `US-C1-nn` exists for it yet — `story: —` is a placeholder for a real gap, reported as a finding for `business-analyst` in the ticket's own `## Context` and in the test plan's Findings note, not an exemption. **Dependent on PRD assumption A11** (the production period value and default action on expiry) without inventing one: the ticket builds fail-fast configuration and the query mechanism only, the same pattern already used for the Priority matrix (`T-C1-27`) and auto-close (`T-C1-63`).

---

## Sequencing risks carried forward

Two findings are about **phasing**, not implementation. They block nothing, and they are recorded here because the sequence they imply is a Product Owner decision that this backlog cannot make.

| Finding | Risk to the sequence |
|---|---|
| **F23** | **The mitigation of the top product risk is unphased while the thing it protects ships in Phase 1.** `FR-INC-15` (block L) guards the intake surface against sport-operations demand; intake itself (block B) is Phase 1. If the scope rule arrives after intake, risk **R1** has already materialized — the demand is in the backlog and the precedent is set. `US-C1-28` is written to ship **with** intake. Recommendation to the Product Owner: phase `FR-INC-15` into Phase 1 alongside `FR-INC-01`. |
| **F26** | **Deflection recording is being phased apart from deflection measurement.** `FR-INC-16` requires recording at intake (block M), while §14.5 places `FR-KNW-06` deflection *measurement* in Phase 3 and the intake-facing `C9` articles in Phase 1. `T-C1-89`/`T-C1-90` (suggestions) and `T-C1-91`/`T-C1-92` (recording) are separate tickets under separate stories so the two halves can be phased independently. The Product Owner decides whether recording rides with Phase 1 suggestions or waits for Phase 3 measurement. |

---

## Totals

| Block | Tickets | Hours | Phase |
|---|--:|--:|---|
| A · Incident context foundation | 2 | 4.5 | disputed 0/1 |
| B · Base record and intake | 17 | 46.0 | disputed 0/1 |
| C · Categorization | 6 | 15.5 | disputed 0/1 |
| D · Prioritization | 10 | 26.5 | 1 (MVP) |
| E · Competition-in-progress flag | 13 | 33.5 | 1 (MVP) |
| F · Lifecycle | 10 | 28.0 | 1 (MVP) |
| G · Closure | 6 | 15.0 | 1 (MVP) |
| H · Collaboration | 7 | 18.5 | 1 (MVP) |
| I · Assignment and escalation | 7 | 19.5 | 1 (MVP) |
| J · First Contact Resolution | 2 | 5.5 | 1 (MVP) |
| K · Linking | 5 | 13.0 | 1 (MVP) |
| L · Scope rule at intake | 3 | 8.5 | unphased |
| M · Knowledge suggestions and deflection | 4 | 11.0 | unphased |
| N · Phase 3 | 6 | 16.0 | 3 (§14.5) |
| O · See it — detail by reference | 3 | 5.0 | disputed 0/1 |
| P · Untriaged-period visibility | 1 | 2.5 | 1 (MVP) |
| **Total** | **102** | **268.5** | |

**By phase.** disputed 0/1 (**F6**): 28 tickets · 71.0h · **the cut is not made here.** Phase 1 (MVP): 61 tickets · 162.0h. Unphased (**F9**): 7 tickets · 19.5h. Phase 3 (§14.5): 6 tickets · 16h.

**Tickets now at the 3h cap with a recorded exception (skill rule, not a sizing failure):** `T-C1-30`, `T-C1-43`, `T-C1-49`, `T-C1-50` and, new this second pass, `T-C1-73`, all at 3.5h — each bundles a migration with the one behavior that is its only writer, per the ADR-014 notes above; splitting any of them would leave a schema no code writes to yet, or a use case that cannot persist its own output.

**Foundation** (`story: —`): 2 tickets · 4.5h — the six `incident` libraries and the context schema/module wiring. Everything else is `C10`. (Block O's three tickets trace `US-C1-01` like the rest of block B — not foundation, even though added by the first ADR-014 pass. `T-C1-102`, new this second pass, also carries `story: —` but is likewise **not** foundation — see its own `## Context` and block P above.)

**Blocked:** 12 tickets — **F24** `T-C1-41` · **F25** `T-C1-86`, `T-C1-87` · **F27** `T-C1-68` · **F28** `T-C1-79`, `T-C1-80` · **F29** `T-C1-10`, `T-C1-14`, `T-C1-16` · **F30** `T-C1-32`, `T-C1-34`, `T-C1-47`. `T-C1-102`'s dependency on PRD assumption **A11** is not counted here: unlike these six findings, it blocks no *mechanism*, only the production configuration value — see block P.

**By agent:** `backend-engineer` 72 · `frontend-engineer` 27 · `—` 3. The three are the six-library scaffolding, which spans both platforms, and two API-E2E specs (`T-C1-64`, `T-C1-71`) — e2e-harness work on the backend platform (`apps/api-e2e`, `platform:backend`, `type:e2e`), which neither dev agent owns. `T-C1-102` (new this pass) is `backend-engineer`, folded into the 72.
