import { useStore } from "../../state/app-state";
import { Card } from "../layout/card";
import type { CustomFormField } from "./custom-form";
import { CustomForm } from "./custom-form";
import { getSupabaseClient, supabaseClient } from "../../db/supabase";
import type { Database } from "@commonTypes/supabase";
import { useEffect, useState } from "react";

export type SbUser = Database["public"]["Tables"]["user"]["Row"];

type SupbaseClientType = Awaited<ReturnType<typeof getSupabaseClient>>;

export const UserAccountForm: React.FC = () => {
  const [accessToken] = useStore((state) => [state.accessToken]);
  const [idToken] = useStore((state) => [state.idToken]);
  const [user, setUser] = useStore((state) => [state.user, state.setUser]);
  const [supabaseAccessToken] = useStore((state) => [
    state.supabaseAccessToken,
  ]);
  const [supabaseRefreshToken] = useStore((state) => [
    state.supabaseRefreshToken,
  ]);

  const [supabase, setSupabase] = useState<SupbaseClientType | null>();

  useEffect(() => {
    if (!supabaseAccessToken) {
      return;
    }

    const setup = async () => {
      const client = await getSupabaseClient({
        supabaseAccessToken,
        supabaseRefreshToken,
      });

      setSupabase(client);
    };

    void setup();

    // return channel.unsubscribe();
  }, [supabaseAccessToken]);

  useEffect(() => {
    if (!supabase) {
      return;
    }
    const test = () => {
      // const user = await supabase.auth.getUser();
      // const test = await supabase.from("user").select("*");
      // console.log({ test, user });

      const channel = supabase
        .channel("tim-test")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
          },
          (payload) => console.log(payload)
        )
        // .subscribe((status) => {
        //   console.log("subscribe status = ", status);
        // });
        .subscribe();
    };

    void test();
  }, [supabase]);

  // ((auth.jwt() ->> 'sub'::text) = (uuid)::text)

  // useEffect(() => {
  //   supabaseClient
  //     .channel("tim-test-2")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "UPDATE",
  //         schema: "public",
  //       },
  //       (payload) => console.log(payload)
  //     )
  //     .subscribe((status) => {
  //       console.log("subscribe status = ", status);
  //     });
  // }, []);

  // const supabaseClient = getSupabaseClient({ supabaseAccessToken });

  const onSubmit = async (userUpdate: Partial<SbUser>): Promise<boolean> => {
    if (!idToken || !accessToken || !supabase) {
      return false;
    }
    try {
      const userResult = await supabase
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
