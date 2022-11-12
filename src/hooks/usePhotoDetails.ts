import { trpc } from "../utils/trpc";
import { GeneratedPhoto } from "@prisma/client";
const usePhotoDetails = (photo: GeneratedPhoto) => {
  return trpc.generatedPhotos.details.useQuery(
    {
      id: photo.id,
    },
    {
      enabled: photo.id !== undefined,
      cacheTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    }
  ).data;
};

export default usePhotoDetails;
