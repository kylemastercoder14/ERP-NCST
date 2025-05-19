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

export const ForgotPasswordValidators = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
});

export const ResetPasswordValidators = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Confirm password is required" }),
});

export const ApplicantValidators = z.object({
  positionDesired: z
    .string()
    .min(1, { message: "Position desired is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  email: z.string().min(1, { message: "Email is required" }),
  licenseNo: z.string().optional(),
  expiryDate: z.string().optional(),
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
  dateOfBirth: z
    .string()
    .min(1, { message: "Date of birth is required" })
    .refine(
      (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        return age >= 18;
      },
      { message: "Employee must be 18 years old or above" }
    ),
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
        from: z.string().optional(),
        to: z.string().optional(),
        position: z.string().optional(),
        company: z.string().optional(),
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

export const SendEmailEmployeeValidators = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  time: z.date({
    required_error: "Time is required",
    invalid_type_error: "Invalid time format",
  }),
  location: z.string().min(1, { message: "Location is required" }),
});

export const SendApplicantStatusValidators = z.object({
  status: z.string().min(1, { message: "Status is required" }),
  remarks: z.string().optional(),
});

export const PurchaseRequestValidators = z.object({
  department: z.string().nonempty("Department is required"),
  items: z.array(
    z.object({
      itemId: z.string().nonempty("Item is required"),
      quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
      totalAmount: z.coerce.number().optional(),
    })
  ),
});

export const WithdrawalValidators = z.object({
  department: z.string().nonempty("Department is required"),
  items: z.array(
    z.object({
      itemId: z.string().nonempty("Item is required"),
      quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    })
  ),
});

export const LeaveManagementValidators = z
  .object({
    leaveType: z.string().min(1, { message: "Leave type is required" }),
    startDate: z.string().min(1, { message: "Start date is required" }),
    endDate: z.string().min(1, { message: "End date is required" }),
    leaveReason: z.string().min(1, { message: "Leave reason is required" }),
    attachment: z.string().optional(),
    isPaid: z.boolean().default(true),
    daysUsed: z.number().min(1, { message: "Days used must be at least 1" }),
    year: z.number().min(2000, { message: "Invalid year" }),
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
  )
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
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

export const ClientManagementValidators = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  address: z.string().optional(),
  contactNo: z.string().optional(),
  logo: z.string().optional(),
});

export const JobPostValidators = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  attachment: z.string().min(1, { message: "Attachment is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  financialStatus: z.string().optional(),
  adminApproval: z.string().optional(),
  department: z.string().min(1, { message: "Department is required" }),
  jobPosition: z.string().min(1, { message: "Job position is required" }),
});

export const SupplierManagementValidators = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  address: z.string().optional(),
  contactNo: z.string().optional(),
  logo: z.string().optional(),
});

export const AccomplishmentReportValidators = z.object({
  report: z.string().min(1, { message: "Title is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  images: z.array(z.string()).optional(),
  remarks: z.string().optional(),
});

export const ItemValidators = z.object({
  unitPrice: z.coerce
    .number()
    .min(1, { message: "Unit price is required" })
    .positive({ message: "Unit price must be greater than 0" }),
  name: z.string().min(1, { message: "Name is required" }),
  supplierId: z.string().min(1, { message: "Supplier is required" }),
  description: z.string().optional(),
  isSmallItem: z.boolean().default(true),
  specification: z.string().optional(),
});

export const AccountPayableValidators = z.object({
  accountType: z.enum(["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"]),
  amount: z.coerce
    .number()
    .min(1, { message: "Amount is required" })
    .positive({ message: "Amount must be greater than 0" }),
  supplierId: z.string().min(1, { message: "Supplier is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  attachment: z.string().optional(),
  subAccountType: z
    .string()
    .min(1, { message: "Sub account type is required" }),
});

export const AccountReceivableValidators = z.object({
  accountType: z.enum(["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"]),
  amount: z.coerce
    .number()
    .min(1, { message: "Amount is required" })
    .positive({ message: "Amount must be greater than 0" }),
  clientId: z.string().min(1, { message: "Client is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  attachment: z.string().optional(),
  subAccountType: z
    .string()
    .min(1, { message: "Sub account type is required" }),
});

export const TransactionValidators = z.object({
  accountType: z.enum(["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"]),
  type: z.enum(["DEBIT", "CREDIT"]),
  amount: z.coerce
    .number()
    .min(1, { message: "Amount is required" })
    .positive({ message: "Amount must be greater than 0" }),
  clientId: z.string().optional(),
  supplierId: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  attachment: z.string().optional(),
  subAccountType: z
    .string()
    .min(1, { message: "Sub account type is required" }),
});

export const ticketPriorities = ["low", "medium", "high", "critical"] as const;
export const ticketTypes = [
  "technical",
  "billing",
  "general",
  "employee",
  "other",
] as const;
export const ticketStatuses = [
  "open",
  "in-progress",
  "resolved",
  "closed",
] as const;

export const TicketValidators = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000),
  type: z.enum(ticketTypes),
  priority: z.enum(ticketPriorities),
  employeeId: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});

export const GenderRequirementValidator = z.object({
  gender: z.enum(["MALE", "FEMALE"]),
  count: z.coerce
    .number()
    .min(0)
    .max(100, "Count per gender cannot exceed 100"),
});

export const ApplicantRequestValidators = z
  .object({
    totalApplicants: z.coerce.number().min(1, "At least 1 applicant required"),
    genderRequirements: z
      .array(GenderRequirementValidator)
      .min(1, "At least one gender requirement is needed")
      .refine(
        (genders) => genders.some((g) => g.count > 0),
        "At least one gender must have a count greater than 0"
      ),
    minAge: z.coerce
      .number()
      .min(18, "Minimum age is 18")
      .max(60, "Maximum minimum age is 60"),
    maxAge: z.coerce
      .number()
      .min(18, "Minimum age is 18")
      .max(60, "Maximum age is 60"),
  })
  .refine((data) => data.minAge <= data.maxAge, {
    message: "Minimum age must be less than or equal to maximum age",
    path: ["minAge"],
  });

export const SiteSettingsValidators = z.object({
  maintenanceMode: z.boolean().default(false),
  maintenanceMessage: z
    .string()
    .optional()
    .default(
      "We're currently performing scheduled maintenance. Please check back soon."
    ),
  maintenanceEndDate: z.string().optional(),
});
