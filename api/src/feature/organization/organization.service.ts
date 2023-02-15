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

export const getOrganizationByAuthId = async ({
  organizationAuthId,
}: GetOrganizationByAuthIDParams): Promise<ApiResponse<organization>> => {
  return organizationRepository.getOrganizationByAuthId({ organizationAuthId });
};

export const updateOrganizationByAuthId = async ({
  organization,
}: UpdateOrganizationByAuthIdparams): Promise<ApiResponse<organization>> => {
  return organizationRepository.updateOrganizationByAuthId({ organization });
};

export const createOrganization = async ({
  organizationCreate,
}: CreateOrganizationParams): Promise<
  ApiResponse<CreateOrganizationResponse>
> => {
  // Call auth provider and create this org
  const auth0OrgCreateResult = await createAuth0Org({
    name: organizationCreate.org_auth_provider_name,
    display_name: organizationCreate.org_display_name,
  });

  if (!auth0OrgCreateResult.success) {
    return auth0OrgCreateResult;
  }

  const createResult = await organizationRepository.createOrganization({
    organizationCreate: {
      ...organizationCreate,
      org_id: auth0OrgCreateResult.data.id,
      user_sub: "", // the user doesn't have a sub yet as they haven't accepted the invitation
    },
  });

  if (!createResult.success) {
    return createResult;
  }

  const {
    id: newOrgId,
    enabled_connections: [{ connection_id }],
  } = auth0OrgCreateResult.data;

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
    app_metadata: {
      userId,
    },
  });

  if (!auth0InviteResult.success) {
    return auth0InviteResult;
  }

  const data = {
    invitationUrl: auth0InviteResult.data.invitation_url,
  };

  return { success: true, data };
};
