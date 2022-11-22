import { trpc } from "../utils/trpc";
import { type AppRouterTypes } from "../utils/trpc";

type Input = AppRouterTypes["photos"]["list"]["input"];
type Opts = {
  enabled?: boolean;
};

function usePhotos({ ...input }: Input = {}, opts: Opts = {}) {
  const perPage = 2 * 4 * 6 * 2;

  const results = trpc.photos.list.useInfiniteQuery(
    {
      ...input,
      take: perPage,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      ...opts,
    }
  );
  return {
    ...results,
    data: results.data?.pages.flatMap((page) => page.photos),
  };
}

export default usePhotos;
