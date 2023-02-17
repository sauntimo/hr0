import * as auth0UserService from "../auth0/auth0.user.service";
import * as userRepository from "./user.repository";
import { ApiResponse } from "@commonTypes/api-response";
import { user } from "@prisma/client";
import {
  CreateUserParams,
  GetUserByIdParams,
  GetUsersByOrgParams,
  UpdateUserBySubParams,
} from "./user.types";
import { AppError } from "../../errors/app-error";

export const createUser = async ({
  user,
}: CreateUserParams): Promise<ApiResponse<user>> => {
  return userRepository.createUser({ user });
};

export const updateUser = async ({
  user,
}: UpdateUserBySubParams): Promise<ApiResponse<user>> => {
  return userRepository.updateUserBySub({ user });
};

export interface GetUserBySubParams {
  sub: string;
  orgAuthProviderId: string;
}

export const getUserBySub = async ({
  sub,
  orgAuthProviderId,
}: GetUserBySubParams): Promise<ApiResponse<user>> => {
  try {
    const userBySubResult = await userRepository.getUserBySub({ sub });

    if (userBySubResult.success) {
      return userBySubResult;
    }

    const auth0UserResult = await auth0UserService.getAuth0User({ sub });

    if (!auth0UserResult.success) {
      throw new AppError(auth0UserResult.error.message);
    }

    const userIdString = auth0UserResult.data.app_metadata.userId;

    if (!userIdString) {
      throw new AppError("Failed to get userId");
    }

    const userId = Number(userIdString);

    const userByIdResult = await userRepository.getUserById({
      userId,
      orgAuthProviderId,
    });

    if (!userByIdResult.success) {
      throw new AppError(userByIdResult.error.message);
    }

    // add the sub to the user
    const updateResult = await userRepository.updateUserById({
      user: { id: userId, sub },
    });

    const userBySubSecondbResult = await userRepository.getUserBySub({ sub });

    if (userBySubSecondbResult.success) {
      return userBySubSecondbResult;
    }

    throw new AppError("Failed to get user after update");
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: { message: error.message } };
    }

    return {
      success: false,
      error: { message: error?.toString() ?? "Failed to get user" },
    };
  }
};

export const getUserById = async ({
  userId,
  orgAuthProviderId,
}: GetUserByIdParams): Promise<ApiResponse<user>> => {
  return userRepository.getUserById({ userId, orgAuthProviderId });
};

export const getUsersByOrg = async ({
  org,
}: GetUsersByOrgParams): Promise<ApiResponse<user[]>> => {
  return userRepository.getUsersByOrg({ org });
};
