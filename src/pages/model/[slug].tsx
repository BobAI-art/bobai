import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import { ModelPhotos } from "../../components/ModelPhotos";

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

  if (model.isLoading) {
    return <>Loading...</>;
  }
  if (!model.data) {
    return <>Model not found</>;
  }

  return (
    <Layout>
      <h2 className="text-2xl font-extrabold leading-normal tracking-tight">
        Model {model.data.slug}
      </h2>
      <ModelPhotos model={model.data} />
    </Layout>
  );
};

export default ModelBySlug;
