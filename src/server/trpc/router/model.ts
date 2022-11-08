import { z } from "zod";
import { modelCreateSchema } from "../../../utils/schema";
import { router, protectedProcedure } from "../trpc";
import { modelClasses } from "../../../utils/consts";

const makeRegularization = (regularization: string) => {
  if(modelClasses.has(regularization as any)) {
    return {
      type: "fetch",
      source: `https://github.com/djbielejeski/Stable-Diffusion-Regularization-Images-${regularization}.git`
    }
  }
  return {
    type: "generate",
      prompt: regularization.toLowerCase().replace(/ /g, "_"),
    count: 200
  }
}

export const modelRouter = router({
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
            }
          },
          parent_model_code: input.parentModelCode,
          regularization: makeRegularization(input.regularization),
        },
      });
    }),
});
