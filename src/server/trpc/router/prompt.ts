import { cuidSchema, dbStringSchema } from "../../../utils/schema";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import cuid from "cuid";
import { env } from "../../../env/server.mjs";

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
        sentence: dbStringSchema.optional(),
        limit: z.number().optional().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.prompt.findMany({
        take: input.limit,
        orderBy: {
          content: "asc",
        },
        where: {
          ...(input.sentence && {
            content: {
              contains: input.sentence,
            },
          }),
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
      const prompts = category.prompts;
      const seed = Math.floor(Math.random() * 4294967295);
      const photoOpts = [
        { ddim: 50, width: 512, height: 512, guide: 5, seed: seed },
        { ddim: 50, width: 512, height: 512, guide: 7.5, seed: seed },
        { ddim: 50, width: 512, height: 512, guide: 10, seed: seed },
        { ddim: 50, width: 512, height: 512, guide: 12.5, seed: seed },
        { ddim: 50, width: 768, height: 512, guide: 7.5, seed: seed },
        { ddim: 50, width: 512, height: 768, guide: 7.5, seed: seed },
      ];
      const depictions = await ctx.prisma.depiction.findMany({});
      const data = prompts
        .flatMap((prompt) =>
          photoOpts.map((photoOpt) => ({
            prompt,
            photoOpt,
          }))
        )
        .flatMap((data) =>
          depictions.map((depiction) => ({ ...data, depiction }))
        )
        .map((data) => ({ ...data, id: cuid() }))
        .map(({ depiction, prompt, photoOpt }) => ({
          root: `user/${depiction.owner_id}/depiction/${depiction.id}/photo`,
          bucket: env.AWS_S3_BUCKET,
          prompt: prompt.content,
          ddim: photoOpt.ddim,
          width: photoOpt.width,
          height: photoOpt.height,
          guidance: photoOpt.guide,
          seed: photoOpt.seed,
          owner_id: ctx.session.user.id,
          style_slug: depiction.style_slug,
          depiction_id: depiction.id,
          prompt_id: prompt.id,
        }));
      // await ctx.prisma.photo.createMany({
      //   data: data,
      // });
      console.log(data[0]);
    }),
});
