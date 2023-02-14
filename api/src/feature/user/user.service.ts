import * as userRepository from "./user.repository";
import { ApiResponse } from "@commonTypes/api-response";
import { user } from "@prisma/client";
import {
  CreateUserParams,
  GetUserBySubParams,
  GetUsersByOrgParams,
  UpdateUserParams,
} from "./user.types";

export const createUser = async ({
  user,
}: CreateUserParams): Promise<ApiResponse<user>> => {
  return userRepository.createUser({ user });
};

export const updateUser = async ({
  user,
}: UpdateUserParams): Promise<ApiResponse<user>> => {
  return userRepository.updateUser({ user });
};

export const getUserBySub = async ({
  sub,
}: GetUserBySubParams): Promise<ApiResponse<user>> => {
  return userRepository.getUserBySub({ sub });
};

export const getUsersByOrg = async ({
  org,
}: GetUsersByOrgParams): Promise<ApiResponse<user[]>> => {
  return userRepository.getUsersByOrg({ org });
};
