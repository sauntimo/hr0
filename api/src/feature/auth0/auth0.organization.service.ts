import { ApiResponse } from "@commonTypes/api-response";
import { Organization, OrganizationInvitation } from "auth0";
import axios from "axios";
import { auth0ManagementClient } from "../..";
import {
  AUTH0_CLIENT_ID,
  AUTH0_CONNECTION_ID,
  AUTH0_DOMAIN,
} from "../../config/globals";
import { AppError } from "../../errors/app-error";

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
}: InviteOrgMemeberParams): Promise<ApiResponse<OrganizationInvitation>> => {
  try {
    const result = await auth0ManagementClient.organizations.createInvitation(
      { id: authProviderOrganizationId },
      {
        inviter: { name: inviterName },
        invitee: { email: inviteeEmail },
        client_id: AUTH0_CLIENT_ID,
        connection_id: "con_O5JCFevNxvWugiuK",
        ttl_sec: 0, // 7 days
        // roles: ["ROLE_ID", "ROLE_ID", "ROLE_ID"],
        send_invitation_email: true,
        app_metadata,
      }
    );

    return { success: true, data: result };
  } catch (error) {
    console.error(error);

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
}: CreateAuth0OrgParams): Promise<ApiResponse<Organization>> => {
  try {
    const createResult = await auth0ManagementClient.organizations.create({
      name,
      display_name,
    });

    await auth0ManagementClient.organizations.addEnabledConnection(
      { id: createResult.id },
      {
        connection_id: AUTH0_CONNECTION_ID,
        assign_membership_on_login: false,
      }
    );

    return { success: true, data: createResult };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: { message: "Failed to create new Auth0 Organization" },
    };
  }
};

// interface AddMemberToAuth0OrgParams {
//   orgId: string;
//   userId: string;
//   AUTH0_MANAGE_API_TOKEN: string;
// }

// export const addMemberToAuth0Org = async ({
//   orgId,
//   userId,
//   AUTH0_MANAGE_API_TOKEN,
// }: AddMemberToAuth0OrgParams): Promise<ApiResponse> => {
//   try {
//     const result = await axios.request({
//       method: "POST",
//       url: `https://${AUTH0_DOMAIN}/api/v2/organizations/${orgId}/members`,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${AUTH0_MANAGE_API_TOKEN}`,
//         "Cache-Control": "no-cache",
//       },
//       data: {
//         members: [userId],
//       },
//     });

//     const { status, data } = result;
//     console.log({ status, data });

//     if (status >= 400) {
//       throw new AppError("Auth0 request returned failed");
//     }

//     return { success: true };
//   } catch (error) {
//     console.error(error);
//     return {
//       success: false,
//       error: { message: "Failed to add user to Auth0 Organization" },
//     };
//   }
// };
