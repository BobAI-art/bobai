// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { modelRouter } from "./model";
import { trainingPhotoRouter } from "./trainingPhoto";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  model: modelRouter,
  trainingPhoto: trainingPhotoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
