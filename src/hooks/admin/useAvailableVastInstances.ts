import { trpc } from "../../utils/trpc";

const useAvailableVastInstances = () =>
  trpc.vast.availableInstances.useQuery(undefined, {
    staleTime: 1000,
  });

export default useAvailableVastInstances;
