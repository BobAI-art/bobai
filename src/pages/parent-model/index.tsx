import React from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { Layout } from "../../components/Layout";
import UserLink from "../../components/UserLink";
import H2 from "../../components/H2";
import H3 from "../../components/H3";
import Link from "next/link";
import useParentModel from "../../hooks/useParentModel";
import { trpc } from "../../utils/trpc";
import { Photo } from "../../components/Photo";

const ParentModels: NextPage = () => {
  const { data: models } = trpc.parentModel.list.useQuery({});
  if (!models) return <Layout>Loading...</Layout>;
  return (
    <Layout>
      <H2>Parent models</H2>
      <ul>
        {models.map((model) => (
          <li key={model.code}>
            <Link
              href={{
                pathname: "/parent-model/[code]/",
                query: { code: model.code },
              }}
            >
              <H3>{model.repo_id.split("/")[1]}</H3>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default ParentModels;
