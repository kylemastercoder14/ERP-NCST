"use client";

import { File as FileIcon, X } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { upload } from "@/lib/upload";
import { Button } from "@/components/ui/button";

interface FileInputProps {
  onFileUpload: (url: string) => void;
  defaultValue?: string;
  fileType?: "image" | "document" | "contract";
  maxSizeMB?: number;
  accept?: Record<string, string[]>;
  label?: string;
}

const FileInput = ({
  onFileUpload,
  defaultValue = "",
  fileType = "document",
  maxSizeMB = 10,
  accept = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
  },
  label = "Drop your file here",
}: FileInputProps) => {
  const [fileUrl, setFileUrl] = useState<string>(defaultValue);
  const [fileName, setFileName] = useState<string>("");

  // Set default accept based on fileType
  const defaultAccept = {
    image: {
      "image/png": [".png"],
      "image/jpg": [".jpg", ".jpeg"],
      "image/svg+xml": [".svg"],
      "image/webp": [".webp"],
    },
    document: accept,
    contract: {
      "application/pdf": [".pdf"],
    },
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: defaultAccept[fileType],
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        toast.error("Unsupported file type.");
        return;
      }

      const file = acceptedFiles[0];

      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File too large. Max size is ${maxSizeMB}MB.`);
        return;
      }

      // Generate timestamp for filename
      const now = new Date();
      const formattedTimestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;

      const fileExtension = file.name.split(".").pop();
      const newFileName = `${fileType}_${formattedTimestamp}.${fileExtension}`;
      const renamedFile = new window.File([file], newFileName, { type: file.type });

      const toastId = toast.loading("Uploading file...");

      try {
        // Simulate upload progress (remove this in production)
        for (let i = 0; i <= 100; i++) {
          await new Promise((resolve) => setTimeout(resolve, 30));
        }

        const { url } = await upload(renamedFile);

        toast.dismiss(toastId);
        toast.success("File uploaded successfully!");
        setFileUrl(url);
        setFileName(file.name);
        onFileUpload(url);
      } catch (error) {
        setFileUrl("");
        setFileName("");
        toast.dismiss(toastId);
        toast.error("File upload failed.");
        console.error(error);
      }
    },
  });

  const handleRemoveFile = () => {
    setFileUrl("");
    setFileName("");
    toast.info("File removed.");
    onFileUpload("");
  };

  const getFileIcon = () => {
    if (!fileUrl) return <FileIcon className="w-10 h-10 text-green-500" />;

    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return <FileIcon className="w-10 h-10 text-red-500" />;
      case "doc":
      case "docx":
        return <FileIcon className="w-10 h-10 text-blue-500" />;
      default:
        return <FileIcon className="w-10 h-10 text-green-500" />;
    }
  };

  return (
    <div className="rounded-xl w-full">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer dark:bg-neutral-800 bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {fileUrl ? (
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              {getFileIcon()}
              <Button
                variant="destructive"
                type="button"
                size="icon"
                className="absolute -top-3 -right-3"
                onClick={handleRemoveFile}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-center max-w-[200px] truncate">
              {fileName}
            </p>
          </div>
        ) : (
          <>
            {getFileIcon()}
            <p className="mt-2 text-sm text-slate-400">{label}</p>
            <p className="text-xs text-slate-500">Max size: {maxSizeMB}MB</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileInput;
