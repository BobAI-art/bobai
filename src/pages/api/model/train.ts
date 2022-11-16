import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../server/db/client";
import { photoUrl } from "../../../utils/helpers";
import { type GetDeciptionResponse } from "../../../interfaces";

const getOldes = async (): Promise<GetDeciptionResponse | null> => {
  const deciption = await prisma.depiction.findFirst({
    where: {
      state: "CREATED",
    },
    include: {
      style: true,
      subject: {
        include: {
          subject_photos: true,
        },
      },
    },
    orderBy: { created: "desc" },
  });
  if (!deciption) return null;

  return {
    id: deciption.id,
    name: deciption.name,
    owner_id: deciption.owner_id,
    style_slug: deciption.style_slug,
    regularization:
      deciption.regularization as unknown as GetDeciptionResponse["regularization"],
    subject: {
      slug: deciption.subject.slug,
      subject_photos: deciption.subject.subject_photos.map((photo) =>
        photoUrl(photo)
      ),
    },
    style: {
      repo_id: deciption.style.repo_id,
      filename: deciption.style.file_name,
    },
  };
};

const getModel = async (): Promise<GetDeciptionResponse | null> => {
  const model = await getOldes();
  if (model === null) return null;

  const updateCount = await prisma.depiction.updateMany({
    where: {
      id: model.id,
      state: "CREATED",
    },
    data: {
      state: "TRAINING",
    },
  });
  // returned by somebody else
  if (updateCount.count === 0) return await getModel();
  return model;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      getModel()
        .then((model) => {
          res.status(200).json(model);
        })
        .catch(() => {
          res.status(500).json({ error: "Could not get model" });
        });
      break;
    case "GET":
      getOldes()
        .then((model) => {
          res.status(200).json(model);
        })
        .catch(() => {
          res.status(500).json({ error: "Could not get model" });
        });
      break;
    default:
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
