import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { promptSchema } from "../../../utils/schema";

export const promptRouter = router({
  create: protectedProcedure
    .input(z.object(promptSchema))
    .mutation(async ({ input, ctx }) => {
      return await Promise.all(
        input.modelIds.map((modelId) =>
          ctx.prisma.prompt.create({
            data: {
              prompt: input.prompt,
              model_id: modelId,
            },
          })
        )
      );
    }),
  list: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    return await ctx.prisma.prompt.findMany({
      include: {
        model: true,
      },
      where: {
        model: {
          owner_id: ctx.session.user.id,
        },
      },
    });
  }),
});
