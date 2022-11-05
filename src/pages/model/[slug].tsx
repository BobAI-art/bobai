import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import { ModelPhotos } from "../../components/ModelPhotos";
import toast from "react-hot-toast";
import Button from "../../components/Button";

const imagesNeeded = {
  "full-body": 3,
  "upper-body": 5,
  face: 12,
};
export const allImages = Object.values(imagesNeeded).reduce((a, b) => a + b, 0);

const ModelBySlug: NextPage = () => {
  const router = useRouter();
  useSession({
    required: true,
  });
  const slug = router.query.slug as string;

  const model = trpc.model.get.useQuery(slug);
  const updateModelStatus = trpc.model.updateStatus.useMutation({
    onSuccess: () => {
      model.refetch();
    },
    onError: (err) => {
      toast.error("Failed to update model status");
    }
  });

  if (model.isLoading) {
    return <>Loading...</>;
  }
  if (!model.data) {
    return <>Model not found</>;
  }

  const updateStatus = (state:  "created" | "ready" | "training" | "trained") => {
    updateModelStatus.mutate({state, slug: model.data?.slug || ""});
  }

  return (
    <Layout>
      <h2 className="text-2xl font-extrabold leading-normal tracking-tight">
        Model {model.data.slug} <span className="border rounded-xl p-1 text-sm bg-red-200">{model.data.state}</span>
      </h2>

      {model.data.state === 'created' && <ModelPhotos model={model.data} howMany={allImages} onTrain={() => updateStatus("ready")} />}
      {model.data.state === 'ready' && <div>Model is waiting to be trained. <Button onClick={() => updateStatus("created")}>Cancel</Button> </div>}
    </Layout>
  );
};

export default ModelBySlug;
