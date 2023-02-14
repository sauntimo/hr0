"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersByOrg = exports.getUserBySub = exports.updateUser = exports.createUser = void 0;
const prisma_1 = require("../../db/prisma");
const app_error_1 = require("../../errors/app-error");
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
const updateUser = async ({ user, }) => {
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
exports.updateUser = updateUser;
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
