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

const Member: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
  });
  const name = router.query.name as string;

  const { isLoading, data: user } = trpc.user.get.useQuery(name, {});
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
          <div className="flex flex-col gap-4">
            <Link href="/model/new">
              <div>
                <Button>
                  <PlusCircleIcon className="w-8" /> Train new model
                </Button>
              </div>
            </Link>

            <Button onClick={() => signOut()}>
              <ArrowLeftOnRectangleIcon className="w-8" /> Logout
            </Button>
          </div>
        )}
      </Layout>
    </>
  );
};

export default Member;
