import { trpc } from "../utils/trpc";
import toast from "react-hot-toast";

const usePromptSubmit = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
} = {}) => {
  const createPrompt = trpc.prompt.create.useMutation({
    onSuccess: () => {
      toast.success("Prompt created");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Error creating prompt: ${error.message}`);
      onError?.();
    },
  });
  return {
    onSubmitPrompt: createPrompt.mutate,
    isLoading: createPrompt.isLoading,
  };
};

export default usePromptSubmit;
