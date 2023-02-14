import { withAuthenticationRequired } from "@auth0/auth0-react";
import type { ComponentType } from "react";
import React from "react";
import { Container } from "../components/layout/container";
import { Layout } from "../components/layout/layout";

interface AuthenticationGuardProps {
  component: ComponentType;
}

export const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({
  component,
}) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <Layout title="Loading">
        <Container title="Loading..."></Container>
      </Layout>
    ),
  });

  return <Component />;
};
