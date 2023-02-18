import { prisma } from "../../db/prisma";
import { ApiResponse } from "@commonTypes/api-response";
import { AppError } from "../../errors/app-error";
import { user } from "@prisma/client";
import {
  CreateUserParams,
  GetUserByIdParams,
  GetUsersByOrgParams,
  UpdateUserByIdParams,
  UpdateUserBySubParams,
} from "./user.types";

/**********
 * CREATE *
 **********/

export const createUser = async ({
  user,
}: CreateUserParams): Promise<ApiResponse<user>> => {
  try {
    const now = new Date();

    const result = await prisma.user.create({
      data: {
        ...user,
        created_at: now,
        organization: {
          connect: {
            auth_provider_id: user.organization_auth_provider_id,
          },
        },
      },
    });

    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: { message: "User create failed" } };
  }
};

/********
 * READ *
 ********/

export interface GetUserBySubParams {
  sub: string;
}

export const getUserBySub = async ({
  sub,
}: GetUserBySubParams): Promise<ApiResponse<user>> => {
  try {
    const result = await prisma.user.findUnique({
      where: { sub },
    });

    if (!result) {
      throw new AppError("User not found");
    }

    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: { message: "Failed to get user" } };
  }
};

export const getUserById = async ({
  userId,
  orgAuthProviderId,
}: GetUserByIdParams): Promise<ApiResponse<user>> => {
  try {
    // although only want one, have to use find many to use org criteria
    // for security so users can only get other users in their org
    const result = await prisma.user.findMany({
      where: {
        id: userId,
        organization: { auth_provider_id: orgAuthProviderId },
      },
    });

    if (!result || result.length === 0) {
      throw new AppError("User not found");
    }

    return { success: true, data: result[0] };
  } catch (error) {
    console.error(error);
    return { success: false, error: { message: "Failed to get user" } };
  }
};

export const getUsersByOrg = async ({
  org,
}: GetUsersByOrgParams): Promise<ApiResponse<user[]>> => {
  try {
    const result = await prisma.user.findMany({
      where: { organization: { auth_provider_id: org } },
    });

    if (!result) {
      throw new AppError("No users found");
    }

    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: { message: "Failed to get users" } };
  }
};

/**********
 * UPDATE *
 **********/

export const updateUserBySub = async ({
  user,
}: UpdateUserBySubParams): Promise<ApiResponse<user>> => {
  try {
    const result = await prisma.user.update({
      where: { sub: user.sub },
      data: user,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: { message: "User update failed" } };
  }
};

export const updateUserById = async ({
  user,
}: UpdateUserByIdParams): Promise<ApiResponse<user>> => {
  try {
    const result = await prisma.user.update({
      where: { id: user.id },
      data: user,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: { message: "User update failed" } };
  }
};
