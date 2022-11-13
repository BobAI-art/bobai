import React from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { Layout } from "../../components/Layout";
import UserLink from "../../components/UserLink";
import { ModelInTrainingPreview } from "../../components/ModelInTrainingPreview";
import { Model } from "@prisma/client";
import useGeneratedPhotos from "../../hooks/useGeneratedPhotos";
import H2 from "../../components/H2";
import Image from "next/image";
import { photoUrl } from "../../utils/helpers";
import { mockSession } from "next-auth/client/__tests__/helpers/mocks";
import image = mockSession.user.image;
import { Photo } from "../../components/Photo";
import H3 from "../../components/H3";
import Link from "next/link";

const TrainedModel: React.FC<{ model: Model }> = ({ model }) => {
  const { data: traningPreview } = useGeneratedPhotos({
    modelId: model.id,
    category: "generated-image",
  });

  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
      {traningPreview?.map((photo) => (
        <Photo photo={photo} key={photo.id} />
      ))}
    </ul>
  );
};
const ModelById: NextPage = () => {
  const router = useRouter();

  const id = router.query.id as string;

  const { data: model } = trpc.model.get.useQuery(id);

  if (!model) {
    return <>Model not found</>;
  }

  return (
    <Layout>
      <H2>
        Model <span className="font-extrabold">{model.name}</span> trained by{" "}
        <span className="font-extrabold">
          <UserLink user={model.owner} />
        </span>
      </H2>
      <H3>
        Trained from{" "}
        <span className="font-bold">
          <Link
            href={{
              pathname: "/parent-model/[name]/",
              query: { name: model.parent_model_code },
            }}
          >
            {model.parent_model.code}
          </Link>
        </span>
      </H3>

      {model.state === "TRAINING" && <ModelInTrainingPreview model={model} />}
      {model.state === "TRAINED" && <TrainedModel model={model} />}
      {/*{model.generated_photos.map((photo) => (*/}
      {/*  <picture key={photo.id}>*/}
      {/*    <source srcSet={photoUrl(photo)} type="image/png" />*/}
      {/*    <img*/}
      {/*      className="w-48 rounded shadow"*/}
      {/*      alt={photo.prompt || "Generated photo"}*/}
      {/*    />*/}
      {/*  </picture>*/}
      {/*))}*/}
    </Layout>
  );
};

export default ModelById;
