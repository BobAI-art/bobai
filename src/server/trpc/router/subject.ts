import { z } from "zod";
import { cuidSchema, subjectSchema } from "../../../utils/schema";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const subjectRouter = router({
  get: publicProcedure
    .input(subjectSchema.slug)
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.subject.findUnique({
        where: {
          slug: input,
        },
        include: {
          models: true,
        },
      });
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
  finish: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.subject.updateMany({
      where: {
        owner_id: ctx.session.user.id,
      },
      data: {
        finished: true,
      },
    });
  }),

  list: protectedProcedure
    .input(z.object({ ownerId: cuidSchema }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.subject.findMany({
        where: {
          owner_id: input.ownerId,
        },
        orderBy: {
          created: "desc",
        },
      });
    }),
});
