import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { IdTokenWithSub } from "../types/jwt";
import type { user, organization } from "@prismaTypes/index";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { UserRow } from "@commonTypes/Database";

interface AppState {
  scopes?: string;
  accessToken?: string;
  idToken?: IdTokenWithSub;
  user?: UserRow;
  organization?: organization;
  organizationUsers: user[];
  users: Record<number, user>;
  supabaseAccessToken: string;
  supabaseRefreshToken: string;
}

const initalState: AppState = {
  scopes: undefined,
  accessToken: undefined,
  idToken: undefined,
  user: undefined,
  users: {},
  organization: undefined,
  organizationUsers: [],
  supabaseAccessToken: "",
  supabaseRefreshToken: "",
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
  setSupabaseAccessToken: (
    supabaseAccessToken: AppState["supabaseAccessToken"]
  ) => void;
  setSupabaseRefreshToken: (
    supabaseRefreshToken: AppState["supabaseRefreshToken"]
  ) => void;
  resetState: () => void;
}

export const useStore = create<AppState & AppStateActions>()(
  persist(
    (set) => ({
      organizationUsers: [],
      users: {},
      supabaseAccessToken: "",
      supabaseRefreshToken: "",
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
      setSupabaseAccessToken: (supabaseAccessToken) =>
        set(() => ({ supabaseAccessToken })),
      setSupabaseRefreshToken: (supabaseRefreshToken) =>
        set(() => ({ supabaseRefreshToken })),

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
