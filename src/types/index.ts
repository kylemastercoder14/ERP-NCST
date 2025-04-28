import {
  Employee,
  CharacterReferences,
  Children,
  EducationRecord,
  EmploymentRecord,
  UserAccount,
  JobTitle,
  Department,
  LeaveManagement,
  BaseSalary,
  GovernmentMandatories,
  Attendance,
  ExtraShift,
  PurchaseRequest,
  AccomplishmentReport,
  PurchaseRequestItem,
  Items,
  Supplier,
  Withdrawal,
  WithdrawalItem,
} from "@prisma/client";

export interface EmployeeWithProps extends Employee {
  Children: Children[];
  EducationRecord: EducationRecord[];
  EmploymentRecord: EmploymentRecord[];
  CharacterReferences: CharacterReferences[];
  JobTitle: JobTitle;
  Department: Department;
}

export interface UserWithProps extends UserAccount {
  Employee: EmployeeWithProps;
}

export interface LeaveManagementWithProps extends LeaveManagement {
  Employee: Employee;
  ApprovedBy: UserAccount | null;
}

export interface ItemWithSupplierProps extends Items {
  Supplier?: Supplier | null;
}

export interface PurchaseRequestItemWithProps extends PurchaseRequestItem {
  Item: ItemWithSupplierProps | null;
}

export interface WithdrawalItemWithProps extends WithdrawalItem {
  Item: ItemWithSupplierProps | null;
}

export interface PurchaseRequestWithProps extends PurchaseRequest {
  PurchaseRequestItem: PurchaseRequestItemWithProps[];
}

export interface WithdrawalWithProps extends Withdrawal {
  WithdrawalItem: WithdrawalItemWithProps[];
  Employee?: Employee | null;
}

export interface AttendanceManagementWithProps extends Attendance {
  Employee: Employee;
}

export interface ExtraShiftWithProps extends ExtraShift {
  Employee: Employee;
}

export interface BaseSalaryWithProps extends BaseSalary {
  Employee: Employee;
}

export interface GovernmentMandatoriesWithProps extends GovernmentMandatories {
  Employee: Employee;
}

export interface PayslipGenerationWithProps extends Employee {
  BaseSalary: BaseSalary[];
  Department: Department;
  JobTitle: JobTitle;
  Attendance: Attendance[];
  ExtraShift: ExtraShift[];
  GovernmentMandatories: GovernmentMandatories[];
  LeaveManagement: LeaveManagement[];
}

export interface AccomplishmentReportWithProps extends AccomplishmentReport {
  Employee: Employee;
}
