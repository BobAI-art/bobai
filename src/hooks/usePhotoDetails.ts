import { trpc } from "../utils/trpc";
import { type Photo } from "@prisma/client";
const usePhotoDetails = (photo: Photo, enabled = true) => {
  return trpc.photos.details.useQuery(
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
