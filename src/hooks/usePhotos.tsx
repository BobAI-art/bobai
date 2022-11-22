import { trpc } from "../utils/trpc";
import { type AppRouterTypes } from "../utils/trpc";

type Input = { page: number } & AppRouterTypes["photos"]["list"]["input"];
type Opts = {
  enabled?: boolean;
};

function usePhotos({ page, ...input }: Input, opts: Opts = {}) {
  const perPage = 2 * 4 * 6 * 2;

  return trpc.photos.list.useInfiniteQuery(
    {
      ...input,
      take: perPage,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      ...opts,
    }
  );
}

export default usePhotos;
