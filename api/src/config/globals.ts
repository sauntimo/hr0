import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT ?? "";
export const POSTGRES_URL = process.env.POSTGRES_URL ?? "";
export const PGBOUNCER_URL = process.env.PGBOUNCER_URL ?? "";
export const CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_URL ?? "";
export const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE ?? "";
export const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN ?? "";
export const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID ?? "";
export const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET ?? "";
export const AUTH0_CONNECTION_ID = process.env.AUTH0_CONNECTION_ID ?? "";
export const AUTH0_M2M_CLIENT_ID = process.env.AUTH0_M2M_CLIENT_ID ?? "";
export const AUTH0_M2M_CLIENT_SECRET =
  process.env.AUTH0_M2M_CLIENT_SECRET ?? "";
export const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET ?? "";
export const SUPABASE_PRIVATE_KEY = process.env.SUPABASE_PRIVATE_KEY ?? "";
export const SUPABASE_API_URL = process.env.SUPABASE_API_URL ?? "";
