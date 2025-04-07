"use client";

import { Share, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Modal } from "../ui/modal";
import Image from "next/image";

const AttachmentModal = ({
  attachmentUrl,
}: {
  attachmentUrl: string | null;
}) => {
  const fileName = attachmentUrl ? attachmentUrl.split("/").pop() : null;
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && attachmentUrl) {
      setIsLoading(true);
      const img = new window.Image();
      img.src = attachmentUrl;
      img.onload = () => {
        setIsLoading(false);
      };
    }
  }, [isOpen, attachmentUrl]);

  return (
    <>
      <Modal
        className="max-w-3xl"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="relative w-full h-[700px] flex items-center justify-center bg-gray-100 rounded-lg">
          {isLoading ? (
            <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
          ) : (
            <Image
              src={attachmentUrl || ""}
              alt={fileName || ""}
              fill
              className="w-full h-full object-contain rounded-lg"
            />
          )}
        </div>
      </Modal>
      {attachmentUrl ? (
        <Link
          href={"#"}
          onClick={() => setIsOpen(true)}
          className="flex items-center hover:underline text-orange-600 gap-2"
        >
          {fileName}
          <Share className="h-4 w-4 text-orange-600" />
        </Link>
      ) : (
        <span className="text-muted-foreground">No attachment</span>
      )}
    </>
  );
};

export default AttachmentModal;
