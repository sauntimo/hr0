import { AuthenticationGuard } from "./providers/authentication-guard";

import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Route, Routes } from "react-router-dom";

import AccountPage from "./pages/account";
import Landing from "./pages";
import NotFoundPage from "./pages/not-found";
import LoadingPage from "./pages/loading";
import InvitePage from "./pages/invite";
import OrganizationPage from "./pages/organization";
import NewOrganizationPage from "./pages/new-organization";
import ProfilePage from "./pages/profile";

export const App: React.FC = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Routes>
      {/* Unprotected Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/new-organization" element={<NewOrganizationPage />} />
      <Route path="/invite" element={<InvitePage />} />

      {/* Protected Routes */}
      <Route
        path="/account"
        // element={<AuthenticationGuard component={AccountPage} />}
        element={<AccountPage />}
      />
      <Route
        path="/profile/:userId"
        element={<AuthenticationGuard component={ProfilePage} />}
      />
      <Route
        path="/organization"
        element={<AuthenticationGuard component={OrganizationPage} />}
      />

      {/* Catch all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
