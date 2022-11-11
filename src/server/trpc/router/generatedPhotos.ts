import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { cuidSchema } from "../../../utils/schema";

export const generatedPhotosRouter = router({
  list: publicProcedure
    .input(
      z.object({
        modelId: cuidSchema,
        category: z.enum(["generated-image", "training-progress"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.generatedPhoto.findMany({
        where: {
          model_id: input.modelId,
          category: input.category,
        },
      });
    }),
});
