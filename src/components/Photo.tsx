import React from "react";
import { PhotoModal } from "./PhotoModal";
import Image from "next/image";
import { photoUrl } from "../utils/helpers";
import { GeneratedPhoto } from "@prisma/client";
import moment from "moment/moment";

const Photo: React.FC<{ photo: GeneratedPhoto }> = ({ photo }) => {
  const [show, setShow] = React.useState(false);
  if (photo.status !== "GENERATED") {
    return (
      <div className="aspect-square overflow-hidden rounded border border-black p-2 shadow">
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
      <div className="overflow-hidden	">
        <Image
          onClick={() => setShow(true)}
          alt={photo.prompt || "Generated photo"}
          src={photoUrl(photo)}
          width={512}
          height={512}
          className="scale-100 cursor-pointer rounded shadow transition-transform duration-200 hover:scale-105"
        />
      </div>
    </>
  );
};

export default Photo;
