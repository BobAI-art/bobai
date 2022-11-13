import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import { trpc } from "../utils/trpc";
import React from "react";

import Photo from "../components/Photo";

const Home: NextPage = () => {
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
              <Photo photo={photo} />
            </li>
          ))}
        </ul>
      </Layout>
    </>
  );
};

export default Home;
