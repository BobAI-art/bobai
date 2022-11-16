// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.preprocess(
    // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    // Since NextAuth automatically uses the VERCEL_URL if present.
    (str) => process.env.VERCEL_URL ?? str,
    // VERCEL_URL doesnt include `https` so it cant be validated as a URL
    process.env.VERCEL ? z.string() : z.string().url()
  ),
  EMAIL_SERVER: z.string().url(),
  EMAIL_FROM: z.string(),
  AWS_S3_REGION: z.string(),
  AWS_S3_BUCKET: z.string(),
  AWS_S3_ACCESS_KEY_ID: z.string(),
  AWS_S3_ACCESS_KEY_SECRET: z.string(),
  VAST_API_KEY: z.string(),

  AWS_S3_MODEL_ACCESS_KEY_ID: z.string(),
  AWS_S3_MODEL_ACCESS_KEY_SECRET: z.string(),
  AWS_S3_MODEL_BUCKET_NAME: z.string(),

  DOCKER_IO_PASSWORD: z.string(),
  SITE_PIN: z.string().optional(),
  HUGGINGFACE_TOKEN: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  // NEXT_PUBLIC_BAR: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  // NEXT_PUBLIC_BAR: process.env.NEXT_PUBLIC_BAR,
  AWS_S3_REGION: process.env.AWS_S3_REGION,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
};
