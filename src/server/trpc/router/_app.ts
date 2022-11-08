// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { subjectRouter } from "./subject";
import { subjectPhotoRouter } from "./subjectPhoto";
import { modelRouter } from "./model";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  model: modelRouter,
  subject: subjectRouter,
  trainingPhoto: subjectPhotoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
