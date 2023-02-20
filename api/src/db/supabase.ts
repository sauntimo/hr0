import { createClient } from "@supabase/supabase-js";
import type { Database } from "@commonTypes/supabase";
import { SUPABASE_API_URL, SUPABASE_PRIVATE_KEY } from "../config/globals";

export const supabaseClient = createClient<Database>(
  SUPABASE_API_URL,
  SUPABASE_PRIVATE_KEY
);
