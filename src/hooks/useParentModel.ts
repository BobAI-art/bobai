import { trpc } from "../utils/trpc";

type Input<T> = T extends (input: infer I, options: infer O) => any ? I : never;

const useParentModel = trpc.parentModel.get.useQuery;

export default useParentModel;
