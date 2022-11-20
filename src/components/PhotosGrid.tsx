import React, { PropsWithChildren } from "react";
import { Photo as PhotoModel } from "@prisma/client";
import Photo from "./Photo";

const PhotosGrid: React.FC<
  PropsWithChildren<{
    photos: PhotoModel[] | undefined;
  }>
> = ({ photos, children }) => {
  return (
    <div>
      {children}
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {photos ? (
          photos.map((photo) => (
            <li key={photo.id}>
              <Photo photo={photo} />
            </li>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </ul>
      {children}
    </div>
  );
};

export default PhotosGrid;
