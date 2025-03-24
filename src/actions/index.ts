/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { z } from "zod";
import {
  LoginValidators,
  ApplicantValidators,
  JobTitleValidators,
  DepartmentValidators,
} from "@/validators";
// import nodemailer from "nodemailer";
// import { OtpVerificationHTML } from "@/components/email-templates/otp-verification";
import { cookies } from "next/headers";
import * as jose from "jose";

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

// export const verifyAccount = async (otpCode: string, email: string) => {
//   try {
//     const user = await db.user.findUnique({
//       where: {
//         email,
//       },
//     });

//     if (!user) {
//       return { error: "User not found" };
//     }

//     if (!user.otpExpiry || user.otpExpiry < new Date()) {
//       return { error: "OTP code has expired" };
//     }

//     if (user.otpCode !== otpCode) {
//       return { error: "Invalid OTP code" };
//     }

//     await db.user.update({
//       where: {
//         email,
//       },
//       data: {
//         isEmailVerified: true,
//       },
//     });

//     return { success: "Account verified successfully" };
//   } catch (error: any) {
//     return {
//       error: `Failed to verify account. Please try again. ${error.message || ""}`,
//     };
//   }
// };

// export const resendOtpCode = async (email: string) => {
//   try {
//     const user = await db.user.findUnique({
//       where: {
//         email,
//       },
//     });

//     if (!user) {
//       return { error: "User not found" };
//     }

//     const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

//     // insert otpExpiry in the database, the value is the current time plus 15 minutes only
//     const otpExpiry = new Date();
//     otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

//     await db.user.update({
//       where: {
//         email,
//       },
//       data: {
//         otpCode,
//         otpExpiry,
//       },
//     });

//     await sendOtpCodeEmail(email, otpCode);

//     return { success: "OTP code sent successfully" };
//   } catch (error: any) {
//     return {
//       error: `Failed to resend OTP code. Please try again. ${error.message || ""}`,
//     };
//   }
// };

// export const sendOtpCodeEmail = async (email: string, otpCode: string) => {
//   const htmlContent = await OtpVerificationHTML({
//     otpCode,
//   });

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "kylemastercoder14@gmail.com",
//       pass: "cyjfgkpetrcmjvtb",
//     },
//   });

//   const message = {
//     from: "kylemastercoder14@gmail.com",
//     to: email,
//     subject: "Verify your email address",
//     text: `Your OTP code is ${otpCode}`,
//     html: htmlContent,
//   };

//   try {
//     await transporter.sendMail(message);

//     return { success: "Email has been sent." };
//   } catch (error) {
//     console.error("Error sending notification", error);
//     return { message: "An error occurred. Please try again." };
//   }
// };

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
