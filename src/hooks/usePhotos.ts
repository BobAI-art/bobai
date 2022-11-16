import { trpc } from "../utils/trpc";

const usePhotos = trpc.photos.list.useQuery;

export default usePhotos;
