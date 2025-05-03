"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Employee } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BsQuestionCircle } from "react-icons/bs";
import { Textarea } from "@/components/ui/textarea";
import { createEvaluation } from "@/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type EvaluationCriteria = {
  id: string;
  name: string;
  description: string;
  rating: number | null;
};

export function EmployeeAssessment({
  employee,
  jobTitle,
  client,
}: {
  employee: Employee;
  jobTitle: string;
  client: string;
}) {
  const router = useRouter();
  const date = new Date().toISOString().split("T")[0];
  const [comment, setComment] = useState<string>("");
  const [evaluations, setEvaluations] = useState<EvaluationCriteria[]>([
    {
      id: "1",
      name: "NHSD policies followed",
      description:
        "Adherence to all NHSD security protocols and procedures. Consistently follows established guidelines without deviation.",
      rating: null,
    },
    {
      id: "2",
      name: "Attendance/Punctuality",
      description:
        "Reliability in reporting for duty on time and maintaining good attendance record. Minimal unscheduled absences.",
      rating: null,
    },
    {
      id: "3",
      name: "Communication Skills",
      description:
        "Effectiveness in verbal and written communication. Ability to clearly convey information and document incidents accurately.",
      rating: null,
    },
    {
      id: "4",
      name: "Staff Relationship",
      description:
        "Professional interactions with colleagues and building personnel. Teamwork and cooperative attitude.",
      rating: null,
    },
    {
      id: "5",
      name: "Appearance",
      description:
        "Maintenance of professional uniform standards, grooming, and overall presentability while on duty.",
      rating: null,
    },
    {
      id: "6",
      name: "Professional Judgment",
      description:
        "Appropriate decision-making in security situations. Demonstrates sound judgment in handling incidents.",
      rating: null,
    },
    {
      id: "7",
      name: "Contributions to Positive Work Environment",
      description:
        "Positive attitude that enhances team morale. Willingness to assist others and promote workplace harmony.",
      rating: null,
    },
    {
      id: "8",
      name: "Service Oriented Attitude",
      description:
        "Helpful and courteous approach when interacting with staff and visitors. Customer service mindset.",
      rating: null,
    },
    {
      id: "9",
      name: "Conscientiousness",
      description:
        "Attention to detail and thoroughness in performing duties. Takes initiative to complete tasks properly.",
      rating: null,
    },
    {
      id: "10",
      name: "Requires Minimal Supervision",
      description:
        "Ability to work independently without constant oversight. Self-motivated and reliable.",
      rating: null,
    },
    {
      id: "11",
      name: "Responds Well to Supervision",
      description:
        "Accepts feedback and direction positively. Implements suggestions for improvement.",
      rating: null,
    },
    {
      id: "12",
      name: "Assists Administration as Requested",
      description:
        "Willingness to take on additional responsibilities when needed. Flexibility in assignments.",
      rating: null,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleRatingChange = (id: string, rating: number) => {
    setEvaluations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, rating } : item))
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const incompleteRatings = evaluations.some((e) => e.rating === null);

      if (incompleteRatings) {
        toast.error("Please rate all criteria before submitting");
        return;
      }

      const evaluationData = {
        employeeId: employee.id,
        clientId: employee.clientId,
        date: new Date(),
        average: calculateAverage(),
        summary: generateSummary(),
        comments: comment,
        ratings: evaluations.map((e) => ({
          criteria: e.name,
          description: e.description,
          rating: e.rating || 0,
          comments: "",
        })),
      };

      const res = await createEvaluation(evaluationData);

      if (res.error) {
        toast.error(res.error);
      }

      toast.success("Evaluation submitted successfully!");
      router.push(`/client/employee-management`);
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      toast.error("Failed to submit evaluation");
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = (): number => {
    const ratedItems = evaluations.filter((e) => e.rating !== null);
    if (ratedItems.length === 0) return 0;
    const sum = ratedItems.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    return parseFloat((sum / ratedItems.length).toFixed(2));
  };

  const generateSummary = (): string => {
    const average = calculateAverage();
    if (average >= 4) return "Excellent performance";
    if (average >= 3) return "Good performance";
    if (average >= 2) return "Needs improvement";
    return "Unsatisfactory performance";
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white border shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">
        Security Guard Evaluation Form
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Employee</label>
          <p className="font-semibold">
            {employee.firstName} {employee.lastName}
          </p>
        </div>
        <div className="flex flex-col items-end justify-end">
          <label className="block text-sm font-medium mb-1">Date</label>
          <p className="font-semibold">{date}</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Job Title</label>
          <p className="font-semibold">{jobTitle}</p>
        </div>
        <div className="flex flex-col items-end justify-end">
          <label className="block text-sm font-medium mb-1">Assessed By:</label>
          <p className="font-semibold">{client}</p>
        </div>
      </div>

      {/* Rating Legend */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h2 className="text-lg font-semibold mb-2 text-blue-800">
          Rating Scale
        </h2>
        <div className="grid grid-cols-5 gap-2 text-center">
          <div className="p-2 bg-blue-100 rounded">
            <p className="font-bold text-blue-800">5</p>
            <p className="text-xs text-blue-600">Excellent</p>
          </div>
          <div className="p-2 bg-blue-100 rounded">
            <p className="font-bold text-blue-800">4</p>
            <p className="text-xs text-blue-600">Very Good</p>
          </div>
          <div className="p-2 bg-blue-100 rounded">
            <p className="font-bold text-blue-800">3</p>
            <p className="text-xs text-blue-600">Good</p>
          </div>
          <div className="p-2 bg-blue-100 rounded">
            <p className="font-bold text-blue-800">2</p>
            <p className="text-xs text-blue-600">Needs Improvement</p>
          </div>
          <div className="p-2 bg-blue-100 rounded">
            <p className="font-bold text-blue-800">1</p>
            <p className="text-xs text-blue-600">Unsatisfactory</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-blue-600 text-center">
          5 is the highest rating, 1 is the lowest
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Evaluation Criteria
              </th>
              {[5, 4, 3, 2, 1].map((rating) => (
                <th
                  key={rating}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {rating}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {evaluations.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="group relative inline-block">
                    <span className="flex items-center gap-2">
                      {item.name}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <BsQuestionCircle className="text-gray-500 hover:text-gray-700" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-white text-black border max-w-xs">
                            <p>{item.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  </div>
                </td>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <td
                    key={rating}
                    className="px-4 py-4 whitespace-nowrap text-center"
                  >
                    <input
                      type="radio"
                      name={`rating-${item.id}`}
                      checked={item.rating === rating}
                      onChange={() => handleRatingChange(item.id, rating)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Additional Comments:
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1"
          placeholder="Enter any additional feedback or comments..."
          rows={4}
        />
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Evaluation Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Average Rating:</p>
            <p className="text-xl font-bold">{calculateAverage()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Overall Performance:</p>
            <p className="text-xl font-bold">{generateSummary()}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 gap-2 flex justify-end">
        <Button
          variant="ghost"
          onClick={() => router.push("/client/employee-management")}
        >
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Submit Evaluation
        </Button>
      </div>
    </div>
  );
}
