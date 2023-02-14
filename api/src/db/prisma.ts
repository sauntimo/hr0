import { PrismaClient } from "@prisma/client";
import { PGBOUNCER_URL } from "../config/globals";

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  datasources: {
    db: {
      url: PGBOUNCER_URL,
    },
  },
});
