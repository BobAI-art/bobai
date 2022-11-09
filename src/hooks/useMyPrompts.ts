import { trpc } from "../utils/trpc";

const useMyPrompts = () => trpc.prompt.list.useQuery({});

export default useMyPrompts;
