import { z } from "zod";

export const RoleEnum = z.enum(["EMPLOYEE", "HEAD", "ASSISTANT", "USER"]);
export const PositionEnum = z.enum(["ACCOUNTING", "OPERATION", "CRM", "HR"]);

export const RegistrationValidators = z.object({
  employeeId: z.string().min(1, { message: "Employee ID is required" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  role: RoleEnum,
  position: PositionEnum,
});

export const LoginValidators = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});
