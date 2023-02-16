import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import nocache from "nocache";
import bodyParser from "body-parser";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { PORT, CLIENT_ORIGIN_URL } from "./config/globals";
import { errors } from "celebrate";

// Routers
import { auth0Router } from "./feature/auth0/auth0.router";
import { userRouter } from "./feature/user/user.router";
import { organizationRouter } from "./feature/organization/organization.router";

import fs from "fs";
import https from "https";

const privateKey = fs.readFileSync(
  "/Users/tim.saunders/work/code/localhost+1-key.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/Users/tim.saunders/work/code/localhost+1.pem",
  "utf8"
);

const credentials = { key: privateKey, cert: certificate };

dotenv.config();

const app: Express = express();

if (!(PORT && CLIENT_ORIGIN_URL)) {
  throw new Error(
    "Missing required environment variables. Check docs for more info."
  );
}

const apiRouter = express.Router();

// app.use(express.json());
app.use(bodyParser.json());

app.set("json spaces", 2);

app.use(
  helmet({
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
  })
);

app.use((req, res, next) => {
  res.contentType("application/json; charset=utf-8");
  next();
});
app.use(nocache());

app.options("*", cors());

app.use(
  cors({
    origin: CLIENT_ORIGIN_URL,
    methods: ["GET,PATCH,POST,DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
    credentials: false,
  })
);

app.use("/api", apiRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/organization", organizationRouter);
apiRouter.use("/auth0", auth0Router);

app.get("/", (req, res, next) => {
  res.status(200).json({ status: "ok" });
});

app.use(errors());
app.use(errorHandler);
app.use(notFoundHandler);

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`🚀 Listening on port ${PORT}...`);
});
