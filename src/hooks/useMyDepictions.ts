import { trpc } from "../utils/trpc";

const useMyDepictions = () => trpc.depiction.ownedByMe.useQuery({});

export default useMyDepictions;
