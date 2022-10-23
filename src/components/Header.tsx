import { signIn, signOut, useSession } from "next-auth/react";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Button from "./Button";

export const Header: React.FC = () => {
  const { data: session } = useSession();
  return (
    <header className="flex items-center gap-2 px-2">
      <h1 className="hero-text bg-gradient-to-t  from-pink-900 via-pink-600 via-pink-900 to-pink-500 bg-clip-text text-6xl font-extrabold leading-normal tracking-tight">
        <Link href="/">AI Portraits</Link>
      </h1>
      <div className="flex-grow" />
      {session ? (
        <Link
          href={{
            pathname: "/member/[name]",
            query: { name: session?.user?.name },
          }}
        >
          <div>
            <Button className="text-2xl">
              <UserIcon className="w-8" /> {session?.user?.name}
            </Button>
          </div>
        </Link>
      ) : (
        <Button onClick={() => signIn()} className="text-2xl">
          <UserIcon className="w-8" /> Sign in
        </Button>
      )}
    </header>
  );
};
