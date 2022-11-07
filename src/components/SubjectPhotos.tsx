import { AppRouterTypes, trpc } from "../utils/trpc";
import { ImageUpload } from "./ImageUpload";
import React, { useState } from "react";
import cuid from "cuid";
import toast from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/solid";
import Button from "./Button";

export const SubjectPhotos: React.FC<{
  model: NonNullable<AppRouterTypes["subject"]["get"]["output"]>;
  photos: NonNullable<AppRouterTypes["trainingPhoto"]["list"]["output"]>;
  howMany: number;
  onPhotosChanged?: () => void;
}> = ({ model, photos, howMany, onPhotosChanged }) => {

  const uploadPhoto = trpc.trainingPhoto.add.useMutation({
    onSuccess: (photo) => {
      onPhotosChanged?.();
      setCropped((current) => current.filter((c) => c.cuid !== photo.id));
    },
    onError: () => {
      toast.error("Failed to upload photo");
    },
  });
  const deletePhoto = trpc.trainingPhoto.delete.useMutation({
    onSuccess: () => {
      onPhotosChanged?.();
    },
    onError: () => {
      toast.error("Delete failed");
    },
  });
  const [cropped, setCropped] = useState<{ data: string; cuid: string }[]>([]);

  return (
    <div className="flex flex-col">
      Training Photos: {photos.length}/{howMany}
      <div className="min-h-24 relative m-2 flex w-full flex-wrap gap-2">
        {photos.map((photo) => (
          <div
            key={`uploaded-${photo.id}`}
            onClick={() => {
              // if(photos.length <= 20 ) {
              //   toast.error("You can't delete photos when you have less than 20 photos");
              //   return
              // }
              deletePhoto.mutate(photo.id);
            }}
            className="group cursor-pointer rounded drop-shadow"
          >
            <div className="invisible absolute flex h-24 w-24 items-center justify-center bg-black  text-white opacity-50 group-hover:visible">
              <TrashIcon className="w-12" />
            </div>

            <picture>
              <img
                src={`
              https://${photo.bucket}.s3.eu-west-2.amazonaws.com/${photo.path}`}
                className="h-24"
                alt="uploaded model training photo"
              />
            </picture>
          </div>
        ))}

        {cropped.map((photo) => (
          <picture key={photo.cuid} className="rounded	drop-shadow">
            <img
              className="h-24 opacity-50"
              src={photo.data}
              alt="model training image beeing uploaded"
            />
          </picture>
        ))}
        <ImageUpload
          className="self-center h-24 w-24 "
          onNewImage={(data) => {
            const photoCuid = cuid();
            uploadPhoto.mutate({ photoData: data, model: model.slug, photoCuid });
            setCropped((current) => [...current, { data, cuid: photoCuid }]);
          }}
        />
      </div>
    </div>
  );
};
