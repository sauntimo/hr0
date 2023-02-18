import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { Layout } from "../components/layout/layout";
import { Container } from "../components/layout/container";
import { SCOPES } from "../config/globals";

interface InviteParams {
  invitation?: string;
  organization?: string;
  organization_name?: string;
}

const InvitePage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const paramsKv = Object.fromEntries(searchParams.entries()) as InviteParams;

  if (
    !paramsKv.invitation ||
    !paramsKv.organization ||
    !paramsKv.organization_name
  ) {
    navigate("/");
  }

  const title = "Redirecting you to sign in";

  const handleCreateAccount = () => {
    void loginWithRedirect({
      authorizationParams: {
        scopes: SCOPES,
        organization: paramsKv.organization,
        invitation: paramsKv.invitation,
        useCookiesForTransactions: false,
      },
    });
  };

  void handleCreateAccount();

  return (
    <Layout title="Sign In">
      <Container title={title}>
        <div>
          <p>If you aren't redirected, click here to sign up.</p>
          <button
            className="btn-outline btn-secondary btn"
            onClick={handleCreateAccount}
          >
            Create Account
          </button>
        </div>

        {/* <table className="table-auto border-collapse border border-slate-400">
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
        </table> */}
      </Container>
    </Layout>
  );
};

export default InvitePage;
