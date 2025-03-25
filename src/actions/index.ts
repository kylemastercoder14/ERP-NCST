/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { z } from "zod";
import {
  LoginValidators,
  ApplicantValidators,
  JobTitleValidators,
  DepartmentValidators,
  AccountValidators,
  LeaveManagementValidators,
  RejectLeaveValidators,
  BaseSalaryValidators,
  GovernmentMandatoriesValidators,
  AttendanceManagementValidators,
  ExtraShiftValidators,
} from "@/validators";
import nodemailer from "nodemailer";
import { CreateAccountHTML } from "@/components/email-templates/create-account";
import { cookies } from "next/headers";
import * as jose from "jose";
import { useUser } from "../hooks/use-user";
import { RejectLeaveHTML } from "../components/email-templates/reject-leave";

export const loginAccount = async (values: z.infer<typeof LoginValidators>) => {
  const validatedField = LoginValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { email, password } = validatedField.data;

  try {
    const user = await db.userAccount.findFirst({
      where: {
        email,
      },
      include: {
        Employee: {
          include: {
            Department: true,
            JobTitle: true,
          },
        },
      },
    });

    if (!user) {
      return { error: "No user account found." };
    }

    if (user.password !== password) {
      return { error: "Invalid password" };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const jwt = await new jose.SignJWT({})
      .setProtectedHeader({ alg })
      .setExpirationTime("72h")
      .setSubject(user.id.toString())
      .sign(secret);

    (
      await // Set the cookie with the JWT
      cookies()
    ).set("Authorization", jwt, {
      httpOnly: true, // Set to true for security
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 3, // Cookie expiration (3 days in seconds)
      sameSite: "strict", // Adjust according to your needs
      path: "/", // Adjust path as needed
    });

    return { token: jwt, user: user };
  } catch (error: any) {
    console.error("Error logging in user", error);
    return {
      error: `Failed to login. Please try again. ${error.message || ""}`,
    };
  }
};

export const logoutUser = async () => {
  (await cookies()).set("Authorization", "", { maxAge: 0, path: "/" });
};

export const isThereAccount = async (id: string) => {
  try {
    const user = await db.userAccount.findFirst({
      where: {
        employeeId: id,
      },
    });

    return { isThereAccount: !!user };
  } catch (error: any) {
    console.error("Error checking account", error);
    return {
      error: `Failed to check account. Please try again. ${error.message || ""}`,
    };
  }
};

export const createAccount = async (
  values: z.infer<typeof AccountValidators>,
  employeeId: string
) => {
  const validatedField = AccountValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { email, password } = validatedField.data;

  try {
    const existingUser = await db.userAccount.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return { error: "User with the email already exist" };
    }

    const res = await db.userAccount.create({
      data: {
        email,
        password,
        employeeId,
      },
      include: {
        Employee: true,
      },
    });

    const name = res.Employee?.firstName + " " + res.Employee?.lastName;

    await sendAccountToEmail(email, password, name);

    return { success: "Account created successfully" };
  } catch (error: any) {
    console.error("Error creating account", error);
    return {
      error: `Failed to create account. Please try again. ${error.message || ""}`,
    };
  }
};

export const sendAccountToEmail = async (
  email: string,
  password: string,
  name: string
) => {
  const htmlContent = await CreateAccountHTML({
    email,
    password,
    name,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kylemastercoder14@gmail.com",
      pass: "cyjfgkpetrcmjvtb",
    },
  });

  const message = {
    from: "kylemastercoder14@gmail.com",
    to: email,
    subject: "This is your account details",
    text: `Hello ${name}, your account has been created. Here are your account details: \nEmail: ${email}\nPassword: ${password}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(message);

    return { success: "Email has been sent." };
  } catch (error) {
    console.error("Error sending notification", error);
    return { message: "An error occurred. Please try again." };
  }
};

export const createApplicant = async (
  values: z.infer<typeof ApplicantValidators>
) => {
  const validatedField = ApplicantValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    positionDesired,
    department,
    licenseNo,
    expiryDate,
    firstName,
    middleName,
    lastName,
    presentAddress,
    provincialAddress,
    telNo,
    celNo,
    dateOfBirth,
    placeOfBirth,
    civilStatus,
    citizenship,
    religion,
    height,
    weight,
    contactAddress,
    contactPerson,
    contactNumber,
    languages,
    fatherName,
    motherName,
    fatherOccupation,
    motherOccupation,
    spouseAddress,
    pagibigNo,
    parentAddress,
    philhealthNo,
    sex,
    signature,
    sssNo,
    tinNo,
    characterReferences,
    children,
    education,
    employment,
    spouseName,
    spouseOccupation,
  } = validatedField.data;

  try {
    const existingApplicant = await db.employee.findFirst({
      where: {
        licenseNo,
        expiryDate,
      },
    });

    if (existingApplicant) {
      return { error: "Employee with a license no. already exist" };
    }

    await db.employee.create({
      data: {
        jobTitleId: positionDesired,
        departmentId: department,
        licenseNo,
        expiryDate,
        firstName,
        middleName,
        lastName,
        presentAddress,
        provincialAddress,
        telNo,
        celNo,
        dateOfBirth,
        placeOfBirth,
        civilStatus,
        citizenship,
        religion,
        height,
        weight,
        contactAddress,
        contactPerson,
        contactNumber,
        languages,
        fatherName,
        motherName,
        fatherOccupation,
        motherOccupation,
        spouseAddress,
        pagibigNo,
        parentAddress,
        philhealthNo,
        sex,
        signature,
        sssNo,
        tinNo,
        spouseName,
        spouseOccupation,
        Children: {
          createMany: {
            data:
              children?.map((child) => ({
                name: child.name || "",
                dateOfBirth: child.dateOfBirth || "",
              })) || [],
          },
        },
        EducationRecord: {
          createMany: {
            data:
              education?.map((educ) => ({
                level: educ.level,
                course: educ.course || null,
                school: educ.school,
                address: educ.address,
                yearGraduate: educ.yearGraduated,
              })) || [],
          },
        },
        EmploymentRecord: {
          createMany: {
            data:
              employment?.map((job) => ({
                companyName: job.company,
                position: job.position,
                dateFrom: job.from,
                dateTo: job.to,
              })) || [],
          },
        },
        CharacterReferences: {
          createMany: {
            data:
              characterReferences?.map((ref) => ({
                name: ref.name,
                occupation: ref.occupation,
                address: ref.address,
              })) || [],
          },
        },
      },
    });

    return { success: "Employee created successfully" };
  } catch (error: any) {
    console.error("Error creating employee", error);
    return {
      error: `Failed to create employee. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateApplicant = async (
  id: string,
  values: z.infer<typeof ApplicantValidators>
) => {
  if (!id) {
    return { error: "Employee ID is required" };
  }

  const validatedField = ApplicantValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    positionDesired,
    department,
    licenseNo,
    expiryDate,
    firstName,
    middleName,
    lastName,
    presentAddress,
    provincialAddress,
    telNo,
    celNo,
    dateOfBirth,
    placeOfBirth,
    civilStatus,
    citizenship,
    religion,
    height,
    weight,
    contactAddress,
    contactPerson,
    contactNumber,
    languages,
    fatherName,
    motherName,
    fatherOccupation,
    motherOccupation,
    spouseAddress,
    pagibigNo,
    parentAddress,
    philhealthNo,
    sex,
    signature,
    sssNo,
    tinNo,
    characterReferences,
    children,
    education,
    employment,
    spouseName,
    spouseOccupation,
  } = validatedField.data;

  try {
    const existingApplicant = await db.employee.findUnique({
      where: {
        id,
      },
    });

    if (!existingApplicant) {
      return { error: "Employee not found" };
    }

    await db.employee.update({
      where: { id },
      data: {
        jobTitleId: positionDesired,
        departmentId: department,
        licenseNo,
        expiryDate,
        firstName,
        middleName,
        lastName,
        presentAddress,
        provincialAddress,
        telNo,
        celNo,
        dateOfBirth,
        placeOfBirth,
        civilStatus,
        citizenship,
        religion,
        height,
        weight,
        contactAddress,
        contactPerson,
        contactNumber,
        languages,
        fatherName,
        motherName,
        fatherOccupation,
        motherOccupation,
        spouseAddress,
        pagibigNo,
        parentAddress,
        philhealthNo,
        sex,
        signature,
        sssNo,
        tinNo,
        spouseName,
        spouseOccupation,
        Children: {
          deleteMany: { employeeId: id },
          createMany: {
            data:
              children?.map((child) => ({
                name: child.name || "",
                dateOfBirth: child.dateOfBirth || "",
              })) || [],
          },
        },
        EducationRecord: {
          deleteMany: { employeeId: id },
          createMany: {
            data:
              education?.map((educ) => ({
                level: educ.level,
                course: educ.course || null,
                school: educ.school,
                address: educ.address,
                yearGraduate: educ.yearGraduated,
              })) || [],
          },
        },
        EmploymentRecord: {
          deleteMany: { employeeId: id },
          createMany: {
            data:
              employment?.map((job) => ({
                companyName: job.company,
                position: job.position,
                dateFrom: job.from,
                dateTo: job.to,
              })) || [],
          },
        },
        CharacterReferences: {
          deleteMany: { employeeId: id }, // Remove old records
          createMany: {
            data:
              characterReferences?.map((ref) => ({
                name: ref.name,
                occupation: ref.occupation,
                address: ref.address,
              })) || [],
          },
        },
      },
    });

    return { success: "Applicant successfully updated!" };
  } catch (error: any) {
    console.error("Error updating applicant", error);
    return {
      error: `Failed to update applicant. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteApplicant = async (id: string) => {
  if (!id) {
    return { error: "Employee ID is required" };
  }

  try {
    await db.employee.delete({
      where: { id },
    });

    return { success: "Employee successfully deleted!" };
  } catch (error: any) {
    console.error("Error deleting employee", error);
    return {
      error: `Failed to delete employee. Please try again. ${error.message || ""}`,
    };
  }
};

export const createJobTitle = async (
  values: z.infer<typeof JobTitleValidators>
) => {
  const validatedField = JobTitleValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name } = validatedField.data;

  try {
    await db.jobTitle.create({
      data: {
        name,
      },
    });

    return { success: "Job title created successfully" };
  } catch (error: any) {
    console.error("Error creating job title", error);
    return {
      error: `Failed to create job title. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateJobTitle = async (
  values: z.infer<typeof JobTitleValidators>,
  id: string
) => {
  if (!id) {
    return { error: "Job title ID is required" };
  }

  const validatedField = JobTitleValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name } = validatedField.data;

  try {
    await db.jobTitle.update({
      where: { id },
      data: {
        name,
      },
    });

    return { success: "Job title updated successfully" };
  } catch (error: any) {
    console.error("Error updating job title", error);
    return {
      error: `Failed to update job title. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteJobTitle = async (id: string) => {
  if (!id) {
    return { error: "Job title ID is required" };
  }

  try {
    await db.jobTitle.delete({
      where: { id },
    });

    return { success: "Job title deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting job title", error);
    return {
      error: `Failed to delete job title. Please try again. ${error.message || ""}`,
    };
  }
};

export const createDepartment = async (
  values: z.infer<typeof DepartmentValidators>
) => {
  const validatedField = DepartmentValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name } = validatedField.data;

  try {
    await db.department.create({
      data: {
        name,
      },
    });

    return { success: "Department created successfully" };
  } catch (error: any) {
    console.error("Error creating department", error);
    return {
      error: `Failed to create department. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateDepartment = async (
  values: z.infer<typeof DepartmentValidators>,
  id: string
) => {
  if (!id) {
    return { error: "Department ID is required" };
  }

  const validatedField = DepartmentValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name } = validatedField.data;

  try {
    await db.department.update({
      where: { id },
      data: {
        name,
      },
    });

    return { success: "Department updated successfully" };
  } catch (error: any) {
    console.error("Error updating department", error);
    return {
      error: `Failed to update department. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteDepartment = async (id: string) => {
  if (!id) {
    return { error: "Department ID is required" };
  }

  try {
    await db.department.delete({
      where: { id },
    });

    return { success: "Department deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting department", error);
    return {
      error: `Failed to delete department. Please try again. ${error.message || ""}`,
    };
  }
};

export const createLeave = async (
  values: z.infer<typeof LeaveManagementValidators>
) => {
  const validatedField = LeaveManagementValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { employee, leaveType, startDate, endDate, leaveReason, attachment } =
    validatedField.data;

  try {
    await db.leaveManagement.create({
      data: {
        employeeId: employee,
        leaveType,
        startDate,
        endDate,
        leaveReason,
        attachment,
      },
    });

    return { success: "Leave requested successfully" };
  } catch (error: any) {
    console.error("Error requesting leave", error);
    return {
      error: `Failed to request leave. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateLeave = async (
  values: z.infer<typeof LeaveManagementValidators>,
  id: string
) => {
  if (!id) {
    return { error: "Leave ID is required" };
  }

  const validatedField = LeaveManagementValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { employee, leaveType, startDate, endDate, leaveReason, attachment } =
    validatedField.data;

  try {
    await db.leaveManagement.update({
      where: { id },
      data: {
        employeeId: employee,
        leaveType,
        startDate,
        endDate,
        leaveReason,
        attachment,
      },
    });

    return { success: "Leave updated successfully" };
  } catch (error: any) {
    console.error("Error updating leave", error);
    return {
      error: `Failed to update leave. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteLeave = async (id: string) => {
  if (!id) {
    return { error: "Leave ID is required" };
  }

  try {
    await db.leaveManagement.delete({
      where: { id },
    });

    return { success: "Leave deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting leave", error);
    return {
      error: `Failed to delete leave. Please try again. ${error.message || ""}`,
    };
  }
};

export const approveLeave = async (id: string) => {
  const { userId } = await useUser();
  try {
    await db.leaveManagement.update({
      where: { id },
      data: {
        status: "Approved",
        approvedById: userId,
        reasonForRejection: null,
      },
    });

    return { success: "Leave approved successfully" };
  } catch (error: any) {
    console.error("Error approving leave", error);
    return {
      error: `Failed to approve leave. Please try again. ${error.message || ""}`,
    };
  }
};

export const rejectLeave = async (
  values: z.infer<typeof RejectLeaveValidators>,
  id: string
) => {
  const { userId } = await useUser();
  const validatedField = RejectLeaveValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { reasonForRejection } = validatedField.data;

  try {
    const res = await db.leaveManagement.update({
      where: { id },
      data: {
        status: "Rejected",
        reasonForRejection,
        approvedById: userId,
      },
      include: {
        Employee: { include: { UserAccount: true } },
      },
    });

    const name =
      res.Employee.firstName +
      " " +
      res.Employee.middleName +
      " " +
      res.Employee.lastName;
    const email = res.Employee.UserAccount[0].email;

    await sendReasonForRejection(name, email, reasonForRejection);

    return { success: "Leave rejected successfully" };
  } catch (error: any) {
    console.error("Error rejecting leave", error);
    return {
      error: `Failed to reject leave. Please try again. ${error.message || ""}`,
    };
  }
};

export const sendReasonForRejection = async (
  name: string,
  email: string,
  reason: string
) => {
  const htmlContent = await RejectLeaveHTML({
    name,
    reason,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kylemastercoder14@gmail.com",
      pass: "cyjfgkpetrcmjvtb",
    },
  });

  const message = {
    from: "kylemastercoder14@gmail.com",
    to: email,
    subject: "Leave Request Rejected",
    text: `Hello ${name}, your requested leave has been rejected due to the following reason: \n${reason}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(message);

    return { success: "Email has been sent." };
  } catch (error) {
    console.error("Error sending notification", error);
    return { message: "An error occurred. Please try again." };
  }
};

export const createBaseSalary = async (
  values: z.infer<typeof BaseSalaryValidators>
) => {
  const validatedField = BaseSalaryValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { employee, type, amount } = validatedField.data;

  try {
    await db.baseSalary.create({
      data: {
        employeeId: employee,
        type,
        amount,
      },
    });

    return { success: "Base salary created successfully" };
  } catch (error: any) {
    console.error("Error creating base salary", error);
    return {
      error: `Failed to create base salary. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateBaseSalary = async (
  values: z.infer<typeof BaseSalaryValidators>,
  id: string
) => {
  if (!id) {
    return { error: "Base salary ID is required" };
  }

  const validatedField = BaseSalaryValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { employee, type, amount } = validatedField.data;

  try {
    await db.baseSalary.update({
      where: { id },
      data: {
        employeeId: employee,
        type,
        amount,
      },
    });

    return { success: "Base salary updated successfully" };
  } catch (error: any) {
    console.error("Error updating base salary", error);
    return {
      error: `Failed to update base salary. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteBaseSalary = async (id: string) => {
  if (!id) {
    return { error: "Base salary ID is required" };
  }

  try {
    await db.baseSalary.delete({
      where: { id },
    });

    return { success: "Base salary deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting base salary", error);
    return {
      error: `Failed to delete base salary. Please try again. ${error.message || ""}`,
    };
  }
};

export const createGovernmentMandatories = async (
  values: z.infer<typeof GovernmentMandatoriesValidators>
) => {
  const validatedField = GovernmentMandatoriesValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { employee, sss, philhealth, pagibig, tin, others } =
    validatedField.data;

  try {
    await db.governmentMandatories.create({
      data: {
        employeeId: employee,
        sss,
        philhealth,
        pagibig,
        tin,
        others,
      },
    });

    return { success: "Government Mandatories created successfully" };
  } catch (error: any) {
    console.error("Error creating government mandatories", error);
    return {
      error: `Failed to create government mandatories. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateGovernmentMandatories = async (
  values: z.infer<typeof GovernmentMandatoriesValidators>,
  id: string
) => {
  if (!id) {
    return { error: "Government Mandatories ID is required" };
  }

  const validatedField = GovernmentMandatoriesValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { employee, sss, philhealth, pagibig, tin, others } =
    validatedField.data;

  try {
    await db.governmentMandatories.update({
      where: { id },
      data: {
        employeeId: employee,
        sss,
        philhealth,
        pagibig,
        tin,
        others,
      },
    });

    return { success: "Government Mandatories updated successfully" };
  } catch (error: any) {
    console.error("Error updating government mandatories", error);
    return {
      error: `Failed to update government mandatories. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteGovernmentMandatories = async (id: string) => {
  if (!id) {
    return { error: "Government Mandatories ID is required" };
  }

  try {
    await db.governmentMandatories.delete({
      where: { id },
    });

    return { success: "Government Mandatories deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting government mandatories", error);
    return {
      error: `Failed to delete government mandatories. Please try again. ${error.message || ""}`,
    };
  }
};

export const createAttendance = async (
  values: z.infer<typeof AttendanceManagementValidators>
) => {
  const validatedField = AttendanceManagementValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { employee, timeIn, timeOut, status } = validatedField.data;

  try {
    await db.attendance.create({
      data: {
        employeeId: employee,
        timeIn: timeIn.toISOString(),
        timeOut: timeOut.toISOString(),
        date: new Date().toISOString(),
        status,
      },
    });

    return { success: "Attendance created successfully" };
  } catch (error: any) {
    console.error("Error creating attendance", error);
    return {
      error: `Failed to create attendance. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateAttendance = async (
  values: z.infer<typeof AttendanceManagementValidators>,
  id: string
) => {
  if (!id) {
    return { error: "Attendance ID is required" };
  }

  const validatedField = AttendanceManagementValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { employee, timeIn, timeOut, status } = validatedField.data;

  try {
    await db.attendance.update({
      where: { id },
      data: {
        employeeId: employee,
        timeIn: timeIn.toISOString(),
        timeOut: timeOut.toISOString(),
        status,
      },
    });

    return { success: "Attendance updated successfully" };
  } catch (error: any) {
    console.error("Error updating attendance", error);
    return {
      error: `Failed to update attendance. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteAttendance = async (id: string) => {
  if (!id) {
    return { error: "Attendance ID is required" };
  }

  try {
    await db.attendance.delete({
      where: { id },
    });

    return { success: "Attendance deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting attendance", error);
    return {
      error: `Failed to delete attendance. Please try again. ${error.message || ""}`,
    };
  }
};

export const createExtraShift = async (
  values: z.infer<typeof ExtraShiftValidators>
) => {
  const validatedField = ExtraShiftValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { employee, type, timeIn, timeOut } = validatedField.data;

  try {
    await db.extraShift.create({
      data: {
        employeeId: employee,
        type,
        timeStart: timeIn.toISOString(),
        timeEnd: timeOut.toISOString(),
        date: new Date().toISOString(),
        status: "Pending",
      },
    });

    return { success: "Extra shift created successfully" };
  } catch (error: any) {
    console.error("Error creating extra shift", error);
    return {
      error: `Failed to create extra shift. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateExtraShift = async (
  values: z.infer<typeof ExtraShiftValidators>,
  id: string
) => {
  if (!id) {
    return { error: "Extra shift ID is required" };
  }

  const validatedField = ExtraShiftValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { employee, type, timeIn, timeOut } = validatedField.data;

  try {
    await db.extraShift.update({
      where: { id },
      data: {
        employeeId: employee,
        type,
        timeStart: timeIn.toISOString(),
        timeEnd: timeOut.toISOString(),
      },
    });

    return { success: "Extra shift updated successfully" };
  } catch (error: any) {
    console.error("Error updating extra shift", error);
    return {
      error: `Failed to update extra shift. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteExtraShift = async (id: string) => {
  if (!id) {
    return { error: "Extra shift ID is required" };
  }

  try {
    await db.extraShift.delete({
      where: { id },
    });

    return { success: "Extra shift deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting extra shift", error);
    return {
      error: `Failed to delete extra shift. Please try again. ${error.message || ""}`,
    };
  }
};

export const approveExtraShift = async (id: string) => {
  try {
    await db.extraShift.update({
      where: { id },
      data: {
        status: "Approved",
      },
    });

    return { success: "Extra shift approved successfully" };
  } catch (error: any) {
    console.error("Error approving extra shift", error);
    return {
      error: `Failed to approve extra shift. Please try again. ${error.message || ""}`,
    };
  }
};

export const rejectExtraShift = async (id: string) => {
  try {
    await db.extraShift.update({
      where: { id },
      data: {
        status: "Rejected",
      },
    });

    return { success: "Extra shift rejected successfully" };
  } catch (error: any) {
    console.error("Error rejecting extra shift", error);
    return {
      error: `Failed to reject extra shift. Please try again. ${error.message || ""}`,
    };
  }
};

export const submitPayslip = async (file: string, employeeId: string) => {
  try {
    const res = await db.paySlip.create({
      data: {
        employeeId,
        file,
      },
    });

    return { success: "Payslip submitted successfully", fileUrl: res.file };
  } catch (error: any) {
    console.error("Error submitting payslip", error);
    return {
      error: `Failed to submit payslip. Please try again. ${error.message || ""}`,
    };
  }
};
