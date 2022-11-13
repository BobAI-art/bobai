import React from "react";
import { NextPage } from "next";
import { Layout } from "../../components/Layout";
import H3 from "../../components/H3";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import Breadcrumbs from "../../components/Breadcrumbs";

const ParentModels: NextPage = () => {
  const { data: models } = trpc.parentModel.list.useQuery({});
  if (!models) return <Layout>Loading...</Layout>;
  return (
    <Layout>
      <Breadcrumbs
        parents={[{ href: "/", label: "Home" }]}
        label="Parent Model"
      />
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
