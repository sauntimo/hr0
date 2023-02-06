import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { Container } from "../components/container";
import { Layout } from "../components/layout";
import { TextInput } from "../components/text-input";
import type { NextApplicationPage } from "./_app";

const Profile: NextApplicationPage = () => {
  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getToken = async () => {
      await getAccessTokenSilently();
    };

    void getToken();
  }, [getAccessTokenSilently]);

  if (!user) {
    return null;
  }

  return (
    <Layout title="Profile">
      <Container title="Profile">
        <div className="flex flex-col space-x-0 space-y-4">
          <div className="form flex flex-col space-y-4">
            <TextInput initialValue={user?.nickname} label="Name" />
            <TextInput
              initialValue={user?.email}
              label="Email address"
              editable={false}
            />
          </div>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </Container>
    </Layout>
  );
};

Profile.requireAuth = true;

export default Profile;
