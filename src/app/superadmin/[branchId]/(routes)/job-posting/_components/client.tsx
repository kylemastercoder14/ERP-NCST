import React from "react";
import { JobPosting } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import Image from "next/image";
import { CellAction } from './cell-action';

const JobPostingClient = ({
  data,
  department,
}: {
  data: JobPosting[];
  department: string | null;
}) => {
  return (
    <div className="mt-5 grid lg:grid-cols-3 grid-cols-1 gap-5">
      {data.map((job) => {
        const formattedDate = format(new Date(job.createdAt), "MMMM dd, yyyy");
        return (
          <Card key={job.id} className="p-0">
            <CardContent className="p-0">
              <div className="relative w-full h-[40vh]">
                <Image
                  src={job.attachment as string}
                  alt="Job Image"
                  fill
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="p-4 mt-3">
                <div className="flex">
                  <h3 className="font-semibold text-xl">{job.title}</h3>
                  <CellAction
                    id={job.id}
                    departmentSession={department as string}
                  />
                </div>
                <p className='mt-2 text-sm'><b>Date Posted:</b> {formattedDate}</p>
                <p className="mt-2 text-muted-foreground line-clamp-4">{job.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default JobPostingClient;
