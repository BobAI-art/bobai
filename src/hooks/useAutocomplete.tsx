import { useDebounce } from "./tools";
import { trpc } from "../utils/trpc";

export const useAutocomplete = (search: string, excludeModel: boolean) => {
  const debouncedSearch = useDebounce(search, 500);

  const results = trpc.prompt.autocomplete.useQuery(
    {
      query: debouncedSearch,
      excludeModel,
    },
    {
      enabled: !!debouncedSearch && debouncedSearch.length > 0,
    }
  );
  if (!search) return [];
  return results.data || [];
};
