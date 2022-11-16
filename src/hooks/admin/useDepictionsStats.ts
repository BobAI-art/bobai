import { trpc } from "../../utils/trpc";

const useDepictionsStats = () => trpc.depiction.stats.useQuery();

export default useDepictionsStats;
