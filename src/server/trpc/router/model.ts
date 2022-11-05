import { z } from "zod";
import { modelSchema, modelState } from "../../../utils/schema";
import { router, protectedProcedure } from "../trpc";

export const modelRouter = router({
  get: protectedProcedure
    .input(modelSchema.slug)
    .query(async ({ ctx, input }) => {
      const model = await ctx.prisma.model.findUnique({
        where: {
          slug: input,
        },
      });

      return model;
    }),
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
  updateStatus: protectedProcedure.input(z.object(
    {slug: modelSchema.slug,
    state:  z.enum(["created", "ready"])}
  )).mutation(async ({ input, ctx }) => {
    return await ctx.prisma.model.updateMany({
      where: {
        slug: input.slug,
        ownerId: ctx.session.user.id,
        state: {
          // do not cancel if already trained
          in: ["created", "ready"],
        }
      },
      data: {
        state: input.state,
      },
    });
  })
});
