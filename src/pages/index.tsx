import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import { trpc } from "../utils/trpc";
import React, { useState } from "react";

import Photo from "../components/Photo";
import Button from "../components/Button";

const Photos = () => {
  const perPage = 2 * 4 * 6 * 2;
  const [page, setPage] = useState(0);
  const { data: generatedPhotos } = trpc.photos.list.useQuery(
    {
      skip: page * perPage,
      limit: perPage,
    },
    {}
  );
  const navigation = (
    <div className="flex justify-between">
      <Button disabled={page === 0} onClick={() => setPage((page) => page - 1)}>
        Prev
      </Button>
      {page}
      <Button onClick={() => setPage((page) => page + 1)}>Next</Button>
    </div>
  );

  return (
    <div>
      {navigation}
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {generatedPhotos?.map((photo) => (
          <li key={photo.id}>
            <Photo photo={photo} />
          </li>
        ))}
      </ul>
      {navigation}
    </div>
  );
};

const Home: NextPage = () => {
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
        <Photos />
      </Layout>
    </>
  );
};

export default Home;
