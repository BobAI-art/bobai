import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { type Photo } from "@prisma/client";
import usePhotoDetails from "../hooks/usePhotoDetails";
import H2 from "./H2";
import { photoUrl } from "../utils/helpers";
import Link from "next/link";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import Button from "./Button";
import { Prompt } from "./Prompt";

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
                <Dialog.Title
                  className="flex justify-between text-gray-900"
                  as={H2}
                >
                  {photoDetails?.depiction?.name || "Generated photo"}
                  <XMarkIcon className="w-8 cursor-pointer" onClick={onClose} />
                </Dialog.Title>
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
                <Prompt
                  className="mt-1"
                  content={photo.prompt}
                  id={photo.prompt_id}
                />
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
                {/*<span className="text-sm font-light text-gray-900">*/}
                {/*  <Link*/}
                {/*    href={{*/}
                {/*      pathname: "/prompt/[id]",*/}
                {/*      query: { id: photo.prompt_id },*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    {photo.prompt}*/}
                {/*  </Link>*/}
                {/*</span>*/}
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
              </Dialog.Panel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
