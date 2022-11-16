import { trpc } from "../../utils/trpc";

const usePhotosStats = () => trpc.photos.stats.useQuery();

export default usePhotosStats;
