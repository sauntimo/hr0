import { prisma } from "../../db/prisma";
import { ApiResponse } from "@commonTypes/api-response";
import { AppError } from "../../errors/app-error";
import { user } from "@prisma/client";
import {
  CreateUserParams,
  GetUserByIdParams,
  GetUserBySubParams,
  GetUsersByOrgParams,
  UpdateUserByIdParams,
  UpdateUserBySubParams,
} from "./user.types";

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
}: GetUserByIdParams): Promise<ApiResponse<user>> => {
  try {
    const result = await prisma.user.findUnique({
      where: { id: userId },
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
