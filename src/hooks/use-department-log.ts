import db from "@/lib/db";
import { useUser } from "./use-user";

export const useDepartmentLog = () => {
  const createDepartmentLog = async (
    departmentName: string,
    action: string
  ) => {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { userId } = await useUser();

      // Find department by name
      const department = await db.department.findFirst({
        where: {
          name: departmentName,
        },
      });

      if (!department) {
        console.error(`Department ${departmentName} not found`);
        return;
      }

      // Create the log
      await db.logs.create({
        data: {
          action,
          departmentId: department.id,
          userId: userId as string,
        },
      });
    } catch (error) {
      console.error("Error creating department log:", error);
    }
  };

  return { createDepartmentLog };
};
