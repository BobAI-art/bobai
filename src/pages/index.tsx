import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const Header: React.FC = () => {
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
          Sign out
        </button>
      ) : (
        <button
          onClick={() => signIn()}
          className="flex cursor-pointer gap-2 text-2xl font-extrabold leading-normal tracking-tight underline decoration-pink-500 hover:text-slate-800 hover:decoration-pink-900"
        >
          <UserIcon className="w-8" /> Login
        </button>
      )}
    </header>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Portraits</title>
        <meta
          name="description"
          content="AI generated portraits of you or your friends"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col ">
        <Header />
      </main>
    </>
  );
};

export default Home;
