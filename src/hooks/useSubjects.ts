import { trpc } from "../utils/trpc";

const useSubjects = (ownerId?: string) => {
  return trpc.subject.list.useQuery(
    {
      ownerId: ownerId || "not-valid",
    },
    {
      enabled: ownerId !== undefined,
    }
  );
};

export default useSubjects;
