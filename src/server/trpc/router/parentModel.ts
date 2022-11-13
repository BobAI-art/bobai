import {
  cuidSchema,
  dbStringSchema,
  modelCreateSchema,
} from "../../../utils/schema";
import {
  router,
  protectedProcedure,
  adminProcedure,
  publicProcedure,
} from "../trpc";
import { ModelClass, modelClasses } from "../../../utils/consts";
import { z } from "zod";

export const parentModelRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.parentModel.findMany({
        take: input.limit,
        orderBy: {
          order: "asc",
        },
      });
    }),
  get: publicProcedure.input(dbStringSchema).query(async ({ ctx, input }) => {
    const model = await ctx.prisma.parentModel.findFirst({
      where: {
        code: {
          equals: input,
        },
      },
    });
    // if (!model) return model;

    return model;
  }),
});
