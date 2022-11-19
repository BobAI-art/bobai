import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import React from "react";
import { PhotosGrid } from "../components/PhotosGrid";

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
        <PhotosGrid />
      </Layout>
    </>
  );
};

export default Home;
