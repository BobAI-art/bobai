import { trpc } from "../utils/trpc";

const useMyDepictionsBySubject = () => trpc.depiction.ownedByMe.useQuery({});

export default useMyDepictionsBySubject;
