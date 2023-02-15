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
const organizationRepository = __importStar(require("./organization.repository"));
const userService = __importStar(require("../user/user.service"));
const auth0_organization_service_1 = require("../auth0/auth0.organization.service");
const getOrganizationByAuthId = async ({ organizationAuthId, }) => {
    return organizationRepository.getOrganizationByAuthId({ organizationAuthId });
};
exports.getOrganizationByAuthId = getOrganizationByAuthId;
const updateOrganizationByAuthId = async ({ organization, }) => {
    return organizationRepository.updateOrganizationByAuthId({ organization });
};
exports.updateOrganizationByAuthId = updateOrganizationByAuthId;
const createOrganization = async ({ organizationCreate, }) => {
    // Call auth provider and create this org
    const auth0OrgCreateResult = await (0, auth0_organization_service_1.createAuth0Org)({
        name: organizationCreate.org_auth_provider_name,
        display_name: organizationCreate.org_display_name,
    });
    if (!auth0OrgCreateResult.success) {
        return auth0OrgCreateResult;
    }
    const createResult = await organizationRepository.createOrganization({
        organizationCreate: Object.assign(Object.assign({}, organizationCreate), { org_id: auth0OrgCreateResult.data.id, user_sub: "" }),
    });
    if (!createResult.success) {
        return createResult;
    }
    const { id: newOrgId, enabled_connections: [{ connection_id }], } = auth0OrgCreateResult.data;
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
    const auth0InviteResult = await (0, auth0_organization_service_1.inviteOrgMember)({
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
exports.createOrganization = createOrganization;
