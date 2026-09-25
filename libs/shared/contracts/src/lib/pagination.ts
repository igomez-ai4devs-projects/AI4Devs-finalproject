/**
 * Pagination request and result shapes.
 *
 * **Not normatively defined anywhere the ticket cites.** `T-C10-11`'s Scope
 * attributes "the pagination ... shapes" to `ARCHITECTURE.md` §3.2, but §3.2
 * (the *Protocols and cross-cutting HTTP contract* table) says nothing about
 * pagination — it covers transport, typing, authN, i18n, errors and time
 * only. No other section of `ARCHITECTURE.md`, `PRD.md` or `DATA-MODEL.md`
 * defines a pagination wire shape either (searched for "pagination",
 * "page", "cursor", "offset" — the one hit, `docs/backlog/C18/user-stories.md`,
 * asks for "stable pagination that cannot skip or duplicate an entry" as a
 * *behavior*, not a shape). This is reported as a finding for the architect.
 *
 * In the absence of a normative source, this declares the **minimal**
 * conventional shape: page number, page size, the returned items and the
 * total item count. No sort order, filters or cursor — nothing here asks
 * for them, and adding them now would be speculative (YAGNI).
 */
export interface PageRequest {
  /** 1-based page number. */
  readonly page: number;
  readonly pageSize: number;
}

export interface PageResult<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
}
