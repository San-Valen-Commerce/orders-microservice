import 'dotenv/config';
import { z } from 'zod';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  PRODUCTS_MICROSERVICE_HOST: string;
  PRODUCTS_MICROSERVICE_PORT: number;
}

const envsSchema = z
  .object({
    PORT: z.coerce.number(),
    DATABASE_URL: z.coerce.string(),
    PRODUCTS_MICROSERVICE_HOST: z.coerce.string(),
    PRODUCTS_MICROSERVICE_PORT: z.coerce.number(),
  })
  .passthrough();

const envVars = envsSchema.parse(process.env);

export const envs: EnvVars = {
  ...envVars,
};
