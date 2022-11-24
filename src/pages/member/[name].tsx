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
import useMyDepictions from "../../hooks/useMyDepictions";
import useSubjects from "../../hooks/useSubjects";
import React from "react";
import useUserByName from "../../hooks/useUserByName";

const MemberPrivate: React.FC = () => {
  const { data: models } = useMyDepictions();
  return (
    <div className="">
      <hr />
      <hr />
    </div>
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
    <Layout>
      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        <li className="mb-10 ml-4">
          <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
          <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
            February 2022
          </time>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Application UI code in Tailwind CSS
          </h3>
          <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
            Get access to over 20+ pages including a dashboard layout, charts,
            kanban board, calendar, and pre-order E-commerce & Marketing pages.
          </p>
          <a
            href="#"
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          >
            Learn more{" "}
            <svg
              className="ml-2 h-3 w-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </a>
        </li>
        <li className="mb-10 ml-4">
          <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
          <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
            March 2022
          </time>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Marketing UI design in Figma
          </h3>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            All of the pages and components are first designed in Figma and we
            keep a parity between the two versions even as we update the
            project.
          </p>
        </li>
        <li className="ml-4">
          <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
          <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
            April 2022
          </time>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            E-Commerce UI code in Tailwind CSS
          </h3>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            Get started with dozens of web components and interactive elements
            built on top of Tailwind CSS.
          </p>
        </li>
      </ol>

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
                <Link
                  href={{
                    pathname: "/subject/[slug]",
                    query: { slug: subject.slug },
                  }}
                >
                  <Button>{subject.slug}</Button>
                </Link>

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
  );
};

export default Member;
