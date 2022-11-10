import { trpc } from "../../utils/trpc";

const usePromptsStats = () => trpc.prompt.stats.useQuery();

export default usePromptsStats;
