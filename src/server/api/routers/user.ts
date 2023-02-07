import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  addOne: protectedProcedure.query(({ ctx }) => {
    console.log("in addOne");
    return "addOne return message";
    // return ctx.prisma.user.create({
    //   data: {
    //     name: ctx.user.name,
    //     auth_provider_id: ctx.user.id,
    //     email: ctx.user.email,
    //     created_at: new Date(),
    //     organization: {
    //       connectOrCreate: {
    //         where: { auth_provider_id: ctx.user.organization_id },
    //         create: {
    //           auth_provider_id: ctx.user.organization_id,
    //           created_at: new Date(),
    //         },
    //       },
    //     },
    //   },
    // });
  }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
});
