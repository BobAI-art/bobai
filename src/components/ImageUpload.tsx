import { ChangeEventHandler, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { classNames } from "../toolbox";
import { ImageCutter } from "./ImageCutter";
import { Dialog } from "@headlessui/react";
import { ArrowUpOnSquareStackIcon } from "@heroicons/react/24/solid";

export const ImageUpload: React.FC<{
  onNewImage: (data: string) => void;
  className?: string;
}> = ({ onNewImage, className }) => {
  const [files, setFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles: string[] = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i] !== undefined) {
          const file: File | undefined = files[i];
          if (file) {
            newFiles.push(URL.createObjectURL(file));
          }
        }
      }
      setFiles((currentFiles) => [...currentFiles, ...newFiles]);

      fileInputRef.current?.value && (fileInputRef.current.value = "");
    }
  };
  const file = files[0];
  const isOpen = file !== undefined;
  return (
    <>
      <div
        className={classNames(
          "flex aspect-square cursor-pointer items-center justify-center border text-center",
          className || ""
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <ArrowUpOnSquareStackIcon className="w-4" /> Upload
      </div>
      <input
        type="file"
        accept="image/*"
        multiple={true}
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Dialog
        className="relative z-50"
        open={isOpen}
        onClose={() => console.log("close")}
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-white p-4">
            <Dialog.Title className="text-xl">
              Crop {files.length > 1 ? "images" : "image"}
            </Dialog.Title>
            <Dialog.Description className="text-md">
              Images to crop: {files.length}
            </Dialog.Description>
            {file && (
              <ImageCutter
                src={file}
                onCrop={(data) => {
                  setFiles(files.slice(1));
                  onNewImage(data);
                }}
                onError={(error) => {
                  toast.error(error);
                  setFiles(files.slice(1));
                }}
                onCancel={() => {
                  setFiles(files.slice(1));
                }}
              />
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
