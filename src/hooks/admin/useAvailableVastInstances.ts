import { trpc } from "../../utils/trpc";

const useAvailableVastInstances = trpc.vast.availableInstances.useQuery;

export default useAvailableVastInstances;
