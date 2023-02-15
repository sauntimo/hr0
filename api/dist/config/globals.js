"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH0_CONNECTION_ID = exports.AUTH0_MANAGE_API_TOKEN = exports.AUTH0_CLIENT_ID = exports.AUTH0_DOMAIN = exports.AUTH0_AUDIENCE = exports.CLIENT_ORIGIN_URL = exports.PGBOUNCER_URL = exports.POSTGRES_URL = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : "";
exports.POSTGRES_URL = (_b = process.env.POSTGRES_URL) !== null && _b !== void 0 ? _b : "";
exports.PGBOUNCER_URL = (_c = process.env.PGBOUNCER_URL) !== null && _c !== void 0 ? _c : "";
exports.CLIENT_ORIGIN_URL = (_d = process.env.CLIENT_ORIGIN_URL) !== null && _d !== void 0 ? _d : "";
exports.AUTH0_AUDIENCE = (_e = process.env.AUTH0_AUDIENCE) !== null && _e !== void 0 ? _e : "";
exports.AUTH0_DOMAIN = (_f = process.env.AUTH0_DOMAIN) !== null && _f !== void 0 ? _f : "";
exports.AUTH0_CLIENT_ID = (_g = process.env.AUTH0_CLIENT_ID) !== null && _g !== void 0 ? _g : "";
exports.AUTH0_MANAGE_API_TOKEN = (_h = process.env.AUTH0_MANAGE_API_TOKEN) !== null && _h !== void 0 ? _h : "";
exports.AUTH0_CONNECTION_ID = (_j = process.env.AUTH0_CONNECTION_ID) !== null && _j !== void 0 ? _j : "";
