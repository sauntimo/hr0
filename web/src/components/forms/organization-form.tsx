import type { organization } from "@prismaTypes/index";
import { callExternalApi } from "../../utils/external-api.service";
import { API_URL } from "../../config/globals";
import { useStore } from "../../state/app-state";
import { Card } from "../layout/card";
import type { CustomFormField } from "./custom-form";
import { CustomForm } from "./custom-form";

export const OrganizationForm: React.FC = () => {
  const [accessToken] = useStore((state) => [state.accessToken]);
  const [idToken] = useStore((state) => [state.idToken]);
  const [organization, setOrganization] = useStore((state) => [
    state.organization,
    state.setOrganization,
  ]);

  if (!accessToken || !idToken || !organization) {
    return null;
  }

  const onSubmit = async (
    organizationUpdate: Partial<organization>
  ): Promise<boolean> => {
    const result = await callExternalApi<organization>({
      config: {
        url: `${API_URL}/organization/${organization.auth_provider_id}`,
        method: "PATCH",
        data: organizationUpdate,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: false,
      },
    });

    if (result.success) {
      setOrganization({ ...organization, ...result.data });
    }

    return result.success;
  };

  const fields: CustomFormField[] = [
    {
      initialValue: organization.name,
      label: "Organization name",
      fieldName: "name",
    },
    {
      initialValue: organization.auth_provider_name,
      label: "Auth provider identifier",
      fieldName: "auth_provider_name",
      editable: false,
    },
    {
      initialValue: organization.auth_provider_id,
      label: "Auth provider ID",
      fieldName: "auth_provider_id",
      editable: false,
    },
  ];

  return (
    <Card title="Organization Details">
      <CustomForm
        onSubmit={onSubmit}
        submitValue="Update organization details"
        fields={fields}
      />
    </Card>
  );
};
