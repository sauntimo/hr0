"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuth0User = exports.createAuth0User = void 0;
const axios_1 = __importDefault(require("axios"));
const globals_1 = require("../../config/globals");
const app_error_1 = require("../../errors/app-error");
const createAuth0User = async ({ name, email, password, }) => {
    try {
        const result = await axios_1.default.request({
            method: "POST",
            url: `https://${globals_1.AUTH0_DOMAIN}/api/v2/users`,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${globals_1.AUTH0_MANAGE_API_TOKEN}`,
                "Cache-Control": "no-cache",
            },
            data: {
                name,
                email,
                password,
                connection: "Username-Password-Authentication",
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
            error: { message: "Failed to create new Auth0 User" },
        };
    }
};
exports.createAuth0User = createAuth0User;
const getAuth0User = async ({ sub, }) => {
    try {
        const result = await axios_1.default.request({
            method: "GET",
            url: `https://${globals_1.AUTH0_DOMAIN}/api/v2/users/${sub}`,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${globals_1.AUTH0_MANAGE_API_TOKEN}`,
                "Cache-Control": "no-cache",
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
            error: { message: "Failed to retrieve Auth0 User" },
        };
    }
};
exports.getAuth0User = getAuth0User;
