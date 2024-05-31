import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as Schema from 'src/drizzle/schema';
import { envs } from 'src/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

export async function migrateDb() {
  const client = new Client({
    connectionString: envs.DATABASE_URL,
  });

  await client.connect();

  const db = drizzle(client, { schema: Schema });

  await migrate(db, { migrationsFolder: './drizzle' });

  await client.end();
}

migrateDb()
  .then(() => console.log('Migrations complete'))
  .catch((err) => console.error(err))
  .finally(() => process.exit(0));
