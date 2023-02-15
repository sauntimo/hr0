"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMemberToAuth0Org = exports.createAuth0Org = exports.inviteOrgMember = void 0;
const axios_1 = __importDefault(require("axios"));
const globals_1 = require("../../config/globals");
const app_error_1 = require("../../errors/app-error");
const inviteOrgMember = async ({ inviterName, inviteeEmail, authProviderOrganizationId, app_metadata, }) => {
    try {
        const result = await axios_1.default.request({
            method: "POST",
            url: `https://${globals_1.AUTH0_DOMAIN}/api/v2/organizations/${authProviderOrganizationId}/invitations`,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${globals_1.AUTH0_MANAGE_API_TOKEN}`,
                "Cache-Control": "no-cache",
            },
            data: {
                inviter: { name: inviterName },
                invitee: { email: inviteeEmail },
                client_id: globals_1.AUTH0_CLIENT_ID,
                connection_id: "con_O5JCFevNxvWugiuK",
                ttl_sec: 0,
                // roles: ["ROLE_ID", "ROLE_ID", "ROLE_ID"],
                send_invitation_email: true,
                app_metadata,
            },
        });
        const { status, data } = result;
        console.log({ status, data });
        if (status >= 400) {
            throw new app_error_1.AppError("Auth0 request returned failed");
        }
        return { success: true, data };
    }
    catch (error) {
        return {
            success: false,
            error: { message: "Failed to invite organization member" },
        };
    }
};
exports.inviteOrgMember = inviteOrgMember;
const createAuth0Org = async ({ name, display_name, }) => {
    try {
        const result = await axios_1.default.request({
            method: "POST",
            url: `https://${globals_1.AUTH0_DOMAIN}/api/v2/organizations`,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${globals_1.AUTH0_MANAGE_API_TOKEN}`,
                "Cache-Control": "no-cache",
            },
            data: {
                name,
                display_name,
                enabled_connections: [
                    {
                        connection_id: globals_1.AUTH0_CONNECTION_ID,
                        assign_membership_on_login: false,
                    },
                ],
            },
        });
        const { status, data } = result;
        console.log({ status, data });
        if (status >= 400) {
            throw new app_error_1.AppError("Auth0 request returned failed");
        }
        return { success: true, data };
    }
    catch (error) {
        console.error(error);
        return {
            success: false,
            error: { message: "Failed to create new Auth0 Organization" },
        };
    }
};
exports.createAuth0Org = createAuth0Org;
const addMemberToAuth0Org = async ({ orgId, userId, }) => {
    try {
        const result = await axios_1.default.request({
            method: "POST",
            url: `https://${globals_1.AUTH0_DOMAIN}/api/v2/organizations/${orgId}/members`,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${globals_1.AUTH0_MANAGE_API_TOKEN}`,
                "Cache-Control": "no-cache",
            },
            data: {
                members: [userId],
            },
        });
        const { status, data } = result;
        console.log({ status, data });
        if (status >= 400) {
            throw new app_error_1.AppError("Auth0 request returned failed");
        }
        return { success: true };
    }
    catch (error) {
        console.error(error);
        return {
            success: false,
            error: { message: "Failed to add user to Auth0 Organization" },
        };
    }
};
exports.addMemberToAuth0Org = addMemberToAuth0Org;
