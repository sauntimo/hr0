import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as CryptoJS from "crypto-js";

import { SUPABASE_JWT_SECRET } from "../../config/globals";
import { AppError } from "../../errors/app-error";

import {
  decodeJWT,
  validateAccessToken,
} from "../../middleware/auth0.middleware";
import { getUserBySub } from "../user/user.service";
import { supabaseClient } from "../../db/supabase";
import { Session } from "@supabase/supabase-js";

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

      const userResult = await getUserBySub({
        sub: decoded.sub,
        orgAuthProviderId: decoded.org_id,
      });

      if (!userResult.success) {
        throw new AppError("Failed to get user");
      }

      const user = userResult.data;

      const userPassword = supabaseUserPassword({
        email: user.email,
      });

      const signInResult = await supabaseClient.auth.signInWithPassword({
        email: user.email,
        password: userPassword,
      });

      const { access_token, refresh_token } = signInResult.data
        .session as Session;

      const decodedSupabaseAccessToken = jwt.decode(access_token);

      res.status(200).json({
        success: true,
        data: { access_token, refresh_token },
      });
    } catch (error) {
      console.log(error);

      res
        .status(400)
        .json({ success: false, error: { message: "Failed to get token" } });
    }
  }
);

interface SupabaseUserPasswordParams {
  email: string;
}

export const supabaseUserPassword = ({
  email,
}: SupabaseUserPasswordParams): string => {
  const b64PwdHash = CryptoJS.SHA256(
    `${email}-${SUPABASE_JWT_SECRET}`
  ).toString(CryptoJS.enc.Base64);

  return b64PwdHash;
};
