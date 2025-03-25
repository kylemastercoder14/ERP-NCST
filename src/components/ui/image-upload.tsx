"use client";

import { Inbox, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { upload } from "@/lib/upload";
import { Button } from "@/components/ui/button";

const ImageUpload = ({
  onImageUpload,
  defaultValue = "",
}: {
  onImageUpload: (url: string) => void;
  defaultValue?: string;
}) => {
  const [imageUrl, setImageUrl] = useState<string>(defaultValue);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg", ".jpeg"],
      "image/svg+xml": [".svg"],
      "image/webp": [".webp"],
    },
    maxFiles: 1, // Accept only one file
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 1) {
        toast.error("You can only upload one image.");
        return;
      }

      // eslint-disable-next-line prefer-const
      let file = acceptedFiles[0];

      if (file.size > 10 * 1024 * 1024) {
        toast.error("Please upload a smaller image.");
        return;
      }

      // Get file extension
      const fileExtension = file.name.split(".").pop();

      // Get current timestamp and format it to MM-DD-YYYY-HH-MM-SS
      const now = new Date();
      const formattedTimestamp = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate()
      ).padStart(2, "0")}-${now.getFullYear()}-${String(
        now.getHours()
      ).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(
        now.getSeconds()
      ).padStart(2, "0")}`;

      const newFileName = `${formattedTimestamp}.${fileExtension}`;

      // Rename the file by creating a new File object
      const renamedFile = new File([file], newFileName, { type: file.type });

      // Show initial loading toast and get the toast id
      const toastId = toast.loading("Uploading image...");

      try {
        // Simulate upload progress
        for (let i = 0; i <= 100; i++) {
          await new Promise((resolve) => setTimeout(resolve, 30));
        }

        // Simulate the upload process and get the URL
        const { url } = await upload(renamedFile);

        // Dismiss the loading toast and show success
        toast.dismiss(toastId);
        toast.success("Image uploaded successfully!");
        setImageUrl(url);
        onImageUpload(url);
      } catch (error) {
        setImageUrl("");
        toast.dismiss(toastId);
        toast.error("Image upload failed.");
        console.error(error);
      }
    },
  });

  const handleRemoveImage = () => {
    setImageUrl("");
    toast.info("Image removed.");
    onImageUpload("");
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
        {imageUrl ? (
          <div className="relative w-[100px] h-[100px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-0 right-0">
              <Button
                variant="destructive"
                type="button"
                size="icon"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Image
              src={imageUrl}
              alt="Uploaded Image"
              className="object-cover"
              fill
            />
          </div>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-green-500" />
            <p className="mt-2 text-sm text-slate-400">Drop your image here.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
