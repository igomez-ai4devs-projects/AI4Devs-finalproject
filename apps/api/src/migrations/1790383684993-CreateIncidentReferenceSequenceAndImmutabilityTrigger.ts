import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Creates the three database-level guarantees `T-C1-04` owns for
 * `incident_ticket.reference` (`DATA-MODEL.md` §3.2/§3.7, decision **M18**),
 * on top of `T-C1-06`'s table and its own `NOT NULL` +
 * `uq_incident_reference` (out of this migration's scope — see this ticket's
 * `## Context`):
 *
 * - `incident.incident_reference_seq` — the **only** source of the numeric
 *   part of an Incident reference (`IncidentReferencePolicy`, "never
 *   reused"). Declared `NO CYCLE` **explicitly**, matching §3.2's SQL to the
 *   letter, even though `NO CYCLE` is a `CREATE SEQUENCE` default — the
 *   explicit keyword is the point: it makes "this counter is guaranteed
 *   never to wrap and repeat a value" a readable fact of the DDL, not an
 *   assumption resting on nobody changing a default later.
 * - `incident.fn_reject_reference_update()` / trigger
 *   `tg_incident_ticket_reference_immutable` — the one sanctioned trigger
 *   category (§3.7): a `BEFORE UPDATE OF reference` guard that compares the
 *   row before and after, which a `CHECK` cannot express. It fires for every
 *   role, the table owner and `postgres` (the superuser every environment
 *   connects as today) included, writes nothing, reads nothing but the row,
 *   and encodes no policy — it does not know *why* a reference must not
 *   change, only that it must not.
 *
 * **No `MAXVALUE` clause on the sequence — a deliberate choice, reported.**
 * `IncidentReferencePolicy.format()` already rejects any sequence value
 * outside `[1, 9_999_999]` with a typed `IncidentReferenceSequenceOutOfRangeError`
 * (`libs/incident/domain/src/lib/incident-reference.policy.ts`), and that
 * error's own doc comment already frames `incident.incident_reference_seq`
 * as "a PostgreSQL `SEQUENCE`, **unbounded by default**" whose ceiling is
 * enforced in the domain, not the database. Adding `MAXVALUE 9999999 NO
 * CYCLE` here would move the failure one layer down: `nextval()` would then
 * raise Postgres's own untyped `nextval: reached maximum value of sequence
 * "incident.incident_reference_seq" (9999999)` error instead of the domain's
 * typed one, which every caller of `nextReference()` (starting with
 * `T-C1-07`'s `LogIncidentUseCase`) would have to learn to recognize as the
 * same condition the domain error already models. Leaving the sequence at
 * its default (`BIGINT`, effectively unbounded for this system's realistic
 * volumes) keeps exactly one place — `IncidentReferencePolicy` — deciding
 * what a valid Incident reference is, consistent with §3.7 ("no business
 * rule ever lives in a trigger, a stored procedure or a check that encodes a
 * policy decision"): the seven-digit width is that kind of policy decision,
 * not a structural invariant the database must also enforce redundantly.
 * `NO CYCLE` is still declared, because "never reused" *is* the structural
 * invariant this migration owns.
 *
 * Reversible: `down` drops the trigger, then the function, then the
 * sequence — the reverse creation order, and the order `DATA-MODEL.md` §3.2
 * itself specifies ("The migration that creates it drops both the trigger
 * and the function in `down`") extended to the sequence this migration also
 * owns. `run → revert → run` reaches the same state both times, with no
 * residual object.
 */
export class CreateIncidentReferenceSequenceAndImmutabilityTrigger1790383684993 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE SEQUENCE "incident"."incident_reference_seq"
        NO CYCLE
    `);

    await queryRunner.query(`
      CREATE FUNCTION "incident"."fn_reject_reference_update"() RETURNS trigger
      LANGUAGE plpgsql AS $$
      BEGIN
        RAISE EXCEPTION 'incident_ticket.reference is immutable'
          USING ERRCODE = 'integrity_constraint_violation';
      END $$
    `);

    await queryRunner.query(`
      CREATE TRIGGER "tg_incident_ticket_reference_immutable"
        BEFORE UPDATE OF "reference" ON "incident"."incident_ticket"
        FOR EACH ROW
        WHEN (OLD."reference" IS DISTINCT FROM NEW."reference")
        EXECUTE FUNCTION "incident"."fn_reject_reference_update"()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER "tg_incident_ticket_reference_immutable" ON "incident"."incident_ticket"
    `);
    await queryRunner.query(`
      DROP FUNCTION "incident"."fn_reject_reference_update"()
    `);
    await queryRunner.query(`
      DROP SEQUENCE "incident"."incident_reference_seq"
    `);
  }
}
