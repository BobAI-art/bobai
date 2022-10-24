import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import {
  ArrowLeftOnRectangleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import Button from "../../components/Button";
import moment from "moment";

const Member: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
  });
  const name = router.query.name as string;

  const { isLoading, data: user } = trpc.user.get.useQuery(name, {});
  const myModels = trpc.model.list.useQuery(undefined, {
    enabled: user?.id === session?.user?.id,
  });

  if (isLoading || !user) {
    return <>Loading...</>;
  }

  return (
    <>
      <Layout>
        <h2 className="text-2xl font-extrabold leading-normal tracking-tight">
          User @{user.name}
        </h2>
        {user.id === session?.user?.id && (
          <>
            <div className="flex flex-col gap-2 rounded bg-slate-300 p-2 shadow">
              <h3 className="text-xl font-extrabold leading-normal tracking-tight">
                @{user.name} Models
              </h3>
              {myModels.data?.map((model) => (
                <div key={model.id} className="flex gap-2 ">
                  <Button>
                    <Link
                      href={{
                        pathname: "/model/[slug]",
                        query: { slug: model.slug },
                      }}
                    >
                      {model.slug}
                    </Link>
                  </Button>
                  <div>{model.state}</div>
                  <div>{moment(model.created).fromNow()}</div>
                </div>
              ))}
              <Link href="/model/new">
                <div>
                  <Button>
                    <PlusCircleIcon className="w-4" /> Train new model
                  </Button>
                </div>
              </Link>
            </div>
            <div className="mt-2 flex flex-col gap-4 rounded bg-slate-300 p-2 shadow">
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
