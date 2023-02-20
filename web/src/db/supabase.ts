import { ApiResponse } from "@commonTypes/api-response";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@commonTypes/supabase";
import { API_URL, SUPABASE_ANON_KEY, SUPABASE_URL } from "../config/globals";
import { callExternalApi } from "../utils/external-api.service";

export const supabaseClient = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

interface SupabaseTokenParams {
  auth0AccessToken: string;
}

interface SupabaseTokenResult {
  access_token: string;
  refresh_token: string;
}

export const getSupabaseToken = async ({
  auth0AccessToken,
}: SupabaseTokenParams): Promise<ApiResponse<SupabaseTokenResult>> => {
  return callExternalApi<SupabaseTokenResult>({
    config: {
      url: `${API_URL}/supabase/token`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth0AccessToken}`,
      },
      withCredentials: false,
    },
  });
};

interface SupabaseClientParams {
  supabaseAccessToken: string;
  supabaseRefreshToken: string;
}

export const getSupabaseClient = async ({
  supabaseAccessToken,
  supabaseRefreshToken,
}: SupabaseClientParams) => {
  const client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  await client.auth.setSession({
    access_token: supabaseAccessToken,
    refresh_token: supabaseRefreshToken,
  });

  return client;
};
