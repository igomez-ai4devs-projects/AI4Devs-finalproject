import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Creates `incident.incident_ticket` and `incident.origin_channel_enum`
 * (`T-C1-06`) — the table-creating migration for the **logging** behavior
 * only (`FR-INC-01`/`02`), the first row of `DATA-MODEL.md` §8.5's column
 * introduction table (ADR-014).
 *
 * **Narrower than the dictionary (`DATA-MODEL.md` §20.3).** Only the columns
 * a just-logged, unassessed Incident needs: `id`, `reference` (moved here
 * from `T-C1-04`, see this ticket's own `## Context` — without it, "every
 * field round-trips" is unprovable and a row could exist with no reference at
 * all, contradicting `US-C1-05`), `short_description`, `description`,
 * `origin_channel`, `reporter_user_id`, `service_id`, the four audit columns
 * and `version`. No `workflow_id`, `state_id`, `state_category`,
 * `priority_matrix_id`, `category_id`, `logged_by_user_id`, any assessment
 * column, the competition flag, or any `CHECK` that reads a column this
 * migration does not create — those arrive with the migration of the
 * behavior that first writes them.
 *
 * **The reference immutability trigger is deliberately not here.**
 * `tg_incident_ticket_reference_immutable` /
 * `incident.fn_reject_reference_update()` are `T-C1-04`'s (`DATA-MODEL.md`
 * §3.2, M18) — this migration's own round-trip acceptance criterion only
 * `INSERT`s and `SELECT`s, never `UPDATE`s `reference`, so it does not need
 * the trigger to exist first (see this ticket's `## Context`, "Closed this
 * pass"). `uq_incident_reference` (uniqueness) is created here because it
 * belongs to *this* column, not to the immutability guarantee.
 *
 * Reversible: `down` drops the table then the enum type, in that order (the
 * column referencing the type must go first), leaving no residual object.
 * `run → revert → run` reaches the same state both times.
 */
export class CreateIncidentTicketTable1790380866140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "incident"."origin_channel_enum" AS ENUM (
        'portal',
        'agent_logged',
        'email',
        'in_app'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "incident"."incident_ticket" (
        "id" uuid NOT NULL DEFAULT uuidv7(),
        "reference" varchar(20) NOT NULL,
        "short_description" varchar(255) NOT NULL,
        "description" text NOT NULL,
        "origin_channel" "incident"."origin_channel_enum" NOT NULL,
        "reporter_user_id" uuid NOT NULL,
        "service_id" uuid,
        "created_at" timestamptz NOT NULL,
        "updated_at" timestamptz NOT NULL,
        "created_by" uuid NOT NULL,
        "updated_by" uuid,
        "version" integer NOT NULL DEFAULT 1,
        CONSTRAINT "pk_incident_ticket" PRIMARY KEY ("id"),
        CONSTRAINT "uq_incident_reference" UNIQUE ("reference")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "incident"."incident_ticket"`);
    await queryRunner.query(`DROP TYPE "incident"."origin_channel_enum"`);
  }
}
