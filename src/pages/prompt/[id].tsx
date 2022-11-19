import React from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { Layout } from "../../components/Layout";
import useStyle from "../../hooks/useStyle";
import { trpc } from "../../utils/trpc";
import Photo from "../../components/Photo";
import Breadcrumbs from "../../components/Breadcrumbs";
import GeneratePhotos from "../../components/GeneratePhotos";
import { toast } from "react-hot-toast";
import { PhotosGrid } from "../../components/PhotosGrid";
import H2 from "../../components/H2";

const ParentModelByCode: NextPage = () => {
  const router = useRouter();
  const promptId = router.query.id as string;
  const { data: prompt, isError } = trpc.prompt.get.useQuery(promptId, {
    enabled: !!promptId,
  });
  console.log(!!promptId);
  if (!prompt) return <Layout>Loading... {JSON.stringify(prompt)}</Layout>;
  return (
    <Layout>
      <H2>{prompt.content}</H2>
      <PhotosGrid promptId={promptId} />
    </Layout>
  );
};

export default ParentModelByCode;
