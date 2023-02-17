import React, { useEffect } from "react";

import type { user, organization } from "@prismaTypes/index";
import { Layout } from "../components/layout/layout";
import { Container } from "../components/layout/container";
import { callExternalApi } from "../utils/external-api.service";
import { API_URL } from "../config/globals";
import { useStore } from "../state/app-state";
import { OrganizationForm } from "../components/forms/organization-form";
import { Card } from "../components/layout/card";
import { InviteMemberForm } from "../components/forms/invite-memeber-form";
import { Link } from "react-router-dom";

const OrganizationPage: React.FC = () => {
  const [scopes] = useStore((state) => [state.scopes]);
  const [accessToken] = useStore((state) => [state.accessToken]);
  const [idToken] = useStore((state) => [state.idToken]);
  const [organization, setOrganization] = useStore((state) => [
    state.organization,
    state.setOrganization,
  ]);
  const [organizationUsers, setOrganizationUsers] = useStore((state) => [
    state.organizationUsers,
    state.setOrganizationUsers,
  ]);

  useEffect(() => {
    if (organizationUsers.length > 0) {
      return;
    }
    const getOrganizationUsers = async () => {
      if (!idToken?.org_id || !accessToken) {
        return;
      }

      const result = await callExternalApi<user[]>({
        config: {
          url: `${API_URL}/user/by-org/${idToken.org_id ?? ""}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: false,
        },
      });

      if (result.success) {
        setOrganizationUsers(result.data);
      }
    };

    void getOrganizationUsers();
  }, [idToken, accessToken]);

  useEffect(() => {
    if (organization) {
      return;
    }
    const getOrganization = async () => {
      if (!idToken?.org_id || !accessToken) {
        return;
      }

      const result = await callExternalApi<organization>({
        config: {
          url: `${API_URL}/organization/by-auth-id/${idToken.org_id ?? ""}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: false,
        },
      });

      if (result.success) {
        setOrganization(result.data);
      }
    };

    void getOrganization();
  }, [idToken, accessToken]);

  const fields: (keyof user)[] = ["name", "email", "job_title"];

  return (
    <Layout title={organization?.name ?? "Organization"}>
      <Container title={organization?.name ?? "Your Organization"}>
        <div className="flex flex-col space-y-6">
          {organization && <OrganizationForm />}
          {scopes?.includes("invite-org-members") && <InviteMemberForm />}
          {organizationUsers.length > 0 && (
            <Card title="Organization Members">
              <table className="table-auto border-collapse border border-slate-400">
                <thead>
                  <tr>
                    <th className="border border-slate-300 bg-slate-200 p-2 font-bold">
                      Name
                    </th>
                    <th className="border border-slate-300 bg-slate-200 p-2 font-bold">
                      Email Address
                    </th>
                    <th className="border border-slate-300 bg-slate-200 p-2 font-bold">
                      Job Title
                    </th>
                    <th className="border border-slate-300 bg-slate-200 p-2 font-bold">
                      Profile
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {organizationUsers.map((user) => (
                    <tr key={`row_${user.id}`}>
                      {fields.map((item) => (
                        <td
                          key={`cell_${item}`}
                          className="border border-slate-300 p-2"
                        >
                          {user[item]?.toString()}
                        </td>
                      ))}
                      <td>
                        <Link to={`/profile/${user.id}`}>View profile</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      </Container>
    </Layout>
  );
};

export default OrganizationPage;
