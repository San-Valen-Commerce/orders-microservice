import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as Schema from './schema';
import { envs } from 'src/config';
import { Logger } from '@nestjs/common';

export const DrizzleAsyncProvider = 'drizzleProvider';
export const DrizzleSchemaProvider = 'drizzleSchemaProvider';

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    useFactory: async () => {
      const client = new Client({
        connectionString: envs.DATABASE_URL,
      });

      await client.connect();
      Logger.log('Connected to database orders', 'DrizzleProvider');
      const db = drizzle(client, { schema: Schema });
      return db;
    },
  },
  {
    provide: DrizzleSchemaProvider,
    useValue: Schema,
  },
];
