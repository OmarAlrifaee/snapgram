import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui";
type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};
const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const [, setFile] = useState<File[]>([]);
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [fieldChange]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".svg"],
    },
  });
  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col
     bg-dark-3 rounded-xl cursor-pointer"
    >
      <input
        {...getInputProps()}
        className="cursor-pointer"
      />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img
              src={fileUrl}
              alt="image"
              className="file_uploader-img"
            />
            <p className="file_uploader-label">
              Click Or Drag Photo To Replace
            </p>
          </div>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            alt="file uploader"
            width={96}
            height={77}
          />
          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag Photo Here
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

          <Button className="shad-button_dark_4">Select Files</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
