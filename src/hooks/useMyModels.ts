import { trpc } from "../utils/trpc";

const useMyModels = () => trpc.model.ownedByMe.useQuery({});

export default useMyModels;
