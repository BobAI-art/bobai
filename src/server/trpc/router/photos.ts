import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import {
  cuidSchema,
  dbStringSchema,
  photoCategorySchema,
  promptSchema,
} from "../../../utils/schema";
import cuid from "cuid";
import { env } from "../../../env/server.mjs";
import { s3PhotoRoot } from "../../../utils/helpers";

export const photosRouter = router({
  generate: protectedProcedure.input(
    z.object({
      prompt: promptSchema,
      howMany: z.number().min(1).max(24),
      style: dbStringSchema,
      depictionId: cuidSchema.optional(),
    })
  ).mutation(async ({ ctx, input }) => {
    return input;
  }),

  generateOld: protectedProcedure
    .input(
      z.object({
        prompt: promptSchema,
        category: photoCategorySchema.default("generated-image"),
        parentModelCode: z.string(),
        depictionId: cuidSchema.optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = cuid();
      const { prompt, category, parentModelCode, depictionId } = input;

      const data = {
        id,
        bucket: env.AWS_S3_BUCKET,
        depiction_id: depictionId ? depictionId : null,
        prompt,
        category,
        owner_id: ctx.session.user.id,
        style_slug: parentModelCode,
      };

      return await ctx.prisma.photo.create({
        data: { ...data, root: s3PhotoRoot(data) },
      });
    }),

  details: publicProcedure
    .input(z.object({ id: cuidSchema }))
    .query(async ({ ctx, input }) => {
      const photo = await ctx.prisma.photo.findUnique({
        where: {
          id: input.id,
        },
        include: {
          depiction: {
            include: {
              subject: true,
            },
          },
          owner: true,
          style: true,
        },
      });
      if (!photo) {
        throw new Error("Photo not found");
      }
      return photo;
    }),
  list: publicProcedure
    .input(
      z.object({
        modelId: cuidSchema.optional(),
        category: z.enum(["generated-image", "training-progress"]).optional(),
        limit: z.number().optional().default(96),
        parentModel: dbStringSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.photo.findMany({
        where: {
          depiction_id: input.modelId,
          ...(input.parentModel
            ? {
                code: input.parentModel,
              }
            : {}),
        },
        orderBy: {
          created: "desc",
        },
        take: input.limit,
      });
    }),
});
