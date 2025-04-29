"use client";

import { Share, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Modal } from "../ui/modal";
import Image from "next/image";

type AttachmentModalProps = {
  attachments: string[] | string | null;
};

const AttachmentModal: React.FC<AttachmentModalProps> = ({ attachments }) => {
  const normalizedAttachments =
    typeof attachments === "string"
      ? attachments
        ? [attachments]
        : []
      : attachments || [];

  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (isOpen && normalizedAttachments.length > 0) {
      setIsLoading(true);
      let loadedCount = 0;
      normalizedAttachments.forEach((url) => {
        const img = new window.Image();
        img.src = url;
        img.onload = () => {
          loadedCount += 1;
          if (loadedCount === normalizedAttachments.length) {
            setIsLoading(false);
          }
        };
      });
    }
  }, [isOpen, normalizedAttachments]);

  const renderTrigger = () => {
    if (normalizedAttachments.length === 1) {
      const rawName = normalizedAttachments[0].split("/").pop();
      const name = rawName?.replace(/^\d+_/, "").split("?")[0];
      return (
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
          className="flex items-center hover:underline text-orange-600 gap-2"
        >
          {name}
          <Share className="h-4 w-4 text-orange-600" />
        </Link>
      );
    }

    return (
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className="flex items-center hover:underline text-orange-600 gap-2"
      >
        {normalizedAttachments.length} attachments
        <Share className="h-4 w-4 text-orange-600" />
      </Link>
    );
  };

  return (
    <>
      <Modal
        className="max-w-5xl"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="w-full max-h-[80vh] overflow-y-auto p-4 bg-gray-100 rounded-lg grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-64">
              <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
            </div>
          ) : (
            normalizedAttachments.map((url, index) => {
              const fileName = url
                .split("/")
                .pop()
                ?.replace(/^\d+_/, "")
                .split("?")[0];
              return (
                <div
                  key={index}
                  className="relative w-full aspect-video bg-white border rounded-lg overflow-hidden flex items-center justify-center"
                >
                  <Image
                    src={url}
                    alt={fileName || ""}
                    fill
                    className="object-contain"
                  />
                </div>
              );
            })
          )}
        </div>
      </Modal>

      {normalizedAttachments.length > 0 ? (
        renderTrigger()
      ) : (
        <span className="text-muted-foreground">No attachment</span>
      )}
    </>
  );
};

export default AttachmentModal;
