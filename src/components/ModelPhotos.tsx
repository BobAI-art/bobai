import { AppRouterTypes, trpc } from "../utils/trpc";
import { ImageUpload } from "./ImageUpload";
import { allImages } from "../pages/model/[slug]";
import { useState } from "react";
import cuid from "cuid";

export const ModelPhotos: React.FC<{
  model: NonNullable<AppRouterTypes["model"]["get"]["output"]>;
}> = ({ model }) => {
  const photos = trpc.trainingPhoto.list.useQuery(model.slug);
  const uploadPhoto = trpc.trainingPhoto.add.useMutation({
    onSuccess: (photo) => {
      if (photo) {
        photos.refetch();
        setCropped((current) => current.filter((c) => c.cuid !== photo.id));
      }
    },
  });
  const [cropped, setCropped] = useState<{ data: string; cuid: string }[]>([]);
  if (photos.isLoading || !photos.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Model Photos: {photos.data.length}/{allImages}
      <div className="min-h-24 m-2 flex w-full flex-wrap gap-2">
        {cropped.map((photo) => (
          <img className="h-24" key={photo.cuid} src={photo.data}></img>
        ))}
      </div>
      <ImageUpload
        onNewImage={(data) => {
          const photoCuid = cuid();
          uploadPhoto.mutate({ photoData: data, model: model.slug, photoCuid });
          setCropped((current) => [...current, { data, cuid: photoCuid }]);
        }}
      />
    </div>
  );
};
