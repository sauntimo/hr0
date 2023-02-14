import { UserCreate, UserUpdate } from "@commonTypes/user";

export interface GetUserBySubParams {
  sub: string;
}

export interface GetUsersByOrgParams {
  org: string;
}

export interface CreateUserParams {
  user: UserCreate;
}

export interface UpdateUserParams {
  user: UserUpdate;
}
