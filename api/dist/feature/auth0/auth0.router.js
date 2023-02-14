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
exports.auth0Router = void 0;
const express_1 = __importDefault(require("express"));
const auth0_middleware_1 = require("../../middleware/auth0.middleware");
const auth0Service = __importStar(require("./auth0.service"));
const auth0_validators_1 = require("./auth0.validators");
exports.auth0Router = express_1.default.Router();
exports.auth0Router.post("/invite", auth0_middleware_1.validateAccessToken, auth0_validators_1.userInviteValidator, async (req, res) => {
    const decoded = (0, auth0_middleware_1.decodeJWT)(req.headers);
    if (!decoded) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const userInvite = req.body;
    const result = await auth0Service.inviteOrgMember(Object.assign(Object.assign({}, userInvite), { authProviderOrganizationId: decoded.org_id }));
    if (!result.success) {
        res.status(400).json(result);
        return;
    }
    res.status(200).send();
});
