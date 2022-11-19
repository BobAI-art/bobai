import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

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
      style_slug: "anime",
    },
  });
  const prompts = await prisma.prompt.findMany({});
  // const created = await prisma.photo.createMany({
  //   data: depictions.flatMap((depiction) =>
  //     prompts.map((prompt) => ({
  //       root: `user/${depiction.owner_id}/depiction/${depiction.id}/photo`,
  //       bucket: "bobai",
  //       prompt: prompt.content,
  //       owner_id: depiction.owner_id,
  //       is_public: false,
  //       status: "CREATED",
  //       style_slug: depiction.style_slug,
  //       depiction_id: depiction.id,
  //       prompt_id: prompt.id,
  //     }))
  //   ),
  // });

  res.status(200).json({ depictions });
}
