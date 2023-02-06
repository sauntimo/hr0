import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

import { Layout } from "../components/layout";
import { Container } from "../components/container";
import { redirecLoginOptions } from "../utils/auth";

export function AuthGuard({ children }: { children: JSX.Element }) {
  const { user, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading) {
      // auth is initialized and there is no user
      if (!user) {
        // redirect to login
        void loginWithRedirect(redirecLoginOptions);
      }
    }
  }, [isLoading, loginWithRedirect, user]);

  /* show loading indicator while the auth provider is still loading */
  if (isLoading) {
    return (
      <Layout title="Loading">
        <Container title="Loading..."></Container>
      </Layout>
    );
  }

  // if auth initialized with a valid user show protected page
  if (!isLoading && user) {
    return <>{children}</>;
  }

  /* otherwise don't return anything, will do a redirect from useEffect */
  return null;
}
