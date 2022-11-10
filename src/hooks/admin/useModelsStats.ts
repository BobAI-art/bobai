import { trpc } from "../../utils/trpc";

const useModelsStats = () => trpc.model.stats.useQuery();

export default useModelsStats;
