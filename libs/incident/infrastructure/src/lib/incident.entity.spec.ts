import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { getMetadataArgsStorage } from 'typeorm';
import { ORIGIN_CHANNEL_CODES } from '@sport-itsm/incident-domain';
import { IncidentEntity } from './incident.entity';

/**
 * The four origin-channel values live in three places that cannot import each
 * other: the domain value object (the authority), this entity (a CLI-loadable
 * leaf that may not import a `@sport-itsm/*` alias — see its header comment)
 * and the migration's raw SQL. Jest resolves aliases, so this spec is where
 * the copies are held to the domain's closed set; a value added or dropped in
 * one place without the others fails here instead of at the database.
 */
describe('IncidentEntity origin_channel enum', () => {
  it('declares exactly the domain OriginChannel codes, in order', () => {
    const column = getMetadataArgsStorage().columns.find(
      (c) => c.target === IncidentEntity && c.propertyName === 'originChannel',
    );

    expect(column?.options.enum).toEqual([...ORIGIN_CHANNEL_CODES]);
  });

  it('matches the value list the migration creates the enum type with', () => {
    const migrationsDir = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      'apps',
      'api',
      'src',
      'migrations',
    );
    const migration = readdirSync(migrationsDir).find((f) =>
      f.endsWith('-CreateIncidentTicketTable.ts'),
    );
    expect(migration).toBeDefined();

    const sql = readFileSync(join(migrationsDir, migration as string), 'utf8');
    const created = sql.match(
      /CREATE TYPE "incident"\."origin_channel_enum" AS ENUM \(([^)]*)\)/,
    );
    expect(created).not.toBeNull();

    const values = (created as RegExpMatchArray)[1]
      .split(',')
      .map((v) => v.trim().replace(/^'|'$/g, ''));
    expect(values).toEqual([...ORIGIN_CHANNEL_CODES]);
  });
});
