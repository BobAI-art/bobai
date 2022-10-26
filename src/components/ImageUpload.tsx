import { ChangeEventHandler, useRef, useState } from "react";
import { ImageCutter } from "./ImageCutter";

export const ImageUpload: React.FC<{ onNewImage: (data: string) => void }> = ({
  onNewImage,
}) => {
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
  const file = files[0];

  return (
    <div className=" flex flex-wrap gap-2">
      {file ? (
        <div className="w-96" key={file}>
          <ImageCutter
            src={file}
            onCrop={(data) => {
              setFiles(files.slice(1));
              onNewImage(data);
            }}
            onError={(error) => {
              alert(error);
              setFiles(files.slice(1));
            }}
          />
        </div>
      ) : (
        <div
          className="flex aspect-square w-96 items-center justify-center border"
          onClick={() => fileInputRef.current?.click()}
        >
          Drop image here
        </div>
      )}
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
