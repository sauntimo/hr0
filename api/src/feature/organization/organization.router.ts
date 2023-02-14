import express, { Request, Response } from "express";
import { AppError } from "../../errors/app-error";
import {
  decodeJWT,
  validateAccessToken,
} from "../../middleware/auth0.middleware";
import {
  createOrganizationValidator,
  getOrganizationByAuthIdValiadtor,
} from "./organization.valiadtors";
import * as organizationService from "./organization.service";
import { UnauthorizedError } from "express-oauth2-jwt-bearer";
import { organization } from "@prisma/client";
import {
  GetOrganizationByAuthIDParams,
  OrganizationCreate,
} from "@commonTypes/organization";

export const organizationRouter = express.Router();

organizationRouter.get(
  "/by-auth-id/:organizationAuthId",
  validateAccessToken,
  getOrganizationByAuthIdValiadtor,
  async (req: Request, res: Response) => {
    const decoded = decodeJWT(req.headers);
    const organizationAuthId = req.params.organizationAuthId as string;

    if (decoded?.org_id !== organizationAuthId) {
      throw new AppError("Unauthorized");
    }

    const result = await organizationService.getOrganizationByAuthId({
      organizationAuthId,
    });

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(200).send(result);
  }
);

organizationRouter.patch(
  "/:organizationAuthId",
  validateAccessToken,
  getOrganizationByAuthIdValiadtor,
  async (req: Request<Partial<organization>>, res: Response) => {
    const decoded = decodeJWT(req.headers);

    const organizationAuthId = (req.params as GetOrganizationByAuthIDParams)
      .organizationAuthId as string;

    if (
      !decoded?.org_id ||
      typeof decoded.org_id !== "string" ||
      decoded.org_id !== organizationAuthId
    ) {
      throw new UnauthorizedError("Attempted to updated another organization");
    }

    const organizationUpdate = req.body;

    const organization = {
      ...organizationUpdate,
      auth_provider_id: organizationAuthId,
    };

    const result = await organizationService.updateOrganizationByAuthId({
      organization,
    });

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(201).send(result);
  }
);

/**
 * Unprotected
 */
organizationRouter.post(
  "/",
  createOrganizationValidator,
  async (req: Request<unknown, unknown, OrganizationCreate>, res: Response) => {
    const organizationCreate: OrganizationCreate = req.body;

    const result = await organizationService.createOrganization({
      organizationCreate,
    });

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(200).send(result);
  }
);
