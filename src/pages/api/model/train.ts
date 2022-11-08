import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../server/db/client";
import { ModelClass, modelClasses, ModelName, parentModels } from "../../../utils/consts";

const getOldestCreatedModel = async () => {
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
  console.log(modelClasses.get(model.parent_model_code as ModelClass),modelClasses,  model.parent_model_code)
  return {
    ...model, parent_model: parentModels.get(model.parent_model_code as ModelName),
  };
}

const getModel = async ():Promise< Awaited<ReturnType<typeof  getOldestCreatedModel>>  | null> => {
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
  return model;
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
