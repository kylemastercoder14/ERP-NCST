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
  ApprovedBy: Employee | null;
}

export interface BaseSalaryWithProps extends BaseSalary {
  Employee: Employee;
}

export interface GovernmentMandatoriesWithProps extends GovernmentMandatories {
  Employee: Employee;
}
