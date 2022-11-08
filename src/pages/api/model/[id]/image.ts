import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../server/db/client";
import {
  s3GeneratedPhotoPath,
  s3GeneratedPhotoRoot,
} from "../../../../utils/helpers";
import { env } from "../../../../env/server.mjs";
import cuid from "cuid";
import { putS3Object } from "../../../../server/s3";

interface ImageUploadRequest {
  category: string;
  prompt?: string;
  image_content: string;
}

const uploadImage = async (modelId: string, request: ImageUploadRequest) => {
  const { category, prompt, image_content } = request;
  const model = await prisma.model.findUnique({
    where: {
      id: modelId,
    },
    select: {
      id: true,
      subject: {
        select: {
          id: true,
          owner_id: true,
        },
      },
    },
  });
  if (!model) {
    throw new Error("Model not found");
  }
  const imageId = cuid();
  const root = s3GeneratedPhotoRoot(
    model.subject.owner_id,
    model.subject.id,
    model.id
  );
  const s3Path = s3GeneratedPhotoPath(
    model.subject.owner_id,
    model.subject.id,
    model.id,
    imageId
  );

  const buffer = Buffer.from(image_content, "base64");
  await putS3Object(s3Path, "image/png", buffer);

  return await prisma.generatedPhoto.create({
    data: {
      id: imageId,
      root,
      category,
      prompt,
      model_id: model.id,
      bucket: env.AWS_S3_BUCKET,
    },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    body,
    method,
  } = req as NextApiRequest & { body: ImageUploadRequest };

  if (!id) {
    res.status(400).json({ error: "Id is required" });
    return;
  }
  if (typeof id !== "string") {
    res.status(400).json({ error: "Id must be a string" });
    return;
  }

  switch (method) {
    case "POST":
      uploadImage(id, body)
        .then((model) => {
          res.status(200).json(model);
        })
        .catch(() => {
          res.status(500).json({ error: "Could not get model" });
        });
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
