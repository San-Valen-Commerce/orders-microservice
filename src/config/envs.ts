import 'dotenv/config';
import { z } from 'zod';

interface EnvVars {
  PORT: number;
}

const envsSchema = z
  .object({
    PORT: z.coerce.number(),
  })
  .passthrough();

const envVars = envsSchema.parse(process.env);

export const envs: EnvVars = {
  ...envVars,
};
