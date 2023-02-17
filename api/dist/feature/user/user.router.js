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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const userService = __importStar(require("./user.service"));
const user_validators_1 = require("./user.validators");
const auth0_middleware_1 = require("../../middleware/auth0.middleware");
const app_error_1 = require("../../errors/app-error");
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
exports.userRouter = express_1.default.Router();
exports.userRouter.post("/", auth0_middleware_1.validateAccessToken, user_validators_1.postUserValiadtor, async (req, res) => {
    const user = req.body;
    const result = await userService.createUser({ user });
    if (!result.success) {
        res.status(400).json(result);
        return;
    }
    res.status(200).send(result);
});
exports.userRouter.patch("/:sub", auth0_middleware_1.validateAccessToken, user_validators_1.patchUserValiadtor, async (req, res) => {
    const decoded = (0, auth0_middleware_1.decodeJWT)(req.headers);
    const sub = req.params.sub;
    if (!(decoded === null || decoded === void 0 ? void 0 : decoded.sub) ||
        typeof decoded.sub !== "string" ||
        decoded.sub !== sub) {
        throw new express_oauth2_jwt_bearer_1.UnauthorizedError("Attempted to updated another user");
    }
    const user = req.body;
    const result = await userService.updateUser({ user });
    if (!result.success) {
        res.status(400).json(result);
        return;
    }
    res.status(200).send(result);
});
exports.userRouter.get("/by-sub/:sub", auth0_middleware_1.validateAccessToken, user_validators_1.getUserBySubValiadtor, async (req, res) => {
    const decoded = (0, auth0_middleware_1.decodeJWT)(req.headers);
    const sub = req.params.sub;
    if ((decoded === null || decoded === void 0 ? void 0 : decoded.sub) !== sub) {
        throw new app_error_1.AppError("Unauthorized");
    }
    const result = await userService.getUserBySub({
        sub,
        orgAuthProviderId: decoded.org_id,
    });
    if (!result.success) {
        res.status(400).json(result);
        return;
    }
    res.status(200).json(result);
});
exports.userRouter.get("/by-id/:userId", auth0_middleware_1.validateAccessToken, user_validators_1.getUserByIdValiadtor, async (req, res) => {
    const decoded = (0, auth0_middleware_1.decodeJWT)(req.headers);
    const userId = Number(req.params.userId);
    const result = await userService.getUserById({
        userId,
        orgAuthProviderId: decoded === null || decoded === void 0 ? void 0 : decoded.org_id,
    });
    if (!result.success) {
        res.status(400).json(result);
        return;
    }
    res.status(200).json(result);
});
exports.userRouter.get("/by-org/:org", auth0_middleware_1.validateAccessToken, user_validators_1.getUsersByOrgValiadtor, async (req, res) => {
    const decoded = (0, auth0_middleware_1.decodeJWT)(req.headers);
    const org = req.params.org;
    if (!org) {
        throw new app_error_1.AppError("Invalid org provided");
    }
    if ((decoded === null || decoded === void 0 ? void 0 : decoded.org_id) !== org) {
        throw new app_error_1.AppError("Unauthorized");
    }
    const result = await userService.getUsersByOrg({ org });
    if (!result.success) {
        res.status(400).json(result);
        return;
    }
    res.status(200).json(result);
});
