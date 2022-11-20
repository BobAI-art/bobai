import { cuidSchema, dbStringSchema } from "../../../utils/schema";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

const makePrompts = () => {
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

  const prompts = [
    "Portrait of <MODEL> as <CHARACTER>, key art, running, highly detailed, digital painting, artstation, concept art, cinematic lighting, sharp focus, illustration, by gaston bussiere alphonse mucha",
    "Portrait of <MODEL> as <CHARACTER>, digital art 4k detailed super realistic",
    "A portrait of  <MODEL> as <CHARACTER> in a futuristic city, soft colours, detailed, realistic, digital art, hd, by alayna lemmer, by tom bagshaw, by fintan magee",
    "A portrait of <MODEL> as <CHARACTER>, digital art, 4k, detailed, super realistic, by alayna lemmer, by tom bagshaw, by fintan magee",
    "A portrait of <MODEL> as <CHARACTER>, retro minimalist portrait by jean giraud, moebius starwatcher comic, 8k",
    "Masterpiece portrait of <MODEL> as <CHARACTER>, d&d, fantasy, highly detailed, digital painting, sharp focus, illustration, art by artgerm and edmiston and greg rutkowski and magali villeneuve",
  ];

  return prompts.flatMap((prompt) =>
    movieCharacters.map((character) => prompt.replace("<CHARACTER>", character))
  );
};

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
  generate: protectedProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.promptCategory.findUnique({
        where: {
          name: input.category,
        },
        include: {
          prompts: true,
        },
      });
      // return makePrompts();
    }),
  generateAndSave: protectedProcedure
    .input(z.object({ category: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.promptCategory.findUnique({
        where: {
          name: input.category,
        },
        include: {
          prompts: true,
        },
      });
      if (!category) {
        throw new Error("Category not found");
      }
      const prompts = category.prompts.map((p) => p.content);
      console.log(prompts);
    }),
});
