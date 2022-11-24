import React from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { Layout } from "../../components/Layout";
import UserLink from "../../components/UserLink";
import { DepictionInTraining } from "../../components/DepictionInTraining";
import H2 from "../../components/H2";
import H3 from "../../components/H3";
import Link from "next/link";
import { useSession } from "next-auth/react";
import FormRow from "../../components/FormRow";
import Button from "../../components/Button";
import { toast } from "react-hot-toast";
import { type Depiction } from "@prisma/client";
import PhotosGrid from "../../components/PhotosGrid";
import usePhotos from "../../hooks/usePhotos";
import usePageScrollPhotos from "../../hooks/usePageScrollPhotos";

const AddPhoto: React.FC<{
  depiction: Depiction;
  onSuccess: () => void;
}> = ({ depiction, onSuccess }) => {
  const formRef = React.useRef<HTMLFormElement>(null);
  // const generateMutation = trpc.photos.generate.useMutation({
  //   onSuccess: () => {
  //     toast.success(
  //       "Walking to studio to paint as requested, pleas give me a sec. Wof wof!"
  //     );
  //     onSuccess();
  //     formRef.current?.reset();
  //   },
  //   onError: (err) => {
  //     toast.error("Oh, I'm sorry, I can't paint that. Wof wof!");
  //   },
  // });

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        // generateMutation.mutate({
        //   prompt: formData.get("prompt") as string,
        //   howMany: parseInt(formData.get("count") as string),
        //   style: depiction.style_slug,
        //   depictionId: depiction.id,
        // });
      }}
    >
      <H2>
        Hey Bob! please paint a really nice portrait of{" "}
        <span className="font-extrabold">{depiction.name}</span>
      </H2>
      <FormRow
        name="prompt"
        component="input"
        label="Here are my instructions: "
        placeholder="looking to the right, riding on the duck"
      />
      <FormRow
        name="count"
        component="number"
        label="I need this many portraits: "
        defaultValue={4}
        min={1}
        max={24}
      />
      {/*<Button disabled={generateMutation.isLoading}>Go to work!</Button>*/}
    </form>
  );
};

const TrainedDeciption: React.FC<{ depiction: Depiction }> = ({
  depiction,
}) => {
  const session = useSession();
  const canAdd = session?.data?.user?.id === depiction.owner_id;

  return (
    <>{canAdd && <AddPhoto depiction={depiction} onSuccess={() => null} />}</>
  );
};
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
      <H2>
        Depiction of <span className="font-extrabold">{depiction.name}</span>{" "}
        asked to paint by{" "}
        <span className="font-extrabold">
          <UserLink user={depiction.owner} />
        </span>
      </H2>
      <H3>
        Style{" "}
        <span className="font-bold">
          <Link
            href={{
              pathname: "/style/[name]/",
              query: { name: depiction.style_slug },
            }}
          >
            {depiction.style_slug}
          </Link>
        </span>
      </H3>

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
