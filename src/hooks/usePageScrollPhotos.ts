import usePhotos from "./usePhotos";
import { useEndOfPage } from "./useEndOfPage";
import { FirstArgument, SecondArgument } from "../utils/types";

const usePageScrollPhotos = (
  input: FirstArgument<typeof usePhotos> = undefined,
  options: SecondArgument<typeof usePhotos> = undefined
) => {
  const { fetchNextPage, isLoading, ...result } = usePhotos(input, options);
  useEndOfPage(fetchNextPage, isLoading);
  return { ...result, isLoading };
};

export default usePageScrollPhotos;
