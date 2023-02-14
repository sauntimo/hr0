import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { Auth0ProviderWithNavigate } from "./providers/auth0-provider-with-navigate";
import { App } from "./routes";
import { HelmetProvider } from "react-helmet-async";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { IdTokenWithSub } from "./types/jwt";
import type { user, organization } from "@prismaTypes/index";
import { mountStoreDevtool } from "simple-zustand-devtools";

interface AppState {
  scopes?: string;
  accessToken?: string;
  idToken?: IdTokenWithSub;
  user?: user;
  organization?: organization;
  organizationUsers: user[];
}

const initalState: AppState = {
  scopes: undefined,
  accessToken: undefined,
  idToken: undefined,
  user: undefined,
  organization: undefined,
  organizationUsers: [],
};

interface AppStateActions {
  setScopes: (scopes: AppState["scopes"]) => void;
  setAccessToken: (accessToken: AppState["accessToken"]) => void;
  setIdToken: (idToken: AppState["idToken"]) => void;
  setUser: (suer: AppState["user"]) => void;
  setOrganization: (organization: AppState["organization"]) => void;
  setOrganizationUsers: (
    organizationUsers: AppState["organizationUsers"]
  ) => void;
  resetState: () => void;
}

export const useStore = create<AppState & AppStateActions>()(
  persist(
    (set) => ({
      organizationUsers: [],
      setScopes: (scopes) => set(() => ({ scopes })),
      setAccessToken: (accessToken) => set(() => ({ accessToken })),
      setIdToken: (idToken) => set(() => ({ idToken })),
      setUser: (user) => set(() => ({ user })),
      setOrganization: (organization) => set(() => ({ organization })),
      setOrganizationUsers: (organizationUsers) =>
        set(() => ({ organizationUsers })),
      resetState: () => {
        set(initalState);
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useStore);
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Auth0ProviderWithNavigate>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Auth0ProviderWithNavigate>
  </BrowserRouter>
  // </React.StrictMode>
);
