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

export const ApplicantValidators = z.object({
  positionDesired: z
    .string()
    .min(1, { message: "Position desired is required" }),
  licenseNo: z.string().min(1, { message: "License number is required" }),
  expiryDate: z.string().min(1, { message: "License validity is required" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  presentAddress: z.string().min(1, { message: "Present address is required" }),
  provincialAddress: z
    .string()
    .min(1, { message: "Provincial address is required" }),
  isSameWithPresent: z.boolean().default(false),
  telNo: z.string().optional(),
  celNo: z.string().min(1, { message: "Cellphone number is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  placeOfBirth: z.string().min(1, { message: "Place of birth is required" }),
  civilStatus: z.string().min(1, { message: "Civil status is required" }),
  citizenship: z.string().min(1, { message: "Citizenship is required" }),
  religion: z.string().min(1, { message: "Religion is required" }),
  height: z.string().min(1, { message: "Height is required" }),
  weight: z.string().min(1, { message: "Weight is required" }),
  sex: z.string().min(1, { message: "Sex is required" }),
  spouseName: z.string().optional(),
  spouseOccupation: z.string().optional(),
  spouseAddress: z.string().optional(),
  fatherName: z.string().min(1, { message: "Father's name is required" }),
  motherName: z.string().min(1, { message: "Mother's name is required" }),
  fatherOccupation: z
    .string()
    .min(1, { message: "Father's occupation is required" }),
  motherOccupation: z
    .string()
    .min(1, { message: "Mother's occupation is required" }),
  parentAddress: z.string().min(1, { message: "Parent's address is required" }),
  languages: z
    .array(z.string())
    .min(1, { message: "At least one language is required" }),
  contactPerson: z.string().min(1, { message: "Contact person is required" }),
  contactAddress: z.string().min(1, { message: "Contact address is required" }),
  contactNumber: z.string().min(1, { message: "Contact number is required" }),
  tinNo: z.string().min(1, { message: "TIN number is required" }),
  sssNo: z.string().min(1, { message: "SSS number is required" }),
  philhealthNo: z.string().min(1, { message: "PhilHealth number is required" }),
  pagibigNo: z.string().min(1, { message: "Pag-IBIG number is required" }),
  signature: z.string().min(1, { message: "Signature is required" }),
  isOnlyChild: z.boolean().default(true),
  children: z
    .array(
      z.object({
        name: z.string().optional(),
        dateOfBirth: z.string().optional(),
      })
    )
    .optional(),
  education: z
    .array(
      z.object({
        level: z.string().min(1, { message: "Education level is required" }),
        course: z.string().optional(),
        school: z.string().min(1, { message: "School name is required" }),
        address: z.string().min(1, { message: "School address is required" }),
        yearGraduated: z
          .string()
          .min(1, { message: "Year graduated is required" }),
      })
    )
    .optional(),
  employment: z
    .array(
      z.object({
        from: z.string().min(1, { message: "Date started is required" }),
        to: z.string().min(1, { message: "Date ended is required" }),
        position: z.string().min(1, { message: "Position is required" }),
        company: z.string().min(1, { message: "Company is required" }),
      })
    )
    .optional(),
  characterReferences: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Name is required" }),
        occupation: z.string().min(1, { message: "Occupation is required" }),
        address: z.string().min(1, { message: "Address is required" }),
      })
    )
    .optional(),
});
