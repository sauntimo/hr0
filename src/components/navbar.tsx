import React from "react";
import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";
import { UserProfile } from "./user-profile";
import { redirecLoginOptions, redirecLoginOptionsSignup } from "../utils/auth";

export const NavBar: React.FC = () => {
  const { logout } = useAuth0();
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();

  const createAccount = async (): Promise<void> => {
    await loginWithRedirect(redirecLoginOptionsSignup);
  };

  const handleLogin = async () => {
    await loginWithRedirect(redirecLoginOptions);
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <div className="navbar sticky top-0 bg-base-100 shadow-md">
      <div className="flex-1">
        <Link className="btn-ghost btn text-xl normal-case" href="/">
          hr0
        </Link>
      </div>
      <div className="navbar-end space-x-2">
        {isAuthenticated && (
          <UserProfile
            givenName={user?.name}
            familyName={user?.family_name}
            email={user?.email}
            avatarUrl={user?.picture}
          />
        )}
        <Link href="/profile" className="btn-outline btn">
          Profile
        </Link>
        {!isAuthenticated && (
          <>
            <button
              className="btn-outline btn-primary btn"
              onClick={() => {
                void createAccount();
              }}
            >
              Create Account
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
    </div>
  );
};
