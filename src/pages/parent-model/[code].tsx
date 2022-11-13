import React from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { Layout } from "../../components/Layout";
import useParentModel from "../../hooks/useParentModel";
import { trpc } from "../../utils/trpc";
import Photo from "../../components/Photo";
import Breadcrumbs from "../../components/Breadcrumbs";
import GeneratePhotos from "../../components/GeneratePhotos";
import { toast } from "react-hot-toast";

const ParentModelByCode: NextPage = () => {
  const router = useRouter();
  const code = router.query.code as string;
  const { data: model } = useParentModel(code, {
    enabled: !!code,
  });
  const { data: generatedPhotos, refetch } = trpc.generatedPhotos.list.useQuery(
    {
      parentModel: code,
      category: "generated-image",
    },
    {
      enabled: !!code,
    }
  );
  const generetePhotoMutation = trpc.generatedPhotos.generate.useMutation({
    onSuccess: () => {
      toast.success("Added your new generation to queue");
      refetch();
    },
    onError: (err) => {
      toast.error("Failed to generate photo");
    },
  });

  if (!model) return <Layout>Loading...</Layout>;
  return (
    <Layout>
      <Breadcrumbs
        parents={[
          { href: "/", label: "Home" },
          {
            href: "/parent-model/",
            label: "Parent Model",
          },
        ]}
        label={model.repo_id.split("/")[1] || ""}
      />
      <GeneratePhotos
        onNewPrompt={(prompt) => {
          generetePhotoMutation.mutate({
            prompt,
            category: "generated-image",
            parentModelCode: code,
          });
        }}
      />
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {generatedPhotos?.map((photo) => (
          <li key={photo.id}>
            <Photo photo={photo} />
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default ParentModelByCode;
