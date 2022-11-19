import { cuidSchema, dbStringSchema } from "../../../utils/schema";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const promptRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.prompt.findMany({
        take: input.limit,
        orderBy: {
          content: "asc",
        },
      });
    }),
  get: publicProcedure.input(cuidSchema).query(async ({ ctx, input }) => {
    return await ctx.prisma.prompt.findFirst({
      where: {
        id: input,
      },
    });
  }),
  generate: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    //
    const movieCharacters = [
      "Aragorn",
      "Bilbo Baggins",
      "Vito Corleone",
      "Neo",
      "Frodo Baggins",
      "Gandalf",
      "Han Solo",
      "Indiana Jones",
      "Jack Sparrow",
      "James Bond",
      "John McClane",
      "Luke Skywalker",
      "Neo",
      "Obi-Wan Kenobi",
      "Peter Parker",
      "Rick Deckard",
      "Rocky Balboa",
      "Samwise Gamgee",
      "Sherlock Holmes",
      "The Terminator",
      "Tony Stark",
      "Walter White",
      "Wolverine",
      "Yoda",
    ];
  }),
});
