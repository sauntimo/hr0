import { ApiResponse } from "@commonTypes/api-response";
import { organization } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { AppError } from "../../errors/app-error";
import {
  CreateOrganizationFullParams,
  GetOrganizationByAuthIDParams,
  UpdateOrganizationByAuthIdparams,
} from "@commonTypes/organization";

export const getOrganizationByAuthId = async ({
  organizationAuthId,
}: GetOrganizationByAuthIDParams): Promise<ApiResponse<organization>> => {
  try {
    const result = await prisma.organization.findUnique({
      where: { auth_provider_id: organizationAuthId },
    });

    if (!result) {
      throw new AppError("Organization not found");
    }

    return { success: true, data: result };
  } catch (error) {
    console.error(error);

    return { success: false, error: { message: "Failed to get organization" } };
  }
};

export const updateOrganizationByAuthId = async ({
  organization,
}: UpdateOrganizationByAuthIdparams): Promise<ApiResponse<organization>> => {
  try {
    const { auth_provider_id, ...data } = organization;

    const result = await prisma.organization.update({
      where: { auth_provider_id },
      data,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: { message: "Failed to update organization" },
    };
  }
};

export const createOrganization = async ({
  organizationCreate,
}: CreateOrganizationFullParams): Promise<ApiResponse> => {
  try {
    const result = await prisma.organization.create({
      data: {
        auth_provider_name: organizationCreate.org_auth_provider_name,
        auth_provider_id: organizationCreate.org_id,
        name: organizationCreate.org_display_name,
        user: {
          create: {
            sub: organizationCreate.user_sub,
            name: organizationCreate.user_name,
            email: organizationCreate.user_email,
          },
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: { message: "Failed to create organization" },
    };
  }
};
