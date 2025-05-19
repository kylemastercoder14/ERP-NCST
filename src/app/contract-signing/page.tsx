import { redirect } from "next/navigation";
import db from "@/lib/db";
import ContractViewer from "./client";

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { employeeId, file } = searchParams;

  if (!employeeId || !file) {
    return <p>Missing required query parameters.</p>;
  }

  const employee = await db.employee.findUnique({
    where: { id: employeeId as string },
  });

  if (!employee) {
    return redirect("/sign-in");
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Contract Signing for {employee.firstName} {employee.lastName}
      </h1>
      <ContractViewer
        fileUrl={file as string}
        employeeId={employeeId as string}
        initialSignature={employee.signature}
      />
    </div>
  );
};

export default Page;
