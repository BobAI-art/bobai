import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import React from "react";
import PhotosGrid from "../components/PhotosGrid";
import usePhotos from "../hooks/usePhotos";
import useNavigation from "../hooks/useNavigation";
import Navigation from "../components/Navigation";

const Home: NextPage = () => {
  const navigation = useNavigation();
  const { data: photos } = usePhotos(navigation);
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
        <PhotosGrid photos={photos}>
          <Navigation {...navigation} />
        </PhotosGrid>
      </Layout>
    </>
  );
};

export default Home;
