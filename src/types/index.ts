import {
  Applicant,
  CharacterReferences,
  Children,
  EducationRecord,
  EmploymentRecord,
} from "@prisma/client";

export interface ApplicantWithProps extends Applicant {
  Children: Children[];
  EducationRecord: EducationRecord[];
  EmploymentRecord: EmploymentRecord[];
  CharacterReferences: CharacterReferences[];
}
