import React from "react";
import useGeneratedPhotos from "../hooks/useGeneratedPhotos";
import H2 from "./H2";
import Image from "next/image";
import { photoUrl } from "../utils/helpers";
import { Model } from "@prisma/client";

export const ModelInTrainingPreview: React.FC<{ model: Model }> = ({
  model,
}) => {
  const { data: traningPreview } = useGeneratedPhotos({
    modelId: model.id,
    category: "training-progress",
  });
  return (
    <>
      <H2>
        Model in training,{" "}
        <span className="font-extrabold">Preview images:</span>
      </H2>
      <ul className="grid grid-cols-6 gap-2">
        {traningPreview?.map((photo) => (
          <li key={photo.id}>
            <Image
              alt={photo.prompt || "Generated photo"}
              src={photoUrl(photo)}
              width={512}
              height={512}
              className="rounded shadow"
            />
          </li>
        ))}
      </ul>
    </>
  );
};
