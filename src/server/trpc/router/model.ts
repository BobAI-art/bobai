import { z } from "zod";
import { modelSchema } from "../../../utils/schema";
import { router, protectedProcedure } from "../trpc";

export const modelRouter = router({
  slugExists: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const model = await ctx.prisma.model.findFirst({
        where: {
          slug: input,
        },
      });
      return {
        exists: model?.slug ? true : false,
        slug: model?.slug,
        id: model?.id,
      };
    }),
  create: protectedProcedure
    .input(z.object(modelSchema))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.model.create({
        data: {
          slug: input.slug,
          description: input.description,
          ownerId: ctx.session.user.id,
          state: "created",
        },
      });
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.model.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
      orderBy: {
        created: "desc",
      },
    });
  }),
});
