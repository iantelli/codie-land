import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const commentRouter = router({
  createComment: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        userId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.post.update({
          where: {
            id: input.postId,
          },
          data: {
            totalComments: {
              increment: 1,
            },
          },
        });
        await ctx.prisma.user.update({
          where: {
            id: input.userId,
          },
          data: {
            totalComments: {
              increment: 1,
            },
          },
        });
        await ctx.prisma.comment.create({
          data: {
            postId: input.postId,
            userId: input.userId,
            content: input.content,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getAllFromPost: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const result = await ctx.prisma.comment.findMany({
          where: {
            postId: input.id,
          },
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        return result;
      } catch (error) {
        console.log(error);
      }
    }),
  findCommentsByUserId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const result = await ctx.prisma.comment.findMany({
          where: {
            userId: input.id,
          },
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        return result;
      } catch (error) {
        console.log(error);
      }
    }),
});
