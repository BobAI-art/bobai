import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { env } from "../../../env/server.mjs";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
  checkPin: publicProcedure
    .input(z.object({ pin: z.string() }))
    .mutation(async ({ input }) => {
      const { pin } = input;
      if (pin == env.SITE_PIN || !env.SITE_PIN) {
        return true;
      }
      return false;
    }),
});
