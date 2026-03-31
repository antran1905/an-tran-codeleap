import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_NAME: z.string().min(1),
  VITE_DOG_API_BASE_URL: z.url(),
  VITE_DOG_API_KEY: z.string().min(1),
  VITE_PROGRESS_STORAGE_KEY: z.string().min(1),
});

export type AppEnv = z.infer<typeof envSchema>;

export function parseEnv(rawEnv: Record<string, unknown>): AppEnv {
  return envSchema.parse(rawEnv);
}

export const Env = parseEnv(import.meta.env as Record<string, unknown>);
