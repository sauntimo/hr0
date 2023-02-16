import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

import { Container } from "../components/layout/container";
import { Layout } from "../components/layout/layout";
import { API_URL, AUDIENCE, SCOPES } from "../config/globals";
import { callExternalApi } from "../utils/external-api.service";
import type { user } from "@prismaTypes/index";
import type { IdTokenWithSub } from "../types/jwt";
import { UserAccountForm } from "../components/forms/user-account-form";
import { Link, useSearchParams } from "react-router-dom";
import { useStore } from "..";
import { Card } from "../components/layout/card";

const ProfilePage: React.FC = () => {
  const {
    user: auth0User,
    isAuthenticated,
    getIdTokenClaims,
    getAccessTokenSilently,
  } = useAuth0();

  const [searchParams] = useSearchParams();

  const profileUserId = searchParams.get("userId");

  return (
    <Layout title="Profile">
      <Container title="Profile">
        <div className="flex flex-col space-x-0 space-y-8">
          <Card title="Profile">
            <p>You're viewing the profile of userId {profileUserId}</p>
            <Link
              className="btn-outline btn-secondary btn"
              to={`/organization/`}
            >
              View organization
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

export default ProfilePage;
