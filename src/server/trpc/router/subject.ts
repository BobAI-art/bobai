import { z } from "zod";
import { cuidSchema, slugSchema, subjectSchema } from "../../../utils/schema";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const subjectRouter = router({
  get: publicProcedure
    .input(subjectSchema.slug)
    .query(async ({ ctx, input }) => {
      const subject = await ctx.prisma.subject.findUnique({
        where: {
          slug: input,
        },
        include: {
          depiction: true,
        },
      });
      if (!subject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subject not found",
        });
      }
      if (!subject.is_public && subject.owner_id !== ctx.session?.user?.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to do this",
        });
      }
      return subject;
    }),
  slugExists: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const subject = await ctx.prisma.subject.findFirst({
        where: {
          slug: input,
        },
      });
      return {
        exists: subject?.slug ? true : false,
        slug: subject?.slug,
        id: subject?.id,
      };
    }),
  create: protectedProcedure
    .input(z.object(subjectSchema))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.subject.create({
        data: {
          slug: input.slug,
          description: input.description,
          owner_id: ctx.session.user.id,
        },
      });
    }),
  finish: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.subject.updateMany({
      where: {
        owner_id: ctx.session.user.id,
      },
      data: {
        finished: true,
      },
    });
  }),

  list: protectedProcedure
    .input(z.object({ ownerId: cuidSchema }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.subject.findMany({
        where: {
          owner_id: input.ownerId,
        },
        orderBy: {
          created: "desc",
        },
      });
    }),
  setCover: protectedProcedure
    .input(
      z.object({
        subjectSlug: slugSchema,
        photoUrl: z.string().url().max(190),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const subject = await ctx.prisma.subject.findUnique({
        where: {
          slug: input.subjectSlug,
        },
      });
      if (!subject) throw new TRPCError({ code: "NOT_FOUND" });
      // if (!subject.depiction_id) throw new TRPCError({ code: "BAD_REQUEST" });
      if (subject.owner_id !== ctx.session.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });
      return await ctx.prisma.subject.update({
        where: {
          id: subject.id,
        },
        data: {
          photoUrl: input.photoUrl,
        },
      });
    }),
});
