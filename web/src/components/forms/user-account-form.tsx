import { useStore } from "../../state/app-state";
import { Card } from "../layout/card";
import type { CustomFormField } from "./custom-form";
import { CustomForm } from "./custom-form";
import { getSupabaseClient } from "../../db/supabase";
import { Database } from "../../../lib/database.types";

export type SbUser = Database["public"]["Tables"]["user"]["Row"];

export const UserAccountForm: React.FC = () => {
  const [accessToken] = useStore((state) => [state.accessToken]);
  const [idToken] = useStore((state) => [state.idToken]);
  const [user, setUser] = useStore((state) => [state.user, state.setUser]);
  const [supabaseAccessToken] = useStore((state) => [
    state.supabaseAccessToken,
  ]);

  const onSubmit = async (userUpdate: Partial<SbUser>): Promise<boolean> => {
    if (!idToken || !accessToken || !supabaseAccessToken) {
      return false;
    }
    try {
      const supabaseClient = getSupabaseClient({ supabaseAccessToken });

      const userResult = await supabaseClient
        .from("user")
        .update(userUpdate)
        .eq("sub", idToken.sub)
        .select();

      if (userResult.error) {
        throw new Error(userResult.error.message);
      }

      const updatedUser = userResult.data[0];

      setUser({ ...user, ...updatedUser });

      return true;
    } catch (error) {
      return false;
    }
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
