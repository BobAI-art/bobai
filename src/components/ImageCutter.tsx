import { ArrowsPointingInIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useRef, useState } from "react";
import { classNames } from "../toolbox";
import Button from "./Button";
import { useOnMove } from "../hooks/useOnMove";

export const ImageCutter: React.FC<{
  src: string;
  onCrop: (data: string) => void;
  onError: (error: string) => void;
}> = ({ src, onCrop, onError }) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState<number | undefined>();
  const [isDND, setIsDND] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageWidth = imageRef.current?.clientWidth || 0;
  const imageHeight = imageRef.current?.clientHeight || 0;

  const handleImageLoad = useCallback(() => {
    const newWidth = Math.min(
      imageRef.current?.clientWidth || 0,
      imageRef.current?.clientHeight || 0
    );
    if (
      Math.min(
        imageRef.current?.naturalWidth || 0,
        imageRef.current?.naturalHeight || 0
      ) < 512
    ) {
      onError("Image is too small. Minimum size is 512x512");
      return;
    }
    setWidth(newWidth);

    setX((imageRef.current?.clientWidth || 0) / 2 - newWidth / 2);
    setY((imageRef.current?.clientHeight || 0) / 2 - newWidth / 2);
  }, [imageRef, onError]);

  const handleMove = useCallback(
    (dx: number, dy: number) => {
      const maskSize = maskRef.current?.clientWidth || 0;
      const imageWidth = imageRef.current?.clientWidth || 0;
      const imageHeight = imageRef.current?.clientHeight || 0;
      setX((x) => Math.min(Math.max(x + dx, 0), imageWidth - maskSize));
      setY((y) => Math.min(Math.max(y + dy, 0), imageHeight - maskSize));
    },
    [maskRef, imageRef]
  );
  const scale =
    (imageRef.current?.naturalWidth || 0) / (imageRef.current?.width || 1);

  const handleResize = useCallback(
    (dx: number) => {
      const imageWidth = imageRef.current?.clientWidth || 0;

      setWidth((width) =>
        Math.min(
          Math.max((width || imageWidth) + dx, 512 / scale),
          imageWidth - x
        )
      );
    },
    [scale, x]
  );

  useOnMove(handleMove, isDND && !isResizing);
  useOnMove(handleResize, isResizing);

  useEffect(() => {
    const handler = () => {
      setIsDND(false);
      setIsResizing(false);
    };
    document.addEventListener("mouseup", handler);
    document.addEventListener("touchend", handler);

    () => {
      document.removeEventListener("mouseup", handler);
      document.removeEventListener("touchend", handler);
    };
  }, []);

  const handleCrop = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (canvas && image) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = 512;
        canvas.height = 512;

        ctx.drawImage(
          image,
          x * scale,
          y * scale,
          width ? width * scale : image.naturalWidth,
          width ? width * scale : image.naturalWidth,
          0,
          0,
          canvas.width,
          canvas.height
        );
      }
      onCrop(canvas.toDataURL());
    }
  };

  return (
    <>
      <div className="relative flex select-none items-center justify-center rounded-md border border-2 border-gray-300">
        <picture>
          <source srcSet={src} />
          <img
            ref={imageRef}
            className="w-max blur-sm"
            onLoad={handleImageLoad}
            alt="Image to crop"
          />
        </picture>
        <div
          ref={maskRef}
          onTouchStart={() => setIsDND(true)}
          onMouseDown={() => setIsDND(true)}
          onDoubleClick={handleCrop}
          style={{
            transform: `translate(${x}px, ${y}px)`,
            width: width !== undefined ? `${width}px` : "0",
            backgroundImage: `url(${src})`,
            backgroundSize: `${imageWidth}px ${imageHeight}px`,
            backgroundPosition: `-${x}px -${y}px`,
          }}
          className={classNames(
            "outline-3 absolute top-0 left-0 aspect-square cursor-move outline-dashed filter",
            isDND ? "outline-gray-500" : " outline-gray-700"
          )}
        >
          <div
            onMouseDown={() => setIsResizing(true)}
            onTouchStart={() => setIsResizing(true)}
            className={classNames(
              "absolute -right-2 -bottom-2 h-4 w-4 cursor-nw-resize outline-dashed",
              isResizing ? "outline-gray-500" : " outline-gray-700"
            )}
          ></div>
        </div>
      </div>
      <Button onClick={handleCrop} className="m-2">
        <ArrowsPointingInIcon className="w-4" />
        Crop
      </Button>
      <canvas ref={canvasRef} width={512} height={512} className="hidden" />
    </>
  );
};
