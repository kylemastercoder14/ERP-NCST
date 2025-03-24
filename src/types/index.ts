import {
  Employee,
  CharacterReferences,
  Children,
  EducationRecord,
  EmploymentRecord,
  UserAccount,
  JobTitle,
} from "@prisma/client";

export interface EmployeeWithProps extends Employee {
  Children: Children[];
  EducationRecord: EducationRecord[];
  EmploymentRecord: EmploymentRecord[];
  CharacterReferences: CharacterReferences[];
  JobTitle: JobTitle;
}

export interface UserWithProps extends UserAccount {
  JobTitle: JobTitle;
  Employee: EmployeeWithProps;
}
