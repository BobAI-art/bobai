import { NextApiRequest, NextApiResponse } from "next";

1;

const releaseDepiction = async (id: string, errored: boolean) => {
  const updateCount = await prisma.depiction.updateMany({
    where: {
      id,
      state: "TRAINING",
    },
    data: {
      state: errored ? "ERROR" : "TRAINED",
    },
  });
  return { success: updateCount.count > 0 };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    body: { error },
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
    case "POST":
      releaseDepiction(id, error != undefined)
        .then((depiction) => {
          res.status(200).json(depiction);
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
