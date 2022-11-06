import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const result = await ctx.prisma.post.findMany({
        include: {
          User: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return result;
    } catch (error) {
      console.log("error", error);
    }
  }),

  findPost: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const result = await ctx.prisma.post.findFirst({
          where: {
            id: input.id,
          },
          include: {
            User: true,
          },
        });
        return result;
      } catch (error) {
        console.log("error", error);
      }
    }),

  postCode: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        language: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.post.create({
          data: {
            code: input.code,
            language: input.language,
            userId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
