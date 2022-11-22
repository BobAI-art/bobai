import { trpc } from "../utils/trpc";
import { toast } from "react-hot-toast";

const useVote = ({
  onSuccessfulVote,
  onFailedVote,
}: {
  onSuccessfulVote?: (id: string) => void | null;
  onFailedVote?: () => void | undefined;
} = {}) => {
  const voting = trpc.photos.vote.useMutation({
    onSuccess: (data) => {
      if (data) {
        onSuccessfulVote?.(data.id);
      }
    },
    onError: (error) => {
      toast.error(error.message);
      onFailedVote?.();
    },
  });

  return voting;
};

export default useVote;
