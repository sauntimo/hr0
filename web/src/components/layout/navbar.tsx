import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "../user-profile";
import { redirecLoginOptions } from "../../utils/auth";
import { Link } from "react-router-dom";
import { useStore } from "../..";
import { callExternalApi } from "../../utils/external-api.service";
import { CLIENT_ID, DOMAIN, SCOPES, STATE } from "../../config/globals";

export const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    loginWithRedirect,
    user: auth0User,
    logout,
  } = useAuth0();

  const [user] = useStore((state) => [state.user]);
  const [resetState] = useStore((state) => [state.resetState]);

  const handleSignUp = (): void => {
    // if we are already authed, redirect
    if (isAuthenticated) {
      navigate("/account");
      return;
    }

    // otherwise redirect to sign up
    navigate("/new-organization");
  };

  const handleLogin = () => {
    // console.log(`[${codeChallenge}]`);

    // const params = new URLSearchParams({
    //   response_type: "code",
    //   code_challenge: codeChallenge,
    //   code_challenge_method: "S256",
    //   client_id: CLIENT_ID,
    //   redirect_uri: "https://localhost:3000/redirect",
    //   scope: SCOPES,
    //   state: STATE,
    // });

    // const url = `https://${DOMAIN}/authorize?${params.toString()}`;

    // console.log(SCOPES);

    // window.location.href = url;

    // void login();
    void loginWithRedirect(redirecLoginOptions);
  };

  const handleLogout = () => {
    resetState();
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <nav className="navbar sticky top-0 bg-base-100 shadow-md">
      <div className="flex-1">
        <Link className="btn-ghost btn text-xl normal-case" to="/">
          hr0
        </Link>
      </div>
      <div className="navbar-end space-x-2">
        {isAuthenticated && (
          <UserProfile
            name={user?.name ?? auth0User?.name}
            email={user?.email ?? auth0User?.email}
            avatarUrl={user?.picture ?? auth0User?.picture}
          />
        )}
        <Link to="/account" className="btn-outline btn">
          Account
        </Link>
        {!isAuthenticated && (
          <>
            <button
              className="btn-outline btn-primary btn"
              onClick={() => {
                void handleSignUp();
              }}
            >
              Sign Up
            </button>
            <button
              className="btn-outline btn-secondary btn"
              onClick={handleLogin}
            >
              Sign In
            </button>
          </>
        )}
        {isAuthenticated && (
          <>
            <button
              className="btn-outline btn-secondary btn"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};