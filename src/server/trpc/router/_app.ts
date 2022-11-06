import { router } from "../trpc";
import { authRouter } from "./auth";
import { postRouter } from "./post";
import { likeRouter } from "./like";
import { commentRouter } from "./comment";

export const appRouter = router({
  post: postRouter,
  auth: authRouter,
  like: likeRouter,
  comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
