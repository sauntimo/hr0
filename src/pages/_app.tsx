import type { AppProps } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import { Auth0ProviderWithNavigate } from "../providers/auth0-provider-with-navigate";
import { AuthGuard } from "../providers/authentication-guard";
import React from "react";
import type { NextPage } from "next";

// const MyApp: AppType = ({ Component, pageProps }) => {
//   return (
//     <Auth0ProviderWithNavigate>
//       <Component {...pageProps} />
//     </Auth0ProviderWithNavigate>
//   );
// };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NextApplicationPage<P = any, IP = P> = NextPage<P, IP> & {
  requireAuth?: boolean;
};

const Root = (props: AppProps) => {
  const {
    Component,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    pageProps,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { Component: NextApplicationPage; pageProps: any } = props;

  return (
    <Auth0ProviderWithNavigate>
      {Component.requireAuth ? (
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      ) : (
        <Component {...pageProps} />
      )}
    </Auth0ProviderWithNavigate>
    // <Auth0Provider
    //   domain={DOMAIN}
    //   clientId={CLIENT_ID}
    //   authorizationParams={{
    //     redirect_uri: CALLBACK_URL,
    //   }}
    //   // onRedirectCallback={onRedirectCallback}
    // >
    //   <Component {...pageProps} />
    // </Auth0Provider>
  );
};

export default api.withTRPC(Root);
