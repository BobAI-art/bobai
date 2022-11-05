import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../server/db/client";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const models = await prisma.model.findMany({ where: { state: "ready" }, orderBy: { created: "desc" }, include: {
    TrainingPhoto: true,
    } });
  res.status(200).json(models.map((model) => ({
    ...model, parentModel: {
      repoId: "runwayml/stable-diffusion-v1-5",
      filename: "v1-5-pruned-emaonly.ckpt"
    },
    TrainingPhoto: model.TrainingPhoto.map((photo) => ({
      ...photo,
      'url': `https://${photo.bucket}.s3.eu-west-2.amazonaws.com/${photo.path}`
    })),
    regularization: {
      type: "generate",
      prompt: "australian_shepherd",
      count: 200
    }
  })));
}
