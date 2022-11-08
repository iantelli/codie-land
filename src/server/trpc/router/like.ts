import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const likeRouter = router({
  likePost: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.post.update({
          where: {
            id: input.postId,
          },
          data: {
            totalLikes: {
              increment: 1,
            },
          },
        });
        await ctx.prisma.user.update({
          where: {
            id: input.userId,
          },
          data: {
            totalLikes: {
              increment: 1,
            },
          },
        });
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
  unlikePost: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.post.update({
          where: {
            id: input.postId,
          },
          data: {
            totalLikes: {
              decrement: 1,
            },
          },
        });
        await ctx.prisma.user.update({
          where: {
            id: input.userId,
          },
          data: {
            totalLikes: {
              decrement: 1,
            },
          },
        });
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
