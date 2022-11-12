import React, { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { GeneratedPhoto } from "@prisma/client";
import usePhotoDetails from "../hooks/usePhotoDetails";
import H2 from "./H2";
import { photoUrl } from "../utils/helpers";
import Link from "next/link";
import Image from "next/image";

export const PhotoModal: React.FC<{
  photo: GeneratedPhoto;
  onClose: () => void;
}> = ({ photo, onClose }) => {
  const photoDetails = usePhotoDetails(photo);
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  });
  return (
    <div
      tabIndex={0}
      className="fixed  inset-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="flex max-h-fit w-[512px] flex-col bg-gray-200 p-2">
        <div className="flex">
          <H2 className="flex-1">
            {photoDetails ? photoDetails.model.name : "..."}
          </H2>
          <XMarkIcon onClick={onClose} className="w-10 cursor-pointer p-2" />
        </div>
        <div>
          <Image
            src={photoUrl(photo)}
            width={512}
            height={512}
            alt={photo.prompt || "Generated photo"}
          />
        </div>
        <div>
          Model{" "}
          <Link
            href={{
              pathname: "/model/[id]",
              query: { id: photoDetails?.model.id },
            }}
          >
            {photoDetails?.model.name}
          </Link>
        </div>
        <div>
          Subject{" "}
          <Link
            href={{
              pathname: "/subject/[slug]",
              query: { slug: photoDetails?.model.subject.slug },
            }}
          >
            {photoDetails?.model.subject.slug}
          </Link>
        </div>
        <span className="text-sm font-light text-gray-600">{photo.prompt}</span>
      </div>
    </div>
  );
};
