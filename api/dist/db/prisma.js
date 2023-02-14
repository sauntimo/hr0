"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const globals_1 = require("../config/globals");
exports.prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
        db: {
            url: globals_1.PGBOUNCER_URL,
        },
    },
});
