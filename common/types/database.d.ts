import type { Database } from "./supabase";

type UserDB = Database["public"]["Tables"]["user"];
export type UserRow = UserDB["Row"];
export type UserInsert = UserDB["Insert"];
export type UserUpdate = UserDB["Update"];

type OrganizationDB = Database["public"]["Tables"]["organization"];
export type OrganizationRow = OrganizationDB["Row"];
export type OrganizationInsert = OrganizationDB["Insert"];
export type OrganizationUpdate = OrganizationDB["Update"];
