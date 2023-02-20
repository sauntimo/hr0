import { useStore } from "../../state/app-state";
import { Card } from "../layout/card";
import type { CustomFormField } from "./custom-form";
import { CustomForm } from "./custom-form";
import type { UserRow } from "@commonTypes/Database";
import { useSupabaseContext } from "../../hooks/useSupabase";
import { useEffect, useState } from "react";
import { useDeepCompareEffect } from "react-use";

export const UserAccountForm: React.FC = () => {
  const [idToken] = useStore((state) => [state.idToken]);
  const [user, setUser] = useStore((state) => [state.user, state.setUser]);
  const { client } = useSupabaseContext();

  // const unsub = useStore.subscribe((state) => setUser(state.user));

  const onSubmit = async (userUpdate: Partial<UserRow>): Promise<boolean> => {
    if (!idToken) {
      return false;
    }
    try {
      const userResult = await client
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

  const [fields, setFields] = useState<CustomFormField[]>([]);

  useDeepCompareEffect(() => {
    console.log("user changed");
    setFields([
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
    ]);
  }, [user]);

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
