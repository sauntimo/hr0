import { ApiResponse } from "@commonTypes/api-response";
import { organization } from "@prisma/client";
import * as organizationRepository from "./organization.repository";
import * as userService from "../user/user.service";
import {
  CreateOrganizationParams,
  CreateOrganizationResponse,
  GetOrganizationByAuthIDParams,
  UpdateOrganizationByAuthIdparams,
} from "@commonTypes/organization";
import {
  createAuth0Org,
  inviteOrgMember,
} from "../auth0/auth0.organization.service";
import { OrganizationRow } from "@commonTypes/database";
import { supabaseUserPassword } from "../supabase/token";
import { supabaseClient } from "../../db/supabase";

export const getOrganizationByAuthId = async ({
  organizationAuthId,
}: GetOrganizationByAuthIDParams): Promise<ApiResponse<OrganizationRow>> => {
  return organizationRepository.getOrganizationByAuthId({ organizationAuthId });
};

export const updateOrganizationByAuthId = async ({
  organization,
}: UpdateOrganizationByAuthIdparams): Promise<ApiResponse<OrganizationRow>> => {
  return organizationRepository.updateOrganizationByAuthId({ organization });
};

export const createOrganization = async ({
  organizationCreate,
}: CreateOrganizationParams): Promise<
  ApiResponse<CreateOrganizationResponse>
> => {
  try {
    // Call auth provider and create this org
    const auth0OrgCreateResult = await createAuth0Org({
      name: organizationCreate.org_auth_provider_name,
      display_name: organizationCreate.org_display_name,
    });

    if (!auth0OrgCreateResult.success) {
      return auth0OrgCreateResult;
    }

    const userPassword = supabaseUserPassword({
      email: organizationCreate.user_email,
    });

    const createUserResult = await supabaseClient.auth.admin.createUser({
      email: organizationCreate.user_email,
      email_confirm: true,
      password: userPassword,
    });

    if (createUserResult.error) {
      throw new Error("Failed to create supabase user");
    }

    const createResult = await organizationRepository.createOrganization({
      organizationCreate: {
        ...organizationCreate,
        org_id: auth0OrgCreateResult.data.id,
        user_uuid: createUserResult.data.user.id,
        user_sub: "", // the user doesn't have a sub yet as they haven't accepted the invitation
      },
    });

    if (!createResult.success) {
      return createResult;
    }

    const { id: newOrgId } = auth0OrgCreateResult.data;

    const usersResult = await userService.getUsersByOrg({ org: newOrgId });

    if (!usersResult.success) {
      return usersResult;
    }

    if (usersResult.data.length === 0) {
      return {
        success: false,
        error: { message: "Failed to store or retrieve user in new org" },
      };
    }

    const userId = usersResult.data[0].id;

    const auth0InviteResult = await inviteOrgMember({
      inviterName: organizationCreate.user_name,
      inviteeEmail: organizationCreate.user_email,
      authProviderOrganizationId: newOrgId,
      roles: ["rol_s9nkwrBDR9z70MI0"], // admin-role
      app_metadata: {
        userId,
      },
    });

    if (!auth0InviteResult.success) {
      return auth0InviteResult;
    }

    const {
      id: invitiationId,
      organization_id: organizationId,
      invitation_url: invitationUrl,
    } = auth0InviteResult.data;

    return {
      success: true,
      data: { invitiationId, organizationId, invitationUrl },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: { message: "Failed to create organization" },
    };
  }
};
