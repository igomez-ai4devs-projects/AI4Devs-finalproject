import { Column, Entity, PrimaryColumn, Unique, VersionColumn } from 'typeorm';

/**
 * Mirrors `libs/incident/domain`'s `ORIGIN_CHANNEL_CODES` — deliberately
 * **not imported** from `@sport-itsm/incident-domain`, even though this file
 * otherwise could (`type:infrastructure` may depend on `type:domain`,
 * `sport-itsm-architecture` §6). The TypeORM CLI (`tools/typeorm.cjs`)
 * `require()`s every file the `entities` glob in `apps/api/src/data-source.ts`
 * matches directly through `ts-node/register`, with **no `tsconfig-paths`
 * hook** (confirmed empirically: `pnpm typeorm migration:show` fails with
 * `Cannot find module '@sport-itsm/incident-domain'` the moment this file
 * imports it, since only relative and real `node_modules` specifiers resolve
 * without that hook — `@sport-itsm/*` aliases are virtual, wired only through
 * `tsconfig` `paths` + webpack/Jest module resolution, neither of which the
 * plain CLI process has). Adding `tsconfig-paths` would fix it but is a new
 * dependency this ticket may not add; see the report's findings. Every
 * `.entity.ts` file must therefore stay a **leaf** the CLI can load with only
 * `typeorm` and relative imports — the same constraint that already forces
 * the migration file to restate these four values as a raw SQL literal rather
 * than import them.
 */
const ORIGIN_CHANNEL_CODES = [
  'portal',
  'agent_logged',
  'email',
  'in_app',
] as const;

type OriginChannelCode = (typeof ORIGIN_CHANNEL_CODES)[number];

/**
 * The TypeORM persistence entity for `incident.incident_ticket`
 * (`DATA-MODEL.md` §20.3, ADR-005). A **separate class** from the `Incident`
 * aggregate (`libs/incident/domain`), joined only by `IncidentMapper` — this
 * is the one place in the codebase allowed to know both shapes.
 *
 * File name ends in `.entity.ts` on purpose: `apps/api/src/data-source.ts`
 * registers entities for the TypeORM CLI with a glob over exactly that
 * suffix (`T-C1-02`).
 *
 * **Scope is narrower than the dictionary (`DATA-MODEL.md` §20.3).** This is
 * the table-creating migration for the logging behavior only (`T-C1-06`,
 * ADR-014, §8.5's first column group): `id`, `reference`,
 * `short_description`, `description`, `origin_channel`, `reporter_user_id`,
 * `service_id`, the four audit columns and `version`. Every later column
 * group (`logged_by_user_id`, `category_id`, the assessment/matrix columns,
 * the competition flag, the lifecycle, assignment…) is a **separate**
 * migration and a separate extension of this class, owned by the ticket that
 * introduces the behavior that writes it — never added ahead of that
 * behavior (ADR-014 rule 4). The aggregate slots those columns will back
 * (`categoryId`, `impact`, `urgency`, `priority`,
 * `competitionAffectsInProgress`, `affectedSubject`, `assignment`) are
 * mapped as empty by `IncidentMapper`, not represented here at all.
 *
 * Every column name is spelled out with `name:` — no `NamingStrategy` is
 * configured on `apps/api/src/data-source.ts`, so TypeORM would otherwise use
 * the camelCase property name verbatim, which does not match this schema's
 * `snake_case` convention (`DATA-MODEL.md` §3.4).
 */
@Entity({ name: 'incident_ticket', schema: 'incident' })
@Unique('uq_incident_reference', ['reference'])
export class IncidentEntity {
  /**
   * Always supplied by the application before insert
   * (`IncidentRepositoryPort.nextIdentity()`, UUID v7, `DATA-MODEL.md` §3.1).
   * The database default is a safety net for migrations/fixtures only — see
   * the migration this entity is mapped against.
   */
  @PrimaryColumn({ type: 'uuid', name: 'id' })
  id!: string;

  /**
   * `update: false` is the mapper's own layer of M18's defence in depth
   * (`DATA-MODEL.md` §3.2, §8.5): TypeORM never emits `reference` in an
   * `UPDATE` for any writer that goes through this entity. The database-level
   * guarantee is `T-C1-04`'s immutability trigger — this is a second,
   * independent layer, not a substitute for it.
   */
  @Column({ type: 'varchar', length: 20, name: 'reference', update: false })
  reference!: string;

  @Column({ type: 'varchar', length: 255, name: 'short_description' })
  shortDescription!: string;

  @Column({ type: 'text', name: 'description' })
  description!: string;

  /**
   * `enumName` is set explicitly (schema-qualified by `@Entity`'s `schema` to
   * `incident.origin_channel_enum`) because the default TypeORM would derive —
   * `incident_ticket_origin_channel_enum` — does not match the type name the
   * migration creates (`DATA-MODEL.md` §20.3: exactly `portal`, `agent_logged`,
   * `email`, `in_app` — no `phone`).
   */
  @Column({
    type: 'enum',
    enum: ORIGIN_CHANNEL_CODES,
    enumName: 'origin_channel_enum',
    name: 'origin_channel',
  })
  originChannel!: OriginChannelCode;

  @Column({ type: 'uuid', name: 'reporter_user_id' })
  reporterUserId!: string;

  @Column({ type: 'uuid', name: 'service_id', nullable: true })
  serviceId!: string | null;

  /**
   * The `Incident` aggregate's own domain source for this column is
   * `loggedAtEpochMs` (ADR-014 rule 4: persistence never invents domain
   * state) — never a persistence-only clock read. Plain `@Column`, not
   * `@CreateDateColumn`: the instant is supplied by the mapper, not generated
   * by TypeORM or the database (`DATA-MODEL.md` §3.3, ADR-009).
   */
  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  /**
   * Plain `@Column`, not `@UpdateDateColumn`: an implicit `new Date()` on
   * every `.save()` call would refresh this column from a wall-clock read
   * the aggregate never authorized (ADR-009, ADR-014 rule 4) — exactly the
   * "persistence invents domain state" failure this ticket's mapper refuses
   * elsewhere. On the first save the mapper sets it equal to `created_at`
   * (see `IncidentMapper`'s own doc comment for the justification); a later
   * ticket that adds an actual mutation sets it from that mutation's own
   * `ClockPort` read, explicitly, the same way `created_at` is set here.
   */
  @Column({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'uuid', name: 'created_by' })
  createdBy!: string;

  @Column({ type: 'uuid', name: 'updated_by', nullable: true })
  updatedBy!: string | null;

  /**
   * Optimistic-lock column (`DATA-MODEL.md` §3.3, §20.3). TypeORM sets it to
   * `1` on insert and increments it on every `UPDATE` it issues through this
   * entity; the mapper never assigns it.
   */
  @VersionColumn({ type: 'integer', name: 'version' })
  version!: number;
}
