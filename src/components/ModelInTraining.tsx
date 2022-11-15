import React from "react";
import useGeneratedPhotos from "../hooks/useGeneratedPhotos";
import H2 from "./H2";
import Image from "next/image";
import { photoUrl } from "../utils/helpers";
import { Model } from "@prisma/client";

export const ModelInTraining: React.FC<{ model: Model }> = ({
  model,
}) => {
  return (
    <>
      <H2>
        Working on a depiction of {model.name} in the style of {model.parent_model_code}
      </H2>
    </>
  );
};
