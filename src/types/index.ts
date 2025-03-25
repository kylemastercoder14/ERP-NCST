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
