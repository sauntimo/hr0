import express, { Request, Response } from "express";

import {
  decodeJWT,
  validateAccessToken,
} from "../../middleware/auth0.middleware";

import * as auth0Service from "./auth0.service";
import { userInviteValidator } from "./auth0.validators";

export const auth0Router = express.Router();

auth0Router.post(
  "/invite",
  validateAccessToken,
  userInviteValidator,
  async (req: Request, res: Response) => {
    const decoded = decodeJWT(req.headers);
    if (!decoded) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userInvite = req.body;
    const result = await auth0Service.inviteOrgMember({
      ...userInvite,
      authProviderOrganizationId: decoded.org_id as string,
    });

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(200).send();
  }
);
