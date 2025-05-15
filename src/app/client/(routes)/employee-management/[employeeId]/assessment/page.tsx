import { notFound } from "next/navigation";
import db from "@/lib/db";
import { getEmployeeEvaluations } from "@/actions";
import { EvaluationList } from "@/components/global/evaluation-list";

const Page = async (props: {
  params: Promise<{
    employeeId: string;
  }>;
}) => {
  const params = await props.params;
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

      <EvaluationList evaluations={evaluations} employeeId={params.employeeId as string} />
    </div>
  );
};

export default Page;
