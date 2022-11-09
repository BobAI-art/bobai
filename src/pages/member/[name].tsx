import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import {
  ArrowLeftOnRectangleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import Button from "../../components/Button";
import moment from "moment";
import H2 from "../../components/H2";
import UserLink from "../../components/UserLink";
import PromptSubmit from "../../components/PromptSubmit";
import usePromptSubmit from "../../hooks/usePromptSubmit";
import useMyModels from "../../hooks/useMyModels";
import useSubjects from "../../hooks/useSubjects";
import React from "react";
import useUserByName from "../../hooks/useUserByName";
import useMyPrompts from "../../hooks/useMyPrompts";

const MemberPrivate: React.FC = () => {
  const { data: models } = useMyModels();
  const { data: prompts, refetch: promptsRefetch } = useMyPrompts();
  const promptSubmit = usePromptSubmit({
    onSuccess: () => {
      promptsRefetch();
    },
  });
  return (
    <>
      <hr />
      <PromptSubmit models={models} {...promptSubmit} />
      <hr />
      <H2>My Prompts</H2>
      <ul>
        {prompts?.map((prompt) => (
          <li key={prompt.id}>
            {prompt.status}{" "}
            <span className="font-bold text-slate-700">{prompt.prompt}</span>{" "}
            created: {moment(prompt.created).fromNow()}
          </li>
        ))}
      </ul>
    </>
  );
};

const Member: NextPage = () => {
  const router = useRouter();

  const { data: session } = useSession({
    required: true,
  });
  const name = router.query.name as string;
  const { isLoading: userIsLoading, data: user } = useUserByName(name);
  const { data: subjects } = useSubjects(user?.id);

  if (userIsLoading || !user) {
    return <Layout>Loading...</Layout>;
  }
  const isMe = user.id === session?.user?.id;

  return (
    <>
      <Layout>
        <H2>
          <UserLink user={user} />
        </H2>
        {user.id === session?.user?.id && (
          <>
            <div className="flex flex-col gap-2 p-2">
              <h3 className="text-xl font-extrabold leading-normal tracking-tight">
                @{user.name} Subjects
              </h3>
              {subjects?.map((subject) => (
                <div key={subject.id} className="flex gap-2 ">
                  <Button>
                    <Link
                      href={{
                        pathname: "/subject/[slug]",
                        query: { slug: subject.slug },
                      }}
                    >
                      {subject.slug}
                    </Link>
                  </Button>
                  <div>{moment(subject.created).fromNow()}</div>
                </div>
              ))}
              {isMe && (
                <Link href="/subject/new">
                  <div>
                    <Button>
                      <PlusCircleIcon className="w-4" /> Add new subject
                    </Button>
                  </div>
                </Link>
              )}
            </div>
            {isMe && <MemberPrivate />}

            <div className="h-48"></div>
            <hr />
            <div className="mt-2 flex flex-col gap-4 p-2">
              <Button onClick={() => signOut()}>
                <ArrowLeftOnRectangleIcon className="w-4" /> Logout
              </Button>
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default Member;
