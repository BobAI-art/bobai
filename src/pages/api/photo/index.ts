import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../server/db/client";
import {
  FetchRegularization,
  GenerateRegularization,
  GetPhotosResponse,
} from "../../../interfaces";
import { env } from "../../../env/server.mjs";
import { Depiction, Prompt } from "@prisma/client";

const getPromptClass = (
  regularization: GenerateRegularization | FetchRegularization
) => {
  return regularization.prompt;
};

const getPhotoQueue = async (limit = 10) => {
  const oldestGroup = await prisma.photo.findFirst({
    where: {
      status: "CREATED",
    },
    include: {
      style: true,
      depiction: true,
    },
    orderBy: { created: "asc" },
  });
  if (!oldestGroup) return null;

  const photos = await prisma.photo.findMany({
    where: {
      depiction_id: oldestGroup.depiction_id,
      style_slug: oldestGroup.style_slug,
      status: "CREATED",
    },
    orderBy: { created: "asc" },
  });

  const foundPrompts = new Map<string, Prompt>();
  const promptsId = photos.map((photo) => photo.prompt_id);
  while (promptsId.length > 0) {
    const result = await prisma.prompt.findMany({
      where: {
        id: {
          in: promptsId,
        },
      },
    });

    promptsId.length = 0;
    result.map((prompt) => {
      foundPrompts.set(prompt.id, prompt);
      if (prompt.parent_id) {
        promptsId.push(prompt.parent_id);
      }
    });
  }

  const flatPrompts = (promptId: string): string[] => {
    const prompt = foundPrompts.get(promptId);
    if (!prompt) return [];
    if (prompt.parent_id) {
      return [...flatPrompts(prompt.parent_id), prompt.content];
    }
    return [prompt.content];
  };
  const prefix = oldestGroup.depiction
    ? [
        `portrait of ${oldestGroup.depiction?.subject_slug} ${
          (oldestGroup.depiction?.regularization as { prompt: string }).prompt
        }`,
      ]
    : [];

  const postfix = oldestGroup.style.prompt_suffix
    ? [oldestGroup.style.prompt_suffix]
    : [];
  return {
    source: getSource(oldestGroup),
    photos: photos.map((photo) => ({
      id: photo.id,
      prompts: [...prefix, ...flatPrompts(photo.prompt_id), ...postfix],
    })),
  };
};

const getSource = ({
  depiction,
  style,
}: {
  depiction: Depiction | null;
  style: {
    repo_id: string;
    file_name: string;
  };
}): GetPhotosResponse["source"] => {
  if (depiction) {
    return {
      source: "aws",
      path: `model-data/${depiction.owner_id}/${depiction.id}`,
    };
  }
  return {
    source: "huggingface",
    repo_id: style.repo_id,
    file_name: style.file_name,
  };
};

const processPhotoQueue = async (): Promise<GetPhotosResponse | null> => {
  const photos = await getPhotoQueue();
  if (photos === null) return null;

  const updateCount = await prisma.photo.updateMany({
    where: {
      id: {
        in: photos.photos.map((photo) => photo.id),
      },
      status: "CREATED",
    },
    data: {
      status: "GENERATING",
    },
  });
  // returned by somebody else
  if (updateCount.count === 0) return await processPhotoQueue();
  return photos;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      processPhotoQueue()
        .then((prompts) => {
          res.status(200).json(prompts);
        })
        .catch(() => {
          res.status(500).json({ error: "Could not get model" });
        });
      break;
    case "GET":
      getPhotoQueue()
        .then((images) => {
          res.status(200).json(images);
        })
        .catch(() => {
          res.status(500).json({ error: "Could not generate images queue" });
        });
      break;
    default:
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
