import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Layout } from "../../../../components/Layout";
import { trpc } from "../../../../utils/trpc";
import { photoUrl } from "../../../../utils/helpers";
import React from "react";


const ModelById: NextPage = () => {
  const router = useRouter();
  useSession({
    required: true,
  });
  const id = router.query.id as string;

  const modelQuery = trpc.model.get.useQuery(id);

  if(modelQuery.isLoading) {
    return <>Loading...</>;
  }
  const model = modelQuery.data;
  if(!model) {
    return <>Model not found</>;
  }

  return (
    <Layout>
      <h2 className="text-2xl font-extrabold leading-normal tracking-tight">
        Model {model.name}
      </h2>
      {model.generated_photos.map(photo => <picture key={photo.id}>
        <source srcSet={photoUrl(photo)} type="image/png" />
        <img
          className="w-48 rounded shadow"
          alt={photo.prompt || "Generated photo"}
        />
      </picture>)}
    </Layout>
  );
};

export default ModelById;
