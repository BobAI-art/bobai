import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "../trpc";
import { z } from "zod";
import {
  cuidSchema,
  dbStringSchema,
  promptSchema,
} from "../../../utils/schema";
import cuid from "cuid";
import { env } from "../../../env/server.mjs";
import { s3PhotoRoot } from "../../../utils/helpers";

export const photosRouter = router({
  generate: protectedProcedure
    .input(
      z.object({
        prompt: promptSchema,
        howMany: z.number().min(1).max(24),
        style: dbStringSchema,
        depictionId: cuidSchema.optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prompt, howMany, style, depictionId } = input;
      const { user } = ctx.session;
      const promptModel = await ctx.prisma.prompt.upsert({
        where: {
          content: prompt,
        },
        update: {},
        create: {
          content: prompt,
        },
      });
      await Promise.all(
        prompt
          .split(",")
          .map((part) => part.trim())
          .map(async (part) => {
            return await ctx.prisma.promptFragment.upsert({
              where: {
                content: part,
              },
              update: {},
              create: {
                content: part,
              },
            });
          })
      );

      await Promise.all(
        Array.from({ length: howMany }).map(async () => {
          const id = cuid();
          const data = {
            id,
            owner_id: user.id,
            style_slug: style,
            depiction_id: depictionId || null,
          };
          const root = s3PhotoRoot(data);
          return await ctx.prisma.photo.create({
            data: {
              ...data,
              root: root,
              prompt_id: promptModel.id,
              bucket: env.AWS_S3_BUCKET,
              prompt,
              seed: Math.floor(Math.random() * 4294967295),
            },
          });
        })
      );
      return input;
    }),

  details: publicProcedure
    .input(z.object({ id: cuidSchema }))
    .query(async ({ ctx, input }) => {
      const photo = await ctx.prisma.photo.findUnique({
        where: {
          id: input.id,
        },
        include: {
          depiction: {
            include: {
              subject: true,
            },
          },
          owner: true,
          style: true,
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
        promptId: cuidSchema.optional(),
        depictionId: cuidSchema.optional(),
        limit: z.number().optional().default(96),
        subjectSlug: dbStringSchema.optional(),
        skip: z.number().optional().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.photo.findMany({
        where: {
          depiction_id: input.depictionId,
          depiction: {
            subject_slug: input.subjectSlug,
          },
          prompt_id: input.promptId,
          status: "GENERATED",
        },
        orderBy: {
          created: "desc",
        },
        take: input.limit,
        skip: input.skip,
      });
    }),
  stats: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.photo.groupBy({
      by: ["status"],
      _count: true,
    });
  }),
  retryFailed: adminProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.photo.updateMany({
      where: {
        status: "GENERATING",
      },
      data: {
        status: "CREATED",
      },
    });
  }),
});
