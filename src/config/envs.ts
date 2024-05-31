import 'dotenv/config';
import { z } from 'zod';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
}

const envsSchema = z
  .object({
    PORT: z.coerce.number(),
    DATABASE_URL: z.coerce.string(),
  })
  .passthrough();

const envVars = envsSchema.parse(process.env);

export const envs: EnvVars = {
  ...envVars,
};
