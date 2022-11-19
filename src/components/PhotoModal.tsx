import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { type Photo } from "@prisma/client";
import usePhotoDetails from "../hooks/usePhotoDetails";
import H2 from "./H2";
import { photoUrl } from "../utils/helpers";
import Link from "next/link";
import Image from "next/image";
import { Dialog } from "@headlessui/react";

export const PhotoModal: React.FC<{
  photo: Photo;
  onClose: () => void;
}> = ({ photo, onClose }) => {
  const photoDetails = usePhotoDetails(photo);

  return (
    <div className="fixed  inset-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Dialog open={true} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true">
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="mx-auto max-w-[512px] rounded bg-white p-2">
                <Dialog.Title className="flex">
                  <H2 className="flex-1">
                    {photoDetails?.depiction?.name || "Generated photo"}
                  </H2>
                  <XMarkIcon className="w-8 cursor-pointer" onClick={onClose} />
                </Dialog.Title>
                <Image
                  src={photoUrl(photo)}
                  width={512}
                  height={512}
                  alt={photo.prompt || "Generated photo"}
                />
                {photoDetails?.depiction && (
                  <div>
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
                  <div>
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
                <span className="text-sm font-light text-gray-600">
                  <Link
                    href={{
                      pathname: "/prompt/[id]",
                      query: { id: photo.prompt_id },
                    }}
                  >
                    {photo.prompt}
                  </Link>
                </span>
              </Dialog.Panel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
