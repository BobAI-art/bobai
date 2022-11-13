import React, { Fragment } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { Layout } from "../../components/Layout";
import Link from "next/link";
import useParentModel from "../../hooks/useParentModel";
import { trpc } from "../../utils/trpc";
import { Photo } from "../../components/Photo";

const Breadcrumbs: React.FC<{
  label: string;
  parents: { href: string; label: string }[];
}> = ({ label, parents }) => (
  <nav className="my-2 w-full rounded-md bg-gray-100 px-5 py-3">
    <ol className="list-reset flex">
      {parents.map((url) => (
        <Fragment key={url.href}>
          <li>
            <Link href={url.href} className="text-blue-600 hover:text-blue-700">
              {url.label}
            </Link>
          </li>
          <li>
            <span className="mx-2 text-gray-500">/</span>
          </li>
        </Fragment>
      ))}
      <li className="text-gray-500">{label}</li>
    </ol>
  </nav>
);
const ParentModelByCode: NextPage = () => {
  const router = useRouter();
  const code = router.query.code as string;
  const { data: model } = useParentModel(code);
  const { data: generatedPhotos } = trpc.generatedPhotos.list.useQuery({
    parentModel: code,
    category: "generated-image",
  });
  if (!model) return <Layout>Loading...</Layout>;
  return (
    <Layout>
      <Breadcrumbs
        parents={[
          { href: "/", label: "Home" },
          {
            href: "/parent-model/",
            label: "Parent Model",
          },
        ]}
        label={model.repo_id.split("/")[1] || ""}
      />
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {generatedPhotos?.map((photo) => (
          <li key={photo.id}>
            <Photo photo={photo} />
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default ParentModelByCode;
