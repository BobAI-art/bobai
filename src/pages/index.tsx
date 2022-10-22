import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { Header } from "../components/Header";

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
      <main className="container mx-auto flex min-h-screen flex-col ">
        <Header />
      </main>
    </>
  );
};

export default Home;
