import { ApiResponse } from "@commonTypes/api-response";
import { organization } from "@prisma/client";
import {
  addMemberToAuth0Org,
  createAuth0Org,
  createAuth0User,
  inviteOrgMember,
} from "../auth0/auth0.service";
import * as organizationRepository from "./organization.repository";
import {
  CreateOrganizationParams,
  CreateOrganizationResponse,
  GetOrganizationByAuthIDParams,
  UpdateOrganizationByAuthIdparams,
} from "@commonTypes/organization";

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
  console.log("createOrganization service fn");

  // Call auth provider and create this org
  const auth0OrgCreateResult = await createAuth0Org({
    name: organizationCreate.org_auth_provider_name,
    display_name: organizationCreate.org_display_name,
  });

  if (!auth0OrgCreateResult.success) {
    return auth0OrgCreateResult;
  }

  const {
    id: newOrgId,
    enabled_connections: [{ connection_id }],
  } = auth0OrgCreateResult.data;

  console.log({ newOrgId, connection_id });

  // // Call auth provider and create a user
  // const auth0UserCreateResult = await createAuth0User({
  //   name: organizationCreate.user_name,
  //   email: organizationCreate.user_email,
  //   password: organizationCreate.user_password,
  // });

  // if (!auth0UserCreateResult.success) {
  //   return auth0UserCreateResult;
  // }

  // // Call auth provider and add user to org
  // const auth0AddOrgMemberResult = await addMemberToAuth0Org({
  //   orgId: auth0OrgCreateResult.data.id,
  //   userId: auth0UserCreateResult.data.user_id,
  // });

  // if (!auth0AddOrgMemberResult.success) {
  //   return auth0AddOrgMemberResult;
  // }

  const auth0InviteResult = await inviteOrgMember({
    inviterName: organizationCreate.user_name,
    inviteeEmail: organizationCreate.user_email,
    authProviderOrganizationId: newOrgId,
  });

  console.log(auth0InviteResult);

  if (!auth0InviteResult.success) {
    return auth0InviteResult;
  }

  const data = {
    invitationUrl: auth0InviteResult.data.invitation_url,
  };

  const createResult = await organizationRepository.createOrganization({
    organizationCreate: {
      ...organizationCreate,
      org_id: auth0OrgCreateResult.data.id,
      // user_sub: auth0UserCreateResult.data.user_id,
      user_sub: "",
    },
  });

  if (!createResult.success) {
    return createResult;
  }

  return { success: true, data };
};
