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
exports.decodeJWT = exports.checkJwt = exports.validateAccessToken = void 0;
const dotenv = __importStar(require("dotenv"));
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const express_jwt_1 = require("express-jwt");
const globals_1 = require("../config/globals");
const jsonwebtoken_1 = require("jsonwebtoken");
dotenv.config();
exports.validateAccessToken = (0, express_oauth2_jwt_bearer_1.auth)({
    issuerBaseURL: `https://${globals_1.AUTH0_DOMAIN}`,
    audience: globals_1.AUTH0_AUDIENCE,
});
exports.checkJwt = (0, express_jwt_1.expressjwt)({
    secret: jwks_rsa_1.default.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${globals_1.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: globals_1.AUTH0_AUDIENCE,
    issuer: `https://${globals_1.AUTH0_DOMAIN}/`,
    algorithms: ["RS256"],
});
const decodeJWT = (headers) => {
    const authHeader = headers.authorization;
    const token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer"))
        ? authHeader.split(" ")[1]
        : "";
    return (0, jsonwebtoken_1.decode)(token);
};
exports.decodeJWT = decodeJWT;
