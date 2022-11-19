// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { subjectRouter } from "./subject";
import { subjectPhotoRouter } from "./subjectPhoto";
import { depictionRouter } from "./depiction";
import { vastRouter } from "./vast";
import { photosRouter } from "./photos";
import { styleRouter } from "./style";
import { promptRouter } from "./prompt";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  depiction: depictionRouter,
  subject: subjectRouter,
  subjectPhoto: subjectPhotoRouter,
  vast: vastRouter,
  photos: photosRouter,
  style: styleRouter,
  prompt: promptRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
