import React from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { Layout } from "../../components/Layout";
import UserLink from "../../components/UserLink";
import { ModelInTraining } from "../../components/ModelInTraining";
import { Model } from "@prisma/client";
import useGeneratedPhotos from "../../hooks/useGeneratedPhotos";
import H2 from "../../components/H2";
import Photo from "../../components/Photo";
import H3 from "../../components/H3";
import Link from "next/link";
import { useSession } from "next-auth/react";
import FormRow from "../../components/FormRow";
import Button from "../../components/Button";
import { toast } from "react-hot-toast";

const AddPhoto: React.FC<{
  model: Model;
}> = ({model}) => {
  const generateMutation = trpc.generatedPhotos.generate.useMutation({
    onSuccess: () => {
      toast.success("Walking to studio to paint as requested, pleas give me a sec. Wof wof!");
    },
    onError: (err) => {
      toast.error("Oh, I'm sorry, I can't paint that. Wof wof!");
    }
  });

  return <form onSubmit={e => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    generateMutation.mutate({
      prompt: formData.get("prompt") as string,
      howMany: parseInt(formData.get("count") as string),
      style: model.parent_model_code,
      modelId: model.id,
    })
  }
  }>
    <H2>Hey Bob! please paint a really nice portrait of  <span className="font-extrabold">{model.name}</span></H2>
    <FormRow name="prompt" component="input" label="Here are my instructions: " placeholder="looking to the right, riding on the duck" />
    <FormRow name="count" component="number" label="I need this many portraits: " defaultValue={4} min={1} max={24} />
    <Button  disabled={generateMutation.isLoading}>Go to work!</Button>
  </form>
}

const TrainedDeciption: React.FC<{ model: Model }> = ({ model }) => {
  const session = useSession();
  const { data: traningPreview } = useGeneratedPhotos({
    modelId: model.id,
    category: "generated-image",
  });
  const canAdd = session?.data?.user?.id === model.owner_id

  return (
    <>
      {canAdd && <AddPhoto model={model} />}
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
      {traningPreview?.map((photo) => (
        <Photo photo={photo} key={photo.id} />
      ))}
    </ul>
    </>
  );
};
const ModelById: NextPage = () => {
  const router = useRouter();

  const id = router.query.id as string;

  const { data: model } = trpc.model.get.useQuery(id);

  if (!model) {
    return <>Depiction not found</>;
  }

  return (
    <Layout>
      <H2>
        Depiction of <span className="font-extrabold">{model.name}</span> asked to paint by{" "}
        <span className="font-extrabold">
          <UserLink user={model.owner} />
        </span>
      </H2>
      <H3>
        Style{" "}
        <span className="font-bold">
          <Link
            href={{
              pathname: "/style/[name]/",
              query: { name: model.parent_model_code },
            }}
          >
            {model.parent_model.code}
          </Link>
        </span>
      </H3>

      {model.state === "TRAINING" && <ModelInTraining model={model} />}
      {model.state === "TRAINED" && <TrainedDeciption model={model} />}
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
