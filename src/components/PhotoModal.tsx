import React, { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { GeneratedPhoto } from "@prisma/client";
import usePhotoDetails from "../hooks/usePhotoDetails";
import H2 from "./H2";
import { photoUrl } from "../utils/helpers";
import Link from "next/link";
import Image from "next/image";
import { Dialog } from "@headlessui/react";

export const PhotoModal: React.FC<{
  photo: GeneratedPhoto;
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
                    {photoDetails?.model?.name || "Generated photo"}
                  </H2>
                  <XMarkIcon className="w-8 cursor-pointer" onClick={onClose} />
                </Dialog.Title>
                <Image
                  src={photoUrl(photo)}
                  width={512}
                  height={512}
                  alt={photo.prompt || "Generated photo"}
                />
                {photoDetails?.model && (
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
                )}
                {photoDetails?.model && (
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
                )}
                <span className="text-sm font-light text-gray-600">
                  {photo.prompt}
                </span>
              </Dialog.Panel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
