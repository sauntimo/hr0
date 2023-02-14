import * as dotenv from "dotenv";
import { auth } from "express-oauth2-jwt-bearer";
import jwksRsa, { ExpressJwtOptions } from "jwks-rsa";
import { expressjwt } from "express-jwt";
import { AUTH0_AUDIENCE, AUTH0_DOMAIN } from "../config/globals";
import { IncomingHttpHeaders } from "http";
import { decode, JwtPayload } from "jsonwebtoken";

dotenv.config();

export const validateAccessToken = auth({
  issuerBaseURL: `https://${AUTH0_DOMAIN}`,
  audience: AUTH0_AUDIENCE,
});

export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }) as Parameters<typeof expressjwt>[0]["secret"], // hackety hack hack
  audience: AUTH0_AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

export const decodeJWT = (headers: IncomingHttpHeaders): JwtPayload | null => {
  const authHeader = headers.authorization;
  const token = authHeader?.startsWith("Bearer")
    ? authHeader.split(" ")[1]
    : "";

  return decode(token) as JwtPayload | null;
};
