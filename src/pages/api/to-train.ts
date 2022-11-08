import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../server/db/client";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const subjects = await prisma.subject.findMany({  orderBy: { created: "desc" }, include: {
    subject_photos: true,
    } });
  res.status(200).json(subjects.map((subject) => ({
    ...subject, parentModel: {
      repoId: "runwayml/stable-diffusion-v1-5",
      filename: "v1-5-pruned-emaonly.ckpt"
    },
    TrainingPhoto: subject.subject_photos.map((photo) => ({
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
