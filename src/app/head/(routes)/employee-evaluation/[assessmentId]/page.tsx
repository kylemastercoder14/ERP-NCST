import { notFound } from "next/navigation";
import db from "@/lib/db";
import { EvaluationDetail } from "@/components/global/evaluation-detail";

const Page = async (props: {
  params: Promise<{
    assessmentId: string;
  }>;
}) => {
  const params = await props.params;
  const evaluation = await db.evaluation.findUnique({
    where: { id: params.assessmentId },
    include: {
      ratings: true,
      employee: true,
      client: true,
    },
  });

  if (!evaluation) {
    return notFound();
  }

  return (
    <div className="pb-8">
      <EvaluationDetail evaluation={evaluation} />
    </div>
  );
};

export default Page;
