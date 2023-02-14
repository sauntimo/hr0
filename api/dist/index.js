"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const nocache_1 = __importDefault(require("nocache"));
const body_parser_1 = __importDefault(require("body-parser"));
const error_middleware_1 = require("./middleware/error.middleware");
const not_found_middleware_1 = require("./middleware/not-found.middleware");
const user_router_1 = require("./feature/user/user.router");
const globals_1 = require("./config/globals");
const celebrate_1 = require("celebrate");
const auth0_router_1 = require("./feature/auth0/auth0.router");
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const organization_router_1 = require("./feature/organization/organization.router");
const privateKey = fs_1.default.readFileSync("/Users/tim.saunders/work/code/sauntimo/hr0/common/keys/localhost-key.pem", "utf8");
const certificate = fs_1.default.readFileSync("/Users/tim.saunders/work/code/sauntimo/hr0/common/keys/localhost.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };
dotenv_1.default.config();
const app = (0, express_1.default)();
if (!(globals_1.PORT && globals_1.CLIENT_ORIGIN_URL)) {
    throw new Error("Missing required environment variables. Check docs for more info.");
}
const apiRouter = express_1.default.Router();
// app.use(express.json());
app.use(body_parser_1.default.json());
app.set("json spaces", 2);
app.use((0, helmet_1.default)({
    hsts: {
        maxAge: 31536000,
    },
    contentSecurityPolicy: {
        useDefaults: false,
        directives: {
            "default-src": ["'none'"],
            "frame-ancestors": ["'none'"],
        },
    },
    frameguard: {
        action: "deny",
    },
}));
app.use((req, res, next) => {
    res.contentType("application/json; charset=utf-8");
    next();
});
app.use((0, nocache_1.default)());
app.options("*", (0, cors_1.default)());
app.use((0, cors_1.default)({
    origin: globals_1.CLIENT_ORIGIN_URL,
    // origin: "http://localhost:3000",
    methods: ["GET,PATCH,POST,DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
    credentials: false, //access-control-allow-credentials:true
}));
app.use("/api", apiRouter);
apiRouter.use("/user", user_router_1.userRouter);
apiRouter.use("/organization", organization_router_1.organizationRouter);
apiRouter.use("/auth0", auth0_router_1.auth0Router);
app.get("/", (req, res, next) => {
    res.status(200).json({ status: "ok" });
});
app.use((0, celebrate_1.errors)());
app.use(error_middleware_1.errorHandler);
app.use(not_found_middleware_1.notFoundHandler);
// const httpServer = http.createServer(app);
const httpsServer = https_1.default.createServer(credentials, app);
// httpServer.listen(8080);
httpsServer.listen(globals_1.PORT, () => {
    console.log(`🚀 Listening on port ${globals_1.PORT}`);
});
