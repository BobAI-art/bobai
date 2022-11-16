import { signIn, useSession } from "next-auth/react";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Button from "./Button";
import React from "react";
import H1 from "./H1";

const SiteHeader: React.FC = () => {
  const { data: session } = useSession();
  return (
    <header className="flex items-center gap-2 px-2">
      <H1>
        <Link href="/">Bob AI</Link>
      </H1>
      <div className="flex-grow" />
      <Link href="/style"><Button >Styles</Button></Link>
      {session ? (
          <Link
            href={{
              pathname: "/member/[name]",
              query: { name: session?.user?.name },
            }}
          >
            <Button>
              <UserIcon className="w-4" /> {session?.user?.name}
            </Button>
          </Link>
      ) : (
        <Button onClick={() => signIn()} className="text-lg">
          <UserIcon className="w-4" /> Sign in
        </Button>
      )}
    </header>
  );
};

export default SiteHeader;
