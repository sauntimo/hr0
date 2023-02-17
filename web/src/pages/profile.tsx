import { useAuth0 } from "@auth0/auth0-react";

import { Container } from "../components/layout/container";
import { Layout } from "../components/layout/layout";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../components/layout/card";
import { useStore } from "../state/app-state";
import { useContext, useEffect } from "react";
import LoadingPage from "./loading";
import type { user } from "@prismaTypes/index";
import { callExternalApi } from "../utils/external-api.service";
import { API_URL } from "../config/globals";
import { CustomForm, CustomFormField } from "../components/forms/custom-form";
import { BreadcrumbContext } from "../hooks/useBreadcrumbs";

const ProfilePage: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const { setBreadcrumbs } = useContext(BreadcrumbContext);
  const params = useParams();
  const navigate = useNavigate();

  const profileUserId = Number(params.userId);

  if (isNaN(profileUserId)) {
    navigate("/");
  }

  const [accessToken] = useStore((state) => [state.accessToken]);
  const [users, addUserToState] = useStore((state) => [
    state.users,
    state.addUserToState,
  ]);
  const [organization] = useStore((state) => [state.organization]);

  const profileUser = users?.[profileUserId];

  useEffect(() => {
    if (!isAuthenticated || users?.[profileUserId]) {
      return;
    }
    const getUser = async () => {
      const result = await callExternalApi<user>({
        config: {
          url: `${API_URL}/user/by-id/${profileUserId ?? ""}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken ?? ""}`,
          },
          withCredentials: false,
        },
      });

      if (result.success) {
        addUserToState(result.data);
      }
    };

    void getUser();
  }, [accessToken, isAuthenticated]);

  useEffect(() => {
    setBreadcrumbs?.([
      { to: "/", text: "Home", link: true },
      {
        to: "/organization",
        text: organization?.name ?? "organization",
        link: true,
      },
      { to: "", text: profileUser.name, link: false },
    ]);
  }, []);

  if (!profileUser) {
    return <LoadingPage />;
  }

  const fields: CustomFormField[] = [
    {
      initialValue: profileUser.name,
      label: "Name",
      fieldName: "name",
      editable: false,
    },
    {
      initialValue: profileUser.email,
      label: "Email Address",
      fieldName: "email",
      editable: false,
    },
    {
      initialValue: profileUser.job_title,
      label: "Job Title",
      fieldName: "job_title",
      editable: false,
    },
  ];

  if (false) {
    fields.push({
      initialValue: profileUser.salary,
      label: "Salary",
      fieldName: "salary",
      editable: false,
    });
  }

  return (
    <Layout title={profileUser.name}>
      <Container title="Profile">
        <div className="flex flex-col space-x-0 space-y-8">
          {profileUser && (
            <Card title={profileUser.name}>
              <CustomForm fields={fields} />
            </Card>
          )}
        </div>
      </Container>
    </Layout>
  );
};

export default ProfilePage;
