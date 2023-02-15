import { ApiResponse } from "@commonTypes/api-response";
import axios from "axios";
import {
  AUTH0_CLIENT_ID,
  AUTH0_CONNECTION_ID,
  AUTH0_DOMAIN,
  AUTH0_MANAGE_API_TOKEN,
} from "../../config/globals";
import { AppError } from "../../errors/app-error";
import { Auth0OrganizationCreationResponse } from "./auth0.types";

interface InviteOrgMemeberParams {
  inviterName: string;
  inviteeEmail: string;
  authProviderOrganizationId: string;
  app_metadata: { userId: number };
}

interface InvitiationResponse {
  id: string;
  connection_id: string;
  client_id: string;
  inviter: { name: string };
  invitee: { email: string };
  invitation_url: string;
  ticket_id: string;
  created_at: string;
  expires_at: string;
  organization_id: string;
}

export const inviteOrgMember = async ({
  inviterName,
  inviteeEmail,
  authProviderOrganizationId,
  app_metadata,
}: InviteOrgMemeberParams): Promise<ApiResponse<InvitiationResponse>> => {
  try {
    const result = await axios.request<InvitiationResponse>({
      method: "POST",
      url: `https://${AUTH0_DOMAIN}/api/v2/organizations/${authProviderOrganizationId}/invitations`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH0_MANAGE_API_TOKEN}`,
        "Cache-Control": "no-cache",
      },
      data: {
        inviter: { name: inviterName },
        invitee: { email: inviteeEmail },
        client_id: AUTH0_CLIENT_ID,
        connection_id: "con_O5JCFevNxvWugiuK",
        ttl_sec: 0, // 7 days
        // roles: ["ROLE_ID", "ROLE_ID", "ROLE_ID"],
        send_invitation_email: true,
        app_metadata,
      },
    });

    const { status, data } = result;
    console.log({ status, data });

    if (status >= 400) {
      throw new AppError("Auth0 request returned failed");
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: { message: "Failed to invite organization member" },
    };
  }
};

interface CreateAuth0OrgParams {
  name: string;
  display_name: string;
}

export const createAuth0Org = async ({
  name,
  display_name,
}: CreateAuth0OrgParams): Promise<
  ApiResponse<Auth0OrganizationCreationResponse>
> => {
  try {
    const result = await axios.request<Auth0OrganizationCreationResponse>({
      method: "POST",
      url: `https://${AUTH0_DOMAIN}/api/v2/organizations`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH0_MANAGE_API_TOKEN}`,
        "Cache-Control": "no-cache",
      },
      data: {
        name,
        display_name,
        enabled_connections: [
          {
            connection_id: AUTH0_CONNECTION_ID,
            assign_membership_on_login: false,
          },
        ],
      },
    });

    const { status, data } = result;
    console.log({ status, data });

    if (status >= 400) {
      throw new AppError("Auth0 request returned failed");
    }

    return { success: true, data };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: { message: "Failed to create new Auth0 Organization" },
    };
  }
};

interface AddMemberToAuth0OrgParams {
  orgId: string;
  userId: string;
}

export const addMemberToAuth0Org = async ({
  orgId,
  userId,
}: AddMemberToAuth0OrgParams): Promise<ApiResponse> => {
  try {
    const result = await axios.request({
      method: "POST",
      url: `https://${AUTH0_DOMAIN}/api/v2/organizations/${orgId}/members`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH0_MANAGE_API_TOKEN}`,
        "Cache-Control": "no-cache",
      },
      data: {
        members: [userId],
      },
    });

    const { status, data } = result;
    console.log({ status, data });

    if (status >= 400) {
      throw new AppError("Auth0 request returned failed");
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: { message: "Failed to add user to Auth0 Organization" },
    };
  }
};
