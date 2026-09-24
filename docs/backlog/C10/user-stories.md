# User Stories — C10 · Identity & Access Management

> Source: `docs/backlog/epic-map.md` (generated 2026-09-06, HEAD `815672f`; repository HEAD at drill time `57b3837`, epic map unchanged since the stamp) · PRD §7.10, §4, §14.2–§14.8 · `CLAUDE.md` §3 · `docs/product/ARCHITECTURE.md` §5, §9
> Scope: 8 requirements remaining · 16 stories · greenfield 16 · gap 0 · defect 0
> Requirements skipped as already built: none — every `FR-IAM-*` is 🔴 Not built (confirmed at this revision: no `identity-access` library, no auth module and no session code exist anywhere in `apps/` or `libs/`), so the epic map's build-state invariant (`remaining == total`) holds and no requirement is discarded.
> `ReadTheCode()` was a no-op: the workspace still contains no `identity-access` code. No story carries a **Today:** line, because that field belongs exclusively to gap and defect stories.
>
> **Revision note (this pass).** The Product Owner resolved a previously open behavior question in the PRD: §14.8 ("Recorded decision: session security posture") now normatively adopts **device-bounded session termination** and expressly **prohibits** any downstream artifact from requiring per-request validation against a central session record, or a stored registry of live sessions updated on every request. `FR-IAM-06` was rewritten to add "prove identity again **at the moment of the action**" before any privileged administrative action, and a new requirement, `FR-IAM-08` (sign-out, M, Phase 1), was added. This revision updates `US-C10-03`, `US-C10-14` and `US-C10-15` to match, annotates the now-resolved phasing on `US-C10-09`, `US-C10-10`, `US-C10-14`, `US-C10-15` and `US-C10-16`, and closes the C10 portion of finding **F9**. No story ID was renumbered or reused; `FR-IAM-08` is traced from the already-existing `US-C10-03` rather than minting a new ID, per the Product Owner's own framing ("rewrite it, don't delete it").

---

## US-C10-01 · Sign in with credentials and obtain a session

- **Shape:** greenfield
- **Traces to:** `FR-IAM-01` · Player / Competitor · epic `C10`

**As a** Player / Competitor **I want** to sign in to Sport ITSM with my credentials and receive a session **so that** I can reach the Self-Service Portal and my own tickets under a verified identity.

### Acceptance criteria

**Given** a registered, active user with a known password
**When** they submit valid credentials to the sign-in endpoint
**Then** the response returns a signed JWT access token whose claims carry the user identifier, the display name, the assigned role identifiers and an expiry, and the password is never present in the response body or in any log line.

**Given** a registered user
**When** they submit an incorrect password or an unknown identifier
**Then** authentication fails with a single generic failure response that does not disclose whether the identifier exists, and no token is issued.

**Given** a user account marked inactive
**When** they submit otherwise valid credentials
**Then** authentication fails and no token is issued.

**Given** stored user credentials
**When** any credential is persisted
**Then** it is stored only as a bcrypt hash, never in reversible form, and password comparison happens through the identity port rather than in the controller.

---

## US-C10-02 · No anonymous surface anywhere in the product

- **Shape:** greenfield
- **Traces to:** `FR-IAM-01` · System Administrator · epic `C10`

**As a** System Administrator **I want** every API route and every web route to reject unauthenticated callers by default **so that** Sport ITSM exposes no anonymous surface at all, including the Knowledge Base and the Self-Service Portal.

### Acceptance criteria

**Given** the API composition root
**When** any HTTP route other than sign-in and the liveness/readiness probes is called without a valid token
**Then** the request is rejected with `401` before reaching any use case, because the JWT guard is registered globally and exemption is opt-in per route rather than opt-out.

**Given** a route that a developer forgot to annotate
**When** it is called anonymously
**Then** it is still rejected — the default is deny, and an unannotated route inherits the global guard.

**Given** an expired or tampered token
**When** it is presented on any protected route
**Then** the request is rejected with `401` and the failure is logged with the correlation identifier but without the token itself.

**Given** the Angular shell
**When** an unauthenticated visitor requests any route other than the sign-in route
**Then** the router guard redirects to sign-in and preserves the requested URL for post-authentication return.

---

## US-C10-03 · Sign out and end usable access on the device

- **Shape:** greenfield
- **Traces to:** `FR-IAM-08` · Service Desk Agent (L1) · epic `C10`
- **Phase:** 1 (MVP) — PRD §14.2, §14.3.

**As a** Service Desk Agent (L1) **I want** to end my session deliberately from wherever I am signed in **so that** the workstation I hand over grants no further access without the next person signing in under their own identity.

### Acceptance criteria

**Given** an agent with an active session on any authenticated surface of the product
**When** they choose sign out
**Then** the device discards every credential and cached authenticated state it held, the shell navigates to the sign-in route, and this is reachable from any authenticated surface — not only one screen.

**Given** a device on which sign-out has just completed
**When** any further action is attempted on that device, whether through the UI or by replaying a request the browser had queued
**Then** it requires a fresh authentication, because the device itself retains no usable access — sign-out is a property of the device, not a claim this story makes about material already extracted from the device or presented from a different device.

**Given** a signed-out device
**When** anyone signs in on it afterward
**Then** the action proceeds under the identity that just authenticated, so an audit entry recorded from that point on names the person who actually acted (`FR-AUD-02`), not whoever used the device before.

**Given** this story's acceptance test
**When** it is designed
**Then** it proves the three criteria above on the signing-out device only; it does not assert anything about whether a token issued before sign-out still verifies if presented from a different device before its own natural expiry — PRD §14.8 deliberately leaves that outside this product's guarantees.

---

## US-C10-04 · Role catalog aligned with the PRD personas

- **Shape:** greenfield
- **Traces to:** `FR-IAM-02` · System Administrator · epic `C10`

**As a** System Administrator **I want** the platform to ship with the roles named in PRD §4.3 and their permission sets **so that** access control speaks the same vocabulary as the personas rather than an ad-hoc invention.

### Acceptance criteria

**Given** a freshly migrated database
**When** the baseline migration has run
**Then** exactly the eight roles of PRD §4.3 exist — Requester, Organizer / League Admin, Agent (L1), Analyst (L2/L3), Change/Release Manager, Approver, Service Manager, System Administrator — each with a stable identifier and a translatable label, and none carries a hardcoded user-facing string.

**Given** the seeded role catalog
**When** a role's permission set is inspected
**Then** it matches the key permissions listed for that role in PRD §4.3, expressed as named permissions in the `identity-access` domain rather than as free text.

**Given** the System Administrator role
**When** its permission set is inspected
**Then** it grants configuration of catalog, taxonomy, SLA policies, workflows, notifications, roles and CMDB schema, and grants **no** permission to modify or delete audit entries.

**Given** the role catalog
**When** a schema change to roles or permissions is required
**Then** it is delivered as a TypeORM migration; `synchronize` remains `false`.

---

## US-C10-05 · Least-privilege enforcement inside the use cases

- **Shape:** greenfield
- **Traces to:** `FR-IAM-02` · Application Support Analyst (L2/L3) · epic `C10`

**As an** Application Support Analyst (L2/L3) **I want** authorization to be decided in domain terms by the use case, not by a controller decorator alone **so that** least privilege holds on every entry path and stays unit-testable without HTTP.

### Acceptance criteria

**Given** an application-layer use case that performs a privileged operation
**When** it executes
**Then** it evaluates an authorization predicate expressed in domain vocabulary (for example `actor may assign roles`) against the actor passed into the use case, and denies by default when no permission grants it.

**Given** the authorization predicates
**When** they are exercised
**Then** they are covered by Jest unit tests that construct actors and permissions directly, with no HTTP layer, no database and no framework import in `type:domain` or `type:application`.

**Given** an actor whose roles do not include the required permission
**When** they invoke the use case
**Then** it raises a typed authorization error that the HTTP adapter maps to `403`, and no side effect and no state change occurs.

**Given** the same operation reached through a different inbound path
**When** it is invoked
**Then** the identical predicate decides it, because the check lives in the use case and not in the adapter.

---

## US-C10-06 · A requester sees only their own records

- **Shape:** greenfield
- **Traces to:** `FR-IAM-03` · Player / Competitor · epic `C10`

**As a** Player / Competitor **I want** my visibility to be limited to the records I raised **so that** other people's support records are never exposed to me.

### Acceptance criteria

**Given** an actor holding only the Requester role
**When** the record-visibility predicate is evaluated for a record they raised
**Then** it grants visibility.

**Given** the same actor
**When** the predicate is evaluated for a record raised by another user
**Then** it denies visibility, and it denies it identically for read and for act-upon (comment, confirm resolution, submit CSAT).

**Given** a requester issuing a list query
**When** the visibility predicate is applied
**Then** it yields a scope restriction the consuming context can push into its repository query, so denied records are never fetched and then filtered in memory.

**Given** a requester requesting a record they may not see by direct identifier
**When** the use case evaluates visibility
**Then** the outcome is indistinguishable from the record not existing, so the response does not confirm its existence.

---

## US-C10-07 · Competition-scoped visibility for a Tournament Organizer / Admin

- **Shape:** greenfield
- **Traces to:** `FR-IAM-03` · Tournament Organizer / Admin · epic `C10`

**As a** Tournament Organizer / Admin **I want** visibility of the records affecting the competitions I own, on top of my own records **so that** I can follow issues that impact my tournament without being able to browse unrelated records.

### Acceptance criteria

**Given** an actor holding the Organizer role with an explicit grant over competition `X`
**When** the visibility predicate is evaluated for a record whose affected competition is `X`
**Then** it grants visibility, even though the actor is not the requester of that record.

**Given** the same actor
**When** the predicate is evaluated for a record whose affected competition is `Y`, over which they hold no grant
**Then** it denies visibility.

**Given** an Organizer with no competition grants at all
**When** the predicate is evaluated
**Then** it behaves exactly as the plain requester rule of `US-C10-06`, granting nothing beyond their own records.

**Given** a competition grant
**When** it is inspected
**Then** it is a persisted, explicitly scoped grant in the `identity-access` domain — never inferred from a name match, a text field or a role label.

---

## US-C10-08 · Cross-competition visibility for a League Administrator

- **Shape:** greenfield
- **Traces to:** `FR-IAM-03` · League Administrator · epic `C10`

**As a** League Administrator **I want** visibility across the set of competitions in the leagues I oversee **so that** I can act as the escalation contact without being granted read-all.

### Acceptance criteria

**Given** an actor holding the League Admin role with a grant over a league containing competitions `X` and `Y`
**When** the visibility predicate is evaluated for records affecting `X` or `Y`
**Then** it grants visibility for both.

**Given** the same actor
**When** the predicate is evaluated for a record affecting a competition outside their leagues
**Then** it denies visibility — the League Admin scope is a union of competition scopes, not a wildcard.

**Given** a competition that is added to a league the actor oversees
**When** the predicate is next evaluated
**Then** the new competition is included without any change to the actor's grants, because the scope resolves through the league at evaluation time.

**Given** the Service Manager read-all permission of PRD §4.3
**When** it is compared with the League Admin scope
**Then** they are distinct: read-all is a permission on the role, whereas the League Admin scope is a bounded set of competitions.

---

## US-C10-09 · `IdentityProviderPort` as the anti-corruption boundary

- **Shape:** greenfield
- **Traces to:** `FR-IAM-04`, `FR-IAM-01` · System Administrator · epic `C10`
- **Phase:** `FR-IAM-04` is Phase 3 (PRD §14.5) — federation is deferred deliberately (§14.5, §14.8 "Open by design"). `FR-IAM-01` (the port existing at all, bound to a local-credential adapter) is Phase 0. This story is not part of the Phase 0/1 delivery cut; only the port-and-local-adapter shape it also traces to is.

**As a** System Administrator **I want** authentication to be resolved through a port with a local-credential adapter behind it **so that** adding SCMS SSO later is an adapter swap in the composition root and not a redesign of the domain.

### Acceptance criteria

**Given** the `identity-access` domain library
**When** it is inspected
**Then** it declares an `IdentityProviderPort` with no framework, HTTP or ORM import, and the authentication use case depends on that port only.

**Given** the composition root in `apps/api`
**When** the application boots
**Then** exactly one adapter is bound to the `IdentityProviderPort` injection token, selected from validated configuration through `ConfigService` with no raw `process.env` access in feature code.

**Given** the local-credential adapter
**When** it verifies a credential
**Then** it performs the bcrypt comparison and returns a domain identity; the domain never sees a hash, a request object or a driver type.

**Given** the authentication use case
**When** it is unit-tested
**Then** it runs against a test double of the port with no database and no HTTP server.

---

## US-C10-10 · Sign in through SCMS SSO behind the anti-corruption layer

- **Shape:** greenfield
- **Traces to:** `FR-IAM-04` · Player / Competitor · epic `C10`
- **Phase:** 3 (PRD §14.5) — deferred deliberately: federation changes *how* a user authenticates, not *what* the service can do, and Phase 0 ships the locally held accounts (`US-C10-01`, `US-C10-09`) as the fallback per assumption A2. This story is out of the Phase 0/1 delivery cut.

**As a** Player / Competitor **I want** to sign in to Sport ITSM with my existing SCMS identity **so that** I do not maintain a second password to report a problem with the platform I already use.

### Acceptance criteria

**Given** the SSO adapter is the bound `IdentityProviderPort` implementation
**When** a user authenticates through the SCMS identity provider
**Then** the adapter translates the external identity and its profile attributes into the local `User` model, and no SCMS-specific field name, claim shape or type crosses into `type:domain` or `type:application`.

**Given** an SCMS identity that has never signed in before
**When** it authenticates successfully
**Then** a local user is provisioned with the default least-privilege role and no elevated permission, and the provisioning is recorded as a domain event.

**Given** an SCMS identity whose profile attributes have changed upstream
**When** it signs in again
**Then** the mapped profile attributes are refreshed while locally assigned roles are preserved — SSO supplies identity and profile, never Sport ITSM authorization.

**Given** the SCMS identity provider is unreachable
**When** a sign-in is attempted
**Then** the failure is surfaced as a typed error with an actionable message and is logged through pino; it is never reported as invalid credentials.

---

## US-C10-11 · Assign a role to a user

- **Shape:** greenfield
- **Traces to:** `FR-IAM-05` · System Administrator · epic `C10`

**As a** System Administrator **I want** to assign roles to a user from the Admin Console **so that** entitlements follow people's actual responsibilities without a code change.

### Acceptance criteria

**Given** an administrator on the role-administration screen
**When** they assign a role to a user
**Then** the assignment is persisted, is visible on the user's profile immediately, and the screen renders through the in-house design system with keyboard operation and an `aria-live` confirmation, using no third-party component library.

**Given** a non-administrator actor
**When** they invoke the role-assignment use case by any path
**Then** it is denied by the authorization predicate of `US-C10-05` and nothing is persisted.

**Given** a role already assigned to that user
**When** the same role is assigned again
**Then** the operation is idempotent: no duplicate assignment is created and no spurious change event is emitted.

**Given** the assignment request
**When** it reaches the API
**Then** its body is validated by a `class-validator` DTO defined in `libs/shared/contracts`; an unvalidated or `any`-typed body is never accepted.

---

## US-C10-12 · Revoke a role, with immediate effect

- **Shape:** greenfield
- **Traces to:** `FR-IAM-05` · System Administrator · epic `C10`

**As a** System Administrator **I want** a revoked role to stop granting access at once **so that** removing an entitlement is effective immediately rather than at the next token expiry.

### Acceptance criteria

**Given** a user holding a role and an active session
**When** the administrator revokes that role
**Then** the next request made with the existing token no longer carries the revoked permissions, because permissions are resolved server-side per request rather than trusted from the token claims alone.

**Given** the same user
**When** they retry an operation that the revoked role permitted
**Then** it is denied with `403` and the denial is recorded per `US-C10-16`.

**Given** a user whose last role is revoked
**When** they sign in
**Then** authentication succeeds but every privileged operation is denied, and the shell renders an explicit "no entitlements" state rather than an empty screen or a silent error.

**Given** an administrator attempting to revoke their own last System Administrator role
**When** the use case executes
**Then** it is refused with a typed error, so the platform cannot be left with no administrator.

---

## US-C10-13 · Role changes are emitted as auditable events

- **Shape:** greenfield
- **Traces to:** `FR-IAM-05` · Service Owner / Service Manager · epic `C10`

**As a** Service Owner / Service Manager **I want** every role assignment and revocation to be published as a domain event carrying the acting administrator **so that** entitlement changes are fully auditable and cannot be made silently.

### Acceptance criteria

**Given** a successful role assignment
**When** the transaction commits
**Then** a `RoleAssigned` domain event is published carrying the actor identity, the target user, the role, the timestamp from `ClockPort` and the previous and new role sets.

**Given** a successful role revocation
**When** the transaction commits
**Then** a `RoleRevoked` domain event is published with the same shape.

**Given** the audit subscriber fails
**When** the event is dispatched post-commit
**Then** the role change stays committed and the dispatch failure is logged; audit is never allowed to roll back an entitlement change.

**Given** a failed or denied role change
**When** the use case returns
**Then** no `RoleAssigned` / `RoleRevoked` event is emitted, so the audit trail records only effective changes.

> **Dependency:** persisting and rendering these events as audit entries belongs to `C18` (`FR-AUD-01`, `FR-AUD-02`) and is out of scope here. `C10` publishes; `C18` records. See finding **F5**.

---

## US-C10-14 · Session terminates after a configurable inactivity period, on the device

- **Shape:** greenfield
- **Traces to:** `FR-IAM-06` · Service Desk Agent (L1) · epic `C10`
- **Phase:** 1 (MVP) — PRD §14.3: "MVP is the first release with real requesters, real personal data (NFR-SEC-07) and shared service-desk workstations, so these protections ship with it."

**As a** Service Desk Agent (L1) **I want** an unattended device to stop granting access on its own after a configured period of inactivity, and never to keep granting it past a bounded maximum lifetime **so that** a service-desk workstation left open does not leave the ticket queue reachable.

### Acceptance criteria

**Given** an inactivity period and a maximum session lifetime defined in validated configuration
**When** the application boots
**Then** both values are read through `ConfigService` with a documented default, and boot fails fast if either is missing or is not a positive duration.

**Given** an active session on a device
**When** that device goes unused for longer than the configured inactivity period
**Then** the device itself stops granting access from that point on — no further action succeeds without a fresh sign-in on that device — and the elapsed idle time is computed through `ClockPort`, never through `new Date()` in domain or application code. Per PRD §14.8, this enforcement is a property of the device: it is proven by tests that exercise the idle device itself, never by a test that asserts a central, per-request-checked record of the session's liveness.

**Given** an active session
**When** use of the device continues within the inactivity period
**Then** the idle window keeps resetting and the device does not lose access on that account, up to the maximum session lifetime.

**Given** a session that reaches the configured maximum lifetime
**When** that lifetime elapses
**Then** the device stops granting access even if it was in continuous use, because inactivity and maximum lifetime are two independent bounds and neither substitutes for the other.

**Given** the same user signed in on a second, independent device
**When** the first device's session ends through either bound
**Then** the second device is unaffected — inactivity and lifetime termination are scoped to the device that went idle or aged out, not to every session the user holds, which is the device-bounded threat this requirement targets (the unattended or handed-over shared device) rather than centralized revocation.

**Given** a session about to be ended by either bound
**When** the remaining time crosses a warning threshold
**Then** the web client shows a localized warning through Transloco with an explicit "stay signed in" action, and losing the session mid-form does not discard the entered data silently.

---

## US-C10-15 · Prove identity again at the moment of a privileged administrative action

- **Shape:** greenfield
- **Traces to:** `FR-IAM-06` · System Administrator · epic `C10`
- **Phase:** 1 (MVP) — PRD §14.3, same clause as `US-C10-14`.

**As a** System Administrator **I want** to be required to prove my identity again at the moment I perform a privileged administrative action **so that** a hijacked, borrowed or merely long-lived session cannot reconfigure the platform on the strength of a login that happened earlier.

### Acceptance criteria

**Given** an operation declared privileged (at minimum: role assignment and revocation, and configuration of catalog, taxonomy, SLA policies, workflows and notification templates, and any operation `NFR-SEC-06` restricts)
**When** it is invoked and the actor has not just proven their identity again for this action
**Then** it is refused with a distinct, machine-readable "re-authentication required" outcome — not a generic `403` — nothing is persisted, and the refusal holds regardless of how recently the actor originally signed in or how active their session has been, because `FR-IAM-06` states plainly that an earlier successful authentication is not sufficient on its own.

**Given** that refusal
**When** the administrator proves their identity again as part of retrying that same privileged action
**Then** the action is authorized for this attempt and succeeds.

**Given** a privileged action just authorized this way
**When** the administrator attempts a second, later privileged action
**Then** that second action is evaluated on its own — proof given for the first action does not stand in for proof of the second, because the requirement is proof "at the moment of the action", not proof for a stretch of time that follows it.

**Given** invalid credentials supplied when proving identity for a privileged action
**When** they are submitted
**Then** the actor's ordinary session and its non-privileged access are unaffected, the privileged action is not authorized, and the attempt is logged.

**Given** the set of privileged operations
**When** a new one is added
**Then** it is declared through the same explicit marker used by the operations above, so the requirement is satisfied by declaration rather than by remembering to add a check.

> **Note on scope.** This story deliberately does not name how "at the moment of the action" is implemented — no guard, token claim or stored flag is specified here, per the skill's "don't invent the how." What it does rule out, per PRD §14.8, is any design whose *observable* behavior is proof-once-then-trusted for a configured window tracked in a central, per-request-checked session record; that reading was the defect in this story's previous revision.

---

## US-C10-16 · Denied authorizations on privileged operations are recorded

- **Shape:** greenfield
- **Traces to:** `FR-IAM-07` · System Administrator · epic `C10`
- **Phase:** 2 (PRD §14.4) — "Phase 2 is the accountability phase: it introduces Change authorization, emergency change and delegated approval, which multiply the privileged operations whose refusals are evidence." This story does **not** belong in any Phase 0/1 sequencing alongside `US-C10-14`/`US-C10-15`; it follows once Phase 2 opens.

**As a** System Administrator **I want** every denied authorization on a privileged operation to be recorded **so that** attempts to exceed entitlements are visible after the fact instead of vanishing into a `403`.

### Acceptance criteria

**Given** a privileged operation
**When** the authorization predicate denies it
**Then** a denial record is produced carrying the actor identity, the attempted operation, the target record reference where one exists, the reason for denial and the timestamp from `ClockPort`.

**Given** a denial on a non-privileged operation
**When** it occurs
**Then** no denial record is produced — the requirement is scoped to privileged operations and the volume of ordinary visibility denials must not drown it.

**Given** an unauthenticated request
**When** it is rejected by the global guard
**Then** it is an authentication failure, not an authorization denial, and it produces no denial record.

**Given** a denial record
**When** it is inspected
**Then** it contains no credential, no token and no password, and it is produced by the same use-case-level predicate that made the decision, so it cannot disagree with the outcome the caller received.

---

## Findings

Observations raised while writing these stories. The first two are carried over from `docs/backlog/epic-map.md`; the rest are new.

| ID | Source | Finding | Effect on this backlog |
| --- | --- | --- | --- |
| **F5** | Epic map (carried) | **Mutual reference at phase 0.** `FR-IAM-05` requires role assignment and revocation to be "fully audited", which needs `C18`; `FR-AUD-02` requires every audit entry to carry an actor, which needs `C10`. | `C10` and `C18` are one phase-0 increment, not two sequenced epics. `US-C10-13` stops at publishing the domain events; the audit entry itself is `C18` (`FR-AUD-01`, `FR-AUD-02`) and **no `C18` story is written here**. |
| **F9** | Epic map (carried) — **closed for C10, this revision** | **`FR-IAM-04`, `FR-IAM-06` and `FR-IAM-07` were assigned to no phase in PRD §14.** The Product Owner has since resolved this for every C10 requirement: PRD §14.2 now states explicitly "No Identity & Access requirement is unphased" — `FR-IAM-06` and `FR-IAM-08` are Phase 1 (§14.3), `FR-IAM-07` is Phase 2 (§14.4), `FR-IAM-04` is Phase 3 (§14.5). This backlog reflects that on `US-C10-09`, `US-C10-10`, `US-C10-14`, `US-C10-15` and `US-C10-16` with a **Phase** line. **Not closed beyond C10:** F9's original list also named `FR-INC-15`, `FR-INC-16`, `FR-CAT-06`, `FR-OMN-02`, `FR-OMN-04`, `FR-QUE-04`, `FR-QUE-05` and `FR-AUD-06`, which belong to other epics and remain unphased as far as this document can tell — that portion of F9 is not this epic's to close and is carried forward for whichever epic owns those requirements. | The record that F9 existed is kept (this row) rather than deleted, per instruction; its C10 scope is resolved and no longer open work for this backlog. |
| **F13** | New | **The PRD has no persona identifiers.** §4.1 and §4.2 name personas in tables with no `PER-n` column, so the skill's `PER-n` trace field cannot be honoured without inventing PRD IDs. | Every story traces to the persona's **exact PRD name** instead. Stated once, here. If `PER-` IDs are wanted, the Product Owner must add them to PRD §4 and this file must be re-traced — they are not minted here. |
| **F14** | New | **`C10` carries foundation work that is not user stories.** The epic map prices the whole workspace foundation into `C10`: Nx bootstrap with pnpm, ESLint 9 flat config with `@nx/enforce-module-boundaries`, Prettier, the three-axis tag scheme, the four applications (`api`, `api-e2e`, `web`, `web-e2e`), `libs/shared/{contracts,domain,ui,util}` including the in-house design system, and the PostgreSQL base schema with its TypeORM migration chain. | Deliberately **not** written as user stories — scaffolding has no persona and no user-observable behavior. It is enabling technical work, belongs in `T-C10-nn` tickets and must be sequenced before `US-C10-01`. It is also why the epic is sized XL while holding only 7 requirements: the 16 stories above do not represent the epic's full cost. |
| **F15** | New | **`FR-IAM-03` is observable only through a record that `C10` does not own.** Requester-scoped and competition-scoped visibility are `identity-access` domain predicates (`ARCHITECTURE.md` §9), but the tickets they filter belong to `C1` and `C2`. | `US-C10-06` → `US-C10-08` are written against the **predicate and the scope restriction it yields**, verifiable by Jest unit tests with no ticket aggregate present. End-to-end proof over real tickets lands with `C1` / `C2` and must not be expected of `C10`'s acceptance run. |
| **F16** | Carried, **partially resolved this revision** | **Neither the PRD nor the architecture defined which operations are "privileged".** `FR-IAM-06` requires re-authentication for "privileged administrative actions" and `FR-IAM-07` requires recording denials "when it concerns privileged operations". The rewritten `FR-IAM-06` now names, in the requirement text itself, "role grant or revocation, reference-data and policy configuration, and every operation restricted by `NFR-SEC-06`" — which is this backlog's previously assumed list, now stated in the PRD rather than assumed by this document. | `US-C10-15` and `US-C10-16` now quote the PRD's own list instead of proposing one. **Still open:** `NFR-SEC-06` says such operations "MUST be restricted to System Administrator", which is a criterion, not a closed enumeration — whether every System-Administrator-only screen in the eventual Admin Console counts is a judgment call at ticketing time, not settled by this wording alone. |
| **F17** | New | **`FR-IAM-07`'s recording destination is unspecified.** A denied authorization is not a change to a record, so it does not fit the `AuditEntry` shape of `FR-AUD-02` (previous value / new value) and it has no natural record reference. | `US-C10-16` specifies the content of the denial record but deliberately not its store. Choosing between a `C18` audit entry and a dedicated security log is an architecture decision that must be made before `US-C10-16` is ticketed. |
| **F18** | New | **This document's own scope header disagrees with `docs/backlog/epic-map.md`.** The epic map's `C10` row (and §"Foundation ownership") still counts **7** `FR-IAM-*` requirements; the PRD now has **8** (`FR-IAM-01` → `FR-IAM-08`, the new sign-out requirement). The epic map is the Business Analyst's upstream input and is explicitly not this role's to edit. | This file's header now says "8 requirements remaining" to stay accurate about its own content, but `docs/backlog/epic-map.md` itself is stale and should be regenerated by `sport-itsm-product-owner` (Mode 2) so the summary table, the "Foundation ownership" §, and the C10 detail section all count 8. Reported, not fixed here. |
| **F19** | New | **`US-C10-09` (`IdentityProviderPort` anti-corruption boundary) may be worth building ahead of its own Phase-3 trigger (`FR-IAM-04`).** The port-and-local-adapter shape is also required by `FR-IAM-01` (Phase 0) on its own terms — a local-credential authentication use case needs a port whether or not SSO ever arrives — so the seam could be cut once, during Phase 0/1 delivery, rather than retrofitted in Phase 3 onto an authentication use case that by then already has direct callers depending on its concrete shape. | This is an **architectural sequencing observation, not a Business Analyst decision** — raised here per instruction so the Architect / Tech Lead can decide whether `T-C10-nn` for `US-C10-09` is scheduled with the Phase 0/1 tickets even though the story's own phase (via `FR-IAM-04`) is Phase 3. The story itself is left phased at 3, matching its trace. |
