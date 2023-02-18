import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container } from "../components/layout/container";
import { Layout } from "../components/layout/layout";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/layout/card";

import { callExternalApi } from "../utils/external-api.service";
import { API_URL } from "../config/globals";
import type { CustomFormField } from "../components/forms/custom-form";
import { CustomForm } from "../components/forms/custom-form";

import type {
  CreateOrganizationResponse,
  OrganizationCreate,
} from "@commonTypes/organization";

const NewOrganizationPage: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState<string | null>(null);

  const createOrganization = async (
    organizationCreate: OrganizationCreate
  ): Promise<boolean> => {
    const result = await callExternalApi<CreateOrganizationResponse>({
      config: {
        method: "POST",
        url: `${API_URL}/organization/`,
        data: organizationCreate,
        withCredentials: false,
      },
    });

    setFeedback(
      result.success ? "Created new organization" : result.error.message
    );

    if (result.success) {
      window.location.href = result.data.invitationUrl;
    }

    return result.success;
  };

  // can't create a new org if logged in
  if (isAuthenticated) {
    navigate("/organization");
  }

  const newOrgNameFields: CustomFormField[] = [
    {
      label: "Organization Unique Name - should be url safe",
      fieldName: "org_auth_provider_name",
    },
    {
      label: "Organization Display Name",
      fieldName: "org_display_name",
      validation: { minLength: 3 },
    },
    {
      label: "Your name",
      fieldName: "user_name",
      validation: { minLength: 2 },
    },
    {
      label: "Your email address",
      fieldName: "user_email",
      validation: { minLength: 5 },
    },
  ];

  return (
    <Layout title="New Organization">
      <Container title="Create a new hr0 Organization">
        {feedback && <p>{feedback}</p>}
        <Card title="New Organization Details">
          <CustomForm
            onSubmit={createOrganization}
            submitValue="Create Organization"
            fields={newOrgNameFields}
          />
        </Card>
      </Container>
    </Layout>
  );
};

export default NewOrganizationPage;
