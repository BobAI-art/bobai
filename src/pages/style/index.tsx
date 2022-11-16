import React from "react";
import { NextPage } from "next";
import { Layout } from "../../components/Layout";
import H3 from "../../components/H3";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import Breadcrumbs from "../../components/Breadcrumbs";

const ParentModels: NextPage = () => {
  const { data: styles } = trpc.style.list.useQuery({});
  if (!styles) return <Layout>Loading...</Layout>;
  return (
    <Layout>
      <Breadcrumbs
        parents={[{ href: "/", label: "Home" }]}
        label="Style"
      />
      <ul>
        {styles.map((style) => (
          <li key={style.slug}>
            <Link
              href={{
                pathname: "/style/[slug]/",
                query: { slug: style.slug },
              }}
            >
              <H3>{style.slug}</H3>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default ParentModels;
