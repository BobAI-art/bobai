import React from "react";
import { Depiction } from "@prisma/client";
import { ImageWithLabel } from "../pages/components/ImageWithLabel";

export const TrainedDeciption: React.FC<{
  depiction: Pick<
    Depiction,
    "name" | "photoUrl" | "photoHeight" | "photoWidth"
  >;
  className?: string;
}> = ({ depiction, className }) => {
  return (
    <ImageWithLabel
      style={{
        maxWidth: Math.min(depiction.photoWidth, depiction.photoHeight),
      }}
      className={className}
      label={depiction.name}
      photoUrl={depiction.photoUrl}
      photoWidth={depiction.photoWidth}
      photoHeight={depiction.photoHeight}
    ></ImageWithLabel>
  );
};
