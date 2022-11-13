import { trpc } from "../utils/trpc";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Result } from "postcss";

type Input<T> = T extends (input: infer I) => any ? I : never;

const useParentModel = <T extends Input<typeof trpc.parentModel.get.useQuery>>(
  input: T
) => {
  const result = trpc.parentModel.get.useQuery(input);
  console.log(result);
  useEffect(() => {
    if (result.error) {
      toast.error(result.error.message);
    }
  }, [result.isError]);
  return result;
};

export default useParentModel;
