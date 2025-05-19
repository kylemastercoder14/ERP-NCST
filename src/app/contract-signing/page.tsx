import { redirect } from "next/navigation";
import db from "@/lib/db";
import ContractViewer from "./client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page(props: any) {
  const searchParams = props.searchParams || {};
  const employeeId = searchParams.employeeId;
  const file = searchParams.file;

  if (!employeeId || !file) {
    return <p>Missing required query parameters.</p>;
  }

  const employee = await db.employee.findUnique({
    where: { id: employeeId },
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
        fileUrl={file}
        employeeId={employeeId}
        initialSignature={employee.signature}
      />
    </div>
  );
}
