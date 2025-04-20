/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { deleteFromS3, upload } from "@/lib/upload";
import { Plus, Grip, Trash } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const MultipleImageUpload = ({
  onImageUpload,
  className,
  defaultValues = [],
  disabled,
  maxImages,
}: {
  onImageUpload: (urls: string[]) => void;
  defaultValues?: string[];
  className?: string;
  disabled?: boolean;
  maxImages: number;
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>(defaultValues);

  useEffect(() => {
    setImageUrls(defaultValues);
  }, [defaultValues]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg", ".jpeg"],
      "image/svg+xml": [".svg"],
      "image/webp": [".webp"],
    },
    maxFiles: maxImages,
    onDrop: async (acceptedFiles: File[]) => {
      const sizeErrors = acceptedFiles.filter(
        (file) => file.size > 5 * 1024 * 1024
      );

      const totalFiles = imageUrls.length + acceptedFiles.length;

      if (totalFiles > maxImages) {
        toast.error(`You can only upload up to ${maxImages} images.`);
        console.error("Total files exceed limit.");
        return;
      }

      if (sizeErrors.length) {
        toast.error(`${sizeErrors.length} files exceed 5MB size limit.`);
        console.error("File size exceeds limit.");
        return;
      }

      const newUrls = [...imageUrls];
      for (const file of acceptedFiles) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Please upload smaller images (max 5MB).");
          console.error("File size exceeds limit.");
          return;
        }

        const previewUrl = URL.createObjectURL(file);
        newUrls.push(previewUrl);
        setImageUrls([...newUrls]);

        try {
          toast.loading("Uploading image...");
          const { url } = await upload(file);
          toast.success("Image uploaded successfully!");

          const index = newUrls.indexOf(previewUrl);
          if (index > -1) newUrls[index] = url;

          setImageUrls([...newUrls]);
          onImageUpload([...newUrls]);
          toast.dismiss();
        } catch (error) {
          setImageUrls((prev) => prev.filter((img) => img !== previewUrl));
          toast.error("Image upload failed.");
          console.error(error);
        }
      }
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ errors }) => {
        errors.forEach((error) => {
          toast.error(error.message);
        });
      });
    },
  });

  const handleRemoveImage = async (index: number) => {
    const urlToRemove = imageUrls[index];

    if (urlToRemove.startsWith("https://")) {
      // URL is from S3, proceed with deletion
      try {
        const response = await deleteFromS3(urlToRemove);

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success("Image deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete image from S3.");
        console.error("Error deleting image:", error);
        return;
      }
    }

    // Update local state regardless of deletion outcome
    const updatedImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedImages);
    onImageUpload(updatedImages);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedImages = Array.from(imageUrls);
    const [movedImage] = updatedImages.splice(result.source.index, 1);
    updatedImages.splice(result.destination.index, 0, movedImage);

    setImageUrls(updatedImages);
    onImageUpload(updatedImages);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="images" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(`flex items-center gap-3`, className)}
          >
            {imageUrls.map((url, index) => (
              <Draggable key={url} draggableId={url} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="relative bg-zinc-100 flex items-center w-32 h-[120px] rounded-md overflow-hidden border border-input"
                  >
                    {/* Grip Icon */}
                    <div
                      {...provided.dragHandleProps}
                      className="p-2 cursor-grab"
                    >
                      <Grip className="h-4 w-4 text-gray-600" />
                    </div>

                    {/* Image */}
                    <div className="relative w-full h-full">
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 z-20">
                          Main Image
                        </div>
                      )}
                      <div className="z-10 absolute top-1 right-1">
                        <Button
                          variant="destructive"
                          type="button"
                          size="sm"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                      <Image
                        src={url}
                        alt={`Uploaded image ${index + 1}`}
                        className="object-cover w-full h-full"
                        fill
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}

            {imageUrls.length < maxImages && (
              <div
                {...getRootProps({
                  className: `w-32 h-[120px] mx-2 border-[2px] rounded-md border-dashed border-input flex items-center justify-center flex-col ${
                    disabled
                      ? "pointer-events-none opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`,
                })}
              >
                <input {...getInputProps()} />
                <Plus className="w-5 h-5 text-gray-600" />
                <p className="mt-1 text-sm text-muted-foreground">Add Photo</p>
                <p className="text-xs text-muted-foreground">
                  ({imageUrls.length}/{maxImages})
                </p>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default MultipleImageUpload;
