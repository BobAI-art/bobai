import { User } from "@prisma/client";
import Link from "next/link";
import React from "react";

const UserLink: React.FC<{ user: Pick<User, "name"> }> = ({ user }) => (
  <Link
    href={{
      pathname: "/member/[name]/",
      query: { name: user.name },
    }}
  >
    @{user.name}
  </Link>
);

export default UserLink;
