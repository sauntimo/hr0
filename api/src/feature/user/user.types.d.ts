import { UserCreate, UserUpdate } from "@commonTypes/user";

export interface GetUserBySubParams {
  sub: string;
}

export interface GetUserByIdParams {
  userId: number;
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
