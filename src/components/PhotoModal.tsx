import React from "react";
import { type Photo } from "@prisma/client";
import usePhotoDetails from "../hooks/usePhotoDetails";
import { photoUrl } from "../utils/helpers";
import Link from "next/link";
import Image from "next/image";
import Button from "./Button";
import { Prompt } from "./Prompt";
import Modal from "./Modal";

export const PhotoModal: React.FC<{
  photo: Photo;
  onClose: () => void;
}> = ({ photo, onClose }) => {
  const photoDetails = usePhotoDetails(photo);

  return (
    <Modal onClose={onClose} title={photo.prompt || "Generated photo"}>
      <Link
        href={{
          pathname: "/photo/[id]",
          query: {
            id: photo.id,
          },
        }}
      >
        <Image
          className="rounded"
          src={photoUrl(photo)}
          width={photo.width}
          height={photo.width}
          alt={photo.prompt || "Generated photo"}
        />
      </Link>
      <Prompt className="mt-1" content={photo.prompt} id={photo.prompt_id} />
      {photoDetails?.depiction && (
        <div className="text-gray-900">
          Depiction{" "}
          <Link
            href={{
              pathname: "/depiction/[id]",
              query: { id: photoDetails?.depiction.id },
            }}
          >
            {photoDetails?.depiction.name}
          </Link>
        </div>
      )}
      {photoDetails?.depiction && (
        <div className="text-gray-900">
          Subject{" "}
          <Link
            href={{
              pathname: "/subject/[slug]",
              query: { slug: photoDetails?.depiction.subject.slug },
            }}
          >
            {photoDetails?.depiction.subject.slug}
          </Link>
        </div>
      )}

      <div>{`${photo.guidance}`}</div>
      <Link
        href={{
          pathname: "/photo/[id]",
          query: {
            id: photo.id,
          },
        }}
      >
        <Button>More</Button>
      </Link>
    </Modal>
  );
};
