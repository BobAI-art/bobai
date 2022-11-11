import { trpc } from "../utils/trpc";

const useGeneratedPhotos = trpc.generatedPhotos.list.useQuery;

export default useGeneratedPhotos;
