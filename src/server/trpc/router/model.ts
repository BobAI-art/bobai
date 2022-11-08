import { cuidSchema, modelCreateSchema } from "../../../utils/schema";
import { router, protectedProcedure } from "../trpc";
import { ModelClass, modelClasses } from "../../../utils/consts";

const makeRegularization = (regularization: string) => {
  if (modelClasses.has(regularization as ModelClass)) {
    return {
      type: "fetch",
      source: `https://github.com/djbielejeski/Stable-Diffusion-Regularization-Images-${regularization}.git`,
    };
  }
  return {
    type: "generate",
    prompt: regularization.toLowerCase().replace(/ /g, "_"),
    count: 200,
  };
};

export const modelRouter = router({
  get: protectedProcedure.input(cuidSchema).query(async ({ ctx, input }) => {
    return await ctx.prisma.model.findFirst({
      where: {
        id: input,
        owner_id: ctx.session.user.id,
      },
      include: {
        generated_photos: true,
      },
    });
  }),
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
            },
          },
          parent_model_code: input.parentModelCode,
          regularization: makeRegularization(input.regularization),
        },
      });
    }),
});
