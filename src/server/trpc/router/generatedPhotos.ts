import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { cuidSchema, dbStringSchema } from "../../../utils/schema";

export const generatedPhotosRouter = router({
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
              owner: true,
              subject: true,
              parent_model: true,
            },
          },
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
                model: {
                  parent_model_code: input.parentModel,
                },
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
