import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { promptSchema } from "../../../utils/schema";



export const promptRouter = router({
  create: protectedProcedure.input(z.object(promptSchema)).mutation(async ({ input, ctx }) => {
    return await ctx.prisma.prompt.create({
      data: {
        prompt: input.prompt,
        model_id: input.modelId,
      },
    });
  })
});
