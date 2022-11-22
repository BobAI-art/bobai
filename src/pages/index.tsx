import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import React from "react";
import H1 from "../components/H1";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const session = useSession();

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
        <H1 className="my-4">Hi, I&apos;m Bob!</H1>
        {session.data?.user ? (
          <div>Logged user: {session.data.user?.name}</div>
        ) : (
          <div>Not logged in</div>
        )}
      </Layout>
    </>
  );
};

export default Home;
