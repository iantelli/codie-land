import { router } from "../trpc";
import { authRouter } from "./auth";
import { postRouter } from "./post";
import { likeRouter } from "./like";

export const appRouter = router({
  post: postRouter,
  auth: authRouter,
  like: likeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
