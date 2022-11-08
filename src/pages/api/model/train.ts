import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../server/db/client";
import { ModelName, parentModels } from "../../../utils/consts";
import { photoUrl } from "../../../utils/helpers";

const getOldestCreatedModel = async (): Promise<GetModelResponse | null> => {
  const model = await prisma.model.findFirst({
    where: {
      state: "CREATED"
    },
    include: {
      subject: {
        include: {
          subject_photos: true
        }
      }
    },
    orderBy: { created: "desc" }
  })
  if(!model) return null;
  const parentModel = parentModels.get(model.parent_model_code as ModelName)
  if(!parentModel) return null;

  return {
    id: model.id,
    name: model.name,
    owner_id: model.owner_id,
    parent_model_code: model.parent_model_code,
    regularization: model.regularization as unknown as GenerateRegularization | FetchRegularization,
    subject: {
      slug: model.subject.slug,
      subject_photos: model.subject.subject_photos.map((photo) => photoUrl(photo))
    },
    parent_model: {
      repo_id: parentModel.repoId,
      filename: parentModel.filename
    }
  }
}

interface GenerateRegularization {
  type: "generate"
  prompt: string
  count: number
}

interface FetchRegularization {
  type: "fetch"
  source: string
}

interface GetModelResponse {
  id: string;
  name: string;
  owner_id: string;
  parent_model_code: string;
  regularization: GenerateRegularization | FetchRegularization,
  subject: {
    slug: string
    subject_photos: string[]
  }
  parent_model: {
    repo_id: string
    filename: string
  }
}


const getModel = async (): Promise<GetModelResponse  | null> => {
  const model = await getOldestCreatedModel();
  if(model === null) return null;

  const updateCount = await prisma.model.updateMany({
    where: {
      id: model.id,
      state: 'CREATED'
    },
    data: {
      state: 'TRAINING'
    }
  })
  // returned by somebody else
  if(updateCount.count === 0) return await getModel();
  return model

}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 switch (req.method) {
    case "POST":
      getModel().then((model) => {
        res.status(200).json(model);
      }).catch(() => {
        res.status(500).json({ error: "Could not get model" });
      })
      break;
    case "GET":
      getOldestCreatedModel().then((model) => {
        res.status(200).json(model);
      }).catch(() => {
        res.status(500).json({ error: "Could not get model" });
      });
      break;
   default:
     res.setHeader('Allow', ['POST', 'GET'])
     res.status(405).end(`Method ${req.method} Not Allowed`)
 }
}
