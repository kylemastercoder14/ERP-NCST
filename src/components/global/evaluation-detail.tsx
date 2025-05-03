"use client";
import { Evaluation, EvaluationRating, Employee, Client } from "@prisma/client";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type EvaluationWithDetails = Evaluation & {
  ratings: EvaluationRating[];
  employee: Employee;
  client: Client | null;
};

export function EvaluationDetail({
  evaluation,
}: {
  evaluation: EvaluationWithDetails;
}) {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Evaluation for {evaluation.employee.firstName}{" "}
          {evaluation.employee.lastName}
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evaluation Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p>{format(new Date(evaluation.date), "MMM dd, yyyy")}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Average Rating</p>
            <p>{evaluation.average.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Overall Performance</p>
            <p>{evaluation.summary}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Assessed By</p>
            <p>{evaluation.client?.name || "N/A"}</p>
          </div>
          {evaluation.comments && (
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm text-gray-500">Comments</p>
              <p className="whitespace-pre-line">{evaluation.comments}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rating Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {evaluation.ratings.map((rating) => (
              <div key={rating.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{rating.criteria}</h3>
                    <p className="text-sm text-gray-500">
                      {rating.description}
                    </p>
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                    {rating.rating}/5
                  </div>
                </div>
                {rating.comments && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>{rating.comments}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
