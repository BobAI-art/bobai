import { modelSchema } from "../../../utils/schema";
import { router, protectedProcedure } from "../trpc";

export const trainingPhotoRouter = router({
  list: protectedProcedure
    .input(modelSchema.slug)
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.trainingPhoto.findMany({
        where: {
          modelSlug: input,
        },
      });
    }),
});
