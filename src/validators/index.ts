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
  department: z.string().min(1, { message: "Department is required" }),
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
  branch: z.string().min(1, { message: "Branch is required" }),
  isNewEmployee: z.boolean().default(true),
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

export const JobTitleValidators = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export const DepartmentValidators = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export const AccountValidators = z.object({
  email: z.string().min(1, { message: "Email address is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const PurchaseRequestValidators = z.object({
  name: z.string().min(1, { message: "Item name is required" }),
  quantity: z.coerce.number().min(1, { message: "Quantity is required" }),
  unitPrice: z.coerce.number().min(1, { message: "Unit price is required" }),
});

export const LeaveManagementValidators = z
  .object({
    leaveType: z.string().min(1, { message: "Leave type is required" }),
    startDate: z.string().min(1, { message: "Start date is required" }),
    endDate: z.string().min(1, { message: "End date is required" }),
    leaveReason: z.string().min(1, { message: "Leave reason is required" }),
    attachment: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.leaveType === "Sick Leave") {
        return !!data.attachment;
      }
      return true;
    },
    {
      message: "Attachment is required for sick leave.",
      path: ["attachment"],
    }
  );

export const AttendanceManagementValidators = z.object({
  employee: z.string().min(1, { message: "Employee is required" }),
  timeIn: z.date().refine((val) => val instanceof Date, {
    message: "Clock in must be a valid date",
  }),
  timeOut: z.date().refine((val) => val instanceof Date, {
    message: "Clock out must be a valid date",
  }),
  status: z.string().min(1, { message: "Status is required" }),
});

export const ExtraShiftValidators = z.object({
  timeIn: z.date().refine((val) => val instanceof Date, {
    message: "Clock in must be a valid date",
  }),
  timeOut: z.date().refine((val) => val instanceof Date, {
    message: "Clock out must be a valid date",
  }),
  type: z.string().min(1, { message: "Type is required" }),
});

export const RejectLeaveValidators = z.object({
  reasonForRejection: z
    .string()
    .min(1, { message: "Reason for rejection is required" }),
});

export const BaseSalaryValidators = z.object({
  type: z.string().min(1, { message: "Type is required" }),
  amount: z.coerce.number().min(1, { message: "Amount is required" }),
  employee: z.string().min(1, { message: "Employee is required" }),
});

export const GovernmentMandatoriesValidators = z.object({
  sss: z.coerce.number().min(1, { message: "SSS deduction is required" }),
  pagibig: z.coerce
    .number()
    .min(1, { message: "Pag-IBIG deduction is required" }),
  philhealth: z.coerce
    .number()
    .min(1, { message: "PhilHealth deduction is required" }),
  tin: z.coerce.number().min(1, { message: "TIN deduction is required" }),
  others: z.coerce.number().optional(),
  employee: z.string().min(1, { message: "Employee is required" }),
});
