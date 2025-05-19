import { redirect } from "next/navigation";
import db from "@/lib/db";
import ContractViewer from "./client";

type PageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: PageProps) {
  // Extract and normalize parameters
  const employeeId = Array.isArray(searchParams.employeeId)
    ? searchParams.employeeId[0]
    : searchParams.employeeId;

  const file = Array.isArray(searchParams.file)
    ? searchParams.file[0]
    : searchParams.file;

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
