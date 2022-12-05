import { cuidSchema, depictionCreateSchema } from "../../../utils/schema";
import {
  router,
  protectedProcedure,
  adminProcedure,
  publicProcedure,
} from "../trpc";
import { ModelClass, modelClasses } from "../../../utils/consts";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { photoUrl } from "../../../utils/helpers";
import { Depiction, Subject } from "@prisma/client";
import * as trpc from "@trpc/server";

const makeRegularization = (regularization: string) => {
  if (modelClasses.has(regularization as ModelClass)) {
    return {
      type: "fetch",
      source: `https://github.com/djbielejeski/Stable-Diffusion-Regularization-Images-${regularization}.git`,
      regularization: regularization,
    };
  }
  return {
    type: "generate",
    prompt: regularization.toLowerCase().replace(/ /g, "_"),
    count: 200,
  };
};

export const depictionRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.depiction.findMany({
        take: input.limit,
        orderBy: {
          created: "desc",
        },
      });
    }),
  ownedByMe: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    const depictions = await ctx.prisma.depiction.findMany({
      where: {
        owner_id: ctx.session.user.id,
        state: "TRAINED",
      },
      orderBy: {
        created: "desc",
      },
      include: {
        subject: true,
      },
    });
    // group by subject
    return Object.values(
      depictions.reduce((acc, depiction) => {
        let current = acc[depiction.subject_slug];
        if (!current) {
          current = {
            subject: depiction.subject,
            depictions: [],
          };
        }
        current.depictions.push(depiction);
        acc[depiction.subject_slug] = current;
        return acc;
      }, {} as Record<string, { subject: Subject; depictions: Depiction[] }>)
    );
  }),
  get: publicProcedure.input(cuidSchema).query(async ({ ctx, input }) => {
    const depiction = await ctx.prisma.depiction.findUnique({
      where: {
        id: input,
      },
      include: {
        subject: true,
        owner: true,
        style: true,
      },
    });
    if (!depiction) {
      throw new trpc.TRPCError({
        code: "NOT_FOUND",
      });
    }
    if (depiction.owner_id !== ctx.session?.user?.id && depiction) {
    }

    return depiction;
  }),
  create: protectedProcedure
    .input(depictionCreateSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.depiction.create({
        data: {
          name: input.name,
          owner: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          subject: {
            connect: {
              slug: input.subjectSlug,
            },
          },
          style: {
            connect: {
              slug: input.styleSlug,
            },
          },
          regularization: makeRegularization(input.regularization),
        },
      });
    }),
  stats: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.depiction.groupBy({
      by: ["state"],
      _count: true,
    });
  }),
  retryFailed: adminProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.depiction.updateMany({
      where: {
        state: "ERROR",
      },
      data: {
        state: "CREATED",
      },
    });
  }),
  setCover: protectedProcedure
    .input(
      z.object({
        photoId: cuidSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const photo = await ctx.prisma.photo.findUnique({
        where: {
          id: input.photoId,
        },
      });
      if (!photo) throw new TRPCError({ code: "NOT_FOUND" });
      if (!photo.depiction_id) throw new TRPCError({ code: "BAD_REQUEST" });
      if (photo.owner_id !== ctx.session.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });
      return await ctx.prisma.depiction.update({
        where: {
          id: photo.depiction_id,
        },
        data: {
          photoUrl: photoUrl(photo),
          photoWidth: photo.width,
          photoHeight: photo.height,
        },
      });
    }),
});
