import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import React from "react";
import { trpc } from "../utils/trpc";
import Button from "../components/Button";

const Home: NextPage = () => {
  const query = trpc.prompt.generate.useQuery({
    category: "movies",
  });
  const mutation = trpc.prompt.generateAndSave.useMutation();
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
        <h2>{query.data?.name}</h2>

        <Button
          disabled={mutation.isLoading}
          onClick={(e) => {
            e.preventDefault();
            mutation.mutate({
              category: "movies",
            });
          }}
        >
          Generate
        </Button>
        <div>{JSON.stringify(query.data)}</div>
        <ul>
          {/*{query.data?.map((item, i) => (*/}
          {/*  <li key={i}>{JSON.stringify(item)}</li>*/}
          {/*))}*/}
        </ul>
      </Layout>
    </>
  );
};

export default Home;
