import type { user } from "@prismaTypes/index";
import { callExternalApi } from "../../utils/external-api.service";
import { API_URL } from "../../config/globals";
import { useStore } from "../../state/app-state";
import { Card } from "../layout/card";
import type { CustomFormField } from "./custom-form";
import { CustomForm } from "./custom-form";

export const UserAccountForm: React.FC = () => {
  const [accessToken] = useStore((state) => [state.accessToken]);
  const [idToken] = useStore((state) => [state.idToken]);
  const [user, setUser] = useStore((state) => [state.user, state.setUser]);

  const onSubmit = async (userUpdate: Partial<user>): Promise<boolean> => {
    if (!idToken || !accessToken) {
      return false;
    }

    const result = await callExternalApi<user>({
      config: {
        url: `${API_URL}/user/${idToken.sub}`,
        method: "PATCH",
        data: { ...userUpdate, sub: idToken.sub },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: false,
      },
    });

    if (result.success) {
      setUser({ ...user, ...result.data });
    }
    return result.success;
  };

  if (!user) {
    return null;
  }

  const fields: CustomFormField[] = [
    {
      initialValue: user.name,
      label: "Name",
      fieldName: "name",
    },
    {
      initialValue: user.email,
      label: "Email Address",
      fieldName: "email",
      editable: false,
    },
    {
      initialValue: user.job_title,
      label: "Job Title",
      fieldName: "job_title",
    },
    {
      initialValue: user.salary,
      label: "Salary",
      fieldName: "salary",
      editable: false,
    },
  ];

  return (
    <Card title="Update your personal details">
      <CustomForm
        onSubmit={onSubmit}
        submitValue="Update your details"
        fields={fields}
      />
    </Card>
  );
};
