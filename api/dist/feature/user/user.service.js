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
exports.getUsersByOrg = exports.getUserById = exports.getUserBySub = exports.updateUser = exports.createUser = void 0;
const auth0UserService = __importStar(require("../auth0/auth0.user.service"));
const userRepository = __importStar(require("./user.repository"));
const app_error_1 = require("../../errors/app-error");
const createUser = async ({ user, }) => {
    return userRepository.createUser({ user });
};
exports.createUser = createUser;
const updateUser = async ({ user, }) => {
    return userRepository.updateUserBySub({ user });
};
exports.updateUser = updateUser;
const getUserBySub = async ({ sub, orgAuthProviderId, }) => {
    var _a;
    try {
        const userBySubResult = await userRepository.getUserBySub({ sub });
        if (userBySubResult.success) {
            return userBySubResult;
        }
        const auth0UserResult = await auth0UserService.getAuth0User({ sub });
        if (!auth0UserResult.success) {
            throw new app_error_1.AppError(auth0UserResult.error.message);
        }
        const userIdString = auth0UserResult.data.app_metadata.userId;
        if (!userIdString) {
            throw new app_error_1.AppError("Failed to get userId");
        }
        const userId = Number(userIdString);
        const userByIdResult = await userRepository.getUserById({
            userId,
            orgAuthProviderId,
        });
        if (!userByIdResult.success) {
            throw new app_error_1.AppError(userByIdResult.error.message);
        }
        // add the sub to the user
        const updateResult = await userRepository.updateUserById({
            user: { id: userId, sub },
        });
        const userBySubSecondbResult = await userRepository.getUserBySub({ sub });
        if (userBySubSecondbResult.success) {
            return userBySubSecondbResult;
        }
        throw new app_error_1.AppError("Failed to get user after update");
    }
    catch (error) {
        if (error instanceof app_error_1.AppError) {
            return { success: false, error: { message: error.message } };
        }
        return {
            success: false,
            error: { message: (_a = error === null || error === void 0 ? void 0 : error.toString()) !== null && _a !== void 0 ? _a : "Failed to get user" },
        };
    }
};
exports.getUserBySub = getUserBySub;
const getUserById = async ({ userId, orgAuthProviderId, }) => {
    return userRepository.getUserById({ userId, orgAuthProviderId });
};
exports.getUserById = getUserById;
const getUsersByOrg = async ({ org, }) => {
    return userRepository.getUsersByOrg({ org });
};
exports.getUsersByOrg = getUsersByOrg;
