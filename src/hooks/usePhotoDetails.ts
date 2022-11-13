import { trpc } from "../utils/trpc";
import { GeneratedPhoto } from "@prisma/client";
const usePhotoDetails = (photo: GeneratedPhoto, enabled = true) => {
  return trpc.generatedPhotos.details.useQuery(
    {
      id: photo.id,
    },
    {
      enabled: photo.id !== undefined && enabled,
      // cacheTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    }
  ).data;
};

export default usePhotoDetails;
