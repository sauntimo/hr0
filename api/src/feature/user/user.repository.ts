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

import { supabaseClient } from "../../db/supabase";
import type { UserRow } from "@commonTypes/database";

/**********
 * CREATE *
 **********/

export const createUser = async ({
  user,
}: CreateUserParams): Promise<ApiResponse<UserRow>> => {
  try {
    const now = new Date();

    const orgResult = await supabaseClient
      .from("organization")
      .select("id")
      .eq("auth_provider_id", user.organization_auth_provider_id);

    if (orgResult.error) {
      throw new AppError("Failed to get organization");
    }

    const userResult = await supabaseClient
      .from("user")
      .insert({
        ...user,
        created_at: now.toISOString(),
        organization_id: orgResult.data[0].id,
      })
      .select();

    if (userResult.error) {
      throw new AppError("Failed to create user");
    }
    // const result = await prisma.user.create({
    //   data: {
    //     ...user,
    //     created_at: now,
    //     organization: {
    //       connect: {
    //         auth_provider_id: user.organization_auth_provider_id,
    //       },
    //     },
    //   },
    // });

    return { success: true, data: userResult.data[0] };
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
}: GetUserBySubParams): Promise<ApiResponse<UserRow>> => {
  try {
    const userResult = await supabaseClient
      .from("user")
      .select()
      .eq("sub", sub);

    if (userResult.error || userResult.data.length === 0) {
      throw new AppError("Failed to get user");
    }

    // const result = await prisma.user.findUnique({
    //   where: { sub },
    // });

    if (userResult.error || userResult.data.length === 0) {
      throw new AppError("User not found");
    }

    return { success: true, data: userResult.data[0] };
  } catch (error) {
    console.error(error);
    return { success: false, error: { message: "Failed to get user" } };
  }
};

export const getUserById = async ({
  userId,
  orgAuthProviderId,
}: GetUserByIdParams): Promise<ApiResponse<UserRow>> => {
  try {
    const orgResult = await supabaseClient
      .from("organization")
      .select("id")
      .eq("auth_provider_id", orgAuthProviderId);

    if (orgResult.error || orgResult.data.length === 0) {
      throw new AppError("Failed to get organization");
    }

    const userResult = await supabaseClient
      .from("user")
      .select()
      .eq("id", userId)
      .eq("organization_id", orgResult.data[0].id);

    // const result = await prisma.user.findUnique({
    //   where: { sub },
    // });

    if (userResult.error || userResult.data.length === 0) {
      throw new AppError("User not found");
    }

    // // although only want one, have to use find many to use org criteria
    // // for security so users can only get other users in their org
    // const result = await prisma.user.findMany({
    //   where: {
    //     id: userId,
    //     organization: { auth_provider_id: orgAuthProviderId },
    //   },
    // });

    // if (!result || result.length === 0) {
    //   throw new AppError("User not found");
    // }

    return { success: true, data: userResult.data[0] };
  } catch (error) {
    console.error(error);
    return { success: false, error: { message: "Failed to get user" } };
  }
};

export const getUsersByOrg = async ({
  org,
}: GetUsersByOrgParams): Promise<ApiResponse<UserRow[]>> => {
  try {
    const orgResult = await supabaseClient
      .from("organization")
      .select("id")
      .eq("auth_provider_id", org);

    if (orgResult.error || orgResult.data.length === 0) {
      throw new AppError("Failed to get organization");
    }

    const usersResult = await supabaseClient
      .from("user")
      .select("*")
      .eq("organization_id", orgResult.data[0].id);

    // const result = await prisma.user.findMany({
    //   where: { organization: { auth_provider_id: org } },
    // });

    if (usersResult.error || usersResult.data.length === 0) {
      throw new AppError("No users found");
    }

    return { success: true, data: usersResult.data };
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
}: UpdateUserBySubParams): Promise<ApiResponse<UserRow>> => {
  try {
    const userResult = await supabaseClient
      .from("user")
      .update(user)
      .eq("sub", user.sub)
      .select();

    if (userResult.error || userResult.data.length === 0) {
      throw new AppError("Failed to update user");
    }

    // const result = await prisma.user.update({
    //   where: { sub: user.sub },
    //   data: user,
    // });

    return { success: true, data: userResult.data[0] };
  } catch (error) {
    console.error(error);
    return { success: false, error: { message: "User update failed" } };
  }
};

export const updateUserById = async ({
  user,
}: UpdateUserByIdParams): Promise<ApiResponse<UserRow>> => {
  try {
    const userResult = await supabaseClient
      .from("user")
      .update(user)
      .eq("id", user.id)
      .select();

    if (userResult.error || userResult.data.length === 0) {
      throw new AppError("Failed to update user");
    }

    // const result = await prisma.user.update({
    //   where: { id: user.id },
    //   data: user,
    // });

    return { success: true, data: userResult.data[0] };
  } catch (error) {
    console.error(error);
    return { success: false, error: { message: "User update failed" } };
  }
};
