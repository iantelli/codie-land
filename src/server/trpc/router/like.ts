import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

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
        await ctx.prisma.like.upsert({
          where: {
          },
          create: {
            postId: input.postId,
            userId: input.userId,
          },
          update: {
            postId: input.postId,
            userId: input.userId,
          },
        });
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
        const counter = await ctx.prisma.like.count({
          where: {
            postId: input.postId,
            userId: input.userId,
          },
        });
        await ctx.prisma.like.deleteMany({
          where: {
            postId: input.postId,
            userId: input.userId,
          },
        });
        await ctx.prisma.post.update({
          where: {
            id: input.postId,
          },
          data: {
            totalLikes: {
              decrement: counter,
            },
          },
        });
        await ctx.prisma.user.update({
          where: {
            id: input.userId,
          },
          data: {
            totalLikes: {
              decrement: counter,
            },
          },
        });

      } catch (error) {
        console.log(error);
      }
    }),
});
