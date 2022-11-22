import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import React, { useCallback, useEffect } from "react";
import PhotosGrid from "../components/PhotosGrid";
import usePhotos from "../hooks/usePhotos";
import useNavigation from "../hooks/useNavigation";
import Navigation from "../components/Navigation";

const useEndOfPage = (onEnd: () => void, disabled = false) => {
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const handleScroll = () => {
    const scrollTop = window.document.scrollingElement?.scrollTop || 0;
    const scrollHeight = window.document.scrollingElement?.scrollHeight || 0;
    const clientHeight = window.document.scrollingElement?.clientHeight || 0;
    if (!disabled && scrollTop > (scrollHeight - clientHeight) * 0.8) {
      window.removeEventListener("scroll", handleScroll);
      onEnd();
    }
  };
};

const Home: NextPage = () => {
  const navigation = useNavigation();
  const { data, fetchNextPage, isLoading } = usePhotos(navigation);
  useEndOfPage(fetchNextPage, isLoading);

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
        <PhotosGrid photos={data?.pages.flatMap((page) => page.photos)}>
          <Navigation {...navigation} />
        </PhotosGrid>
      </Layout>
    </>
  );
};

export default Home;
