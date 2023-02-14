"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.updateUser = exports.createUser = void 0;
const prisma_1 = require("../../db/prisma");
const app_error_1 = require("../../errors/app-error");
const createUser = async ({ user, }) => {
    try {
        const now = new Date();
        const result = await prisma_1.prisma.user.create({
            data: Object.assign(Object.assign({}, user), { created_at: now, organization: {
                    connectOrCreate: {
                        where: {
                            auth_provider_id: user.organization_auth_provider_id,
                        },
                        create: {
                            auth_provider_id: user.organization_auth_provider_id,
                            created_at: now,
                        },
                    },
                } }),
        });
    }
    catch (error) {
        return { success: false, error: { message: "User create failed" } };
    }
    return { success: true };
};
exports.createUser = createUser;
const updateUser = async ({ user, }) => {
    try {
        const result = await prisma_1.prisma.user.update({
            where: { sub: user.sub },
            data: user,
        });
    }
    catch (error) {
        return { success: false, error: { message: "User update failed" } };
    }
    return { success: true };
};
exports.updateUser = updateUser;
const getUser = async ({ sub, }) => {
    var _a;
    try {
        const result = await prisma_1.prisma.user.findUnique({
            where: { sub },
        });
        if (!result) {
            throw new app_error_1.AppError("user not found");
        }
        return { success: true, data: result };
    }
    catch (error) {
        const message = error instanceof app_error_1.AppError
            ? error.message
            : (_a = error === null || error === void 0 ? void 0 : error.toString()) !== null && _a !== void 0 ? _a : "Failed to get user";
        return { success: false, error: { message } };
    }
};
exports.getUser = getUser;
