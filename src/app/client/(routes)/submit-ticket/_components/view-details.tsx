import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Column } from "./column";
import {
  Calendar,
  CircleHelp,
  Clock,
  CreditCard,
  FileText,
  User,
  Wrench,
  AlertTriangle,
  ArrowDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TicketBadge } from "@/components/global/ticket-badge";

interface ViewDetailsProps {
  data: Column;
  onClose: () => void;
}

export const ViewDetails = ({ data, onClose }: ViewDetailsProps) => {
  // Icon mappings
  const typeIcons = {
    technical: <Wrench className="w-4 h-4" />,
    billing: <CreditCard className="w-4 h-4" />,
    general: <CircleHelp className="w-4 h-4" />,
    employee: <User className="w-4 h-4" />,
    other: <FileText className="w-4 h-4" />,
  };

  const priorityIcons = {
    low: <ArrowDown className="w-4 h-4" />,
    medium: <AlertCircle className="w-4 h-4" />,
    high: <AlertTriangle className="w-4 h-4" />,
    critical: <AlertTriangle className="w-4 h-4" />,
  };

  const statusIcons = {
    Open: <Clock className="w-4 h-4" />,
    InProgress: <Clock className="w-4 h-4" />,
    Resolved: <CheckCircle className="w-4 h-4" />,
    Closed: <CheckCircle className="w-4 h-4" />,
  };

  return (
    <div className="space-y-4">
      {/* Basic Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ticket Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Title & Type */}
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">Title:</span>
              </div>
              <p className="text-sm pl-6 break-words">{data.title}</p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm">
                {typeIcons[data.type]}
                <span className="font-medium whitespace-nowrap">Type:</span>
              </div>
              <div className="pl-6">
                <TicketBadge variant="outline" className="capitalize">
                  {data.type}
                </TicketBadge>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm">
                {statusIcons[data.ticketStatus]}
                <span className="font-medium whitespace-nowrap">Status:</span>
              </div>
              <div className="pl-6">
                <TicketBadge
                  variant={
                    data.ticketStatus === "Resolved" ? "success" : "outline"
                  }
                  className="capitalize"
                >
                  {data.ticketStatus}
                </TicketBadge>
              </div>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm">
                {priorityIcons[data.priority]}
                <span className="font-medium whitespace-nowrap">Priority:</span>
              </div>
              <div className="pl-6">
                <TicketBadge
                  variant={
                    data.priority === "high" || data.priority === "critical"
                      ? "destructive"
                      : "outline"
                  }
                  className="capitalize"
                >
                  {data.priority}
                </TicketBadge>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">Created:</span>
              </div>
              <p className="text-sm pl-6">{data.createdAt}</p>
            </div>
            {data.employee?.name && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">
                    Assigned To:
                  </span>
                </div>
                <p className="text-sm pl-6 break-words">{data.employee.name}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description Card */}
      <Card>
        <CardContent className='p-5'>
          <p className="text-muted-foreground whitespace-pre-line">
            {data.description || "No description provided"}
          </p>
        </CardContent>
      </Card>

      {/* Attachments Card */}
      {data.attachments.length > 0 && (
        <Card>
          <CardContent className='p-5'>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.attachments.map((image, index) => {
                return (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={image}
                        alt={image}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button asChild>
          <Link href={`/client/submit-ticket/${data.id}`}>Edit Ticket</Link>
        </Button>
      </div>
    </div>
  );
};
