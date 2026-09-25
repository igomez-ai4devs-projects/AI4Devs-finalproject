# User Stories — C1 · Incident Management

> Source: `docs/backlog/epic-map.md` (generated 2026-09-06, HEAD `815672f`; repository HEAD at drill time `57b3837`) — **its C1 build-state column is stale as of this revision; not relied on, see below** · PRD §7.1, §14.10 (uncommitted working-tree revision, 2026-09-26) · `CLAUDE.md` §3 · `docs/product/ARCHITECTURE.md` §5
> Scope: **20** requirements remaining (`FR-INC-01` → `FR-INC-20`) · **34** stories · greenfield **30** · gap **4** · defect 0
> Requirements skipped as already built: none — no `FR-INC-*` is fully 🟢 Built end to end.
>
> **As-built changed since the epic map's stamp — `ReadTheCode()` is no longer a no-op.** The epic map (stamped `b129e03`, 2026-09-24) still records every `FR-INC-*` as 🔴 Not built. It is wrong as of this revision: commits `1d0a8b9` → `5e7dcc4` (2026-09-26) landed real, unit-tested code in `libs/incident/domain` — `Incident.log()` (the creation invariants), `OriginChannel` (the four-value closed set) and `IncidentReferencePolicy` (`INC` + 7 zero-padded digits, round-trip tested) — with no HTTP, no persistence adapter and no UI behind any of it. That makes **`FR-INC-01`, `FR-INC-02` and `FR-INC-04` `🟡 Partial`**, not `🔴`. `US-C1-01`, `US-C1-02`, `US-C1-05` and `US-C1-08` are reshaped to **gap** below, each with a **Today:** line naming exactly the domain-layer guarantee that already exists, so nobody re-derives it. Every other requirement in this epic has no code behind it and stays greenfield. Per this drill's instructions, `docs/backlog/epic-map.md`'s C1 counts are **not** relied on for this revision — the Product Owner is regenerating that map in parallel — and the disagreement above is reported (finding **F31**), not silently reconciled with it.
>
> **PRD delta this revision (§14.10, "Recorded decision — Incident intake and triage", ADR-014 reconciliation).** `FR-INC-01`'s "contact channel" is now the **origin channel** (decision D1): exactly four values — portal, email, in-app, agent-logged — with **no separate phone channel** (a phone or chat contact is agent-logged). The **affected service is optional at logging, mandatory to leave `New`** (D5). `FR-INC-04` now states plainly that an Incident with no assessed Impact or Urgency has **no Priority — never a default** — and that the governing Impact × Urgency matrix version is fixed at the Incident's **first derivation**, not at its creation (D4). Two requirements were appended at the end of the `FR-INC` series, both **Must**, both Phase 1: **`FR-INC-19`** (the triage gate — category, Impact, Urgency and affected service required to leave `New`; Impact and Urgency required to be assigned, D3) and **`FR-INC-20`** (no indefinite rest in `New`; value and default action on expiry are open, PRD assumption `A11`, D2). No `FR-INC-*` ID was renumbered, reused or retired. `US-C1-01`, `US-C1-02`, `US-C1-07`, `US-C1-08`, `US-C1-09`, `US-C1-15` and `US-C1-24` are updated in place for this delta; `US-C1-33` and `US-C1-34` are new, appended at the end of the series.

### Scope boundary

- **`FR-MIM-*` is not this epic.** PRD §7.1 contains a nested §7.1.1 "C13 — Major Incident Management". Those requirements are epic `C13` with their own key and their own drill. **No story here traces to an `FR-MIM-*`.** `US-C1-20` links an Incident to a parent Major Incident from the **Incident side only**; declaring, running and closing a Major Incident is `C13`.
- **`FR-INC-10`'s link targets are mostly not built and mostly not phase 1.** Problems belong to `C3`, Configuration Items to `C6`, Changes to `C4` and Releases to `C5` — all Phase 2. `US-C1-21` delivers the Incident-side typed reference and its graceful degradation; the target aggregates are those epics' cost. The epic map already marks this deferral as acceptable.
- **C1 owns the six `incident` libraries** (`domain`, `application`, `infrastructure`, `feature`, `ui`, `data-access`) and nothing else. Where a behavior needs another context, this file delivers the Incident-side half and says so: SLA pause/resume (`C7`), the configurable state model primitive (`C12`), Resolver Groups (`C14`), audit entries (`C18`), notifications (`C16`), knowledge search (`C9`), the origin channel (`C11`) and identity/visibility (`C10`).
- **`incident` never imports `sla`** (`ARCHITECTURE.md` §8): the adapter in `apps/api` is the only object that knows both. `US-C1-17` is written accordingly.

### Phase boundary — findings **F6** and **F9**

| Requirements | Stories | Phase per PRD §14 |
| --- | --- | --- |
| `FR-INC-01`, `FR-INC-02`, `FR-INC-03` | `US-C1-01` → `US-C1-07` | **Disputed.** §14.2 puts them in Phase 0 ("core ticket record and reference numbering, categorization taxonomy"); §14.3 puts `FR-INC-01 → 13` in the Phase 1 MVP. The two lists overlap without stating the cut — see **F6**. |
| `FR-INC-04` → `FR-INC-13`, `FR-INC-18` | `US-C1-08` → `US-C1-26`, `US-C1-32` | Phase 1 (MVP). |
| `FR-INC-14`, `FR-INC-17` | `US-C1-27`, `US-C1-31` | Phase 3 (§14.5). |
| `FR-INC-15`, `FR-INC-16` | `US-C1-28` → `US-C1-30` | **Unphased** — see **F9** and **F26**. |
| `FR-INC-19` | `US-C1-33` (new) | Phase 1 (MVP) — added to the PRD 2026-09-26, §14.10. |
| `FR-INC-20` | `US-C1-34` (new) | Phase 1 (MVP) — added to the PRD 2026-09-26, §14.10; mechanism only, value open (assumption `A11`). |

---

## US-C1-01 · A requester logs an Incident from the portal

- **Shape:** gap
- **Traces to:** `FR-INC-01` · Player / Competitor · epic `C1`
- **Phase:** disputed 0/1 (**F6**)
- **Today:** `libs/incident/domain`'s `Incident.log()` (`T-C1-05`, committed) already enforces the record's creation invariants as pure, unit-tested domain logic: reporter, **origin channel** (`OriginChannel.fromCode()`, exactly `portal` / `email` / `in_app` / `agent_logged`, no `phone` member — decision **D1**), short description (≤255 chars) and detailed description are mandatory and each raises its own typed error when missing; **the affected service is accepted as optional** (`affectedServiceId?: Identity`) and a `null` value is stored, not rejected — this already matches decision **D5** ("optional at logging") exactly, without needing to change. `loggedAtEpochMs`/`loggedBy` are populated from `ClockPort`/the acting actor, never `new Date()`. What is missing is everything a requester or an operator would actually touch: `libs/shared/contracts` DTOs and the `class-validator` `ValidationPipe` wiring that rejects priority-bearing fields (`T-C1-08`, not started), the `IncidentController` route, the `IncidentRepositoryPort` TypeORM adapter (`IncidentModule` in `apps/api` is registered empty, no provider bound), the requester-facing UI, attachments, and the structured affected competition subject/instance (`affectedSubject` is a typed `null` slot on the aggregate — no `CompetitionSubject` value object exists yet).

**As a** Player / Competitor **I want** to report a problem with SCMS in plain language **so that** I get help without needing to know how a service desk works.

### Acceptance criteria

**Given** an authenticated requester on the intake form
**When** they submit a report
**Then** an Incident is created capturing reporter, **origin channel** — the channel the Incident arrived through, not a preferred way of contacting the requester back (`FR-OMN-02`, decision D1) — short description, detailed description and, if the requester knows it, affected service; the reporter is taken from the authenticated session, never from a field the requester can type.

**Given** a requester who does not know which service is failing
**When** they submit without selecting one
**Then** creation succeeds with the affected service left unset (decision **D5**) — it becomes mandatory only when the Incident later tries to leave `New` (`US-C1-33`, `FR-INC-19`), never at intake.

**Given** the requester-facing intake form
**When** it is rendered
**Then** it exposes **no** priority-bearing field: no Impact, no Urgency, no Priority and no competition-in-progress flag, and the server rejects those fields if they are present in the request body regardless of what the client sent (`NFR-SEC-02`).

**Given** a requester with competition context to describe
**When** they fill the form
**Then** they may describe it in **free text**; the structured affected competition subject and instance of `US-C1-03` are assessment fields set by an agent, not by the requester.

**Given** the intake form
**When** a requester with no ITSM knowledge uses it
**Then** it uses plain language with no untranslated ITSM vocabulary (`NFR-USE-01`), is operable on a mobile device (`NFR-USE-04`), meets WCAG 2.1 AA, and every validation error states what happened and what to do next (`NFR-USE-05`).

**Given** a submission missing a mandatory field
**When** it is posted
**Then** it is rejected by a `class-validator` DTO declared in `libs/shared/contracts`, with field-level messages resolved through Transloco / `nestjs-i18n` — the domain-level typed errors of `Incident.log()` already exist for reporter, origin channel and both descriptions; this criterion is about the HTTP-facing DTO that has to reject the same cases before the aggregate is even reached.

---

## US-C1-02 · An agent logs a phone- or chat-reported Incident in one flow

- **Shape:** gap
- **Traces to:** `FR-INC-01` · Service Desk Agent (L1) · epic `C1`
- **Phase:** disputed 0/1 (**F6**)
- **Today:** the domain distinction this story depends on already exists and is deliberately documented for it: `Incident.log()`'s `LogIncidentCommand` keeps `reporterId` (who the Incident is *about*, `FR-OMN-04`) and `actor`/`loggedBy` (who performed the logging, `FR-OMN-02`) as two separate identities, and `incident.aggregate.spec.ts` has a dedicated test proving they stay distinct even when a caller passes the same value for both. **There is no separate `phone` origin channel to set** — decision **D1** confirms `agent_logged` is the correct value for a phone or chat contact, and `OriginChannel`'s closed set (`origin-channel.vo.ts`) already omits `phone` on exactly that reasoning, recorded in the file before the PRD decision existed. What is missing is the entire agent-facing surface: the one-continuous-flow UI, reporter lookup/creation, the agent intake contract and controller (distinct from `T-C1-08`'s requester contract, since an agent is permitted to set Impact/Urgency/the competition flag at logging), and the persistence adapter — none of which exist yet.

**As a** Service Desk Agent (L1) **I want** to log an Incident on behalf of a caller in a single uninterrupted flow **so that** I can keep talking to a referee mid-match instead of navigating between screens.

### Acceptance criteria

**Given** an agent logging on behalf of a caller reached by phone or chat
**When** they create the Incident
**Then** the reporter is the caller (not the agent), the **origin channel is `agent_logged`** — phone and chat are not separate channels (decision D1, `FR-OMN-02`) — and the acting agent is recorded separately (`loggedBy`) as the actor of the creation.

**Given** the agent intake surface
**When** it is used
**Then** reporter lookup, description, affected service, category, competition subject and the assessment fields are reachable in one continuous flow with no forced navigation away and no loss of typed data (`NFR-USE-02`).

**Given** an agent logging an Incident
**When** they fill the assessment fields
**Then** they may set Impact and Urgency and the competition-in-progress flag, because an agent — unlike a requester — holds the permission for priority-bearing fields.

**Given** a caller who is not yet a registered user
**When** the agent searches for the reporter
**Then** the flow states explicitly that a reporter must exist and offers the correct path, rather than silently creating an anonymous ticket (`NFR-SEC-01`).

---

## US-C1-03 · Affected competition subject and instance as structured references

- **Shape:** greenfield
- **Traces to:** `FR-INC-01` · Referee / Match Official · epic `C1`
- **Phase:** disputed 0/1 (**F6**)

**As a** Referee / Match Official **I want** the Incident to name exactly which fixture, result or standings entry is affected **so that** the agent assessing it can see it concerns live officiating rather than a general question.

### Acceptance criteria

**Given** the affected competition subject
**When** it is modelled
**Then** it is a closed set of exactly the twelve values named in `FR-INC-01` — Tournament, League, Group/Division, Bracket, Fixture/Match, Standings/Ranking, Registration, Roster, Team, Player Account, Schedule, Result — with stable identifiers and translatable labels, never free text.

**Given** an agent selecting the affected competition instance
**When** SCMS reference data is reachable
**Then** the instance is resolved through the `CompetitionSubjectLookupPort` anti-corruption layer and stored as a stable reference; SCMS vocabulary never leaks into the Incident model.

**Given** SCMS reference data is unreachable
**When** the agent needs to record the instance
**Then** the free-text fallback adapter is used and the Incident records that the reference is unresolved, so the ticket is never blocked by an unavailable external system (risk R10).

**Given** a competition subject on an Incident
**When** it is inspected
**Then** it is the **affected subject** of a support record and carries no in-application sport decision — a Fixture reference never implies the fixture can be rescheduled from here (see `US-C1-28`).

---

## US-C1-04 · Attachments on an Incident

- **Shape:** greenfield
- **Traces to:** `FR-INC-01` · Player / Competitor · epic `C1`
- **Phase:** disputed 0/1 (**F6**)

**As a** Player / Competitor **I want** to attach a screenshot of the error I hit **so that** the agent can see the failure instead of asking me to describe it.

### Acceptance criteria

**Given** a requester logging or commenting on their own Incident
**When** they attach one or more files
**Then** the attachments are stored against the Incident with original filename, content type, size and the uploading actor, and attachments are optional — an Incident without them is valid.

**Given** a file that exceeds the configured size limit or whose type is not on the configured allow-list
**When** it is uploaded
**Then** it is rejected before storage with a message stating the limit and the accepted types (`NFR-USE-05`); the limits come from validated configuration through `ConfigService`.

**Given** an attachment added to an internal work note
**When** a requester views the Incident
**Then** the attachment is not listed and not retrievable by direct reference, because work-note visibility governs it (`NFR-SEC-04`).

**Given** an attachment
**When** it is added or removed
**Then** the action is published as a domain event so it appears in the activity history like any other change.

---

## US-C1-05 · A unique, human-readable reference number

- **Shape:** gap
- **Traces to:** `FR-INC-02` · Service Desk Agent (L1) · epic `C1`
- **Phase:** disputed 0/1 (**F6**)
- **Today:** `IncidentReferencePolicy` (`libs/incident/domain`, `T-C1-03`) already renders and parses the documented shape — `INC` + seven zero-padded digits, prefix and numeric part in fixed positions, no ambiguous-when-spoken characters — with round-trip unit tests and no I/O. `IncidentRepositoryPort.nextReference(): Promise<TicketReference>` is declared as the port `Incident.log()` expects a reference from. What is missing is everything that makes the reference real: the `incident.incident_reference_seq` sequence and its migration, the TypeORM adapter implementing `nextReference()`, the database-level uniqueness guarantee, and the same-transaction assignment at creation that `NFR-DAT-01` depends on — today nothing calls this policy outside its own unit tests.

**As a** Service Desk Agent (L1) **I want** every Incident to carry a readable reference number from the moment it is created **so that** I can quote it to a caller on the phone and find it again later.

### Acceptance criteria

**Given** a new Incident
**When** it is created
**Then** it is assigned a human-readable reference number in the same transaction, so no Incident can ever exist without one.

**Given** two Incidents created concurrently
**When** both commit
**Then** their reference numbers differ; uniqueness is guaranteed by a database constraint, not by an application-level check that a race can defeat.

**Given** an existing reference number
**When** any operation attempts to change it, or the Incident is cancelled or deleted
**Then** the number is never modified and never re-issued to another Incident (`NFR-DAT-01`).

**Given** a reference number
**When** it is displayed
**Then** it is readable aloud without ambiguity and its format is stable across environments.

---

## US-C1-06 · A configurable Category → Subcategory → Item taxonomy

- **Shape:** greenfield
- **Traces to:** `FR-INC-03` · System Administrator · epic `C1`
- **Phase:** disputed 0/1 (**F6**)

**As a** System Administrator **I want** to maintain the categorization taxonomy as data **so that** the service desk can adapt its vocabulary without a code change or a release.

### Acceptance criteria

**Given** the taxonomy
**When** it is modelled
**Then** it is a persisted three-level structure — Category → Subcategory → Item — owned by the `incident` context, with stable identifiers and translatable labels, and no level hardcoded in the application.

**Given** an administrator editing the taxonomy
**When** they add, rename, deactivate or reorder a node
**Then** the change takes effect for new Incidents without a restart, and it is published as a domain event so it lands in the audit trail (`FR-AUD-05`).

**Given** a category that is renamed or deactivated
**When** existing Incidents referencing it are read
**Then** they keep the identifier they were created with and their historical reporting semantics are unchanged (`NFR-DAT-03`); a deactivated node stays valid on existing records but is not offered for new ones.

**Given** an administrator attempting to delete a node in use
**When** the operation executes
**Then** it is refused with a typed error naming the constraint, and deactivation is offered instead.

---

## US-C1-07 · Category is required before an Incident leaves `New`

- **Shape:** greenfield
- **Traces to:** `FR-INC-03` · Service Desk Agent (L1) · epic `C1`
- **Phase:** disputed 0/1 (**F6**)
- **Scope note (2026-09-26):** `FR-INC-19` (new, `§14.10`) adds two further conditions to this same exit-from-`New` gate — Impact/Urgency assessed and affected service recorded — explicitly "in addition to the category required by `FR-INC-03`," never restating it. Those two conditions, and the companion gate on assignment, are **`US-C1-33`**, not here: this story stays scoped to the category condition alone so `FR-INC-03`'s own text is not diluted by a requirement it does not carry. The two gates compose at the same `transitionTo()` call in the implementation (`T-C1-25` for this story, `T-C1-49` for `US-C1-33`'s half) — see finding **F32**.

**As a** Service Desk Agent (L1) **I want** the system to stop an uncategorized Incident from moving on **so that** every ticket carries the categorization the reporting and routing depend on.

### Acceptance criteria

**Given** an Incident in `New` with no category
**When** any transition out of `New` is attempted
**Then** the transition is refused with a typed domain error naming the missing category, and the state does not change.

**Given** an Incident in `New` with a category set to the Item level
**When** a transition out of `New` is attempted
**Then** the transition proceeds, subject to the other transition rules of `US-C1-15`.

**Given** the gate
**When** it is implemented
**Then** it lives in the `incident` domain or application layer and is unit-tested with no HTTP and no database, so it holds on every inbound path and not only in the UI.

**Given** an Incident created by a requester with no category
**When** it is submitted
**Then** creation succeeds — categorization is a triage responsibility, and the gate applies at exit from `New`, not at intake.

---

## US-C1-08 · Priority derived server-side from the Impact × Urgency matrix

- **Shape:** gap
- **Traces to:** `FR-INC-04` · Service Desk Agent (L1) · epic `C1`
- **Phase:** 1 (MVP)
- **Today:** `Incident.log()` already creates every Incident with `impact`, `urgency` and `priority` all `null`, and `incident.aggregate.spec.ts` (AC3) already asserts Priority "reads as explicitly not-yet-derived, not as a disguised default" — this is precisely the revised `FR-INC-04` wording ("the Incident has **no** Priority... MUST NOT substitute a default Priority"), built and tested before the PRD text was even reconciled. What is entirely missing is the derivation itself: no matrix exists, no derive-on-assessment logic, no matrix-version pinning, no override and no event publication — `impact`/`urgency`/`priority` are typed slots with no mutator that ever changes them.

**As a** Service Desk Agent (L1) **I want** Priority to be derived from the assessed Impact and Urgency **so that** prioritization is consistent between agents instead of being a personal judgement call.

### Acceptance criteria

**Given** an Incident with an assessed Impact and Urgency
**When** either value is set or changed
**Then** the server derives Priority from the configured Impact × Urgency matrix and persists it; the derivation is a pure function in the `incident` domain, unit-tested with no infrastructure.

**Given** the web client
**When** it displays Priority
**Then** it displays the value the server returned and derives nothing locally; a client that posts a Priority has it ignored, because authorization and derivation are enforced server-side (`NFR-SEC-02`).

**Given** an Incident whose Impact or Urgency is not yet assessed
**When** it is read
**Then** Priority is explicitly "not yet derived" — never defaulted to a middle value that could be mistaken for a real assessment — exactly as `Incident.log()` already guarantees at creation; this criterion only becomes non-trivial once a mutator exists that could otherwise be tempted to default it.

**Given** an Incident with no prior derivation
**When** its Impact and Urgency are both assessed for the first time
**Then** Priority is derived under the Impact × Urgency matrix version **in force at that moment** — not the version in force when the Incident was logged (decision **D4**) — and that version is recorded and pinned on the Incident for every later re-derivation, even after a newer version is published (`NFR-CFG-02`).

**Given** a Priority change from any cause
**When** it commits
**Then** the Incident publishes an event carrying the previous and new Priority and the reason for the derivation, which `C7` consumes to re-evaluate SLA targets (`FR-SLA-04`) and `C18` records.

---

## US-C1-09 · Configure the Impact × Urgency matrix

- **Shape:** greenfield
- **Traces to:** `FR-INC-04` · System Administrator · epic `C1`
- **Phase:** 1 (MVP)

**As a** System Administrator **I want** to configure which Impact × Urgency combination yields which Priority **so that** the prioritization policy can be tuned without a code change.

### Acceptance criteria

**Given** the matrix
**When** it is edited
**Then** every combination of the defined Impact and Urgency levels maps to exactly one Priority, and the configuration cannot be saved with a combination left unmapped.

**Given** a matrix change
**When** it commits
**Then** it applies to every Incident that has not yet had its first derivation, and is published as a domain event for the audit trail (`FR-AUD-05`); an Incident that has already derived a Priority keeps the matrix version in force at that **first derivation** (decision **D4**, corrected 2026-09-26 from "the version they were created under" — before the first derivation no matrix governs the record at all, so there is nothing yet for `NFR-CFG-02` to pin).

**Given** the matrix configuration screen
**When** it is used
**Then** it is built from the in-house design system with no third-party component library, is keyboard-operable and meets WCAG 2.1 AA.

**Given** the derivation
**When** the matrix is missing or incomplete at boot
**Then** the application fails fast with a configuration error rather than silently falling back to a default matrix.

---

## US-C1-10 · Agent override of the derived Priority, with mandatory justification

- **Shape:** greenfield
- **Traces to:** `FR-INC-04` · Service Desk Agent (L1) · epic `C1`
- **Phase:** 1 (MVP)

**As a** Service Desk Agent (L1) **I want** to override a derived Priority when the matrix gets it wrong, stating why **so that** exceptional cases are handled without the override becoming an unaccountable habit.

### Acceptance criteria

**Given** an authorized agent overriding the derived Priority
**When** they submit the override **without** a justification
**Then** it is refused with a typed domain error and the Priority is unchanged — the justification is mandatory, enforced in the domain, not by a required form field alone.

**Given** the same agent submitting an override **with** a justification
**When** it commits
**Then** the Priority becomes the overridden value, the derived value is retained alongside it so both are visible, and an event carrying actor, previous value, new value and the justification text is published for the audit trail.

**Given** a user without the prioritization permission
**When** they attempt an override by any path
**Then** it is denied with `403` by the use-case-level predicate and nothing changes.

**Given** an Incident with an overridden Priority
**When** its Impact or Urgency later changes
**Then** the system does not silently re-derive over the override: the override stands until an agent explicitly returns the Incident to the derived value, and that action is itself audited.

---

## US-C1-11 · Agent flags that the Incident affects a competition in progress

- **Shape:** greenfield
- **Traces to:** `FR-INC-05` · Service Desk Agent (L1) · epic `C1`
- **Phase:** 1 (MVP)
- **Open point carried from §14.10 (5):** the flag may be set at logging, before Impact has ever been assessed. How the uplift applies to an Impact that does not yet exist is **undecided** by the PRD — this story does not assume an answer (finding **F39**).

**As a** Service Desk Agent (L1) **I want** to flag, with a written justification, that an Incident is hitting a competition that is actually running **so that** live competition impact is deliberately assessed and reflected in Priority rather than argued case by case.

### Acceptance criteria

**Given** an agent setting the competition-in-progress flag at logging or at triage
**When** they submit it **without** a justification
**Then** it is refused with a typed domain error and the flag remains unset; the justification is mandatory in the domain model, not merely a required input.

**Given** an agent setting the flag **with** a justification
**When** it commits
**Then** the assessed Impact is raised by the configured amount and Priority is re-derived through the Impact × Urgency matrix of `US-C1-08` — the flag never writes a Priority directly.

**Given** an Incident whose Priority changes because of the flag
**When** the change commits
**Then** one event carries the flag change, the justification, the previous and new Impact and the previous and new Priority, so the causal chain is readable in the activity history rather than appearing as two unrelated changes.

**Given** an Incident whose assessed Impact is already at the top of the scale
**When** the flag is set
**Then** the behavior is the one decided for the ceiling case (see finding **F24**) and is deterministic — never a silent no-op that leaves the agent believing the escalation took effect.

**Given** the flag on an Incident
**When** it is read
**Then** the justification is stored with it and is visible to agents wherever the flag is displayed, so the assessment can be reviewed later.

---

## US-C1-12 · The flag is agent-only and never automatic

- **Shape:** greenfield
- **Traces to:** `FR-INC-05` · Service Owner / Service Manager · epic `C1`
- **Phase:** 1 (MVP)

**As a** Service Owner / Service Manager **I want** the competition-in-progress flag to be settable only by explicit agent action — never automatically, never by a requester **so that** the product's priority escalation stays a deliberate, accountable human judgement and cannot be claimed by whoever shouts loudest.

### Acceptance criteria

**Given** a requester submitting or updating an Incident
**When** the request body contains the competition-in-progress flag
**Then** the field is rejected server-side and the flag stays as it was; UI concealment is not the control (`NFR-SEC-02`), and this holds on every inbound path including the portal, the API and any future channel.

**Given** any automated source — a schedule or calendar, an SCMS fixture feed, a time-based workflow rule, an SLA threshold event or an imported record
**When** it is processed
**Then** it **cannot** set, change or clear the flag: no automated code path exists that writes it, and the write is reachable only from the agent-invoked use case with an actor holding the agent permission.

**Given** the flag write path
**When** it is unit-tested
**Then** a test asserts that invoking it with a system actor (the rule actor of `FR-AUD-02`) is refused, so "never automatically" is a falsifiable property and not a comment.

**Given** an agent who does not hold the flag permission
**When** they attempt to set it
**Then** it is denied with `403` and nothing changes.

---

## US-C1-13 · Changing and clearing the flag re-derives Priority

- **Shape:** greenfield
- **Traces to:** `FR-INC-05` · Service Desk Agent (L1) · epic `C1`
- **Phase:** 1 (MVP)

**As a** Service Desk Agent (L1) **I want** clearing the flag once the match is over to take the Impact uplift back off **so that** an Incident does not stay at an inflated Priority after the live window has passed.

### Acceptance criteria

**Given** an Incident with the flag set
**When** an agent clears it with a justification
**Then** the uplift is removed, Priority is re-derived from the underlying assessed Impact and Urgency, and the change is published with actor, justification, previous and new values.

**Given** an agent changing the justification without changing the flag state
**When** it commits
**Then** it is recorded as its own change in the activity history; every change to the flag or its justification is audited (`FR-INC-05`).

**Given** an Incident whose Priority was overridden per `US-C1-10`
**When** the flag is set or cleared
**Then** the interaction between override and re-derivation follows the single documented rule of `US-C1-10` and is exercised by an explicit test, so the two mechanisms cannot disagree.

**Given** a cleared flag
**When** the Incident is read later
**Then** the history still shows that it had been set, by whom, why and for how long — clearing removes the uplift, never the record.

---

## US-C1-14 · Configure the Impact uplift applied by the flag

- **Shape:** greenfield
- **Traces to:** `FR-INC-05` · System Administrator · epic `C1`
- **Phase:** 1 (MVP)

**As a** System Administrator **I want** the amount by which the flag raises assessed Impact to be configuration **so that** the escalation policy can be tuned as the service desk learns, without a release.

### Acceptance criteria

**Given** the uplift amount
**When** it is configured
**Then** it is persisted configuration with a documented default, expressed against the defined Impact scale rather than as an opaque number, and validated at boot.

**Given** a change to the uplift
**When** it commits
**Then** it applies to subsequent derivations, is audited (`FR-AUD-05`), and Incidents in flight keep the configuration version they were created under (`NFR-CFG-02`).

**Given** an uplift value that would be meaningless on the scale (zero, negative, or larger than the scale)
**When** an administrator tries to save it
**Then** it is refused with a message naming the valid range.

---

## US-C1-15 · The Incident lifecycle with configurable transitions

- **Shape:** greenfield
- **Traces to:** `FR-INC-06` · Service Desk Agent (L1) · epic `C1`
- **Phase:** 1 (MVP)
- **Scope note (2026-09-26):** the exit-from-`New` transition this story's state model exposes is where `US-C1-07` (category, `FR-INC-03`) and `US-C1-33` (Impact, Urgency and affected service, `FR-INC-19`) compose their own gates — this story owns the state model and the generic transition mechanism, not either gate's condition. `§14.10` open point 2 asks whether the exit to `Cancelled` is exempt from those gates; it is **undecided** and this story does not assume an answer (see finding **F36**).

**As a** Service Desk Agent (L1) **I want** the Incident to move through a defined lifecycle whose allowed transitions are configured **so that** the process is consistent and can be adjusted without a code change.

### Acceptance criteria

**Given** the Incident state model
**When** it is inspected
**Then** it defines exactly the states of `FR-INC-06`: `New`, `Assigned`, `In Progress`, `Pending` with the three distinguishable reasons (customer, third party, change), `Resolved`, `Closed` and `Cancelled`.

**Given** a transition that the configuration does not allow
**When** it is attempted
**Then** it is refused with a typed domain error naming the current state and the attempted target, and nothing changes.

**Given** the configured transitions
**When** they are changed by an administrator
**Then** the change takes effect without a restart and is audited; the model is realized through the `StateModel` primitive in `libs/shared/domain` rather than a workflow god-context (`C12`, ADR-001).

**Given** every state change
**When** it commits
**Then** the Incident publishes an event with actor, previous state and new state for the activity history (`FR-AUD-01`).

**Given** an Incident in a terminal state (`Closed`, `Cancelled`)
**When** any transition other than those the configuration explicitly permits is attempted
**Then** it is refused — reopening is a configured transition, never an implicit one.

---

## US-C1-16 · Resolution requires a resolution code and notes

- **Shape:** greenfield
- **Traces to:** `FR-INC-07` · Service Desk Agent (L1) · epic `C1`
- **Phase:** 1 (MVP)

**As a** Service Desk Agent (L1) **I want** to be stopped from resolving an Incident without saying how it was resolved **so that** the resolution data behind trend analysis and knowledge creation is actually there.

### Acceptance criteria

**Given** an Incident being transitioned to `Resolved`
**When** the resolution code or the resolution notes are missing or blank
**Then** the transition is refused with a typed domain error and the state does not change.

**Given** the resolution code
**When** it is offered
**Then** it comes from a configurable list with stable identifiers and translatable labels, not from free text.

**Given** a valid resolution code and notes
**When** the transition commits
**Then** the Incident enters `Resolved`, the resolution is recorded with its actor and timestamp, and the confirmation window of `US-C1-18` starts.

**Given** an Incident that is later reopened
**When** it is resolved again
**Then** a new resolution code and notes are required again; the previous resolution stays in the history.

---

## US-C1-17 · Pending states stop and resume the SLA clock

- **Shape:** greenfield
- **Traces to:** `FR-INC-08` · Service Desk Agent (L1) · epic `C1`
- **Phase:** 1 (MVP)
- **Open point carried from §14.10 (4):** which SLA policy (and therefore which response target) applies to a newly logged Incident before its first Priority derivation is **undecided** — `FR-SLA-01`/`FR-SLA-02` own the answer (`C7`), not this story; `US-C1-34`'s untriaged-period visibility is a separate measure and does not substitute for it (finding **F38**).

**As a** Service Desk Agent (L1) **I want** the resolution clock to stop while I am legitimately waiting on the customer or a third party **so that** the SLA measures the time the service desk actually controls.

### Acceptance criteria

**Given** an Incident entering a `Pending` state whose pause behavior is configured as clock-stopping
**When** the transition commits
**Then** the Incident publishes a pause signal carrying the state, the reason and the `ClockPort` timestamp — the `incident` context **never imports** `sla`; the adapter in `apps/api` is the only object that knows both (`ARCHITECTURE.md` §8).

**Given** an Incident leaving that `Pending` state
**When** the transition commits
**Then** it publishes a resume signal with the same shape, so the elapsed pause is derivable from persisted UTC timestamps rather than from an in-memory counter (ADR-009).

**Given** a `Pending` state configured as **not** clock-stopping
**When** the Incident enters it
**Then** no pause signal is published and the clock keeps running.

**Given** a process restart between pause and resume
**When** the Incident resumes
**Then** the pause is still correctly accounted for, because both endpoints are persisted events and not runtime state.

---

## US-C1-18 · The requester confirms or rejects the resolution

- **Shape:** greenfield
- **Traces to:** `FR-INC-09` · Player / Competitor · epic `C1`
- **Phase:** 1 (MVP)

**As a** Player / Competitor **I want** to say whether the fix actually worked **so that** a ticket is not closed on me while my problem is still there.

### Acceptance criteria

**Given** a `Resolved` Incident inside its confirmation period
**When** the requester confirms the resolution
**Then** the Incident moves to `Closed` and the confirmation is recorded with its actor and timestamp.

**Given** the same Incident inside the confirmation period
**When** the requester rejects the resolution
**Then** it returns to `In Progress`, the rejection reason is recorded, and the event is marked as a **reopen** so the Reopen Rate metric can count it.

**Given** a requester attempting to confirm or reject after the confirmation period has elapsed
**When** they submit
**Then** the action is refused with a message stating that the Incident is closed and what to do instead (`NFR-USE-05`) — never a silent failure.

**Given** a user who is not the requester of the Incident
**When** they attempt to confirm or reject
**Then** it is denied by the visibility and ownership predicate (`FR-IAM-03`), and the response does not reveal whether the Incident exists.

---

## US-C1-19 · Auto-close after the confirmation period

- **Shape:** greenfield
- **Traces to:** `FR-INC-09` · Service Owner / Service Manager · epic `C1`
- **Phase:** 1 (MVP)

**As a** Service Owner / Service Manager **I want** resolved Incidents to close themselves when nobody responds **so that** the backlog reflects real open work instead of accumulating tickets waiting on silence.

### Acceptance criteria

**Given** a configurable confirmation period
**When** the application boots
**Then** the value is read from validated configuration through `ConfigService` with a documented default, and boot fails fast if it is absent or not a positive duration.

**Given** a `Resolved` Incident whose confirmation period has elapsed with no requester response
**When** the time-based rule runs
**Then** the Incident transitions to `Closed`, the closure is attributed to the **system actor** and not to the last agent who touched it (`FR-AUD-02`), and the reason "auto-closed, no response" is recorded.

**Given** the elapsed-time evaluation
**When** it is performed
**Then** it uses `ClockPort` against persisted UTC timestamps, so a process restart neither closes early nor misses the window (ADR-009).

**Given** an Incident the requester rejected before the period elapsed
**When** the rule runs
**Then** it is not auto-closed, because it is no longer in `Resolved`.

---

## US-C1-20 · Link an Incident to other Incidents and to a parent Major Incident

- **Shape:** greenfield
- **Traces to:** `FR-INC-10` · Application Support Analyst (L2/L3) · epic `C1`
- **Phase:** 1 (MVP)

**As an** Application Support Analyst (L2/L3) **I want** to link related and duplicate Incidents, and to attach an Incident to its parent Major Incident **so that** one underlying failure is worked once instead of ten times in parallel.

### Acceptance criteria

**Given** two Incidents
**When** an agent links them as duplicate or related
**Then** the link is persisted with its type and is visible from **both** Incidents, and the link creation is published for the activity history.

**Given** an Incident linked as a duplicate of another
**When** the link is created
**Then** the direction is explicit — which is the duplicate and which is the original — and an Incident cannot be marked a duplicate of itself, nor can a duplicate chain form a cycle.

**Given** an Incident being attached to a parent Major Incident
**When** the link is created
**Then** the Incident stores the parent reference; declaring, coordinating and closing the Major Incident belongs to `C13` and is **out of scope here**.

**Given** an existing link
**When** an agent removes it
**Then** the removal requires the link permission, is audited, and the two records remain otherwise unchanged.

---

## US-C1-21 · Link to Problems, Changes, Releases and Configuration Items

- **Shape:** greenfield
- **Traces to:** `FR-INC-10` · Application Support Analyst (L2/L3) · epic `C1`
- **Phase:** 1 (MVP) for the Incident-side reference; the link targets are Phase 2

**As an** Application Support Analyst (L2/L3) **I want** an Incident to be able to point at the Problem, Change, Release or Configuration Item behind it **so that** the causal picture is captured when I find it, not months later when the CMDB finally exists.

### Acceptance criteria

**Given** the Incident aggregate
**When** its external links are modelled
**Then** a link is a typed reference — target kind plus target identifier — so adding Problem, Change, Release and CI targets needs no change to the Incident model when `C3`, `C4`, `C5` and `C6` arrive.

**Given** a link target kind whose owning context is not yet deployed
**When** an agent views the Incident
**Then** the link surface degrades explicitly: the target kind is either not offered, or shown as unavailable with a stated reason — never a broken link and never a silent empty section (`NFR-USE-05`).

**Given** a link to a record in another context
**When** it is created
**Then** the Incident stores only the reference; it does not import that context's domain library, and `@nx/enforce-module-boundaries` fails the build if it tries.

**Given** the deferral
**When** `C3`, `C4`, `C5` or `C6` ships
**Then** enabling its link kind is a configuration and adapter change on the Incident side, and the acceptance of the link's target-side behavior belongs to that epic.

---

## US-C1-22 · Public comments and internal work notes are distinct

- **Shape:** greenfield
- **Traces to:** `FR-INC-11` · Service Desk Agent (L1) · epic `C1`
- **Phase:** 1 (MVP)

**As a** Service Desk Agent (L1) **I want** to record internal diagnosis separately from what I tell the requester **so that** I can think out loud in the ticket without that text ever reaching the reporter.

### Acceptance criteria

**Given** an agent adding an entry to an Incident
**When** they choose the entry type
**Then** public comment and internal work note are two distinct types on the aggregate, chosen explicitly, and the default when the type is not stated is **internal** — the safe default is to withhold.

**Given** an internal work note
**When** the Incident is rendered, notified on, or exported through **any** channel
**Then** the note is absent from the payload, not hidden by the client (`NFR-SEC-04`); this is asserted by an explicit test for each channel.

**Given** an agent viewing the Incident
**When** entries are listed
**Then** public and internal entries are visually and semantically distinguishable at a glance, so an agent always knows what the requester can see.

**Given** an entry that has been added
**When** an agent tries to change its type from internal to public or the reverse
**Then** the behavior follows the single documented rule (see finding **F27**) rather than being silently permitted — text already sent to a requester cannot be unsent.

---

## US-C1-23 · The requester reads and adds public comments

- **Shape:** greenfield
- **Traces to:** `FR-INC-11` · Player / Competitor · epic `C1`
- **Phase:** 1 (MVP)

**As a** Player / Competitor **I want** to follow the conversation on my ticket and reply to it **so that** I can answer the agent's questions without opening a second ticket or sending an email.

### Acceptance criteria

**Given** a requester viewing their own Incident
**When** the entries are returned
**Then** only public comments are present in the response payload; internal work notes never cross the API boundary to a requester.

**Given** a requester adding a comment
**When** it commits
**Then** it is recorded as a public comment attributed to them, and it is published as an event so agents are notified (`C16`) and the activity history records it (`C18`).

**Given** a requester viewing an Incident they did not raise and hold no competition-scoped grant over
**When** they request it
**Then** access is denied by `FR-IAM-03` / `NFR-SEC-03`, indistinguishably from the Incident not existing.

**Given** a comment thread
**When** it is rendered on a mobile device
**Then** it is usable and accessible to WCAG 2.1 AA, since officials and organizers operate from venues (`NFR-USE-04`).

---

## US-C1-24 · Reassignment preserving full assignment history

- **Shape:** greenfield
- **Traces to:** `FR-INC-12` · Service Desk Agent (L1) · epic `C1`
- **Phase:** 1 (MVP)
- **Scope note (2026-09-26):** `FR-INC-19` (new, `§14.10`) additionally blocks **any** assignment path — manual, self-assignment (`FR-QUE-03`), this story's reassignment, or an automatic routing rule (`FR-WFL-02/03`) — until Impact and Urgency are assessed. That gate's condition and its own acceptance criteria are **`US-C1-33`**, not restated here; this story keeps its own scope to the mechanics of appending to and preserving assignment history. `§14.10` open point 3 asks whether placing an unassessed Incident in an intake/triage queue itself counts as "assignment" under that gate — **undecided** (finding **F37**).

**As a** Service Desk Agent (L1) **I want** to hand an Incident to the right Resolver Group or colleague without losing where it has been **so that** routing mistakes are visible and reassignment ping-pong can be measured.

### Acceptance criteria

**Given** an assigned Incident
**When** an agent reassigns it to another Resolver Group or to an individual agent
**Then** the current assignee changes and a new assignment record is appended; previous assignments are never overwritten or deleted.

**Given** an Incident whose Impact or Urgency has not yet been assessed
**When** any assignment operation is attempted — initial assignment, self-assignment or reassignment
**Then** it is refused per the gate of `US-C1-33` (`FR-INC-19`), naming the missing assessment, and no history entry is appended.

**Given** an Incident's assignment history
**When** it is read
**Then** it shows every assignment in order with the group or agent, the actor who made the change and the timestamp, so the full path is reconstructable.

**Given** a reassignment
**When** it commits
**Then** the Incident publishes an assignment event that `C16` consumes to notify and `C18` records; Resolver Groups themselves are owned by `C14` and are referenced, not defined, here.

**Given** an Incident that has been reassigned at least once
**When** First Contact Resolution is evaluated per `US-C1-32`
**Then** it does not qualify.

---

## US-C1-25 · Manual functional escalation to a higher support tier

- **Shape:** greenfield
- **Traces to:** `FR-INC-13` · Service Desk Agent (L1) · epic `C1`
- **Phase:** 1 (MVP)

**As a** Service Desk Agent (L1) **I want** to escalate an Incident to a higher support tier when it is beyond me **so that** the caller gets a specialist quickly instead of waiting on my next attempt.

### Acceptance criteria

**Given** an agent escalating functionally
**When** they submit the escalation
**Then** the Incident is routed to the target tier's Resolver Group, the escalation is recorded as its own event distinct from an ordinary reassignment, and the assignment history of `US-C1-24` captures the move.

**Given** an escalation
**When** it commits
**Then** it records the actor, the reason and the timestamp, and notifies the receiving group through `C16`.

**Given** the escalation action
**When** it is invoked by an actor without the escalation permission
**Then** it is denied with `403` by the use-case-level predicate.

**Given** an escalated Incident
**When** it is displayed in the agent work list
**Then** its escalated state is visible, so it is not lost among ordinary assignments.

---

## US-C1-26 · Hierarchical escalation, and automatic escalation on SLA thresholds

- **Shape:** greenfield
- **Traces to:** `FR-INC-13` · Service Owner / Service Manager · epic `C1`
- **Phase:** 1 (MVP)

**As a** Service Owner / Service Manager **I want** Incidents to escalate to management — by an agent's decision or automatically when an SLA threshold is crossed **so that** breaches are visible to the people accountable for them before the customer tells us.

### Acceptance criteria

**Given** an Incident
**When** an agent escalates hierarchically
**Then** the escalation targets the management contact rather than a support tier, is recorded as a distinct escalation kind from `US-C1-25`, and notifies through `C16`.

**Given** an SLA warning or breach event raised by `C7` / `C12`
**When** the Incident receives it
**Then** it performs the configured escalation as a system-actor action and records it with the triggering threshold — C1 owns the **escalation action**; raising the threshold event belongs to `FR-SLA-07` and `FR-WFL-05` and is not written here.

**Given** an automatic escalation
**When** it is recorded
**Then** its actor is the system rule, never a person (`FR-AUD-02`), so manual and automatic escalations are distinguishable in reporting.

**Given** repeated threshold events on the same Incident
**When** they arrive
**Then** the escalation is not duplicated for a threshold already escalated, so a retrying dispatcher cannot spam management.

---

## US-C1-27 · Convert a mis-classified record between Incident and Service Request

- **Shape:** greenfield
- **Traces to:** `FR-INC-14` · Service Desk Agent (L1) · epic `C1`
- **Phase:** **3** (§14.5)
- **Open point carried from §14.10 (2):** whether converting an Incident that has not cleared the `US-C1-07`/`US-C1-33` exit gate is itself exempt from those gates is **undecided** by the PRD — this story does not assume an answer (finding **F36**).

**As a** Service Desk Agent (L1) **I want** to convert a record that was logged as the wrong type **so that** a misfiled ticket is corrected without losing its reference number or its history.

### Acceptance criteria

**Given** an Incident that is really a Service Request
**When** an agent converts it
**Then** the original reference number is preserved (`NFR-DAT-01`), the full comment and activity history remains readable on the converted record, and no history entry is deleted or rewritten (`NFR-AUD-02`).

**Given** the conversion
**When** it commits
**Then** it is recorded as an explicit conversion event naming the source type, the target type, the actor and the reason, so the record's type change is itself part of the history.

**Given** a record in a state that has no meaningful equivalent in the target type
**When** conversion is attempted
**Then** it is refused with a typed error naming the reason, rather than landing the record in an undefined state.

**Given** the conversion
**When** it is implemented
**Then** the Service Request side belongs to `C2`; this story delivers only the Incident side of the exchange, and the two must ship together.

---

## US-C1-28 · Scope-rule enforcement at intake

- **Shape:** greenfield
- **Traces to:** `FR-INC-15` · Tournament Organizer / Admin · epic `C1`
- **Phase:** **unphased** (**F9**) — although it is the declared mitigation of risk R1

**As a** Tournament Organizer / Admin **I want** to be told, before I submit, that a reschedule or a result dispute is not handled here and shown where it *is* handled **so that** I get to the right place instead of waiting on a ticket that was never going to be actioned.

### Acceptance criteria

**Given** a submission describing an in-application sport decision — a reschedule, a roster change, a result dispute, a sanction
**When** the requester submits or the intake form evaluates the description
**Then** the system rejects or flags it and offers the correct path — a Knowledge Article or a Service Catalog item — **before** the record is created.

**Given** the detection rules
**When** they are inspected
**Then** they are configuration data rather than hardcoded strings, so the scope rule can be tuned as new demand patterns appear (see finding **F25**).

**Given** a submission that is flagged but is genuinely a platform defect
**When** the requester proceeds anyway
**Then** the configured behavior — hard reject or flag-and-allow — applies deterministically, and where submission is allowed the flag is recorded on the Incident so the false-positive rate is measurable.

**Given** a redirected submission
**When** the requester follows the offered path
**Then** the redirection is recorded, giving the Product Owner evidence of demand pressure against the scope rule (risk R1).

**Given** the rejection message
**When** it is shown
**Then** it says what happened and what to do next in the requester's language, with no ITSM jargon (`NFR-USE-01`, `NFR-USE-05`).

---

## US-C1-29 · Knowledge Article suggestions at intake

- **Shape:** greenfield
- **Traces to:** `FR-INC-16` · Player / Competitor · epic `C1`
- **Phase:** **unphased** (**F9**)

**As a** Player / Competitor **I want** to be shown articles that match what I am describing **so that** I can solve it myself now instead of waiting for an agent.

### Acceptance criteria

**Given** a requester typing a description and choosing a category
**When** the intake form requests suggestions
**Then** the Incident side calls the knowledge search through a port; the search itself, its ranking and the article model belong to `C9` and are not implemented here.

**Given** suggestions returned
**When** they are displayed
**Then** they are shown before submission, are keyboard-navigable and screen-reader-announced, and do not block the requester from continuing to submit.

**Given** the knowledge service is unavailable or returns nothing
**When** the form renders
**Then** intake continues normally with no suggestions and no error blocking submission — a degraded optional subsystem never prevents logging an Incident (`NFR-AVL-03`).

**Given** a suggestion the requester opens
**When** they return to the form
**Then** their entered data is preserved.

---

## US-C1-30 · Record deflection when a suggestion ends the submission

- **Shape:** greenfield
- **Traces to:** `FR-INC-16` · Service Owner / Service Manager · epic `C1`
- **Phase:** **unphased** (**F9**) — and see finding **F26**

**As a** Service Owner / Service Manager **I want** to know when a suggested article stopped a ticket from being raised **so that** the value of the Knowledge Base is measured rather than assumed.

### Acceptance criteria

**Given** a requester who opened a suggested article and then abandoned the submission
**When** the abandonment is detected
**Then** a deflection record is created naming the article, the category and the timestamp — no Incident is created, so the deflection is recorded independently of the Incident aggregate.

**Given** a requester who viewed a suggestion and submitted anyway
**When** the Incident is created
**Then** no deflection is recorded, and the fact that suggestions were shown is recorded on the Incident so precision can be evaluated.

**Given** a deflection record
**When** it is written
**Then** it carries no personal data beyond what support needs (`NFR-SEC-07`).

**Given** the deflection data
**When** it is reported on
**Then** the reporting surface belongs to `C17` / `C9`; this story delivers only the recording at intake.

---

## US-C1-31 · Duplicate and related Incident detection

- **Shape:** greenfield
- **Traces to:** `FR-INC-17` · Service Desk Agent (L1) · epic `C1`
- **Phase:** **3** (§14.5)

**As a** Service Desk Agent (L1) **I want** the system to propose Incidents that look like the one in front of me **so that** ten reports of one outage converge instead of being worked ten times.

### Acceptance criteria

**Given** an Incident being logged or triaged
**When** detection runs
**Then** it proposes existing Incidents sharing the same affected service **and** the same affected competition subject within the configurable time window.

**Given** the time window
**When** it is configured
**Then** it is validated configuration with a documented default, and it is applied against persisted UTC timestamps via `ClockPort`.

**Given** proposed duplicates
**When** they are shown
**Then** they are **proposals**: the agent decides, and no link is created automatically — accepting one creates the duplicate link of `US-C1-20`.

**Given** the agent's decision
**When** they accept or dismiss a proposal
**Then** it is recorded, so proposal precision is measurable and dismissals do not keep reappearing for the same pair.

---

## US-C1-32 · First Contact Resolution is recorded automatically

- **Shape:** greenfield
- **Traces to:** `FR-INC-18` · Service Owner / Service Manager · epic `C1`
- **Phase:** 1 (MVP)

**As a** Service Owner / Service Manager **I want** First Contact Resolution to be derived from what actually happened on the ticket **so that** the FCR metric cannot be inflated by an agent ticking a box.

### Acceptance criteria

**Given** an Incident resolved by an L1 agent within the first interaction with no reassignment
**When** it reaches `Resolved`
**Then** FCR is recorded on the Incident as a derived fact, computed by the system and not settable by an agent.

**Given** an Incident that was reassigned at any point, or resolved by a tier other than L1
**When** it reaches `Resolved`
**Then** FCR is **not** recorded, and the reason it did not qualify is derivable from the assignment history.

**Given** an Incident that qualified for FCR and is later reopened per `US-C1-18`
**When** it is resolved again
**Then** the FCR outcome follows the single documented rule for reopened Incidents and is exercised by an explicit test, so the metric cannot be quietly inflated by a reopen-and-reclose cycle.

**Given** "the first interaction"
**When** FCR is evaluated
**Then** it is evaluated against the definition settled per finding **F28** — the rule is stated once in the domain and unit-tested, never inferred differently by reporting.

---

> **Decision on `FR-INC-19` — own story, not an extension of `US-C1-07`/`US-C1-24` (2026-09-26).** `docs/backlog/C1/test-plan.md`'s own "Findings for `business-analyst`" section reads `FR-INC-19` as "a natural extension" of `US-C1-07` (category gate) and `US-C1-24` (reassignment), and notes the tickets (`T-C1-49`, `T-C1-51`, `T-C1-73`) already implement the requirement either way. This backlog decides **`FR-INC-19` gets its own story, `US-C1-33`**, for three reasons: (1) `FR-INC-19`'s own text is explicit that it is additive — "in addition to the category required by `FR-INC-03`" — never a restatement of `FR-INC-03` or of `FR-INC-12`'s reassignment-history concern, so folding it into either dilutes what that story's requirement actually says; (2) it is one coherent business rule (an unassessed Incident cannot be worked further) expressed as **two** gates on **two** different operations (a lifecycle transition and an assignment) — splitting its acceptance criteria across `US-C1-07` and `US-C1-24` would scatter one requirement's proof across two files with no single home; (3) it is a newly added **Must** requirement in its own right and deserves the same visibility any other Must requirement gets, rather than being an implicit rider on two stories about something else. `US-C1-07`, `US-C1-15` and `US-C1-24` are each annotated with a short cross-reference so a reader lands on `US-C1-33` for the gate's own acceptance criteria. See finding **F32** for the resulting ticket-reparenting action.

## US-C1-33 · The triage gate: Impact, Urgency and affected service must be known before an Incident leaves `New` or is assigned

- **Shape:** greenfield
- **Traces to:** `FR-INC-19` · Service Desk Agent (L1) · epic `C1`
- **Phase:** 1 (MVP) — new requirement, PRD 2026-09-26, §14.10

**As a** Service Desk Agent (L1) **I want** the system to refuse to move an Incident past `New`, or to hand it to anyone, until it has actually been triaged **so that** no ticket is worked, routed, escalated or reported on before its Priority is known — instead of an agent finding out three screens later that nobody ever assessed it.

### Acceptance criteria

**Given** an Incident in `New` with a category set but Impact or Urgency not yet assessed
**When** a transition out of `New` is attempted
**Then** it is refused with a typed domain error naming the missing assessment, and the state does not change — this composes with, and never replaces, the category gate of `US-C1-07`.

**Given** an Incident in `New` with a category and a full Impact/Urgency assessment (and therefore a derived Priority, `US-C1-08`) but no affected service recorded
**When** a transition out of `New` is attempted
**Then** it is refused with a typed domain error naming the missing affected service, and the state does not change.

**Given** an Incident in `New` with a category, a full Impact/Urgency assessment and an affected service
**When** a transition out of `New` is attempted
**Then** these two conditions permit it, subject to `US-C1-07`'s category gate and the rest of `US-C1-15`'s transition rules.

**Given** an Incident whose Impact or Urgency has not yet been assessed
**When** it is assigned to a Resolver Group or to an individual agent by **any** path — manual assignment, self-assignment (`FR-QUE-03`), reassignment (`US-C1-24`) or an automatic routing rule (`FR-WFL-02`/`FR-WFL-03`)
**Then** the assignment is refused with a typed domain error naming the missing assessment, and nothing is written to the assignment record or its history — note that the affected service is **not** part of this particular gate: it governs exit from `New` only, per `FR-INC-19`'s own text.

**Given** the lifecycle or routing configuration
**When** it is changed
**Then** it may add further conditions on top of these two gates, but may never remove either — `FR-INC-19`'s own wording ("configuration can add conditions, never remove these").

**Given** a rejected transition or assignment attempt from any inbound path
**When** the actor reads the response
**Then** it names exactly which mandatory element is missing, distinguishably from every other refusal reason on the same operation.

---

## US-C1-34 · An Incident overdue for triage becomes visible to the Service Desk

- **Shape:** greenfield
- **Traces to:** `FR-INC-20` · Service Desk Agent (L1) · epic `C1`
- **Phase:** 1 (MVP) — new requirement, PRD 2026-09-26, §14.10; depends on PRD assumption `A11`

**As a** Service Desk Agent (L1) **I want** an Incident that has sat in `New` with no category past a configured maximum period to show up as overdue for triage **so that** a ticket is never simply forgotten before anyone has even looked at it.

### Acceptance criteria

**Given** a configurable maximum untriaged period
**When** the application boots
**Then** the value is read from validated configuration through `ConfigService` with **no in-code default**, and boot fails fast naming the missing key if it is absent, zero, negative or not a duration — the production value itself is an open point the business has not set (PRD assumption `A11`); this story does not invent one.

**Given** an Incident in `New` with no category, older than the configured period
**When** the overdue condition is evaluated
**Then** it is reported as overdue for triage.

**Given** an Incident in `New` with no category, within the configured period
**When** the overdue condition is evaluated
**Then** it is not reported as overdue.

**Given** an Incident that has left `New`, or one that already has a category
**When** the overdue condition is evaluated
**Then** it is never reported as overdue, regardless of its age — no persisted "overdue" flag exists to go stale if the configured period later changes; the condition is evaluated live.

**Given** an Incident that becomes overdue
**When** the `FR-WFL-05` scheduled-rule mechanism (owned by `C12`) evaluates it
**Then** it receives the trigger condition this story exposes; what happens beyond visibility — a reminder, or a functional or hierarchical escalation under `US-C1-25`/`US-C1-26` — is configured through that mechanism and is **not** decided by this story (PRD assumption `A11` leaves the default action on expiry open, as well as the period's value).

---

## Findings

Observations raised while writing these stories. **F6** and **F9** are carried over from `docs/backlog/epic-map.md`; the rest are new.

| ID | Source | Finding | Effect on this backlog |
| --- | --- | --- | --- |
| **F6** | Epic map (carried) | **This epic is not phase-atomic.** PRD §14.2 places `FR-INC-01/02/03` — core ticket record, reference numbering, categorization taxonomy — in Phase 0, while §14.3 lists `FR-INC-01 → 13, 18` in the Phase 1 MVP. The two lists overlap and neither states where the boundary falls. | Marked, not resolved. `US-C1-01` → `US-C1-07` are the disputed slice and carry **Phase: disputed 0/1**. The Product Owner must settle the cut before these are ticketed, or the Phase 0 stories will be written twice. |
| **F9** | Epic map (carried) | **`FR-INC-15` and `FR-INC-16` are assigned to no phase in §14**, even though `FR-INC-15` is the declared mitigation for risk **R1** (scope creep into sport operations, rated High × High). | `US-C1-28` → `US-C1-30` carry **Phase: unphased**. See **F23** for why `FR-INC-15` in particular cannot be left late. |
| **F23** | New | **The mitigation of the product's top risk is unphased while the thing it protects ships in Phase 1.** `FR-INC-15` guards the intake surface against sport-operations demand; intake itself is Phase 1. If the scope rule arrives after intake, R1 has already materialized — the demand is in the backlog and the precedent is set. | `US-C1-28` is written to ship **with** intake, not after it. Recommend the Product Owner phase `FR-INC-15` into Phase 1 alongside `FR-INC-01`; this backlog cannot make that call. |
| **F24** | New | **`FR-INC-05`'s "raise the assessed Impact by a configurable amount" is undefined at the ceiling.** Impact is an ordinal scale (`ImpactLevel` in the shared kernel), so "an amount" presumably means levels — and the requirement says nothing about what happens when the Incident is already at the top of the scale. | `US-C1-11` requires the ceiling behavior to be deterministic and explicitly forbids a silent no-op, but **does not choose** between clamping at the ceiling and refusing the flag. This needs a Product Owner decision; it is the difference between the flag always being meaningful and it sometimes doing nothing. |
| **F25** | New | **`FR-INC-15` does not say whether the scope rules are configurable, nor whether detection rejects or merely flags.** The requirement reads "MUST reject **or** flag", leaving the choice open, and says nothing about where the patterns live. | `US-C1-28` assumes the rules are **configuration data** (consistent with "configuration as data", `ARCHITECTURE.md` §9) and that reject-versus-flag is itself configured. Both are **assumptions of this backlog needing confirmation**; hardcoding either would make the R1 mitigation unmaintainable. |
| **F26** | New | **`FR-INC-16` conflicts with the phasing of the capability it depends on.** It requires the system to record deflection, but §14.5 places "deflection measurement" (`FR-KNW-06`) in Phase 3 while `C9`'s intake-facing articles (`FR-KNW-01 → 05, 08`) are Phase 1. Recording deflection at intake and measuring deflection are being phased apart. | `US-C1-29` (suggestions) and `US-C1-30` (deflection recording) are deliberately separate stories so they can be phased independently. The Product Owner must decide whether `FR-INC-16`'s recording half rides with Phase 1 suggestions or waits for Phase 3 measurement. |
| **F27** | New | **Nothing says whether a comment's visibility type can be changed after the fact.** `FR-INC-11` defines public comments and internal work notes as distinct entry types but is silent on reclassification — which matters because an internal note made public is a disclosure, and a public comment made internal is a retraction of something the requester has already seen and possibly been notified about. | `US-C1-22` requires a single documented rule and forbids silent permission. Recommended default is that the type is immutable after creation and a correction is a new entry, consistent with `NFR-AUD-02` — **needs Product Owner confirmation**. |
| **F28** | New | **`FR-INC-18` does not define "the first interaction".** FCR requires resolution "by L1 within the first interaction without reassignment", but whether a public comment, a callback, a requester reply or an elapsed period ends the first interaction is unstated — and the metric is one of the MVP's stated acceptance outputs. | `US-C1-32` derives FCR from assignment history and resolving tier, which are unambiguous, and defers the interaction boundary to a rule that must be settled and stated once in the domain. Until it is, FCR is not implementable to a testable definition. |
| **F29** | New | **`FR-INC-01`'s treatment of the structured competition subject is ambiguous.** The same requirement lists affected competition subject and instance among the fields captured at logging by "a requester **or** an agent", then forbids the requester from setting priority-bearing fields — and the competition subject is precisely what the `FR-INC-05` assessment turns on. | This backlog reads it as: **requesters supply free text; agents set the structured subject and instance.** `US-C1-01` and `US-C1-03` are written to that reading. If the intent was that requesters pick a structured subject, `US-C1-01`'s form and `US-C1-03`'s permissions change — **needs Product Owner confirmation.** |
| **F30** | New | **`FR-INC-04`'s override and `FR-INC-05`'s re-derivation can contradict each other.** If an agent overrides Priority and the competition-in-progress flag is then set or cleared, the requirement set does not say whether re-derivation wins or the override stands. | `US-C1-10` and `US-C1-13` both require a **single documented rule** exercised by an explicit test, and assume the override stands until an agent explicitly returns the Incident to the derived value. Stated as an assumption; two independently reasonable implementations exist and they produce different P1 counts. |
| **F31** | New (2026-09-26) | **`docs/backlog/epic-map.md`'s C1 build-state column disagrees with the code.** The map (stamped `b129e03`, 2026-09-24) records every `FR-INC-*` as 🔴 Not built. Reading `libs/incident/domain` at HEAD shows `FR-INC-01`, `FR-INC-02` and `FR-INC-04` are `🟡 Partial`: `Incident.log()`, `OriginChannel` and `IncidentReferencePolicy` are real, unit-tested domain code (commits `1d0a8b9` → `5e7dcc4`, 2026-09-26), landed after the map's stamp. | Reported per `ReadTheCode()`, not silently reconciled. `US-C1-01`, `US-C1-02`, `US-C1-05` and `US-C1-08` are reshaped to **gap** in this revision on that basis. This backlog does **not** edit `epic-map.md`; the Product Owner's parallel regeneration should pick this up, and this file's per-story build-state notes should be treated as more current than the map's C1 row until it is re-stamped. |
| **F32** | New (2026-09-26) | **`FR-INC-19`'s tickets are already parented to `US-C1-15` and `US-C1-24`, not to the new `US-C1-33` this document creates for it.** `T-C1-49`, `T-C1-50` and `T-C1-51` (the exit-from-`New` half) carry `story: US-C1-15`; `T-C1-73` (the assignment half) carries `story: US-C1-24`. This backlog gives `FR-INC-19` its own story (`US-C1-33`) because it is a distinct, newly added Must requirement spanning two operations, not a restatement of either `FR-INC-06` or `FR-INC-12` — see the "Decision on `FR-INC-19`" note above the Findings table for the full reasoning. | **Action for `architect-tech-lead`:** reparent `T-C1-49`, `T-C1-50`, `T-C1-51` and `T-C1-73`'s `story:` front-matter field to `US-C1-33` for the acceptance criteria that implement `FR-INC-19`'s conditions specifically (they may keep a secondary reference to `US-C1-15`/`US-C1-24` for the `FR-INC-06`/`FR-INC-12` behavior the same ticket also carries). `T-C1-102` (`story: —`) should be reparented to the new `US-C1-34` (`FR-INC-20`). No ticket is renumbered. |
| **F33** | New (2026-09-26) — **Resolved** | **The "contact channel" naming question the domain code itself raised is now closed.** `libs/incident/domain/src/lib/origin-channel.vo.ts` and `T-C1-05`'s own reported deviation asked the Product Owner to confirm or correct the term, since neither the PRD nor `DATA-MODEL.md` defined "contact channel" and the code adopted `origin_channel` as the closest documented fact. | **Closed by PRD 2026-09-26, §14.10 decision D1:** the field is the **origin channel** — how the Incident arrived, not a preferred way of contacting the requester back — with exactly four values (portal, email, in-app, agent-logged) and no separate `phone` value; a phone or chat contact is `agent_logged`. `US-C1-01` and `US-C1-02` are updated to this term. No code or ticket change is made by this document; recorded here so the resolution is traceable from the backlog side too. |
| **F34** | New (2026-09-26) — **Resolved** | **What exactly gates an Incident's exit from `New`, and its assignment, was previously answered only by `FR-INC-03` (category) — leaving Impact/Urgency/service and the assignment path fully open.** | **Closed by PRD 2026-09-26, §14.10, new `FR-INC-19` (decision D3, D5):** category (`FR-INC-03`, `US-C1-07`) plus Impact, Urgency and affected service (`FR-INC-19`, `US-C1-33`) gate exit from `New`; Impact and Urgency alone gate assignment by any path. `US-C1-33` is authored to this text. |
| **F35** | §14.10 open point 1 (not decided by this backlog) | **The untriaged period's value and its default action on expiry are open** (PRD assumption `A11`: "the service organization will set the maximum untriaged period... This PRD deliberately states no value"). | `US-C1-34` builds the mechanism (configuration key, fail-fast boot, overdue evaluation, trigger exposure to `FR-WFL-05`) with no invented default and no invented default action, consistent with `CLAUDE.md`'s instruction not to invent timelines. Awaits the service organization's decision. |
| **F36** | §14.10 open point 2 (not decided by this backlog) | **Whether cancelling an Incident (`US-C1-15`'s `Cancelled` transition) or converting it (`US-C1-27`, `FR-INC-14`) is exempt from the `US-C1-07`/`US-C1-33` exit gate is undecided.** As written, `FR-INC-03` and `FR-INC-19` gate **every** exit from `New`, including these two. | `US-C1-15` and `US-C1-27` are both annotated with this open point rather than assuming an exemption either way. Needs a Product Owner decision before either transition's gate behavior is ticketed. |
| **F37** | §14.10 open point 3 (not decided by this backlog) | **Whether placing an unassessed Incident into an intake or triage queue counts as "assignment" under `FR-INC-19`'s assignment gate is undecided.** `FR-WFL-03` maps category/subject/channel to a Resolver Group or **queue**; if queue placement is "assignment," an intake rule can never route an unassessed Incident anywhere, including to a triage queue meant to hold it. | `US-C1-33` and `US-C1-24` are annotated with this open point. This is a real implementation fork: one reading makes intake routing impossible before triage, the other makes the gate meaningless for queue-based routing. Needs a Product Owner decision. |
| **F38** | §14.10 open point 4 (not decided by this backlog) | **Which SLA policy — and therefore which response target — applies to a newly logged Incident before its first Priority derivation is undecided.** `FR-SLA-02` attaches exactly one policy at creation, but `FR-INC-04` gives a new Incident no Priority to attach one by. | Cross-epic: the decision belongs to `C7` (`FR-SLA-01`/`FR-SLA-02`), not to this backlog. `US-C1-17` is annotated so the gap is not silently assumed away when `C7` is drilled. `US-C1-34`'s untriaged-period visibility is a different measure and does not answer this. |
| **F39** | §14.10 open point 5 (not decided by this backlog) | **How the competition-in-progress flag's Impact uplift applies when it is set at logging, before Impact has ever been assessed, is undecided.** `FR-INC-05` permits the flag at logging; `FR-INC-04` says a not-yet-assessed Incident has no Impact for an uplift to raise. | `US-C1-11` is annotated with this open point. It interacts with **F24** (the uplift's undefined behavior at the ceiling of the Impact scale): both need a Product Owner decision before `FR-INC-05`'s logging-time path can be ticketed with confidence. |
