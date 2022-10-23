// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { modelRouter } from "./model";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  model: modelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
