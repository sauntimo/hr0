import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

import { Container } from "../components/layout/container";
import { Layout } from "../components/layout/layout";
import { API_URL, AUDIENCE, SCOPES } from "../config/globals";
import { callExternalApi } from "../utils/external-api.service";
import type { user } from "@prismaTypes/index";
import type { IdTokenWithSub } from "../types/jwt";
import { UserAccountForm } from "../components/forms/user-account-form";
import { Link } from "react-router-dom";
import { useStore } from "../state/app-state";
import { Card } from "../components/layout/card";
import { getSupabaseToken, supabaseClient } from "../db/supabase";

const AccountPage: React.FC = () => {
  const {
    user: auth0User,
    isAuthenticated,
    getIdTokenClaims,
    getAccessTokenSilently,
  } = useAuth0();

  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useStore((state) => [state.user, state.setUser]);
  const [idToken, setIdToken] = useStore((state) => [
    state.idToken,
    state.setIdToken,
  ]);
  const [accessToken, setAccessToken] = useStore((state) => [
    state.accessToken,
    state.setAccessToken,
  ]);
  const [, setScopes] = useStore((state) => [state.scopes, state.setScopes]);
  const [supabaseAccessToken, setSupabaseAccessToken] = useStore((state) => [
    state.supabaseAccessToken,
    state.setSupabaseAccessToken,
  ]);
  const [supabaseRefreshToken, setSupabaseRefreshToken] = useStore((state) => [
    state.supabaseRefreshToken,
    state.setSupabaseRefreshToken,
  ]);

  useEffect(() => {
    if (!isAuthenticated || (accessToken && idToken)) {
      return;
    }

    const getToken = async () => {
      const retrievedAccessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: AUDIENCE,
          scope: SCOPES,
        },
        detailedResponse: true,
      });

      if (retrievedAccessToken) {
        setAccessToken(retrievedAccessToken.access_token);
        setScopes(retrievedAccessToken.scope);
      }

      const idToken = (await getIdTokenClaims()) as IdTokenWithSub;

      if (!idToken || !idToken.sub || typeof idToken.sub !== "string") {
        setError("Failed to authenticate user");
        return;
      }

      setIdToken(idToken);
    };

    void getToken();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (supabaseAccessToken || !accessToken) {
      return;
    }

    const getSupabaseTokenWrapper = async () => {
      const supabaseTokenResult = await getSupabaseToken({
        auth0AccessToken: accessToken,
      });

      if (supabaseTokenResult.success) {
        setSupabaseAccessToken(supabaseTokenResult.data.access_token);
        setSupabaseRefreshToken(supabaseTokenResult.data.refresh_token);
      }
    };

    void getSupabaseTokenWrapper();
  }, [accessToken]);

  useEffect(() => {
    if (!isAuthenticated || user || !idToken?.sub) {
      return;
    }
    const getUser = async () => {
      const result = await callExternalApi<user>({
        config: {
          url: `${API_URL}/user/by-sub/${idToken?.sub ?? ""}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken ?? ""}`,
          },
          withCredentials: false,
        },
      });

      if (result.success) {
        setUser(result.data);
      }
    };

    void getUser();
  }, [idToken, accessToken]);

  return (
    <Layout title="Account">
      <Container title="Account">
        <div className="flex flex-col space-x-0 space-y-8">
          {error && <p>{error}</p>}
          <UserAccountForm />
          <Card title="Organization">
            <Link
              className="btn-outline btn-secondary btn"
              to={`/organization/`}
            >
              View organization details
            </Link>
          </Card>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(auth0User, null, 2)}
          </pre>
        </div>
      </Container>
    </Layout>
  );
};

export default AccountPage;
