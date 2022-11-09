// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { subjectRouter } from "./subject";
import { subjectPhotoRouter } from "./subjectPhoto";
import { modelRouter } from "./model";
import { promptRouter } from "./prompt";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  model: modelRouter,
  subject: subjectRouter,
  subjectPhoto: subjectPhotoRouter,
  prompt: promptRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
