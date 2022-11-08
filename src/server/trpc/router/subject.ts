import { z } from "zod";
import { subjectSchema } from "../../../utils/schema";
import { router, protectedProcedure } from "../trpc";

export const subjectRouter = router({
  get: protectedProcedure
    .input(subjectSchema.slug)
    .query(async ({ ctx, input }) => {
      const model = await ctx.prisma.subject.findUnique({
        where: {
          slug: input,
        },
        include: {
          models: true,
        },
      });

      return model;
    }),
  slugExists: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const model = await ctx.prisma.subject.findFirst({
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
    .input(z.object(subjectSchema))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.subject.create({
        data: {
          slug: input.slug,
          description: input.description,
          owner_id: ctx.session.user.id,
        },
      });
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.subject.findMany({
      where: {
        owner_id: ctx.session.user.id,
      },
      orderBy: {
        created: "desc",
      },
    });
  }),
});
