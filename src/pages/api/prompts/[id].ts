import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

// TODO: api key
const deletePrompt = async (id: string) => {
  return await prisma.prompt.delete({
    where: {
      id,
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
  } = req;
  if (!id) {
    res.status(400).json({ error: "Id is required" });
    return;
  }
  if (typeof id !== "string") {
    res.status(400).json({ error: "Id must be a string" });
    return;
  }

  switch (method) {
    case "DELETE":
      deletePrompt(id)
        .then(() => {
          res.status(204);
        })
        .catch(() => {
          res.status(500).json({ error: "Could not get model" });
        });
      break;
    default:
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
