import { notFound } from "next/navigation";
import db from "@/lib/db";
import { getEmployeeEvaluations } from "@/actions";
import { EvaluationList } from "@/components/global/evaluation-list";

interface PageProps {
  params: {
    employeeId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const employee = await db.employee.findUnique({
    where: {
      id: params.employeeId,
    },
    include: {
      JobTitle: true,
      Client: true,
    },
  });

  if (!employee) {
    return notFound();
  }

  const evaluations = await getEmployeeEvaluations(params.employeeId);

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6">
        Evaluations for {employee.firstName} {employee.lastName}
      </h1>

      <EvaluationList evaluations={evaluations} />
    </div>
  );
};

export default Page;
