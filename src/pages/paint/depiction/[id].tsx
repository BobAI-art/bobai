import { NextPage } from "next";
import { Layout } from "../../../components/Layout";
import React from "react";
import { PromptEditor } from "../../../components/PromptEditor";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";

const PaintDepiction: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: depiction } = trpc.depiction.get.useQuery(id);
  return (
    <Layout>
      <div>Paint depiction</div>
      <PromptEditor />
    </Layout>
  );
};

export default PaintDepiction;
