import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { photoUrl } from "../../utils/helpers";

const HOW_MANY_PHOTOS = 5000;

const updateAutocomplete = async (
  scores: { content: string; score: number; photoUrl: string }[]
) => {
  await prisma.autocompletePrompt.deleteMany({
    where: {
      score: {
        gte: 0, // delete all is not supported, so we delete all with score >= 0
      },
    },
  });
  while (scores.length) {
    const toInsert = scores.splice(0, 50);
    try {
      await prisma.autocompletePrompt.createMany({
        data: toInsert,
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  return scores;
};

const weightedRandom = (scores: { url: string; score: number }[]) => {
  const total = scores.reduce((acc, row) => acc + row.score, 0);
  const rand = Math.random() * total;
  let current = 0;
  for (const score of scores) {
    current += score.score;
    if (current >= rand) return score.url;
  }
  return scores[0]?.url || "";
};

const getScores = async () => {
  const photosWithPrompts = await prisma.photo.findMany({
    include: {
      Prompt: {
        select: {
          content: true,
        },
      },
    },
    orderBy: {
      average_score: "desc",
    },
    where: {
      is_public: true,
    },
    take: HOW_MANY_PHOTOS,
  });
  const photos = photosWithPrompts.map((prompt) => ({
    url: photoUrl(prompt),
    score: prompt.average_score,
    content: prompt.Prompt.content
      .trim()
      .split(",")
      .map((s) => s.trim().toLowerCase()),
  }));

  const flatScores = photos
    .flatMap((photo) =>
      photo.content.map((content) => ({
        score: photo.score,
        content,
        url: photo.url,
      }))
    )
    .map((row) => ({ ...row, score: row.score || 0 }))
    .filter(({ content }) => content.length < 190);

  const scores = flatScores
    .reduce((acc, prompt) => {
      if (!prompt.score) return acc;
      const current = acc.get(prompt.content);
      if (current) {
        current.push({ score: prompt.score, url: prompt.url });
      } else {
        acc.set(prompt.content, [{ score: prompt.score, url: prompt.url }]);
      }
      return acc;
    }, new Map<string, { url: string; score: number }[]>())
    .entries();

  return Array.from(scores)
    .map(([content, scores]) => ({
      content,
      scores: scores.map((row) => ({
        score: row.score * row.score,
        url: row.url,
      })),
    }))
    .map(({ content, scores }) => ({
      content,
      score: scores.reduce((acc, row) => acc + row.score, 0) / scores.length,
      photoUrl: weightedRandom(scores),
    }));
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      getScores().then((scores) => {
        updateAutocomplete(scores)
          .then(() => {
            res.status(200).json(scores);
          })
          .catch((e) => {
            console.error(e);
            res.status(500).json({ error: "Could not update autocomplete" });
          });
      });

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
