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

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    const first = array[randomIndex];
    const second = array[currentIndex];
    if (first && second) {
      // always true but typescript doesn't know that
      array[currentIndex] = first;
      array[randomIndex] = second;
    }
  }

  return array;
}

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
  vote: protectedProcedure
    .input(z.object({ id: cuidSchema, vote: z.number().min(0).max(5) }))
    .mutation(async ({ ctx, input }) => {
      const redisKey = `vote:${ctx.session.user.id}:${input.id}`;
      const isVoted = await ctx.redis.get(redisKey);
      if (isVoted !== null) {
        throw new Error("Already voted today");
      }
      const photo = await ctx.prisma.photo.findUnique({
        where: {
          id: input.id,
        },
      });
      await ctx.prisma.photo.update({
        where: {
          id: input.id,
        },
        data: {
          score: {
            increment: input.vote,
          },
          average_score:
            (photo?.score || 0) + input.vote / ((photo?.votes || 0) + 1),
          votes: {
            increment: 1,
          },
        },
      });
      await ctx.redis.set(redisKey, "1", {
        ex: 60 * 60 * 24,
      });
      return photo;
    }),
  toVote: protectedProcedure
    .input(
      z.object({
        count: z.number().min(1).max(512),
        maxVotes: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const photos = await ctx.prisma.photo.findMany({
        where: {
          votes: {
            lt: input.maxVotes,
          },
        },
        include: {
          depiction: true,
        },
        take: input.count * 1000,
      });
      return shuffle(photos).slice(0, input.count);
    }),

  list: publicProcedure
    .input(
      z.object({
        promptId: cuidSchema.optional(),
        depictionId: cuidSchema.optional(),
        take: z.number().min(1).default(96),
        subjectSlug: dbStringSchema.optional(),
        styleSlug: dbStringSchema.optional(),
        cursor: cuidSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const canShow =
        ctx.session?.user?.id !== undefined
          ? { OR: [{ owner_id: ctx.session.user.id }, { is_public: true }] }
          : {
              is_public: true,
            };
      const photos = await ctx.prisma.photo.findMany({
        where: {
          depiction_id: input.depictionId,
          depiction: {
            subject_slug: input.subjectSlug,
          },
          style_slug: input.styleSlug,
          prompt_id: input.promptId,
          status: "GENERATED",
          ...canShow,
        },
        // cursor: input.cursor ? { created: input.cursor } : undefined,
        cursor: input.cursor
          ? {
              id: input.cursor,
            }
          : undefined,
        orderBy: {
          created: "desc",
        },
        take: input.take + 1,
        // skip: input.skip,
      });
      let nextCursor: typeof input.cursor | undefined = undefined;
      if (photos.length > input.take) {
        const nextItem = photos.pop();
        nextCursor = nextItem!.id;
      }
      return {
        photos,
        nextCursor,
      };
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
