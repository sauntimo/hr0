import type { AppState } from "@auth0/auth0-react";
import { Auth0Provider } from "@auth0/auth0-react";
import type { PropsWithChildren } from "react";
import React from "react";
import { useRouter } from "next/router";
import { env } from "../env/client.mjs";

interface Auth0ProviderWithNavigateProps {
  children: React.ReactNode;
}

export const Auth0ProviderWithNavigate = ({
  children,
}: PropsWithChildren<Auth0ProviderWithNavigateProps>): JSX.Element | null => {
  const router = useRouter();

  const onRedirectCallback = (appState?: AppState) => {
    void router.push(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: env.NEXT_PUBLIC_AUTH0_CALLBACK_URL,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
