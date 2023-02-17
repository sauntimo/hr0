import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { IdTokenWithSub } from "../types/jwt";
import type { user, organization } from "@prismaTypes/index";
import { mountStoreDevtool } from "simple-zustand-devtools";

interface AppState {
  scopes?: string;
  accessToken?: string;
  idToken?: IdTokenWithSub;
  user?: user;
  organization?: organization;
  organizationUsers: user[];
  users: Record<number, user>;
}

const initalState: AppState = {
  scopes: undefined,
  accessToken: undefined,
  idToken: undefined,
  user: undefined,
  users: {},
  organization: undefined,
  organizationUsers: [],
};

interface AppStateActions {
  setScopes: (scopes: AppState["scopes"]) => void;
  setAccessToken: (accessToken: AppState["accessToken"]) => void;
  setIdToken: (idToken: AppState["idToken"]) => void;
  setUser: (user: AppState["user"]) => void;
  setOrganization: (organization: AppState["organization"]) => void;
  setOrganizationUsers: (
    organizationUsers: AppState["organizationUsers"]
  ) => void;
  addUserToState: (user: user) => void;
  resetState: () => void;
}

export const useStore = create<AppState & AppStateActions>()(
  persist(
    (set) => ({
      organizationUsers: [],
      users: {},
      setScopes: (scopes) => set(() => ({ scopes })),
      setAccessToken: (accessToken) => set(() => ({ accessToken })),
      setIdToken: (idToken) => set(() => ({ idToken })),
      setUser: (user) => set(() => ({ user })),
      setOrganization: (organization) => set(() => ({ organization })),
      setOrganizationUsers: (organizationUsers) =>
        set(() => ({ organizationUsers })),
      addUserToState: (user) =>
        set((state) => ({
          users: Object.assign(state.users, { [user.id]: user }),
        })),

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
