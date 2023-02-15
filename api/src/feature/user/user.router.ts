import express, { Request, Response } from "express";

import * as userService from "./user.service";
import type { UserCreate, UserUpdateBySub } from "@commonTypes/user";

import {
  getUserBySubValiadtor,
  patchUserValiadtor,
  postUserValiadtor,
  getUsersByOrgValiadtor,
} from "./user.validators";
import {
  decodeJWT,
  validateAccessToken,
} from "../../middleware/auth0.middleware";
import { AppError } from "../../errors/app-error";
import { UnauthorizedError } from "express-oauth2-jwt-bearer";
import { GetUserBySubParams } from "./user.types";

export const userRouter = express.Router();

userRouter.post(
  "/",
  validateAccessToken,
  postUserValiadtor,
  async (req: Request<unknown, unknown, UserCreate>, res: Response) => {
    const user = req.body;
    const result = await userService.createUser({ user });

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(200).send(result);
  }
);

userRouter.patch(
  "/:sub",
  validateAccessToken,
  patchUserValiadtor,
  async (req: Request<unknown, unknown, UserUpdateBySub>, res: Response) => {
    const decoded = decodeJWT(req.headers);

    const sub = (req.params as GetUserBySubParams).sub as string;

    if (
      !decoded?.sub ||
      typeof decoded.sub !== "string" ||
      decoded.sub !== sub
    ) {
      throw new UnauthorizedError("Attempted to updated another user");
    }

    const user = req.body;
    const result = await userService.updateUser({ user });

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(200).send(result);
  }
);

userRouter.get(
  "/by-sub/:sub",
  validateAccessToken,
  getUserBySubValiadtor,
  async (req: Request, res: Response) => {
    console.log("GET /user/by-sub/:sub");

    const decoded = decodeJWT(req.headers);
    const sub = req.params.sub as string;

    if (!sub) {
      throw new AppError("Invalid sub provided");
    }

    if (decoded?.sub !== sub) {
      throw new AppError("Unauthorized");
    }

    const result = await userService.getUserBySub({ sub });

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(200).json(result);
  }
);

userRouter.get(
  "/by-org/:org",
  validateAccessToken,
  getUsersByOrgValiadtor,
  async (req: Request, res: Response) => {
    const decoded = decodeJWT(req.headers);
    const org = req.params.org as string;

    if (!org) {
      throw new AppError("Invalid org provided");
    }

    if (decoded?.org_id !== org) {
      throw new AppError("Unauthorized");
    }

    const result = await userService.getUsersByOrg({ org });

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(200).json(result);
  }
);
