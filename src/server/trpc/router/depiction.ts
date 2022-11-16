import { cuidSchema, depictionCreateSchema } from "../../../utils/schema";
import {
  router,
  protectedProcedure,
  adminProcedure,
  publicProcedure,
} from "../trpc";
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

export const depictionRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.depiction.findMany({
        take: input.limit,
        orderBy: {
          created: "desc",
        },
      });
    }),
  ownedByMe: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    return await ctx.prisma.depiction.findMany({
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
  get: publicProcedure.input(cuidSchema).query(async ({ ctx, input }) => {
    const model = await ctx.prisma.depiction.findFirst({
      where: {
        id: input,
      },
      include: {
        subject: true,
        owner: true,
        style: true,
      },
    });
    if (!model) return model;

    return model;
  }),
  create: protectedProcedure
    .input(depictionCreateSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.depiction.create({
        data: {
          name: input.name,
          owner: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          subject: {
            connect: {
              slug: input.subjectSlug,
            },
          },
          style: {
            connect: {
              slug: input.styleSlug,
            },
          },
          regularization: makeRegularization(input.regularization),
        },
      });
    }),
  stats: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.depiction.groupBy({
      by: ["state"],
      _count: true,
    });
  }),
  retryFailed: adminProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.depiction.updateMany({
      where: {
        state: "ERROR",
      },
      data: {
        state: "CREATED",
      },
    });
  }),
});
