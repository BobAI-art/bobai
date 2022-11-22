import { trpc } from "../utils/trpc";
import { toast } from "react-hot-toast";

const usePhoto = (photoId: string) =>
  trpc.photos.details.useQuery(
    { id: photoId },
    {
      enabled: photoId !== undefined,
      onError: (err) => {
        toast.error("Error loading photo");
      },
    }
  );

export default usePhoto;
