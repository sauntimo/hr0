// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js
 * middleware, so you have to do it manually here.
 * @type {{ [k in keyof z.input<typeof serverSchema>]: string | undefined }}
 */
export const serverEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
};

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  // NEXT_PUBLIC_CLIENTVAR: z.string(),
  NEXT_PUBLIC_API_SERVER_URL: z.string().url(),
  NEXT_PUBLIC_AUTH0_DOMAIN: z.string(),
  NEXT_PUBLIC_AUTH0_CLIENT_ID: z.string(),
  NEXT_PUBLIC_AUTH0_CALLBACK_URL: z.string().url(),
  NEXT_PUBLIC_AUTH0_AUDIENCE: z.string().url(),
  NEXT_PUBLIC_STATE: z.string(),
  NEXT_PUBLIC_SCOPES: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.input<typeof clientSchema>]: string | undefined }}
 */
export const clientEnv = {
  // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  NEXT_PUBLIC_API_SERVER_URL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  NEXT_PUBLIC_AUTH0_DOMAIN: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  NEXT_PUBLIC_AUTH0_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  NEXT_PUBLIC_AUTH0_CALLBACK_URL: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL,
  NEXT_PUBLIC_AUTH0_AUDIENCE: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
  NEXT_PUBLIC_STATE: process.env.NEXT_PUBLIC_STATE,
  NEXT_PUBLIC_SCOPES: process.env.NEXT_PUBLIC_SCOPES,
};
