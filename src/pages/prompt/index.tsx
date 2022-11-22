import React from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { Layout } from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import H2 from "../../components/H2";
import PhotosGrid from "../../components/PhotosGrid";
import Navigation from "../../components/Navigation";
import useNavigation from "../../hooks/useNavigation";
import usePhotos from "../../hooks/usePhotos";
import Link from "next/link";

const ParentModelByCode: NextPage = () => {
  const navigation = useNavigation();

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
