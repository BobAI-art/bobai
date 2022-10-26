import * as trpc from "@trpc/server";

import { z } from "zod";
import {
  base64ImageSchema,
  cuidSchema,
  modelSchema,
} from "../../../utils/schema";
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
  add: protectedProcedure
    .input(
      z.object({
        model: modelSchema.slug,
        photoCuid: cuidSchema,
        photoData: base64ImageSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const model = await ctx.prisma.model.findFirst({
        where: {
          slug: input.model,
          ownerId: ctx.session.user.id,
        },
      });
      if (model) {
        throw new Error("You already have a training photo for this model");
        return await ctx.prisma.trainingPhoto.create({
          data: {
            modelSlug: input.model,
            id: input.photoCuid,
            path: "some/path",
          },
        });
      }
      throw new trpc.TRPCError({
        code: "FORBIDDEN",
        message: "You are not allowed to do this",
      });
    }),
});
