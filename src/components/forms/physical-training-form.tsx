"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BsQuestionCircle } from "react-icons/bs";
import { Textarea } from "@/components/ui/textarea";
import { sendTrainingStatus } from "@/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TrainingStatus } from "@/types";

type EvaluationCriteria = {
  id: string;
  name: string;
  description: string;
  rating: number | null;
};

export function PhysicalTrainingForm({
  employeeId,
  employeeName,
  jobTitle,
  assessor,
  onClose,
  currentStatus,
}: {
  employeeId: string;
  employeeName: string;
  jobTitle: string;
  assessor: string;
  onClose: () => void;
  currentStatus: TrainingStatus;
}) {
  const router = useRouter();
  const date = new Date().toISOString().split("T")[0];
  const [comment, setComment] = useState<string>("");
  const [evaluations, setEvaluations] = useState<EvaluationCriteria[]>([
    {
      id: "1",
      name: "Firearm Handling Proficiency",
      description:
        "Demonstrates safe and proper handling, loading, unloading, and maintenance of assigned firearms. Shows mastery of weapon systems.",
      rating: null,
    },
    {
      id: "2",
      name: "Marksmanship Accuracy",
      description:
        "Accuracy in hitting targets at various distances. Proper stance, grip, sight alignment, and trigger control during live fire exercises.",
      rating: null,
    },
    {
      id: "3",
      name: "Tactical Movement",
      description:
        "Effective movement techniques during tactical scenarios including cover usage, room clearing, and team coordination.",
      rating: null,
    },
    {
      id: "4",
      name: "Physical Fitness",
      description:
        "Meets required physical standards including strength, endurance, and agility. Completes obstacle courses and defensive tactics drills effectively.",
      rating: null,
    },
    {
      id: "5",
      name: "Defensive Tactics",
      description:
        "Proficiency in hand-to-hand combat, restraint techniques, and non-lethal force options. Demonstrates control and proper escalation.",
      rating: null,
    },
    {
      id: "6",
      name: "Emergency Response",
      description:
        "Speed and effectiveness in responding to simulated emergencies including active shooter scenarios and medical situations.",
      rating: null,
    },
    {
      id: "7",
      name: "Equipment Proficiency",
      description:
        "Proper use and maintenance of all assigned tactical gear including radios, restraints, protective equipment, and less-lethal options.",
      rating: null,
    },
    {
      id: "8",
      name: "Situational Awareness",
      description:
        "Maintains constant environmental awareness during exercises. Identifies and properly responds to potential threats.",
      rating: null,
    },
    {
      id: "9",
      name: "Stress Management",
      description:
        "Performance under pressure during high-stress simulations. Maintains composure and follows protocols in crisis situations.",
      rating: null,
    },
    {
      id: "10",
      name: "Team Coordination",
      description:
        "Effective communication and coordination with other team members during tactical exercises. Follows commands and supports teammates.",
      rating: null,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleRatingChange = (id: string, rating: number) => {
    setEvaluations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, rating } : item))
    );
  };

  const calculateAverage = (): number => {
    const ratedItems = evaluations.filter((e) => e.rating !== null);
    if (ratedItems.length === 0) return 0;
    const sum = ratedItems.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    return parseFloat((sum / ratedItems.length).toFixed(2));
  };

  const generateSummary = (): string => {
    const average = calculateAverage();
    if (average >= 4.5) return "Exceptional tactical readiness";
    if (average >= 4) return "Highly proficient security skills";
    if (average >= 3) return "Meets security standards";
    if (average >= 2) return "Needs additional training";
    return "Unsatisfactory performance - Retraining required";
  };

  const averageRating = calculateAverage();
  const status = averageRating >= 3.0 ? "Passed" : "Failed";

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const incompleteRatings = evaluations.some((e) => e.rating === null);

      if (incompleteRatings) {
        toast.error("Please rate all criteria before submitting");
        return;
      }

      const evaluationData = {
        average: calculateAverage(),
        summary: generateSummary(),
        comments: comment,
        ratings: evaluations.map((e) => ({
          rating: e.rating || 0,
          comments: "",
        })),
      };

      const res = await sendTrainingStatus(
        currentStatus,
        employeeId,
        status,
        "",
        JSON.stringify(evaluationData)
      );

      if (res.error) {
        toast.error(res.error);
      }

      toast.success("Assessment submitted successfully!");
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Failed to submit assessment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl h-[90vh] overflow-y-auto mx-auto p-6 bg-white border shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">
        Security Guard Physical Training Assessment
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Security Officer
          </label>
          <p className="font-semibold">{employeeName}</p>
        </div>
        <div className="flex flex-col items-end justify-end">
          <label className="block text-sm font-medium mb-1">Date</label>
          <p className="font-semibold">{date}</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <p className="font-semibold">{jobTitle}</p>
        </div>
        <div className="flex flex-col items-end justify-end">
          <label className="block text-sm font-medium mb-1">Assessed By:</label>
          <p className="font-semibold">{assessor}</p>
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
            <p className="text-xs text-blue-600">Expert</p>
          </div>
          <div className="p-2 bg-blue-100 rounded">
            <p className="font-bold text-blue-800">4</p>
            <p className="text-xs text-blue-600">Proficient</p>
          </div>
          <div className="p-2 bg-blue-100 rounded">
            <p className="font-bold text-blue-800">3</p>
            <p className="text-xs text-blue-600">Competent</p>
          </div>
          <div className="p-2 bg-blue-100 rounded">
            <p className="font-bold text-blue-800">2</p>
            <p className="text-xs text-blue-600">Developing</p>
          </div>
          <div className="p-2 bg-blue-100 rounded">
            <p className="font-bold text-blue-800">1</p>
            <p className="text-xs text-blue-600">Novice</p>
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
                Tactical Evaluation Criteria
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
          Training Recommendations:
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1"
          placeholder="Enter specific training recommendations or areas needing improvement..."
          rows={4}
        />
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Assessment Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Average Rating:</p>
            <p className="text-xl font-bold">{calculateAverage()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tactical Readiness:</p>
            <p className="text-xl font-bold">{generateSummary()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status:</p>
            <p className="text-xl font-bold">{status}</p>
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
          Submit Assessment
        </Button>
      </div>
    </div>
  );
}
