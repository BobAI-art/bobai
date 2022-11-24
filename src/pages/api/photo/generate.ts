import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";
import cuid from "cuid";
import { env } from "../../../env/server.mjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const promts =  prisma.prompt.findMany();
  // const depictions = [
  //   "clali1c6x0000p0b2loiag0fr",
  //   "clali2i3b0002p0b2eykf8xc4",
  //   "clalm33jp0004p00zgjle5916",
  // ];
  const depictions = await prisma.depiction.findMany({
    where: {
      subject_slug: "bob",
    },
  });
  const prompts = await prisma.prompt.findMany({
    where: {
      categories: {
        some: {
          name: "painter",
        },
      },
    },
  });
  const seed = Math.floor(Math.random() * 4294967295);
  const photoOpts = [
    // { ddim: 50, width: 512, height: 512, guide: 2.5, seed: seed },
    // { ddim: 50, width: 512, height: 512, guide: 5, seed: seed },
    { ddim: 50, width: 512, height: 512, guide: 7.5, seed: seed },
    // { ddim: 50, width: 512, height: 512, guide: 10, seed: seed },
    // { ddim: 50, width: 512, height: 512, guide: 12.5, seed: seed },

    // { ddim: 50, width: 512, height: 768, guide: 2.5, seed: seed },
    // { ddim: 50, width: 512, height: 768, guide: 5, seed: seed },
    { ddim: 50, width: 512, height: 768, guide: 7.5, seed: seed },
    // { ddim: 50, width: 512, height: 768, guide: 10, seed: seed },
    // { ddim: 50, width: 512, height: 768, guide: 12.5, seed: seed },
  ];
  const data = prompts
    .flatMap((prompt) =>
      photoOpts.map((photoOpt) => ({
        prompt,
        photoOpt,
      }))
    )
    .flatMap((data) => depictions.map((depiction) => ({ ...data, depiction })))
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
      owner_id: depiction.owner_id,
      style_slug: depiction.style_slug,
      depiction_id: depiction.id,
      prompt_id: prompt.id,
    }));
  await prisma.photo.createMany({
    data: data,
  });

  res.status(200).json({ l: data.length });
}
