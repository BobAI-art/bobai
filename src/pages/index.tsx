import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import H1 from "../components/H1";

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
        <H1>Hello world, here will be page soon</H1>
      </Layout>
    </>
  );
};

export default Home;
