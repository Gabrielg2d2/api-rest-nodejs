import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z
    .string()
    .transform((value) => Number(value))
    .default("3333"),
});

export const env = envSchema.parse(process.env);
