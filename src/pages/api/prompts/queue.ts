import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../server/db/client";
import {
  FetchRegularization,
  GenerateRegularization,
} from "../../../interfaces";

const getPromptClass = (
  regularization: GenerateRegularization | FetchRegularization
) => {
  return regularization.prompt;
};
const getOldestPrompts = async (limit = 10) => {
  const latestPrompt = await prisma.prompt.findFirst({
    where: {
      status: "CREATED",
    },
    select: {
      model_id: true,
    },
    orderBy: { created: "desc" },
  });
  if (!latestPrompt) return null;
  const prompts = await prisma.prompt.findMany({
    where: {
      model_id: latestPrompt.model_id,
      status: "CREATED",
    },
    include: {
      model: true,
    },
    orderBy: { created: "desc" },
    take: limit,
  });

  return prompts.map((prompt) => ({
    id: prompt.id,
    model_id: prompt.model_id,
    class: getPromptClass(
      prompt.model.regularization as unknown as
        | GenerateRegularization
        | FetchRegularization
    ),
    prompt: prompt.prompt,
    subject: prompt.model.subject_slug,
  }));
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      getOldestPrompts()
        .then((prompts) => {
          res.status(200).json(prompts);
        })
        .catch(() => {
          res.status(500).json({ error: "Could not get model" });
        });
      break;
    case "GET":
      getOldestPrompts()
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
