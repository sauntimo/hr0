import express, { Request, Response } from "express";
import { auth0ManagementClient } from "../..";
import { prisma } from "../../db/prisma";

export const adminRouter = express.Router();

/**
 * This is obviouslt just for dev while I'm working on the sign up flow
 */
adminRouter.delete("/nuke", async (req: Request, res: Response) => {
  try {
    if (process.env.NODE_ENV !== "develop") {
      res.status(400).json({ message: "just no" });
    }

    const orgs = await auth0ManagementClient.organizations.getAll();

    orgs.forEach(async (org) => {
      const users = await auth0ManagementClient.organizations.getMembers({
        id: org.id,
      });

      users.forEach(async (user) => {
        await auth0ManagementClient.deleteUser({
          id: user.user_id ?? "",
        });
      });

      await auth0ManagementClient.organizations.delete({
        id: org.id,
      });
    });

    await prisma.$transaction([
      prisma.$queryRawUnsafe("TRUNCATE organization CASCADE;"),
      prisma.$queryRawUnsafe("ALTER SEQUENCE organization_id_seq RESTART;"),
      prisma.$queryRawUnsafe("ALTER SEQUENCE user_id_seq RESTART;"),
    ]);

    res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(400).json({ message: "fail" });
  }
});
