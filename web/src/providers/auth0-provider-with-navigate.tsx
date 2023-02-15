import type { AppState } from "@auth0/auth0-react";
import { Auth0Provider } from "@auth0/auth0-react";
import type { PropsWithChildren } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AUDIENCE,
  CALLBACK_URL,
  CLIENT_ID,
  DOMAIN,
  SCOPES,
} from "../config/globals";

interface Auth0ProviderWithNavigateProps {
  children: React.ReactNode;
}

export const Auth0ProviderWithNavigate = ({
  children,
}: PropsWithChildren<Auth0ProviderWithNavigateProps>): JSX.Element | null => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: AppState) => {
    console.log("Tim's custom onRedirectCallBack");
    void navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={DOMAIN}
      clientId={CLIENT_ID}
      authorizationParams={{
        audience: AUDIENCE,
        scope: SCOPES,
        clientID: CLIENT_ID,
        prompt: "consent",
        redirect_uri: CALLBACK_URL,
        useCookiesForTransactions: false,
        useRefreshTokens: true,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
