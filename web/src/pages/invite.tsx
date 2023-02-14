import React from "react";

import { useSearchParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { Layout } from "../components/layout/layout";
import { redirecLoginOptionsSignup } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/layout/container";

interface InviteParams {
  invitation?: string;
  organization?: string;
  organization_name?: string;
}

const InvitePage: React.FC = () => {
  const { loginWithRedirect, loginWithPopup } = useAuth0();

  const [searchParams, setSearchParams] = useSearchParams();

  const paramsKv = Object.fromEntries(searchParams.entries()) as InviteParams;

  const title =
    paramsKv.invitation && paramsKv.organization_name
      ? `Welcome to ${paramsKv.organization_name}`
      : "Welcome";

  const body =
    paramsKv.invitation && paramsKv.organization_name
      ? `Hey! 👋 It looks like you've received an invitation to join the 
            ${paramsKv.organization_name} organization, so that's cool. Generally in real life we'd redirect you immediately without showing you this page, but for our purposes it's useful to see what's actually happening here.`
      : "Hey! usually people arrive at this page when they click on a link inviting them to an hr0 organization - but you don't seem to have an invitation. Maybe try signing in normally?";

  const handleCreateAccount = () => {
    void loginWithRedirect({
      // appState: {
      //   returnTo: "/redirect",
      // },
      authorizationParams: {
        // prompt: "consent",
        // screen_hint: "signup",
        organization: paramsKv.organization,
        invitation: paramsKv.invitation,
        useCookiesForTransactions: true,
      },
    });
  };

  return (
    <Layout title="Sign In">
      <Container title={title}>
        <div>
          <p>{body}</p>
          <button
            className="btn-outline btn-secondary btn"
            onClick={handleCreateAccount}
          >
            Create Account
          </button>
        </div>

        <table className="table-auto border-collapse border border-slate-400">
          <thead>
            <tr>
              <th className="border border-slate-300 bg-slate-200 p-2 font-bold">
                URL Param
              </th>
              <th className="border border-slate-300 bg-slate-200 p-2 font-bold">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from(Object.entries(paramsKv) as [string, string][]).map(
              (entry) => (
                <tr key={`row_${entry[0]}`}>
                  {entry.map((item) => (
                    <td
                      key={`cell_${item}`}
                      className="border border-slate-300 p-2"
                    >
                      {item}
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </Container>
    </Layout>
  );
};

export default InvitePage;
