import React from "react";
import H2 from "./H2";
import { type Depiction } from "@prisma/client";

export const DepictionInTraining: React.FC<{ depiction: Depiction }> = ({
  depiction,
}) => {
  return (
    <>
      <H2>
        Working on a depiction of {depiction.name} in the style of {depiction.style_slug}
      </H2>
    </>
  );
};
