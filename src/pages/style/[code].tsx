import React from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { Layout } from "../../components/Layout";
import useStyle from "../../hooks/useStyle";
import { trpc } from "../../utils/trpc";
import Breadcrumbs from "../../components/Breadcrumbs";
import GeneratePhotos from "../../components/GeneratePhotos";
import { toast } from "react-hot-toast";
import PhotosGrid from "../../components/PhotosGrid";
import usePageScrollPhotos from "../../hooks/usePageScrollPhotos";

const ParentModelByCode: NextPage = () => {
  const router = useRouter();
  const code = router.query.code as string;
  const { data: model } = useStyle(code, {
    enabled: !!code,
  });
  const { data: generatedPhotos, refetch } = usePageScrollPhotos(
    {
      styleSlug: code,
    },
    {
      enabled: !!code,
    }
  );

  if (!model) return <Layout>Loading...</Layout>;
  return (
    <Layout>
      <Breadcrumbs
        parents={[
          { href: "/", label: "Home" },
          {
            href: "/style/",
            label: "Style",
          },
        ]}
        label={model.slug}
      />
      <GeneratePhotos
        onNewPrompt={(prompt) => {
          toast.success("... TODO");
        }}
      />
      <PhotosGrid photos={generatedPhotos}></PhotosGrid>
    </Layout>
  );
};

export default ParentModelByCode;
