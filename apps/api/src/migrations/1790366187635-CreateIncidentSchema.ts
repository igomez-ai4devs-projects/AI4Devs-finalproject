import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Creates the `incident` schema namespace (`T-C1-02`).
 *
 * `docs/product/DATA-MODEL.md` §8/§20.3: "`incident` — schema `incident`" —
 * the Postgres schema name, not the Nx bounded-context slug (both happen to
 * coincide here, unlike `identity-access` → `iam`; see `README.md` in this
 * directory). No table is created here: every table in this schema belongs
 * to the ticket that introduces it (`T-C1-04` for `incident_ticket`, and so
 * on), exactly as the bootstrap migration left `incident` for this ticket to
 * create.
 *
 * No extension is created or required here. `citext` and `pg_trgm` were
 * already installed cluster-wide by the bootstrap migration
 * (`CreateIamSchemaAndExtensions1790349248155`) and are available to any
 * schema without a further `CREATE EXTENSION` — extensions are not
 * schema-scoped in PostgreSQL.
 *
 * `down` drops only the schema this migration created. It does **not** touch
 * `citext`/`pg_trgm`: this migration never installed them, so it does not own
 * them, and dropping them here would remove something the `iam` schema (or
 * any future `incident` table relying on `pg_trgm`, e.g. FR-INC-16's
 * `gin_trgm_ops` search index) may still depend on. See `README.md`,
 * "Extensions and `down`, a documented decision".
 *
 * `DROP SCHEMA` here is deliberately **not** `CASCADE`. Every table this
 * schema will ever hold arrives through its own reversible migration
 * (`T-C1-04` and onward), so by the time this migration's `down` runs, a
 * correctly-ordered revert chain has already dropped every one of those
 * tables and the schema is empty. A plain `DROP SCHEMA` therefore succeeds
 * when the chain was reverted in order and fails loudly — instead of
 * silently destroying tables — if it was not, which is the safer failure
 * mode for a namespace shared by many future migrations.
 */
export class CreateIncidentSchema1790366187635 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "incident"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS "incident"`);
  }
}
