"use client";

import { ImageIcon } from "lucide-react";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Image from 'next/image';

const ImagesViewer = ({ images }: { images: string[] }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Modal title='Accomplishment Report Images' isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
          {images.map((image, index) => (
            <div
              key={index}
              className="w-full h-60 relative overflow-hidden rounded-md"
            >
              <Image
                src={image}
                alt={`Image ${index + 1}`}
				fill
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </Modal>
      <div
        onClick={() => setIsOpen(true)}
        className="flex cursor-pointer text-orange-700 hover:underline items-center gap-2"
      >
        <ImageIcon className="size-4" />
        <p>{images.length} images</p>
      </div>
    </>
  );
};

export default ImagesViewer;
