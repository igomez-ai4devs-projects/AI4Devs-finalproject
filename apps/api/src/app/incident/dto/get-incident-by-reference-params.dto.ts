import { IsDefined, Matches } from 'class-validator';

/**
 * `TicketReference`'s own shape (`libs/shared/domain/src/lib/ticket-reference.vo.ts`),
 * duplicated as a literal here rather than imported: the shared kernel does
 * not export its private `TICKET_REFERENCE` regex (only the `TicketReference`
 * class and its error), and this ticket's boundary ("Lo que NO debes tocar":
 * `libs/shared/domain`) has no license to add that export. The same
 * duplication `LogIncidentRequesterDto` already accepts for
 * `SHORT_DESCRIPTION_MAX_LENGTH` (`T-C1-08` Trap 1).
 */
const TICKET_REFERENCE_PATTERN = /^[A-Z]{3}[0-9]{7}$/;

/**
 * The `class-validator`-decorated params DTO for `:reference`
 * (`T-C1-100` Trap 2), validated by the **already-configured** global
 * `ValidationPipe` (`main.ts`) — the same mechanism `LogIncidentRequesterDto`
 * uses, not a bespoke validation path for this one route.
 *
 * **A single detail, never a cascade.** With the global `stopAtFirstError:
 * true`, `@IsDefined()` always runs first regardless of position
 * (`class-validator` special-cases `IS_DEFINED`), and `@Matches()` is the
 * only remaining decorator on this property — so a malformed reference
 * (wrong length, lowercase letters, wrong prefix shape) reports **exactly
 * one** detail: `{ field: 'reference', rule: 'matches' }`. There is no second
 * decorator here to cascade into.
 *
 * **Deliberately does not distinguish a foreign-but-well-formed prefix
 * (`SRQ0000001`) from a genuinely malformed one.** `@Matches()` only proves
 * the three-letter-then-seven-digit *shape* `TicketReference.fromString()`
 * itself enforces — it has no way to know which three-letter prefixes belong
 * to a real record type, and it should not: that is `T-C1-99`'s decision
 * (`GetIncidentByReferenceUseCase`'s own doc comment), where a well-formed but
 * foreign or nonexistent reference is `404 NOT_FOUND`, not `400
 * VALIDATION_FAILED` — the controller reaches the use case for exactly that
 * case.
 */
export class GetIncidentByReferenceParamsDto {
  @IsDefined()
  @Matches(TICKET_REFERENCE_PATTERN)
  readonly reference!: string;
}
