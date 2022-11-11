import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { cuidSchema } from "../../../utils/schema";

export const generatedPhotosRouter = router({
  list: publicProcedure
    .input(
      z.object({
        modelId: cuidSchema.optional(),
        category: z.enum(["generated-image", "training-progress"]).optional(),
        limit: z.number().optional().default(96),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.generatedPhoto.findMany({
        where: {
          model_id: input.modelId,
          category: input.category,
        },
        orderBy: {
          created: "desc",
        },
        take: input.limit,
      });
    }),
});
