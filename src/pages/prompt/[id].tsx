import React from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { Layout } from "../../components/Layout";
import useStyle from "../../hooks/useStyle";
import { trpc } from "../../utils/trpc";
import H2 from "../../components/H2";
import PhotosGrid from "../../components/PhotosGrid";
import Navigation from "../../components/Navigation";
import useNavigation from "../../hooks/useNavigation";
import usePhotos from "../../hooks/usePhotos";

const ParentModelByCode: NextPage = () => {
  const navigation = useNavigation();

  const router = useRouter();
  const promptId = router.query.id as string;
  const { data: prompt, isError } = trpc.prompt.get.useQuery(promptId, {
    enabled: !!promptId,
  });
  const { data: photos } = usePhotos(
    { ...navigation, promptId: promptId },
    {
      enabled: !!promptId,
    }
  );
  console.log(!!promptId);
  if (!prompt) return <Layout>Loading... {JSON.stringify(prompt)}</Layout>;
  return (
    <Layout>
      <H2>{prompt.content}</H2>
      <PhotosGrid photos={photos}>
        <Navigation {...navigation} />
      </PhotosGrid>
    </Layout>
  );
};

export default ParentModelByCode;
