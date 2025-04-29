/* eslint-disable react/no-unescaped-entities */
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { submitApplication } from "@/actions";
import { uploadFile } from "@/lib/upload";

// Form validation schema
const applyFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  branch: z.string().min(1, "Branch is required"),
  resume: z.any().refine((files) => files.length > 0, "Resume is required"),
});

type ApplyFormValues = z.infer<typeof applyFormSchema>;

const ApplyNowForm = ({
  jobTitle,
  onClose,
  jobPostId,
}: {
  jobTitle: string;
  onClose: () => void;
  jobPostId: string;
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ApplyFormValues>({
    resolver: zodResolver(applyFormSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onSubmit = async (data: ApplyFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const file = data.resume[0];

      let uploadedUrl;
      try {
        uploadedUrl = await uploadFile(file);
      } catch (uploadError) {
        console.error("File upload failed", uploadError);
        toast.error("Failed to upload resume. Please try again.");
        setIsSubmitting(false);
        return; // Stop here if upload fails
      }

      const res = await submitApplication(
        {
          ...data,
          resume: uploadedUrl.url,
        },
        jobPostId as string
      );

      if (res.success) {
        setSubmitSuccess(true);
        reset();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center p-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Application Submitted!
        </h3>
        <p className="text-sm text-gray-500">
          Thank you for applying to BAT Security Services INC. We'll review your
          application and get back to you soon.
        </p>
        <div className="mt-6">
          <Button
            onClick={() => {
              setSubmitSuccess(false);
              onClose();
            }}
            className="bg-secondary hover:bg-secondary/90"
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-2">
        Apply for {jobTitle}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              placeholder="John"
              className="mt-1"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              placeholder="Doe"
              className="mt-1"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="john.doe@example.com"
            className="mt-1"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="branch">Branch</Label>
          <Controller
            name="branch"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cavite">Cavite</SelectItem>
                  <SelectItem value="Batangas">Batangas</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.branch && (
            <p className="mt-1 text-sm text-red-600">{errors.branch.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="resume">Resume (PDF, DOC, DOCX)</Label>
          <div className="mt-1">
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              {...register("resume")}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-secondary file:text-white
                hover:file:bg-secondary/90"
            />
          </div>
          {errors.resume && (
            <p className="mt-1 text-sm text-red-600">{errors.resume.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-primary text-primary hover:bg-primary/10"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-secondary text-white hover:text-white hover:bg-secondary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

const JobPost = ({ jobPosts }: { jobPosts: JobPosting[] }) => {
  // Sort job posts by date (newest first)
  const sortedJobs = [...jobPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Get the latest job (for main carousel)
  const latestJob = sortedJobs[0];
  // Get remaining jobs (for thumbnails)
  const otherJobs = sortedJobs.slice(1);

  // State for expanded/collapsed descriptions
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});

  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplyNowModalOpen, setIsApplyNowModalOpen] = useState(false);
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

  const openApplyNowModal = () => {
    setIsApplyNowModalOpen(true);
    setIsModalOpen(false);
  };

  return (
    <section id="jobPosts" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Job Posts</h2>

        {/* Carousel Section */}
        <Carousel
          orientation="vertical"
          className="flex items-center gap-2 mb-12"
        >
          <div className="relative basis-3/4">
            <CarouselMainContainer className="h-[500px]">
              {latestJob && (
                <SliderMainItem
                  key={latestJob.id}
                  className="border border-muted rounded-md overflow-hidden"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={latestJob.attachment as string}
                      alt={latestJob.title}
                      fill
                      className="object-cover cursor-pointer"
                      onClick={() => openModal(latestJob)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-white font-bold text-2xl">
                          {latestJob.title}
                        </h3>
                        <div className="relative">
                          <p
                            className={`text-white/80 transition-all duration-300 ${expandedDescriptions[latestJob.id] ? "" : "line-clamp-2"}`}
                          >
                            {latestJob.description}
                          </p>
                          {latestJob.description.length > 100 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDescription(latestJob.id);
                              }}
                              className="text-secondary hover:text-secondary/80 text-sm font-medium mt-1 focus:outline-none"
                            >
                              {expandedDescriptions[latestJob.id]
                                ? "Read Less"
                                : "Read More"}
                            </button>
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-white text-sm">
                            Posted:{" "}
                            {format(
                              new Date(latestJob.createdAt),
                              "MMMM dd, yyyy"
                            )}
                          </span>
                          <Button
                            className="bg-secondary text-white hover:text-white hover:bg-secondary/90"
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(latestJob);
                            }}
                          >
                            View Details &rarr;
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SliderMainItem>
              )}
            </CarouselMainContainer>
          </div>

          {/* Thumbnail Navigation */}
          <CarouselThumbsContainer className="h-[500px] basis-1/4">
            {otherJobs.map((job, index) => {
              const formattedDate = format(new Date(job.createdAt), "MMM dd");
              return (
                <SliderThumbItem
                  key={job.id}
                  index={index}
                  className="rounded-md bg-transparent"
                >
                  <div
                    className="border border-muted flex flex-col h-full w-full rounded-md cursor-pointer bg-background overflow-hidden"
                    onClick={() => openModal(job)}
                  >
                    <div className="relative h-24 w-full">
                      <Image
                        src={job.attachment as string}
                        alt={job.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                      <h4 className="font-medium text-sm line-clamp-1">
                        {job.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formattedDate}
                      </p>
                      <div className="mt-2 flex-grow relative">
                        <p
                          className={`text-xs text-muted-foreground transition-all duration-300 ${expandedDescriptions[job.id] ? "" : "line-clamp-2"}`}
                        >
                          {job.description}
                        </p>
                        {job.description.length > 50 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDescription(job.id);
                            }}
                            className="text-secondary hover:text-secondary/80 text-xs font-medium mt-1 focus:outline-none"
                          >
                            {expandedDescriptions[job.id]
                              ? "Read Less"
                              : "Read More"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </SliderThumbItem>
              );
            })}
          </CarouselThumbsContainer>
        </Carousel>

        {/* Job Detail Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-4xl">
          {selectedJob && (
            <div className="bg-white rounded-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="relative h-[500px] w-full">
                <Image
                  src={selectedJob.attachment as string}
                  alt={selectedJob.title}
                  fill
                  className="object-contain rounded-t-lg"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  {selectedJob.title}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Posted:{" "}
                  {format(new Date(selectedJob.createdAt), "MMMM dd, yyyy")}
                </p>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedJob.description}
                  </p>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={closeModal}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={openApplyNowModal}
                    className="bg-secondary hover:bg-secondary/90"
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Apply Now Modal */}
        <Modal
          isOpen={isApplyNowModalOpen}
          onClose={() => setIsApplyNowModalOpen(false)}
          className="max-w-2xl"
        >
          {selectedJob && (
            <ApplyNowForm
              onClose={() => setIsApplyNowModalOpen(false)}
              jobTitle={selectedJob.title}
              jobPostId={selectedJob.id}
            />
          )}
        </Modal>
      </div>
    </section>
  );
};

export default JobPost;
