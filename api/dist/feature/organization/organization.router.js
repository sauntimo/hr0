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
exports.organizationRouter = void 0;
const express_1 = __importDefault(require("express"));
const app_error_1 = require("../../errors/app-error");
const auth0_middleware_1 = require("../../middleware/auth0.middleware");
const organization_valiadtors_1 = require("./organization.valiadtors");
const organizationService = __importStar(require("./organization.service"));
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
exports.organizationRouter = express_1.default.Router();
exports.organizationRouter.get("/by-auth-id/:organizationAuthId", auth0_middleware_1.validateAccessToken, organization_valiadtors_1.getOrganizationByAuthIdValiadtor, async (req, res) => {
    const decoded = (0, auth0_middleware_1.decodeJWT)(req.headers);
    const organizationAuthId = req.params.organizationAuthId;
    if ((decoded === null || decoded === void 0 ? void 0 : decoded.org_id) !== organizationAuthId) {
        throw new app_error_1.AppError("Unauthorized");
    }
    const result = await organizationService.getOrganizationByAuthId({
        organizationAuthId,
    });
    if (!result.success) {
        res.status(400).json(result);
        return;
    }
    res.status(200).send(result);
});
exports.organizationRouter.patch("/:organizationAuthId", auth0_middleware_1.validateAccessToken, organization_valiadtors_1.getOrganizationByAuthIdValiadtor, async (req, res) => {
    const decoded = (0, auth0_middleware_1.decodeJWT)(req.headers);
    const organizationAuthId = req.params
        .organizationAuthId;
    if (!(decoded === null || decoded === void 0 ? void 0 : decoded.org_id) ||
        typeof decoded.org_id !== "string" ||
        decoded.org_id !== organizationAuthId) {
        throw new express_oauth2_jwt_bearer_1.UnauthorizedError("Attempted to updated another organization");
    }
    const organizationUpdate = req.body;
    const organization = Object.assign(Object.assign({}, organizationUpdate), { auth_provider_id: organizationAuthId });
    const result = await organizationService.updateOrganizationByAuthId({
        organization,
    });
    if (!result.success) {
        res.status(400).json(result);
        return;
    }
    res.status(201).send(result);
});
/**
 * Unprotected
 */
exports.organizationRouter.post("/", organization_valiadtors_1.createOrganizationValidator, async (req, res) => {
    const organizationCreate = req.body;
    const result = await organizationService.createOrganization({
        organizationCreate,
    });
    if (!result.success) {
        res.status(400).json(result);
        return;
    }
    res.status(200).send(result);
});
