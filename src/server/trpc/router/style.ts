import { dbStringSchema } from "../../../utils/schema";
import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const styleRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.style.findMany({
        take: input.limit,
        orderBy: {
          order: "asc",
        },
      });
    }),
  get: publicProcedure.input(dbStringSchema).query(async ({ ctx, input }) => {
    return await ctx.prisma.style.findFirst({
      where: {
        slug: {
          equals: input,
        },
      },
    });
  }),
});
