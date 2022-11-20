import { trpc } from "../utils/trpc";
import { type AppRouterTypes } from "../utils/trpc";
import { number } from "zod";

type Input = { page: number } & AppRouterTypes["photos"]["list"]["input"];
type Opts = {
  enabled?: boolean;
};

function usePhotos({ page, ...input }: Input, opts: Opts = {}) {
  const perPage = 2 * 4 * 6 * 2;

  return trpc.photos.list.useQuery(
    {
      ...input,
      skip: page * perPage,
      limit: perPage,
    },
    opts
  );
}

export default usePhotos;
