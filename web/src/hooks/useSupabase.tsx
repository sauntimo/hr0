import { createContext, useEffect, useState } from "react";
import { ApiResponse } from "@commonTypes/api-response";
import { callExternalApi } from "../utils/external-api.service";
import { API_URL, SUPABASE_ANON_KEY, SUPABASE_URL } from "../config/globals";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@commonTypes/supabase";
import type { UserRow } from "@commonTypes/Database";
import { useStore } from "../state/app-state";
import React from "react";

interface Alert {
  type: string;
  message: string;
}

interface SupabaseContext {
  client: SupabaseClient<Database>;
  alerts: Alert[];
}

interface UseSupabaseReturn {
  client?: SupabaseClient<Database>;
  alerts: Alert[];
}

const SupabaseContext = createContext<SupabaseContext | undefined>(undefined);

interface SupabaseProviderProps {
  children: JSX.Element;
}

export const useSupabase = (): UseSupabaseReturn => {
  const [accessToken] = useStore((state) => [state.accessToken]);
  const [user, setUser] = useStore((state) => [state.user, state.setUser]);
  const [supabaseAccessToken, setSupabaseAccessToken] = useState<string>();
  const [supabaseRefreshToken, setSupabaseRefreshToken] = useState<string>();
  const [client, setClient] = useState<SupabaseClient<Database>>();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Get supabase token from API
  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const getToken = async () => {
      const tokenResult = await getSupabaseToken({
        auth0AccessToken: accessToken,
      });

      if (tokenResult.success) {
        setSupabaseAccessToken(tokenResult.data.access_token);
        setSupabaseRefreshToken(tokenResult.data.refresh_token);
      }
    };

    void getToken();
  }, [accessToken]);

  // Instantiate Supabase Client
  useEffect(() => {
    if (!supabaseAccessToken || !supabaseRefreshToken) {
      return;
    }

    const createSupabaseClient = async () => {
      const client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
      await client.auth.setSession({
        access_token: supabaseAccessToken,
        refresh_token: supabaseRefreshToken,
      });

      setClient(client);
    };

    void createSupabaseClient();
  }, [supabaseAccessToken, supabaseRefreshToken]);

  // Subscribe to changes when client and user are available
  useEffect(() => {
    if (!client || !user) {
      return;
    }

    client
      .channel(`user-id-${user.id}-changes`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
        },
        (payload) => {
          void updateUserInState(client, setUser);

          setAlerts([
            {
              type: "success",
              message: "Your profile was updated",
            },
          ]);

          setTimeout(() => setAlerts([]), 3000);
        }
      )
      .subscribe();
  }, [client, user]);

  return { client, alerts };
};

const updateUserInState = async (
  client: SupabaseClient<Database>,
  setUser: (user: UserRow) => void
) => {
  const userResult = await client.from("user").select("*");
  if (!userResult.error && userResult.data.length === 1) {
    setUser(userResult.data[0]);
  }
};

interface SupabaseProviderProps {
  children: JSX.Element;
}

export const SupabaseProvider = ({
  children,
}: SupabaseProviderProps): JSX.Element => {
  const { client, alerts } = useSupabase();

  return (
    <SupabaseContext.Provider
      value={{
        client: client!,
        alerts,
      }}
    >
      <>
        {children}
        {alerts.map((alert, index) => (
          <Alert
            key={`${alert.type}_${index}`}
            type={alert.type}
            message={alert.message}
          />
        ))}
      </>
    </SupabaseContext.Provider>
  );
};

const Alert: React.FC<Alert> = ({ type, message }) => {
  return (
    <div
      className={`alert alert-success fixed top-20 right-6 w-auto shadow-lg`}
    >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 flex-shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
};

export const useSupabaseContext = () => {
  const context = React.useContext(SupabaseContext);
  // If context is undefined, we know we used RadioGroupItem
  // outside of our provider so we can throw a more helpful
  // error!
  if (context === undefined) {
    throw Error("Supabase must be used inside context");
  }

  // Because of TypeScript's type narrowing, if we make it past
  // the error the compiler knows that context is always defined
  // at this point, so we don't need to do any conditional
  // checking on its values when we use this hook!
  return context;
};

/******************
 * UTIL FUNCTIONS *
 ******************/

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
