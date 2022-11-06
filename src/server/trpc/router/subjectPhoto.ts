import * as trpc from "@trpc/server";

import { z } from "zod";
import {
  base64ImageSchema,
  cuidSchema,
  subjectSchema,
} from "../../../utils/schema";
import { router, protectedProcedure } from "../trpc";
import { deleteS3Object, putS3Object } from "../../s3";
import { env } from "../../../env/server.mjs";

const s3TrainingImagePath = (
  userId: string,
  modelId: string,
  photoCuid: string
) => `user/${userId}/model/${modelId}/photo/${photoCuid}`;

export const subjectPhotoRouter = router({
  list: protectedProcedure
    .input(subjectSchema.slug)
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.subjectPhoto.findMany({
        where: {
          subject_slug: input,
        },
      });
    }),
  delete: protectedProcedure
    .input(cuidSchema)
    .mutation(async ({ ctx, input }) => {
      const image = await ctx.prisma.subjectPhoto.findFirst({
        where: {
          id: input,
          subject: {
            owner_id: ctx.session.user.id,
          },
        },
        select: {
          id: true,
          subject: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!image) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to do this",
        });
      }
      const s3Path = s3TrainingImagePath(
        ctx.session.user.id,
        image.subject.id,
        image.id
      );
      await deleteS3Object(s3Path);

      return await ctx.prisma.subjectPhoto.delete({
        where: {
          id: input,
        },
      });
    }),
  add: protectedProcedure
    .input(
      z.object({
        model: subjectSchema.slug,
        photoCuid: cuidSchema,
        photoData: base64ImageSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const model = await ctx.prisma.subject.findFirst({
        where: {
          slug: input.model,
          owner_id: ctx.session.user.id,
        },
      });
      if (model) {
        const s3Path = s3TrainingImagePath(
          ctx.session.user.id,
          model.id,
          input.photoCuid
        );
        const [header, data] = input.photoData.split(",");
        if (!data) throw new Error("Invalid image data");
        if (!header) throw new Error("Invalid image header");
        const contentType = header.split(":")[1]?.split(";")[0];
        if (contentType === undefined)
          throw new Error("Invalid image content type");
        const buffer = Buffer.from(data, "base64");
        await putS3Object(s3Path, contentType, buffer);

        return await ctx.prisma.subjectPhoto.create({
          data: {
            subject_slug: input.model,
            id: input.photoCuid,
            path: s3Path,
            bucket: env.AWS_S3_BUCKET,
          },
        });
      }
      throw new trpc.TRPCError({
        code: "FORBIDDEN",
        message: "You are not allowed to do this",
      });
    }),
});
