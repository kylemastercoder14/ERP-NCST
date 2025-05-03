import { Evaluation, EvaluationRating, Client } from "@prisma/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type EvaluationWithRatings = Evaluation & {
  ratings: EvaluationRating[];
  client: Client | null;
};

export function EvaluationList({
  evaluations,
}: {
  evaluations: EvaluationWithRatings[];
}) {
  if (evaluations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No evaluations found</p>
        <Button className="mt-4" asChild>
          <Link
            href={`/client/employee-management/${evaluations[0]?.employeeId}/assessment/create`}
          >
            Create First Evaluation
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Average Rating</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead>Assessed By</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evaluations.map((evaluation) => (
            <TableRow key={evaluation.id}>
              <TableCell>
                {format(new Date(evaluation.date), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>{evaluation.average.toFixed(1)}</TableCell>
              <TableCell>{evaluation.summary}</TableCell>
              <TableCell>{evaluation.client?.name || "N/A"}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/client/assessment/${evaluation.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
