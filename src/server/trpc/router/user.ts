import { z } from "zod";
import { userSchema } from "../../../utils/schema";
import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
    nameAllowed: protectedProcedure
      .input(z.string())
      .query(async ({ input, ctx }) => {
        const user = await ctx.prisma.user.findFirst({
            where: {
                name: input,
                NOT: {
                    id: ctx.session.user.id
                }
            },
            select: {
                name: true
            }
        })
        return {
          allowed: user?.name? false : true
        };
      }),
      setName: protectedProcedure.input(userSchema.name).mutation(async ({ input, ctx }) => {
        const user = await ctx.prisma.user.update({
            where: {
                id: ctx.session.user.id
            },
            data: {
                name: input
            }
        })
        return {
            user
        }
      })
  });