import { ApiResponse } from "@commonTypes/api-response";
// import { organization } from "@prisma/client";
// import { prisma } from "../../db/prisma";
import { AppError } from "../../errors/app-error";
import {
  CreateOrganizationFullParams,
  GetOrganizationByAuthIDParams,
  UpdateOrganizationByAuthIdparams,
} from "@commonTypes/organization";
import { supabaseClient } from "../../db/supabase";
import type { OrganizationRow } from "@commonTypes/database";

export const getOrganizationByAuthId = async ({
  organizationAuthId,
}: GetOrganizationByAuthIDParams): Promise<ApiResponse<OrganizationRow>> => {
  try {
    const orgResult = await supabaseClient
      .from("organization")
      .select("*")
      .eq("auth_provider_id", organizationAuthId);

    // const result = await prisma.organization.findUnique({
    //   where: { auth_provider_id: organizationAuthId },
    // });

    if (orgResult.error || orgResult.data.length === 0) {
      throw new AppError("Organization not found");
    }

    return { success: true, data: orgResult.data[0] };
  } catch (error) {
    console.error(error);

    return { success: false, error: { message: "Failed to get organization" } };
  }
};

export const updateOrganizationByAuthId = async ({
  organization,
}: UpdateOrganizationByAuthIdparams): Promise<ApiResponse<OrganizationRow>> => {
  try {
    const { auth_provider_id, ...data } = organization;

    const updateOrgResult = await supabaseClient
      .from("organization")
      .update(data)
      .eq("auth_provider_id", auth_provider_id)
      .select();

    if (updateOrgResult.error || updateOrgResult.data.length === 0) {
      throw new AppError("Failed to update organization");
    }
    // const result = await prisma.organization.update({
    //   where: { auth_provider_id },
    //   data,
    // });

    return { success: true, data: updateOrgResult.data[0] };
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
    const newOrgResult = await supabaseClient
      .from("organization")
      .insert({
        auth_provider_name: organizationCreate.org_auth_provider_name,
        auth_provider_id: organizationCreate.org_id,
        name: organizationCreate.org_display_name,
      })
      .select();

    if (newOrgResult.error || newOrgResult.data.length === 0) {
      throw new AppError("Failed to create organization");
    }

    await supabaseClient.from("user").insert({
      sub: organizationCreate.user_sub,
      name: organizationCreate.user_name,
      email: organizationCreate.user_email,
      uuid: organizationCreate.user_uuid,
      organization_id: newOrgResult.data[0].id,
    });

    // const result = await prisma.organization.create({
    //   data: {
    //     auth_provider_name: organizationCreate.org_auth_provider_name,
    //     auth_provider_id: organizationCreate.org_id,
    //     name: organizationCreate.org_display_name,
    //     user: {
    //       create: {
    //         uuid: uuid4(),
    //         sub: organizationCreate.user_sub,
    //         name: organizationCreate.user_name,
    //         email: organizationCreate.user_email,
    //       },
    //     },
    //   },
    // });

    return { success: true };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: { message: "Failed to create organization" },
    };
  }
};
