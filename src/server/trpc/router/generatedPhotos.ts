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
import { s3GeneratedPhotoRoot } from "../../../utils/helpers";

export const generatedPhotosRouter = router({
  generate: protectedProcedure
    .input(
      z.object({
        prompt: promptSchema,
        category: photoCategorySchema.default("generated-image"),
        parentModelCode: z.string(),
        modelId: cuidSchema.optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = cuid();
      const { prompt, category, parentModelCode, modelId } = input;

      const data = {
        id,
        bucket: env.AWS_S3_BUCKET,
        model_id: modelId ? modelId : null,
        prompt,
        category,
        owner_id: ctx.session.user.id,
        code: parentModelCode,
      };

      return await ctx.prisma.generatedPhoto.create({
        data: { ...data, root: s3GeneratedPhotoRoot(data) },
      });
    }),

  details: publicProcedure
    .input(z.object({ id: cuidSchema }))
    .query(async ({ ctx, input }) => {
      const photo = await ctx.prisma.generatedPhoto.findUnique({
        where: {
          id: input.id,
        },
        include: {
          model: {
            include: {
              subject: true,
            },
          },
          owner: true,
          parent_model: true,
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
      return await ctx.prisma.generatedPhoto.findMany({
        where: {
          model_id: input.modelId,
          category: input.category,
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
