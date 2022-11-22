import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import React from "react";
import PhotosGrid from "../components/PhotosGrid";
import H1 from "../components/H1";
import usePageScrollPhotos from "../hooks/usePageScrollPhotos";

const Explore: NextPage = () => {
  const { data: photos } = usePageScrollPhotos();

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
        <H1 className="my-4">
          Here is my recent work I&apos;m really proud of, feel free to look
        </H1>
        <PhotosGrid photos={photos}></PhotosGrid>
      </Layout>
    </>
  );
};

export default Explore;
