"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserById = exports.updateUserBySub = exports.getUsersByOrg = exports.getUserById = exports.getUserBySub = exports.createUser = void 0;
const prisma_1 = require("../../db/prisma");
const app_error_1 = require("../../errors/app-error");
/**********
 * CREATE *
 **********/
const createUser = async ({ user, }) => {
    try {
        const now = new Date();
        const result = await prisma_1.prisma.user.create({
            data: Object.assign(Object.assign({}, user), { created_at: now, organization: {
                    connect: {
                        auth_provider_id: user.organization_auth_provider_id,
                    },
                } }),
        });
        return { success: true, data: result };
    }
    catch (error) {
        console.error(error);
        return { success: false, error: { message: "User create failed" } };
    }
};
exports.createUser = createUser;
const getUserBySub = async ({ sub, }) => {
    try {
        const result = await prisma_1.prisma.user.findUnique({
            where: { sub },
        });
        if (!result) {
            throw new app_error_1.AppError("User not found");
        }
        return { success: true, data: result };
    }
    catch (error) {
        console.error(error);
        return { success: false, error: { message: "Failed to get user" } };
    }
};
exports.getUserBySub = getUserBySub;
const getUserById = async ({ userId, orgAuthProviderId, }) => {
    console.log({
        userId,
        orgAuthProviderId,
    });
    try {
        // although only want one, have to use find many to use org criteria
        // for security so users can only get other users in their org
        const result = await prisma_1.prisma.user.findMany({
            where: {
                id: userId,
                organization: { auth_provider_id: orgAuthProviderId },
            },
        });
        if (!result || result.length === 0) {
            throw new app_error_1.AppError("User not found");
        }
        return { success: true, data: result[0] };
    }
    catch (error) {
        console.error(error);
        return { success: false, error: { message: "Failed to get user" } };
    }
};
exports.getUserById = getUserById;
const getUsersByOrg = async ({ org, }) => {
    try {
        const result = await prisma_1.prisma.user.findMany({
            where: { organization: { auth_provider_id: org } },
        });
        if (!result) {
            throw new app_error_1.AppError("No users found");
        }
        return { success: true, data: result };
    }
    catch (error) {
        console.error(error);
        return { success: false, error: { message: "Failed to get users" } };
    }
};
exports.getUsersByOrg = getUsersByOrg;
/**********
 * UPDATE *
 **********/
const updateUserBySub = async ({ user, }) => {
    try {
        const result = await prisma_1.prisma.user.update({
            where: { sub: user.sub },
            data: user,
        });
        return { success: true, data: result };
    }
    catch (error) {
        console.error(error);
        return { success: false, error: { message: "User update failed" } };
    }
};
exports.updateUserBySub = updateUserBySub;
const updateUserById = async ({ user, }) => {
    try {
        const result = await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: user,
        });
        return { success: true, data: result };
    }
    catch (error) {
        console.error(error);
        return { success: false, error: { message: "User update failed" } };
    }
};
exports.updateUserById = updateUserById;
