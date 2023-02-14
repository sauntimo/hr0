"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrganization = exports.updateOrganizationByAuthId = exports.getOrganizationByAuthId = void 0;
const auth0_service_1 = require("../auth0/auth0.service");
const organizationRepository = __importStar(require("./organization.repository"));
const getOrganizationByAuthId = async ({ organizationAuthId, }) => {
    return organizationRepository.getOrganizationByAuthId({ organizationAuthId });
};
exports.getOrganizationByAuthId = getOrganizationByAuthId;
const updateOrganizationByAuthId = async ({ organization, }) => {
    return organizationRepository.updateOrganizationByAuthId({ organization });
};
exports.updateOrganizationByAuthId = updateOrganizationByAuthId;
const createOrganization = async ({ organizationCreate, }) => {
    console.log("createOrganization service fn");
    // Call auth provider and create this org
    const auth0OrgCreateResult = await (0, auth0_service_1.createAuth0Org)({
        name: organizationCreate.org_auth_provider_name,
        display_name: organizationCreate.org_display_name,
    });
    if (!auth0OrgCreateResult.success) {
        return auth0OrgCreateResult;
    }
    const { id: newOrgId, enabled_connections: [{ connection_id }], } = auth0OrgCreateResult.data;
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
    const auth0InviteResult = await (0, auth0_service_1.inviteOrgMember)({
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
        organizationCreate: Object.assign(Object.assign({}, organizationCreate), { org_id: auth0OrgCreateResult.data.id, 
            // user_sub: auth0UserCreateResult.data.user_id,
            user_sub: "" }),
    });
    if (!createResult.success) {
        return createResult;
    }
    return { success: true, data };
};
exports.createOrganization = createOrganization;
