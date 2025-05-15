/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { AccomplishmentReportWithProps } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { viewedNotificationOperations } from "@/actions";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Client = ({ data }: { data: AccomplishmentReportWithProps[] }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedNotification, setSelectedNotification] =
    React.useState<AccomplishmentReportWithProps | null>(null);

  const handleClick = async (notification: AccomplishmentReportWithProps) => {
    setSelectedNotification(notification);
    setIsOpen(true);
    await viewedNotificationOperations(notification.id);
    router.refresh();
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {selectedNotification && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              {selectedNotification.Employee.firstName}{" "}
              {selectedNotification.Employee.lastName}'s Report
            </h2>
            <p>
              <strong>Title:</strong> {selectedNotification.report}
            </p>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              {selectedNotification.images.map((image, index) => (
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
          </div>
        )}
      </Modal>
      {data.length === 0 ? (
        <div className="flex flex-col max-w-4xl gap-y-4 mt-5">
          <p className="text-muted-foreground">No notifications found.</p>
        </div>
      ) : (
        <div className="flex flex-col max-w-4xl gap-y-4 mt-5">
          {data.map((notification) => {
            return (
              <div
                onClick={() => handleClick(notification)}
                className="flex items-start cursor-pointer hover:bg-neutral-50/70 rounded-md transition gap-3 py-3 px-3"
                key={notification.id}
              >
                <Avatar className="size-12">
                  <AvatarFallback>
                    {notification.Employee.firstName.charAt(0)}
                    {notification.Employee.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm text-muted-foreground">
                    <strong className="text-black">
                      {notification.Employee.firstName}{" "}
                      {notification.Employee.lastName}
                    </strong>{" "}
                    submitted a report entitled{" "}
                    <strong className="text-black">
                      "{notification.report}"{" "}
                    </strong>
                    with{" "}
                    <strong className="text-black">
                      {notification.images.length} attachment/s
                    </strong>
                  </div>
                  <div className="text-xs flex items-center gap-1 text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.date), {
                      addSuffix: true,
                    })}
                    {!notification.isViewed && (
                      <div className="size-1 rounded-full bg-neutral-300" />
                    )}
                    <span>{notification.isViewed ? "" : "Unread"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Client;
