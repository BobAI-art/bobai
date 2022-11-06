import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import { SubjectPhotos } from "../../components/SubjectPhotos";
import toast from "react-hot-toast";

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

  const subject = trpc.subject.get.useQuery(slug);
  const photos = trpc.trainingPhoto.list.useQuery(slug);

  if (subject.isLoading || photos.isLoading) {
    return <>Loading...</>;
  }
  if (!subject.data) {
    return <>Model not found</>;
  }
  if(photos.data == undefined) {
    return <>Photos not found</>;
  }

  return (
    <Layout>
      <h2 className="text-2xl font-extrabold leading-normal tracking-tight">
        Subject {subject.data.slug}
      </h2>

      <SubjectPhotos photos={photos.data} model={subject.data} howMany={allImages} onPhotosChanged={() => photos.refetch()}  />
      {/*{subject.data.state === 'ready' && <div>Model is waiting to be trained. <Button onClick={() => updateStatus("created")}>Cancel</Button> </div>}*/}
    </Layout>
  );
};

export default ModelBySlug;
