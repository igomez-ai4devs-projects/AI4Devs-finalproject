import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Bootstrap migration — the first link in this repository's migration chain.
 *
 * Creates exactly one schema, `iam` (`docs/product/DATA-MODEL.md` §6/§20.1,
 * "`identity-access` — schema `iam`"; `identity_access` is only the Nx
 * bounded-context slug, never a Postgres identifier — see `README.md` in this
 * directory), and the two contrib extensions the modelled schema requires:
 *
 * - `citext` — case-insensitive `email` columns (e.g. `iam_user.email`,
 *   FR-IAM-01).
 * - `pg_trgm` — the `gin_trgm_ops` GIN index for typo-tolerant knowledge
 *   search (FR-INC-16).
 *
 * No other schema is created here. Every other context's schema namespace is
 * that context's own migration, owned by that context's own ticket
 * (`T-C1-02` creates `incident`, and so on) — see `README.md`.
 *
 * No extension is needed for identifier generation: `uuidv7()` is a
 * PostgreSQL 18 **core** function (`DATA-MODEL.md` §3.1.1, ADR-012), not a
 * contrib extension, so it needs no `CREATE EXTENSION` here or anywhere else.
 *
 * `down` drops both extensions and the schema, reversing `up` exactly. This
 * migration is the sole creator of `citext`/`pg_trgm` in this chain — it is
 * the first migration, so nothing earlier could have created them — so
 * dropping them on `down` cannot remove an extension this migration did not
 * itself install. See `README.md` for the reasoning this decision generalizes
 * from.
 */
export class CreateIamSchemaAndExtensions1790349248155 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "iam"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "citext"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pg_trgm"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXISTS "pg_trgm"`);
    await queryRunner.query(`DROP EXTENSION IF EXISTS "citext"`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS "iam"`);
  }
}
