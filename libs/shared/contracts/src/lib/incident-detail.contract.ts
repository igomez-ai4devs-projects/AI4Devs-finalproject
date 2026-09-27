/**
 * Wire shape for reading a single Incident by its reference (`T-C1-100`,
 * `US-C1-01`, `FR-INC-01`) — `GET /api/incidents/{reference}`, the "see it"
 * half of the slice `T-C1-08`'s `POST` starts.
 *
 * **Types only (ADR-007).** No `class-validator` decorator, no framework
 * import — see the barrel (`index.ts`)'s own doc comment for the convention
 * this library holds to; `apps/api` maps `IncidentSnapshot` onto this type by
 * hand (`incident-detail-response.mapper.ts`), never a `class` that
 * `implements` it, because there is nothing here for `class-validator` to
 * decorate on the way *out* of the API (unlike `LogIncidentRequesterDto` on
 * the way in).
 *
 * **Field-by-field decision (`T-C1-100` Trap 1) — what crosses the wire and
 * why.** The ticket's own text only names `IncidentSnapshot.id` as excluded;
 * AC4 reaches further ("no internal identifier that leaks storage details
 * unrelated to the reference itself"), and the snapshot carries three more
 * raw UUIDs. Each is judged on its own:
 * - `id` — excluded per the ticket's own text: the storage primary key, no
 *   reason for a requester to see it.
 * - `reporterId`, `loggedBy` — **excluded**. Both are internal *actor*
 *   identities (who the ticket is about, who performed the logging
 *   action — `incident.aggregate.ts`'s own doc comment on `LogIncidentCommand`
 *   draws that distinction), not part of what the Incident itself *is*. This
 *   route has **no authorization/visibility predicate yet**
 *   (`GetIncidentByReferenceUseCase`'s own doc comment: "no authorization
 *   context — decided, not omitted by oversight"), so anyone who can guess or
 *   is handed a syntactically valid reference can call it; a bare account
 *   UUID with no name-resolution endpoint anywhere in this delivery slice is
 *   not information the client can render — it is a storage-level identity
 *   leak with no offsetting value (AC4). Revisit once `US-C1-06`'s visibility
 *   predicates and a display-name resolution exist.
 * - `affectedServiceId`, `categoryId` — **included, as the raw id**. Unlike
 *   the two actor identities above, these name *what the ticket is about* —
 *   part of `FR-INC-01`'s own captured content, not a detail of who handled
 *   the row. A bare id without a resolved display name is admittedly thin for
 *   `T-C1-101`'s UI today, but omitting the field entirely would be strictly
 *   less honest about "the full persisted state" (AC1) than shipping the id
 *   the client can later resolve once `service-catalog`/categorization expose
 *   a lookup — reported as a finding either way.
 * - `affectedSubject`, `assignment` — **excluded**. Both are typed as the
 *   literal `null` on `IncidentSnapshot` today (`incident.aggregate.ts`'s own
 *   doc comment: "the slot is real, its future type is not") because no
 *   value object or feature exists yet. Trap 1's own list of "still-empty
 *   fields to show explicitly" names Priority, Impact, Urgency, category and
 *   the competition-in-progress flag — not these two. Adding a field that can
 *   only ever be `null`, for a feature no ticket has built, is speculative
 *   surface this contract has no requirement to carry (YAGNI); it is added
 *   the day `T-C1-14`/assignment give it a real type.
 *
 * **Instants as ISO 8601 UTC strings, never epoch milliseconds
 * (`NFR-I18N-03`).** `loggedAt` is `IncidentSnapshot.loggedAtEpochMs`
 * rendered through `Date#toISOString()` — the client presents it in the
 * viewer's own zone; the wire never carries a zone-less number.
 *
 * **Still-empty fields are explicit, never omitted (Trap 1).** `categoryId`,
 * `impact`, `urgency`, `priority` are `null` until a later ticket assesses
 * them; `competitionAffectsInProgress` is `false` until `T-C1-14` derives it.
 * A read caller sees the real shape of "not yet assessed", never a missing
 * key it has to guess the meaning of.
 *
 * **`originChannel` and `priority` duplicate their domain's closed set as a
 * literal union, not `string`.** Neither `incident-domain`'s
 * `OriginChannelCode` nor shared-domain's `PriorityCode` can be imported here
 * (`type:contracts` may depend only on `type:contracts`/`type:util` —
 * `sport-itsm-architecture` §6; AC5 of this ticket greps for exactly this).
 * The two small, named-code sets are duplicated as their own literal union
 * instead of widened to `string`, matching `LogIncidentRequesterDto`'s own
 * precedent of duplicating `SHORT_DESCRIPTION_MAX_LENGTH` rather than
 * reaching into a layer this ticket may not touch — the client keys a
 * Transloco translation off the exact code, so losing that precision to
 * `string` would give up a compile-time check for no benefit. Keep both in
 * sync with `ORIGIN_CHANNEL_CODES` / `PRIORITY_CODES` by hand; there is no
 * boundary-safe way to derive one from the other today.
 */

/** Mirrors `@sport-itsm/incident-domain`'s `OriginChannelCode` — see this file's own doc comment for why it is duplicated, not imported. */
export type IncidentOriginChannel =
  'portal' | 'agent_logged' | 'email' | 'in_app';

/** Mirrors `@sport-itsm/shared-domain`'s `PriorityCode` — see this file's own doc comment for why it is duplicated, not imported. */
export type IncidentPriority = 'P1' | 'P2' | 'P3' | 'P4';

/**
 * `GET /api/incidents/{reference}`'s `200` body — the full persisted state a
 * requester (or, until `US-C1-06` lands, any caller quoting a valid
 * reference) is entitled to see. Keyed on `reference`, never `id` (`T-C1-100`
 * Scope).
 */
export interface IncidentDetailResponse {
  readonly reference: string;
  /** ISO 8601, UTC (`NFR-I18N-03`) — never epoch milliseconds, never a bare `Date`. */
  readonly loggedAt: string;
  readonly originChannel: IncidentOriginChannel;
  readonly shortDescription: string;
  readonly description: string;
  /** UUID of the affected `Service` (`service-catalog`), or `null` when none was captured. */
  readonly affectedServiceId: string | null;
  /** UUID of the assigned category, or `null` before `US-C1-07`'s categorization gate runs. */
  readonly categoryId: string | null;
  /** 1-5 assessment scale, or `null` before an agent assesses it. */
  readonly impact: number | null;
  /** 1-5 assessment scale, or `null` before an agent assesses it. */
  readonly urgency: number | null;
  /** `null` until Priority is derived from Impact x Urgency (`FR-INC-04`). */
  readonly priority: IncidentPriority | null;
  /** `false` until `T-C1-14` derives whether the affected competition is in progress. */
  readonly competitionAffectsInProgress: boolean;
}
