import React from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { classNames } from "../toolbox";

export const Prompt: React.FC<{
  content: string;
  id: string;
  className?: string;
}> = ({ id, content, className }) => (
  <div className={classNames("relative", className || "")}>
    <Link
      className="peer absolute bottom-6 right-2"
      href={{
        pathname: "/prompt/[id]",
        query: { id },
      }}
    >
      <ChevronRightIcon className="h-6 w-6 fill-gray-400" />
    </Link>
    <h5 className="mb-2 rounded p-4 text-xl font-medium text-gray-900 peer-hover:bg-gray-200">
      {content.split(",").map((sentence, i) => (
        <span
          key={i}
          className="rounded p-1 outline-8 outline-amber-300 after:content-[','] last:after:content-[''] hover:bg-gray-300 hover:outline-gray-300"
        >
          <Link
            href={{
              pathname: "/prompt/",
              query: { sentence: sentence.trim() },
            }}
          >
            {sentence}
          </Link>
        </span>
      ))}
    </h5>
  </div>
);
