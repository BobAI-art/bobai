import React, { PropsWithChildren, ReactNode } from "react";
import Image, { StaticImageData } from "next/image";
import { classNames } from "../../toolbox";
import defaultImage from "../../assets/default.webp";
const photoCompensation = (width: number, height: number) => ({
  ...(width !== height
    ? {
        ...(width < height
          ? {
              marginTop: (width - height) / 2,
            }
          : {
              marginLeft: (height - width) / 2,
            }),
      }
    : {}),
});
export const ImageWithLabel: React.FC<
  PropsWithChildren<{
    photoUrl: string | null;
    photoWidth: number;
    photoHeight: number;
    label: string | ReactNode;
    className?: string;
    imageClassName?: string;
    style?: React.CSSProperties;
  }>
> = ({
  children,
  photoWidth,
  photoUrl,
  photoHeight,
  label,
  className,
  imageClassName,
  style,
}) => {
  return (
    <div
      className={classNames(
        "max-w-sd grid aspect-square grid-cols-1 grid-rows-1 overflow-hidden rounded shadow",
        className || ""
      )}
      style={style}
    >
      <Image
        src={photoUrl || defaultImage}
        alt="default depiction"
        className={classNames(
          "col-start-1 row-start-1 transition-transform duration-300 hover:scale-110",
          !photoUrl ? "blur grayscale filter" : "",
          imageClassName || ""
        )}
        style={photoCompensation(photoWidth, photoHeight)}
        width={photoWidth}
        height={photoHeight}
      />
      {children}
      <div className="col-start-1 row-start-1 self-end">
        <div className="w-full	p-2 text-gray-100 drop-shadow  backdrop-blur backdrop-brightness-50">
          {label}
        </div>
      </div>
    </div>
  );
};
