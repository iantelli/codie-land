import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const likeRouter = router({
  likePost: publicProcedure
    .input(
      z.object({
        postId: z.number(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.like.create({
          data: {
            postId: input.postId,
            userId: input.userId,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  unlikePost: publicProcedure
    .input(
      z.object({
        postId: z.number(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.like.deleteMany({
          where: {
            postId: input.postId,
            userId: input.userId,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
