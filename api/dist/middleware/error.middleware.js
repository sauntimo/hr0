"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const errorHandler = (error, request, response, next) => {
    if (error) {
        console.log(request.headers, error);
    }
    if (error instanceof express_oauth2_jwt_bearer_1.InvalidTokenError) {
        const message = "InvalidTokenError";
        response.status(error.status).json({ message });
        return;
    }
    if (error instanceof express_oauth2_jwt_bearer_1.UnauthorizedError) {
        const message = "UnauthorizedError";
        response.status(error.status).json({ message });
        return;
    }
    const status = 500;
    const message = "Internal Server Error";
    response.status(status).json({ message });
};
exports.errorHandler = errorHandler;
