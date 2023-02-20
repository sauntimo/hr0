import { organization } from "@prisma/client";

// require id but everything else is optional
export type OrganizationUpdate = Partial<organization> & {
  auth_provider_id: string;
};

export interface GetOrganizationByAuthIDParams {
  organizationAuthId: string;
}

export interface UpdateOrganizationByAuthIdparams {
  organization: OrganizationUpdate;
}

export interface CheckOrganizationAuthProviderNameParams {
  organizationAuthProviderName: string;
}

export interface NewOrganizationParams {
  uniqueName: string;
  displayName: string;
  userEmail: string;
}

export interface OrganizationCreate {
  org_auth_provider_name: string;
  org_display_name: string;
  user_name: string;
  user_email: string;
}

export interface OrganizationCreateFull extends OrganizationCreate {
  org_id: string;
  user_sub: string;
  user_uuid: string;
}

export interface CreateOrganizationParams {
  organizationCreate: OrganizationCreate;
}

export interface CreateOrganizationFullParams {
  organizationCreate: OrganizationCreateFull;
}

export interface CreateOrganizationResponse {
  invitiationId: string;
  organizationId: string;
  invitationUrl: string;
}
