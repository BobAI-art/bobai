import { signIn, signOut, useSession } from "next-auth/react";
import { UserIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export const Header: React.FC = () => {
  const { data: session } = useSession();

  return (
    <header className="flex items-center gap-2 px-2">
      <h1 className="hero-text bg-gradient-to-t  from-pink-900 via-pink-600 via-pink-900 to-pink-500 bg-clip-text text-6xl font-extrabold leading-normal tracking-tight">
        <Link href="/">AI Portraits</Link>
      </h1>
      <div className="flex-grow" />
      {session ? (
        <button
          className="flex cursor-pointer gap-2 text-2xl font-extrabold leading-normal tracking-tight underline decoration-pink-500 hover:text-slate-800 hover:decoration-pink-900"
          onClick={() => signOut()}
        >
          <ArrowLeftOnRectangleIcon className="w-8" />
          Sign out
        </button>
      ) : (
        <button
          onClick={() => signIn()}
          className="flex cursor-pointer gap-2 text-2xl font-extrabold leading-normal tracking-tight underline decoration-pink-500 hover:text-slate-800 hover:decoration-pink-900"
        >
          <UserIcon className="w-8" /> Sign in
        </button>
      )}
    </header>
  );
};
