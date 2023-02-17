import { UserCreate, UserUpdate } from "@commonTypes/user";

export interface GetUserByIdParams {
  userId: number;
  orgAuthProviderId: string;
}

export interface GetUsersByOrgParams {
  org: string;
}

export interface CreateUserParams {
  user: UserCreate;
}

export interface UpdateUserBySubParams {
  user: UserUpdateBySub;
}

export interface UpdateUserByIdParams {
  user: UserUpdateById;
}
