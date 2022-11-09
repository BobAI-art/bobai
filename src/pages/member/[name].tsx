import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import { ArrowLeftOnRectangleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Button from "../../components/Button";
import moment from "moment";
import H2 from "../../components/H2";
import UserLink from "../../components/UserLink";
import PromptSubmit from "../../components/PromptSubmit";


const Member: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
  });
  const name = router.query.name as string;

  const { isLoading, data: user } = trpc.user.get.useQuery(name, {});
  const mySubjects = trpc.subject.list.useQuery(undefined, {
    enabled: user?.id === session?.user?.id,
  });
  const myModelsQuery = trpc.model.ownedByMe.useQuery({});

  if (isLoading || !user) {
    return <>Loading...</>;
  }

  return (
    <>
      <Layout>
        <H2><UserLink user={user} /></H2>
        {user.id === session?.user?.id && (
          <>
            <div className="flex flex-col gap-2 p-2">
              <h3 className="text-xl font-extrabold leading-normal tracking-tight">
                @{user.name} Subjects
              </h3>
              {mySubjects.data?.map((subject) => (
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
              <Link href="/subject/new">
                <div>
                  <Button>
                    <PlusCircleIcon className="w-4" /> Add new subject
                  </Button>
                </div>
              </Link>
            </div>

            <PromptSubmit models={myModelsQuery.data} />

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
