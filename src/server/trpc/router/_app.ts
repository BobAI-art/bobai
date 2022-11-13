// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { subjectRouter } from "./subject";
import { subjectPhotoRouter } from "./subjectPhoto";
import { modelRouter } from "./model";
import { vastRouter } from "./vast";
import { generatedPhotosRouter } from "./generatedPhotos";
import { parentModelRouter } from "./parentModel";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  model: modelRouter,
  subject: subjectRouter,
  subjectPhoto: subjectPhotoRouter,
  vast: vastRouter,
  generatedPhotos: generatedPhotosRouter,
  parentModel: parentModelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
