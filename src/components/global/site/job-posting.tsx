
"use client";

import { JobPosting } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselMainContainer,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
} from "@/components/global/carousel";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";

const JobPost = ({ jobPosts }: { jobPosts: JobPosting[] }) => {
  const sortedJobs = [...jobPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  const toggleDescription = (jobId: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const openModal = (job: JobPosting) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <section id="jobPosts" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Job Posts</h2>

        <Carousel className="space-y-6">
          <CarouselMainContainer className="h-[500px]">
            {sortedJobs.map((job) => (
              <SliderMainItem key={job.id} className="rounded-lg border overflow-hidden">
                <div className="relative w-full h-full cursor-pointer" onClick={() => openModal(job)}>
                  <Image
                    src={job.attachment as string}
                    alt={job.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-white font-bold text-2xl mb-2">{job.title}</h3>
                    <p className={`text-white text-sm ${expandedDescriptions[job.id] ? '' : 'line-clamp-2'}`}>
                      {job.description}
                    </p>
                    {job.description.length > 100 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDescription(job.id);
                        }}
                        className="text-secondary hover:text-secondary/80 text-sm mt-2"
                      >
                        {expandedDescriptions[job.id] ? 'Read Less' : 'Read More'}
                      </button>
                    )}
                  </div>
                </div>
              </SliderMainItem>
            ))}
          </CarouselMainContainer>

          <CarouselThumbsContainer className="grid grid-cols-3 gap-4">
            {sortedJobs.map((job, i) => (
              <SliderThumbItem key={job.id} index={i} className="rounded border h-60 cursor-pointer">
                <div className="relative w-full h-60">
                  <Image
                    src={job.attachment as string}
                    alt={job.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </SliderThumbItem>
            ))}
          </CarouselThumbsContainer>
        </Carousel>

        <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-3xl">
          {selectedJob && (
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="relative h-80">
                <Image
                  src={selectedJob.attachment as string}
                  alt={selectedJob.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-primary mb-2">{selectedJob.title}</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Posted: {format(new Date(selectedJob.createdAt), "MMMM dd, yyyy")}
                </p>
                <p className="text-gray-700 whitespace-pre-line mb-6">{selectedJob.description}</p>
                <Button className="bg-secondary text-white hover:bg-secondary/90" onClick={closeModal}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
};

export default JobPost;
