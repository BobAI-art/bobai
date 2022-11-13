import React, { Fragment } from "react";
import Link from "next/link";

const Breadcrumbs: React.FC<{
  label: string;
  parents: { href: string; label: string }[];
}> = ({ label, parents }) => (
  <nav className="my-2 w-full rounded-md bg-gray-100 px-5 py-3">
    <ol className="list-reset flex">
      {parents.map((url) => (
        <Fragment key={url.href}>
          <li>
            <Link href={url.href} className="text-blue-600 hover:text-blue-700">
              {url.label}
            </Link>
          </li>
          <li>
            <span className="mx-2 text-gray-500">/</span>
          </li>
        </Fragment>
      ))}
      <li className="text-gray-500">{label}</li>
    </ol>
  </nav>
);

export default Breadcrumbs;
