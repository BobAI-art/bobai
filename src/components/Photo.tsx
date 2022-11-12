import React from "react";
import { PhotoModal } from "./PhotoModal";
import Image from "next/image";
import { photoUrl } from "../utils/helpers";
import { GeneratedPhoto } from "@prisma/client";

export const Photo: React.FC<{ photo: GeneratedPhoto }> = ({ photo }) => {
  const [show, setShow] = React.useState(false);
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
