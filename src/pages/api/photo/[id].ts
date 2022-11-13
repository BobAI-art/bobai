import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";
import { s3GeneratedPhotoRootPath } from "../../../utils/helpers";
import { number } from "zod";
import { putS3Object } from "../../../server/s3";

// TODO: api key
interface ImageUploadRequest {
  photo_content: string;
}

const uploadImage = async (id: string, request: ImageUploadRequest) => {
  const { photo_content } = request;
  const photo = await prisma.generatedPhoto.findUnique({
    where: {
      id,
    },
  });
  if (!photo) {
    return null;
  }
  if (photo.status === "GENERATED") {
    throw new Error("Photo already uploaded");
  }
  const path = s3GeneratedPhotoRootPath(photo);
  const buffer = Buffer.from(photo_content, "base64");
  await putS3Object(path, "image/png", buffer);

  return await prisma.generatedPhoto.update({
    where: {
      id,
    },
    data: {
      status: "GENERATED",
    },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
    body,
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
        .then((result) => {
          if (result === null) {
            res.status(404).end();
          }
          res.status(204).end();
        })
        .catch((e) => {
          console.error(e);
          res.status(500).json({ error: "Could not update photo" });
        });
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
