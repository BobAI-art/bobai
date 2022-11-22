import React from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { Layout } from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import usePageScrollPhotos from "../../hooks/usePageScrollPhotos";

const ParentModelByCode: NextPage = () => {
  const router = useRouter();
  // router.query.
  const sentence = router.query.sentence as string;
  const { data: prompt, isError } = trpc.prompt.list.useQuery({
    sentence,
  });
  if (!prompt) return <Layout>Loading... {JSON.stringify(prompt)}</Layout>;
  return (
    <Layout>
      {prompt.map((prompt) => (
        <Link
          key={prompt.id}
          href={{
            pathname: "/prompt/[id]",
            query: { id: prompt.id },
          }}
        >
          <p key={prompt.id}>{prompt.content}</p>
        </Link>
      ))}
    </Layout>
  );
};

export default ParentModelByCode;
