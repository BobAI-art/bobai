import { trpc } from "../utils/trpc";

const useUserByName = (name?: string) =>
  trpc.user.get.useQuery(name || "wrong-user-name", {
    enabled: name !== undefined,
  });

export default useUserByName;
