import type { user } from "@prismaTypes/index";
import { callExternalApi } from "../../utils/external-api.service";
import { API_URL } from "../../config/globals";
import { useStore } from "../../state/app-state";
import { Card } from "../layout/card";
import type { CustomFormField } from "./custom-form";
import { CustomForm } from "./custom-form";

interface InviteForm {
  inviteeEmail: string;
}

export const InviteMemberForm: React.FC = () => {
  const [accessToken] = useStore((state) => [state.accessToken]);
  const [idToken] = useStore((state) => [state.idToken]);
  const [user] = useStore((state) => [state.user, state.setUser]);

  if (!accessToken || !idToken || !user) {
    return null;
  }

  const onSubmit = async (data: InviteForm): Promise<boolean> => {
    if (!idToken || !accessToken) {
      return false;
    }

    const result = await callExternalApi<user>({
      config: {
        url: `${API_URL}/auth0/invite`,
        method: "POST",
        data: { inviterName: user.name, inviteeEmail: data.inviteeEmail },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: false,
      },
    });

    return result.success;
  };

  const fields: CustomFormField[] = [
    {
      initialValue: null,
      label: "Invitee Email Address",
      fieldName: "inviteeEmail",
    },
  ];

  return (
    <Card title="Invite new members to your organization">
      <CustomForm
        onSubmit={onSubmit}
        submitValue="Invite User"
        fields={fields}
      />
    </Card>
  );
};
