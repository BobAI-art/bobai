import React from "react";
import { PhotoModal } from "./PhotoModal";
import Image from "next/image";
import { photoUrl } from "../utils/helpers";
import { type Photo as PhotoModel } from "@prisma/client";
import moment from "moment/moment";
import { classNames } from "../toolbox";

const Photo: React.FC<{
  photo: PhotoModel;
  showModal?: boolean;
  className?: string;
}> = ({ photo, showModal = true, className }) => {
  const [show, setShow] = React.useState(false);
  if (photo.status !== "GENERATED") {
    return (
      <div
        className={classNames(
          "aspect-square overflow-hidden rounded border border-black p-2 shadow",
          className || ""
        )}
      >
        <div>Added to queue {moment(photo.created).fromNow()}</div>
        <div>{photo.status}</div>
        <div>{photo.id}</div>
        <span className="text-sm text-gray-600">{photo.prompt}</span>
      </div>
    );
  }
  return (
    <>
      {show && <PhotoModal photo={photo} onClose={() => setShow(false)} />}
      <div className={classNames("overflow-hidden", className || "")}>
        <Image
          style={{ minWidth: "100%" }}
          onClick={showModal ? () => setShow(true) : undefined}
          alt={photo.prompt || "Generated photo"}
          src={photoUrl(photo)}
          width={photo.width}
          height={photo.height}
          className={classNames(
            showModal
              ? "min-w-full scale-100 rounded shadow transition-transform duration-300 hover:scale-110"
              : ""
          )}
        />
      </div>
    </>
  );
};
Photo.defaultProps = {
  showModal: true,
};

export default Photo;
