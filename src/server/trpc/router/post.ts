import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { useSession } from "next-auth/react";

export const postRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const result = await ctx.prisma.post.findMany({
        include: {
          User: true,
        },
      });
      console.log(result);
      return result;
    } catch (error) {
      console.log("error", error);
    }
  }),

  postMessage: protectedProcedure
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
            User: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
