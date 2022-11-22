import React, { PropsWithChildren } from "react";
import { Photo as PhotoModel } from "@prisma/client";
import Photo from "./Photo";
import { classNames } from "../toolbox";
import Masonry from "react-masonry-css";
import { EyeSlashIcon } from "@heroicons/react/24/solid";
import useWindowDimensions from "../hooks/useWindowDimentions";

const PhotosGrid: React.FC<
  PropsWithChildren<{
    photos: PhotoModel[] | undefined;
  }>
> = ({ photos, children }) => {
  const { width } = useWindowDimensions();
  return (
    <div>
      {children}
      <ul>
        {photos ? (
          <Masonry
            breakpointCols={width < 640 ? 2 : width < 1024 ? 4 : 6}
            className="flex gap-2"
            columnClassName=""
          >
            {photos.map((photo) => (
              <li
                key={photo.id}
                className={classNames(
                  "mb-2 grid cursor-pointer grid-cols-1 grid-rows-1",
                  photo.height > 512 ? "row-span-3" : "row-span-2",
                  photo.width > 512 ? "col-span-3" : "col-span-2"
                )}
              >
                <Photo photo={photo} className="col-start-1 row-start-1" />
                {!photo.is_public && (
                  <div className="z-0 col-start-1 row-start-1 h-8 w-8 ">
                    <EyeSlashIcon />
                  </div>
                )}
              </li>
            ))}
          </Masonry>
        ) : (
          <div>Loading...</div>
        )}
      </ul>
      {children}
    </div>
  );
};

export default PhotosGrid;
