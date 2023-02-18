import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SUPABASE_JWT_SECRET } from "../../config/globals";
import { AppError } from "../../errors/app-error";

import {
  decodeJWT,
  validateAccessToken,
} from "../../middleware/auth0.middleware";

export const supabaseRouter = express.Router();

/**
 * This is obviouslt just for dev while I'm working on the sign up flow
 */
supabaseRouter.get(
  "/token",
  validateAccessToken,
  async (req: Request, res: Response) => {
    try {
      const decoded = decodeJWT(req.headers);

      if (!decoded?.sub) {
        throw new AppError("Bad token");
      }

      const accessToken = jwt.sign(
        { userId: decoded.sub, exp: decoded.exp },
        SUPABASE_JWT_SECRET
      );

      res.status(200).json({ success: true, data: { accessToken } });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, error: { message: "Failed to get token" } });
    }
  }
);
