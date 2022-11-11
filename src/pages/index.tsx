import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import H1 from "../components/H1";
import { trpc } from "../utils/trpc";
import Image from "next/image";
import { photoUrl } from "../utils/helpers";
import React from "react";

const Home: NextPage = () => {
  // const { data: models } = trpc.model.list.useQuery({});
  const { data: generatedPhotos } = trpc.generatedPhotos.list.useQuery({
    category: "generated-image",
  });
  return (
    <>
      <Head>
        <title>Portraits</title>
        <meta
          name="description"
          content="AI generated portraits of you or your friends"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {generatedPhotos?.map((photo) => (
            <li key={photo.id}>
              <Image
                alt={photo.prompt || "Generated photo"}
                src={photoUrl(photo)}
                width={512}
                height={512}
                className="rounded shadow"
              />
            </li>
          ))}
        </ul>
      </Layout>
    </>
  );
};

export default Home;
