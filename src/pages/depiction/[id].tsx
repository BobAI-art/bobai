import React from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { Layout } from "../../components/Layout";
import { DepictionInTraining } from "../../components/DepictionInTraining";
import PhotosGrid from "../../components/PhotosGrid";
import usePageScrollPhotos from "../../hooks/usePageScrollPhotos";
import { TrainedDeciption } from "../../components/TrainedDeciption";

const ModelById: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: depiction } = trpc.depiction.get.useQuery(id);
  const showPhotos = !!depiction && depiction.state === "TRAINED";
  const { data: photos } = usePageScrollPhotos(
    {
      depictionId: depiction?.id,
    },
    {
      enabled: showPhotos,
    }
  );

  if (!depiction) {
    return <>Depiction not found</>;
  }

  return (
    <Layout>
      {depiction.state === "TRAINING" && (
        <DepictionInTraining depiction={depiction} />
      )}
      {depiction.state === "TRAINED" && (
        <TrainedDeciption depiction={depiction} />
      )}
      {showPhotos && <PhotosGrid photos={photos}></PhotosGrid>}
    </Layout>
  );
};

export default ModelById;
