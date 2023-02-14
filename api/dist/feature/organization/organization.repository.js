"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrganization = exports.updateOrganizationByAuthId = exports.getOrganizationByAuthId = void 0;
const prisma_1 = require("../../db/prisma");
const app_error_1 = require("../../errors/app-error");
const getOrganizationByAuthId = async ({ organizationAuthId, }) => {
    try {
        const result = await prisma_1.prisma.organization.findUnique({
            where: { auth_provider_id: organizationAuthId },
        });
        if (!result) {
            throw new app_error_1.AppError("Organization not found");
        }
        return { success: true, data: result };
    }
    catch (error) {
        console.error(error);
        return { success: false, error: { message: "Failed to get organization" } };
    }
};
exports.getOrganizationByAuthId = getOrganizationByAuthId;
const updateOrganizationByAuthId = async ({ organization, }) => {
    try {
        const { auth_provider_id } = organization, data = __rest(organization, ["auth_provider_id"]);
        const result = await prisma_1.prisma.organization.update({
            where: { auth_provider_id },
            data,
        });
        return { success: true, data: result };
    }
    catch (error) {
        console.error(error);
        return {
            success: false,
            error: { message: "Failed to update organization" },
        };
    }
};
exports.updateOrganizationByAuthId = updateOrganizationByAuthId;
const createOrganization = async ({ organizationCreate, }) => {
    try {
        const result = await prisma_1.prisma.organization.create({
            data: {
                auth_provider_name: organizationCreate.org_auth_provider_name,
                auth_provider_id: organizationCreate.org_id,
                name: organizationCreate.org_display_name,
                user: {
                    create: {
                        sub: organizationCreate.user_sub,
                        name: organizationCreate.user_name,
                        email: organizationCreate.user_email,
                    },
                },
            },
        });
        return { success: true };
    }
    catch (error) {
        console.error(error);
        return {
            success: false,
            error: { message: "Failed to create organization" },
        };
    }
};
exports.createOrganization = createOrganization;
