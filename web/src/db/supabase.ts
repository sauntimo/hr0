import { ApiResponse } from "@commonTypes/api-response";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../lib/database.types";
import { API_URL, SUPABASE_ANON_KEY, SUPABASE_URL } from "../config/globals";
import { callExternalApi } from "../utils/external-api.service";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

interface SupabaseTokenParams {
  auth0AccessToken: string;
}

interface SupabaseTokenResult {
  accessToken: string;
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
}

export const getSupabaseClient = ({
  supabaseAccessToken,
}: SupabaseClientParams) => {
  return createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    supabaseAccessToken
      ? {
          global: {
            headers: { Authorization: `Bearer ${supabaseAccessToken}` },
          },
        }
      : {}
  );
};
