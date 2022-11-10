import { trpc } from "../../utils/trpc";

const useActiveVastInstances = trpc.vast.activeInstances.useQuery;

export default useActiveVastInstances;
