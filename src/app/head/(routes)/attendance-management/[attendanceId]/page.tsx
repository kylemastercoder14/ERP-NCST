import React from "react";
import db from "@/lib/db";
import AttendanceForm from '@/components/forms/attendance-form';

const Page = async (props: {
  params: Promise<{
	attendanceId: string;
  }>;
}) => {
  const params = await props.params;
  const attendance = await db.attendance.findUnique({
	where: {
	  id: params.attendanceId,
	},
	include: {
	  Employee: true,
	},
  });

  // employee Lists
  const employees = await db.employee.findMany({
	orderBy: {
	  lastName: "asc",
	},
  });

  return (
	<div>
	  <AttendanceForm employees={employees} initialData={attendance} />
	</div>
  );
};

export default Page;
