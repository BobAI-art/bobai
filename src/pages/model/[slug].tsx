import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { AppRouterTypes, trpc } from "../../utils/trpc";
import { ArrowsPointingInIcon } from "@heroicons/react/24/solid";
import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { classNames } from "../../toolbox";
import Button from "../../components/Button";

const imagesNeeded = {
  "full-body": 3,
  "upper-body": 5,
  face: 12,
};
const allImages = Object.values(imagesNeeded).reduce((a, b) => a + b, 0);

const ImageCutter: React.FC<{ src: string }> = ({ src }) => {
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

  useEffect(() => {
    const moveHandler = (e: MouseEvent) => {
      if (isDND && !isResizing) {
        handleMove(e.movementX, e.movementY);
      }
      if (isResizing) {
        handleResize(e.movementX);
      }
    };
    document.addEventListener("mousemove", moveHandler);
    return () => {
      document.removeEventListener("mousemove", moveHandler);
    };
  }, [isDND, isResizing, handleMove, handleResize]);

  useEffect(() => {
    const handler = () => {
      setIsDND(false);
      setIsResizing(false);
    };
    document.addEventListener("mouseup", handler);

    () => {
      document.removeEventListener("mouseup", handler);
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
      console.log(canvas.toDataURL());
    }
  };

  return (
    <>
      <div className="relative flex select-none items-center justify-center rounded-md border border-2 border-gray-300">
        <img ref={imageRef} src={src} className="w-max blur-sm" />
        <div
          ref={maskRef}
          onMouseDown={() => setIsDND(true)}
          style={{
            transform: `translate(${x}px, ${y}px)`,
            width: width !== undefined ? `${width}px` : "100%",
          }}
          className="outline-3 absolute top-0 left-0 aspect-square outline-dashed outline-gray-700 filter"
        >
          <div
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${imageWidth}px ${imageHeight}px`,
              backgroundPosition: `-${x}px -${y}px`,
            }}
            className={classNames(
              "absolute top-0 left-0 h-full w-full cursor-move "
              // isDND ? "opacity-40" : "opacity-50"
            )}
          />
          <div
            onMouseDown={() => setIsResizing(true)}
            className={classNames(
              "absolute -right-2 -bottom-2 h-4 w-4 cursor-nw-resize outline-dashed",
              isResizing ? " outline-gray-500" : " outline-gray-700"
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

const ImageUpload: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles: string[] = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i] !== undefined) {
          const file: File = files[i]!;
          newFiles.push(URL.createObjectURL(file));
        }
      }
      setFiles((currentFiles) => [...currentFiles, ...newFiles]);

      fileInputRef.current?.value && (fileInputRef.current.value = "");
    }
  };
  return (
    <div className=" flex flex-wrap gap-2">
      {files.map((file) => (
        <div className="w-96" key={file}>
          <ImageCutter src={file} />
        </div>
      ))}

      <div
        className="flex h-[400px] w-[400px] items-center justify-center border"
        onClick={() => fileInputRef.current?.click()}
      >
        Drop image here
      </div>
      <input
        type="file"
        accept="image/*"
        multiple={true}
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

const ModelPhotos: React.FC<{
  model: NonNullable<AppRouterTypes["model"]["get"]["output"]>;
}> = ({ model }) => {
  const photos = trpc.trainingPhoto.list.useQuery(model.slug);
  if (photos.isLoading || !photos.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Model Photos: {photos.data.length}/{allImages}
      <ImageUpload />
    </div>
  );
};

const ModelBySlug: NextPage = () => {
  const router = useRouter();
  useSession({
    required: true,
  });
  const slug = router.query.slug as string;

  const model = trpc.model.get.useQuery(slug);

  if (model.isLoading) {
    return <>Loading...</>;
  }
  if (!model.data) {
    return <>Model not found</>;
  }

  return (
    <Layout>
      <h2 className="text-2xl font-extrabold leading-normal tracking-tight">
        Model {model.data.slug}
      </h2>
      <ModelPhotos model={model.data} />
    </Layout>
  );
};

export default ModelBySlug;
