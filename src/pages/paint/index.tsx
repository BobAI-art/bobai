import type { NextPage } from "next";
import { Layout } from "../../components/Layout";
import React from "react";
import H1 from "../../components/H1";
import { useSession } from "next-auth/react";
import { PromptEditor } from "../../components/PromptEditor";
import H3 from "../../components/H3";
import useMyDepictionsBySubject from "../../hooks/useMyDepictionsBySubject";
import H2 from "../../components/H2";
import Subject from "../../components/Subject";
import { TrainedDeciption } from "../../components/TrainedDeciption";
import Link from "next/link";
import Button from "../../components/Button";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

const Paint: NextPage = () => {
  useSession({ required: true });

  const { data: groups, isLoading } = useMyDepictionsBySubject();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Layout>
      <H1 className="my-4">Hi Bob!, please paint:</H1>
      <H2>My depictions</H2>
      <div className="flex flex-col gap-2">
        {groups?.map((group) => (
          <div key={group.subject.id} className="flex gap-2">
            <Link
              href={{
                pathname: "/paint/subject/[subject]",
                query: {
                  subject: group.subject.slug,
                },
              }}
            >
              <Subject subject={group.subject} className="mr-4 max-w-[256px]" />
            </Link>
            <div key={group.subject.id} className="flex flex-wrap gap-2">
              {group.depictions.map((depiction) => (
                <Link
                  key={depiction.id}
                  href={{
                    pathname: "/paint/depiction/[depiction]",
                    query: {
                      depiction: depiction.id,
                    },
                  }}
                >
                  <div className="aspect-square w-[256px]" key={depiction.id}>
                    <TrainedDeciption depiction={depiction} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
        <Link href="/subject/new">
          <Button className="aspect-square w-[256px]">
            <PlusCircleIcon className="w-4" /> Add new subject
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default Paint;
