import { cuidSchema, modelCreateSchema } from "../../../utils/schema";
import { router, protectedProcedure, adminProcedure } from "../trpc";
import { ModelClass, modelClasses } from "../../../utils/consts";
import { z } from "zod";

const makeRegularization = (regularization: string) => {
  if (modelClasses.has(regularization as ModelClass)) {
    return {
      type: "fetch",
      source: `https://github.com/djbielejeski/Stable-Diffusion-Regularization-Images-${regularization}.git`,
      regularization: regularization,
    };
  }
  return {
    type: "generate",
    prompt: regularization.toLowerCase().replace(/ /g, "_"),
    count: 200,
  };
};

export const modelRouter = router({
  ownedByMe: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    return await ctx.prisma.model.findMany({
      where: {
        owner_id: ctx.session.user.id,
        state: "TRAINED",
      },
      orderBy: {
        created: "desc",
      },
      select: {
        id: true,
        name: true,
        created: true,
      },
    });
  }),
  get: protectedProcedure.input(cuidSchema).query(async ({ ctx, input }) => {
    return await ctx.prisma.model.findFirst({
      where: {
        id: input,
        owner_id: ctx.session.user.id,
      },
      include: {
        generated_photos: true,
      },
    });
  }),
  create: protectedProcedure
    .input(modelCreateSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.model.create({
        data: {
          name: input.name,
          owner_id: ctx.session.user.id,
          subject: {
            connect: {
              slug: input.subjectSlug,
            },
          },
          parent_model_code: input.parentModelCode,
          regularization: makeRegularization(input.regularization),
        },
      });
    }),
  stats: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.model.groupBy({
      by: ["state"],
      _count: true,
    });
  }),
});
