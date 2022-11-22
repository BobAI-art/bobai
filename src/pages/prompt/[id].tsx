import React from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { Layout } from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import H2 from "../../components/H2";
import PhotosGrid from "../../components/PhotosGrid";
import usePageScrollPhotos from "../../hooks/usePageScrollPhotos";

const ParentModelByCode: NextPage = () => {
  const router = useRouter();
  const promptId = router.query.id as string;
  const { data: prompt, isError } = trpc.prompt.get.useQuery(promptId, {
    enabled: !!promptId,
  });
  const { data: photos } = usePageScrollPhotos(
    { promptId: promptId },
    {
      enabled: !!promptId,
    }
  );
  if (!prompt) return <Layout>Loading... {JSON.stringify(prompt)}</Layout>;
  return (
    <Layout>
      <H2>{prompt.content}</H2>
      <PhotosGrid photos={photos}></PhotosGrid>
    </Layout>
  );
};

export default ParentModelByCode;
