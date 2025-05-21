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
  ClientManagementValidators,
  AccomplishmentReportValidators,
  ItemValidators,
  SupplierManagementValidators,
  AccountPayableValidators,
  AccountReceivableValidators,
  TransactionValidators,
  SendEmailEmployeeValidators,
  SendApplicantStatusValidators,
  JobPostValidators,
  TicketValidators,
  ForgotPasswordValidators,
  ResetPasswordValidators,
  ApplicantRequestValidators,
} from "@/validators";
import nodemailer from "nodemailer";
import { CreateAccountHTML } from "@/components/email-templates/create-account";
import { cookies } from "next/headers";
import * as jose from "jose";
import { useUser } from "@/hooks/use-user";
import { RejectLeaveHTML } from "@/components/email-templates/reject-leave";
import bcrypt from "bcryptjs";
import {
  generatePurchaseCode,
  generateRandomPassword,
  generateWithdrawalCode,
} from "@/lib/utils";
import { InitialInterviewDetailsHTML } from "@/components/email-templates/initial-interview";
import {
  TrainingStatusEmailHTML,
  TrainingStatusEmailProps,
} from "@/components/email-templates/status-applicant";
import { useClient } from "@/hooks/use-client";
import { TrainingStatus } from "@/types";
import { ForgotPasswordEmailHTML } from "@/components/email-templates/forgot-password";
import { InquiryEmailHTML } from "@/components/email-templates/contact";
import { TicketStatus } from "@prisma/client";
import { useDepartmentLog } from "@/hooks/use-department-log";
import { ContractEmailHTML } from "@/components/email-templates/client-contract";
import { getManilaNow } from "@/lib/timezone-utils";

const { createDepartmentLog } = useDepartmentLog();

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

    // Check if password is hashed (bcrypt hashes start with '$2b$' or '$2a$')
    const isPasswordHashed =
      user.password.startsWith("$2b$") || user.password.startsWith("$2a$");

    // For hashed passwords: compare using bcrypt
    if (isPasswordHashed) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return { error: "Invalid password" };
      }
    }
    // For non-hashed passwords (auto-generated): direct comparison
    else {
      if (user.password !== password) {
        return { error: "Invalid password" };
      }
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

    // Return isPasswordHashed flag along with other data
    return { token: jwt, user: user, isPasswordHashed };
  } catch (error: any) {
    console.error("Error logging in user", error);
    return {
      error: `Failed to login. Please try again. ${error.message || ""}`,
    };
  }
};

export const forgotPassword = async (
  values: z.infer<typeof ForgotPasswordValidators>
) => {
  const validatedField = ForgotPasswordValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { email } = validatedField.data;

  try {
    const user = await db.userAccount.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return { error: "No user account found." };
    }

    const randomTwelveToken = generateRandomPassword(12);

    const resetLink = `https://bat-security-services-inc.vercel.app/reset-password?token=${randomTwelveToken}&email=${email}`;

    const emailContent = {
      resetLink,
      expiryHours: 1,
    };

    // Email sending configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "bats3curity.9395@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "wfffyihhttplludl",
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER || "bats3curity.9395@gmail.com",
      to: email,
      subject: `Forgot Password - BAT Security Services INC.`,
      html: await ForgotPasswordEmailHTML(emailContent),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Something went wrong.", error);
    return {
      error: `Something went wrong. Please try again. ${error.message || ""}`,
    };
  }
};

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordValidators>,
  email: string
) => {
  const validatedField = ResetPasswordValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { password, confirmPassword } = validatedField.data;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const user = await db.userAccount.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return { error: "No user account found." };
    }

    await db.userAccount.update({
      where: { id: user.id },
      data: {
        password,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error resetting password", error);
    return {
      error: `Failed to reset password. Please try again. ${error.message || ""}`,
    };
  }
};

export const supplierLoginAccount = async (
  values: z.infer<typeof LoginValidators>
) => {
  const validatedField = LoginValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { email, password } = validatedField.data;

  try {
    const user = await db.supplier.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return { error: "No user account found." };
    }

    // Check if password is hashed (bcrypt hashes start with '$2b$' or '$2a$')
    const isPasswordHashed =
      user.password.startsWith("$2b$") || user.password.startsWith("$2a$");

    // For hashed passwords: compare using bcrypt
    if (isPasswordHashed) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return { error: "Invalid password" };
      }
    }
    // For non-hashed passwords (auto-generated): direct comparison
    else {
      if (user.password !== password) {
        return { error: "Invalid password" };
      }
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

    return { token: jwt, user: user, isPasswordHashed };
  } catch (error: any) {
    console.error("Error logging in user", error);
    return {
      error: `Failed to login. Please try again. ${error.message || ""}`,
    };
  }
};

export const clientLoginAccount = async (
  values: z.infer<typeof LoginValidators>
) => {
  const validatedField = LoginValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { email, password } = validatedField.data;

  try {
    const user = await db.client.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return { error: "No user account found." };
    }

    // Check if password is hashed (bcrypt hashes start with '$2b$' or '$2a$')
    const isPasswordHashed =
      user.password.startsWith("$2b$") || user.password.startsWith("$2a$");

    // For hashed passwords: compare using bcrypt
    if (isPasswordHashed) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return { error: "Invalid password" };
      }
    }
    // For non-hashed passwords (auto-generated): direct comparison
    else {
      if (user.password !== password) {
        return { error: "Invalid password" };
      }
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

    return { token: jwt, user: user, isPasswordHashed };
  } catch (error: any) {
    console.error("Error logging in user", error);
    return {
      error: `Failed to login. Please try again. ${error.message || ""}`,
    };
  }
};

export const superAdminLoginAccount = async (
  values: z.infer<typeof LoginValidators>
) => {
  const validatedField = LoginValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { email, password } = validatedField.data;

  try {
    const user = await db.admin.findFirst({
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

    const branch = await db.branch.findFirst({});

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

    return { token: jwt, user: user, branch: branch };
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

export const sendInitialInterviewEmployee = async (
  values: z.infer<typeof SendEmailEmployeeValidators>,
  email: string,
  department: string,
  jobTitle: string,
  branch: string
) => {
  const validatedField = SendEmailEmployeeValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { date, time, location } = validatedField.data;

  // Create date objects
  const dateObj = new Date(date);
  const timeObj = new Date(time);

  // Combine date and time
  const interviewStartTime = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    timeObj.getHours(),
    timeObj.getMinutes()
  );

  // Add 1 hour for end time
  const interviewEndTime = new Date(interviewStartTime);
  interviewEndTime.setHours(interviewEndTime.getHours() + 1);

  try {
    // Save to database first
    await db.applicantList.update({
      where: { email },
      data: {
        interviewDate: interviewStartTime,
        interviewStartTime,
        interviewEndTime,
        interviewLocation: location,
        status: "Scheduled",
      },
    });

    // Format for display
    const formattedDate = interviewStartTime.toLocaleDateString("en-US", {
      timeZone: "Asia/Manila",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const formattedTime = interviewStartTime.toLocaleTimeString("en-US", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Send email
    const htmlContent = await InitialInterviewDetailsHTML({
      email,
      date: formattedDate,
      time: formattedTime,
      department,
      jobTitle,
      branch,
      location,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "bats3curity.9395@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "wfffyihhttplludl",
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER || "bats3curity.9395@gmail.com",
      to: email,
      subject: "Initial Interview Invitation - BAT Security Services INC.",
      text: `Hello ${email},\n\nInterview details...`,
      html: htmlContent,
    });

    await createDepartmentLog(
      "Human Resource",
      `Scheduled interview for ${email} at ${interviewStartTime.toISOString()}`
    );

    return { success: "Interview scheduled and email sent successfully." };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Failed to schedule interview. Please try again." };
  }
};

export const sendEmployeeStatus = async (
  values: z.infer<typeof SendApplicantStatusValidators>,
  currentStatus: TrainingStatus,
  employeeId: string,
  clientId?: string,
  branch?: string,
  jobTitle?: string
) => {
  const validatedField = SendApplicantStatusValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { status, remarks } = validatedField.data;

  // Fetch employee with user account and company data
  const [employee, company] = await Promise.all([
    db.employee.findUnique({
      where: { id: employeeId },
      include: {
        UserAccount: true,
      },
    }),
    clientId ? db.client.findUnique({ where: { id: clientId } }) : null,
  ]);

  if (!employee || !employee.UserAccount || employee.UserAccount.length === 0) {
    return { error: "Employee not found or missing user account" };
  }

  if (currentStatus === "Initial Interview" && status === "Passed") {
    await db.applicantList.delete({
      where: {
        email: employee.UserAccount[0].email,
      },
    });
  }

  // Define status flow based on job title
  const statusFlow: TrainingStatus[] =
    jobTitle !== "Regular Employee"
      ? ["Initial Interview", "Final Interview", "Deployed"]
      : [
          "Initial Interview",
          "Final Interview",
          "Orientation",
          "Physical Training",
          "Customer Service Training",
          "Deployment",
          "Deployed",
        ];

  // Validate current status exists in flow
  const currentIndex = statusFlow.indexOf(currentStatus);
  if (currentIndex === -1) {
    return { error: "Invalid current status" };
  }

  // Determine new status with proper type assertion
  let newTrainingStatus: TrainingStatus;
  if (status === "Passed") {
    // Special case for Head Department - skip to Deployed after Final Interview
    if (
      jobTitle !== "Regular Employee" &&
      currentStatus === "Final Interview"
    ) {
      newTrainingStatus = "Deployed";
    } else {
      // For all other cases, move to next status in flow
      newTrainingStatus = statusFlow[currentIndex + 1] || currentStatus;
    }
  } else if (status === "Failed") {
    // Failed status always goes to Deployed
    newTrainingStatus = "Deployed";
  } else {
    newTrainingStatus = currentStatus;
  }

  // Calculate date 2 days from now
  const twoDaysLater = new Date();
  twoDaysLater.setDate(twoDaysLater.getDate() + 2);

  // Update employee data
  const updateData = {
    status,
    trainingStatus: newTrainingStatus,
    ...(newTrainingStatus === "Deployed" && {
      isNewEmployee: false,
      // Only assign client if not Head Department and in Deployment status
      ...(jobTitle !== "Head Department" &&
        currentStatus === "Deployment" && { clientId }),
    }),
    updatedAt: new Date(),
  };

  await db.employee.update({
    where: { id: employeeId },
    data: updateData,
  });

  // Prepare email content with 2 days later date
  const emailContent: TrainingStatusEmailProps = {
    email: employee.UserAccount[0].email,
    trainingStatus: currentStatus,
    applicationStatus: status as "Passed" | "Failed",
    date: twoDaysLater.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time: "8:00 AM",
    location: "BAT Security Services INC. Office",
    branch,
    company: company?.name,
    remarks,
  };

  // Email sending configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "bats3curity.9395@gmail.com",
      pass: process.env.EMAIL_PASSWORD || "wfffyihhttplludl",
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "bats3curity.9395@gmail.com",
      to: employee.UserAccount[0].email,
      subject: `${currentStatus} Status Update - BAT Security Services INC.`,
      html: await TrainingStatusEmailHTML(emailContent),
    });

    await createDepartmentLog(
      "Human Resource",
      `Sent an email to ${employee.UserAccount[0].email} for ${currentStatus} status`
    );

    return { success: "Status updated and notification sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error);
    return { error: "Failed to send notification email." };
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
      user: "bats3curity.9395@gmail.com",
      pass: "wfffyihhttplludl",
    },
  });

  const message = {
    from: "bats3curity.9395@gmail.com",
    to: email,
    subject: "This is your account details",
    text: `Hello ${name}, your account has been created. Here are your account details: \nEmail: ${email}\nPassword: ${password}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(message);

    await createDepartmentLog(
      "Human Resource",
      `Sent an email to ${email} for account creation`
    );

    return { success: "Email has been sent." };
  } catch (error) {
    console.error("Error sending notification", error);
    return { message: "An error occurred. Please try again." };
  }
};

export const createApplicant = async (
  values: z.infer<typeof ApplicantValidators>,
  newApplicant?: boolean
) => {
  const validatedField = ApplicantValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    positionDesired,
    department,
    email,
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
    isNewEmployee,
    branch,
  } = validatedField.data;

  try {
    const trainingStatus = isNewEmployee ? "Initial Interview" : "";

    const res = await db.employee.create({
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
        isNewEmployee,
        trainingStatus,
        branchId: branch,
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

    const userAccount = await db.userAccount.create({
      data: {
        email,
        employeeId: res.id,
        password: generateRandomPassword(12),
      },
    });

    const fullName = res.firstName + " " + res.lastName;

    if (!isNewEmployee || newApplicant) {
      await sendAccountToEmail(email, userAccount.password, fullName);
    }

    return { success: "Employee created successfully" };
  } catch (error: any) {
    console.error("Error creating employee", error);
    return {
      error: `Failed to create employee. Please try again. ${error.message || ""}`,
    };
  }
};

export const changePurchaseRequestStatusSupplier = async (
  id: string,
  status: string,
  reason?: string
) => {
  const { user } = await useUser();
  if (!id) {
    return { error: "Purchase request ID is required" };
  }

  try {
    if (status === "Received") {
      const request = await db.purchaseRequest.update({
        where: { id },
        data: {
          supplierStatus: status,
          receivedBy: user?.employeeId,
        },
        include: {
          PurchaseRequestItem: {
            include: {
              Item: true,
            },
          },
        },
      });

      for (const item of request.PurchaseRequestItem) {
        const existingInventory = await db.inventory.findFirst({
          where: { itemId: item.itemId },
        });

        if (existingInventory) {
          // Item already in inventory — increment quantity
          await db.inventory.update({
            where: { id: existingInventory.id },
            data: {
              quantity: existingInventory.quantity + item.quantity,
            },
          });
        } else {
          // New item — create inventory record
          await db.inventory.create({
            data: {
              itemId: item.itemId,
              quantity: item.quantity,
              supplierId: item.Item.supplierId,
            },
          });
        }
      }
    } else {
      // If not received, just update status
      await db.purchaseRequest.update({
        where: { id },
        data: {
          supplierStatus: status,
          supplierRemark: reason,
        },
      });
    }

    await createDepartmentLog(
      "Procurement",
      `Updated purchase request status to ${status} for ID ${id}`
    );

    return { success: "Purchase request status updated successfully." };
  } catch (error: any) {
    console.error("Error changing purchase request status", error);
    return {
      error: `Failed to change purchase request status. Please try again. ${error.message || ""}`,
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
    branch,
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
        branchId: branch,
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

    await createDepartmentLog(
      "Human Resource",
      `Updated employee with ID ${id}`
    );

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

    await db.userAccount.deleteMany({
      where: { employeeId: id },
    });

    await createDepartmentLog(
      "Human Resource",
      `Deleted employee with ID ${id}`
    );

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

export const approvePurchaseRequest = async (
  id: string,
  status: string,
  department: string
) => {
  try {
    const updateData: any = {};

    if (department === "Procurement") {
      updateData.procurementStatus = status;
    } else if (department === "Finance") {
      updateData.financeStatus = status;
    } else {
      return {
        error: "Only Procurement or Finance can approve/reject this request.",
      };
    }

    await db.purchaseRequest.update({
      where: { id },
      data: updateData,
    });

    await createDepartmentLog(
      "Finance",
      `Updated purchase request status to ${status} for ID ${id}`
    );

    return { success: `Purchase request ${status.toLowerCase()} successfully` };
  } catch (error: any) {
    console.error("Error approving purchase request", error);
    return {
      error: `Failed to approve purchase request. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const rejectOvertime = async (
  values: z.infer<typeof RejectLeaveValidators>,
  id: string
) => {
  const validatedField = RejectLeaveValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { reasonForRejection } = validatedField.data;

  try {
    await db.extraShift.update({
      where: { id },
      data: {
        status: "Rejected",
        reasonForRejection,
      },
      include: {
        Employee: { include: { UserAccount: true } },
      },
    });

    await createDepartmentLog(
      "Operation",
      `Rejected overtime request with ID ${id}`
    );

    return { success: "Overtime rejected successfully" };
  } catch (error: any) {
    console.error("Error rejecting overtime", error);
    return {
      error: `Failed to reject overtime. Please try again. ${error.message || ""}`,
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
      user: "bats3curity.9395@gmail.com",
      pass: "wfffyihhttplludl",
    },
  });

  const message = {
    from: "bats3curity.9395@gmail.com",
    to: email,
    subject: "Leave Request Rejected",
    text: `Hello ${name}, your requested leave has been rejected due to the following reason: \n${reason}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(message);
    await createDepartmentLog(
      "Operation",
      `Sent an email to ${email} for leave rejection`
    );

    return { success: "Email has been sent." };
  } catch (error) {
    console.error("Error sending notification", error);
    return { message: "An error occurred. Please try again." };
  }
};

export const createBaseSalary = async (
  values: z.infer<typeof BaseSalaryValidators>,
  role?: string
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

    if (role !== "superadmin") {
      await createDepartmentLog(
        "Human Resource",
        `Created a base salary for employee ID ${employee}`
      );
    }

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
  id: string,
  role?: string
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

    if (role !== "superadmin") {
      await createDepartmentLog(
        "Human Resource",
        `Updated base salary for employee ID ${employee}`
      );
    }

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

    await createDepartmentLog(
      "Human Resource",
      `Deleted base salary with ID ${id}`
    );

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
  const { userId } = await useUser();
  const validatedField = ExtraShiftValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { type, timeIn, timeOut } = validatedField.data;

  try {
    const user = await db.userAccount.findUnique({
      where: { id: userId },
      select: { employeeId: true },
    });

    // Create date bounds in Manila timezone
    const today = getManilaNow();
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    // Check if a request already exists for today
    const existingShift = await db.extraShift.findFirst({
      where: {
        employeeId: user?.employeeId,
        date: {
          gte: todayStart.toISOString(),
          lte: todayEnd.toISOString(),
        },
      },
    });

    if (existingShift) {
      return {
        error: "You have already requested overtime today.",
      };
    }

    // Format times properly with Manila timezone in mind
    await db.extraShift.create({
      data: {
        employeeId: user?.employeeId as string,
        type,
        timeStart: timeIn.toISOString(), // The TimePicker component now properly handles the timezone
        timeEnd: timeOut.toISOString(), // The TimePicker component now properly handles the timezone
        date: getManilaNow().toISOString(), // Current date in Manila timezone
        status: "Pending",
      },
    });

    return { success: "Overtime requested successfully" };
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

  const { type, timeIn, timeOut } = validatedField.data;

  try {
    await db.extraShift.update({
      where: { id },
      data: {
        type,
        timeStart: timeIn.toISOString(),
        timeEnd: timeOut.toISOString(),
      },
    });

    return { success: "Requested overtime updated successfully" };
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

    await createDepartmentLog(
      "Operation",
      `Approved extra shift request with ID ${id}`
    );

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

    await createDepartmentLog(
      "Operation",
      `Rejected extra shift request with ID ${id}`
    );

    return { success: "Extra shift rejected successfully" };
  } catch (error: any) {
    console.error("Error rejecting extra shift", error);
    return {
      error: `Failed to reject extra shift. Please try again. ${error.message || ""}`,
    };
  }
};

export const getAttendanceDate = async (
  todayDate: string,
  employeeId: string
) => {
  try {
    const attendance = await db.attendance.findFirst({
      where: {
        employeeId,
        date: todayDate,
      },
    });

    return { attendance };
  } catch (error: any) {
    console.error("Error fetching attendance", error);
    return {
      error: `Failed to fetch attendance. Please try again. ${error.message || ""}`,
    };
  }
};

export const clockInEmployee = async (
  employeeId: string,
  todayDate: string,
  timeIn: string,
  status: string
) => {
  try {
    const attendance = await db.attendance.create({
      data: {
        employeeId,
        date: todayDate,
        timeIn,
        status,
        timeOut: "",
      },
    });

    return { attendance };
  } catch (error: any) {
    console.error("Error creating attendance", error);
    return {
      error: `Failed to create attendance. Please try again. ${error.message || ""}`,
    };
  }
};

export const clockOutEmployee = async (
  attendanceId: string,
  timeOut: string,
  status: string
) => {
  try {
    const attendance = await db.attendance.update({
      where: { id: attendanceId },
      data: {
        timeOut,
        status,
      },
    });

    return { attendance };
  } catch (error: any) {
    console.error("Error updating attendance", error);
    return {
      error: `Failed to update attendance. Please try again. ${error.message || ""}`,
    };
  }
};

export const savePayslipToPdf = async (
  fileName: string,
  batDeduction: number,
  salary: number,
  monthToday: string,
  employeeId: string,
  employeeName: string
) => {
  try {
    // Validate all required fields
    if (!fileName || !employeeId || !monthToday || !employeeName) {
      throw new Error("Missing required fields for payslip creation");
    }

    if (isNaN(batDeduction)) batDeduction = 0;
    if (isNaN(salary)) throw new Error("Invalid salary amount");

    // Check for existing payslip
    const existingPayslip = await db.paySlip.findFirst({
      where: {
        employeeId,
        date: monthToday,
      },
    });

    if (existingPayslip) {
      return { error: "Payslip already exists for this month." };
    }

    // Create payslip record
    const employeePayslip = await db.paySlip.create({
      data: {
        file: fileName,
        date: monthToday,
        employeeId,
      },
      include: {
        Employee: true,
      },
    });

    // Only create transactions if there's a BAT deduction
    if (batDeduction > 0) {
      // Get latest transaction to generate next journal entry number
      const latestTransaction = await db.transaction.findFirst({
        where: {
          journalEntryId: {
            startsWith: "JE",
          },
        },
        orderBy: { createdAt: "desc" },
        select: { journalEntryId: true },
      });

      let nextJournalEntryNumber = "JE000001";
      if (latestTransaction?.journalEntryId) {
        const currentNumber = parseInt(
          latestTransaction.journalEntryId.replace("JE", "")
        );
        if (!isNaN(currentNumber)) {
          const nextNumber = currentNumber + 1;
          nextJournalEntryNumber = `JE${nextNumber.toString().padStart(6, "0")}`;
        }
      }

      // Create both transactions as a single atomic operation
      await db.$transaction([
        // BAT Deduction (Credit)
        db.transaction.create({
          data: {
            name: `BAT Deduction from ${employeeName} - ${monthToday}`,
            accountType: "LIABILITY",
            amount: batDeduction,
            type: "CREDIT",
            branchId: employeePayslip.Employee.branchId,
            description: `BAT withheld from ${employeeName} salary for ${monthToday}`,
            journalEntryId: nextJournalEntryNumber,
            subAccountType: "PAYROLL_TAXES_PAYABLE",
            attachment: fileName,
            status: "Paid",
          },
        }),
        // Salary Expense (Debit)
        db.transaction.create({
          data: {
            name: `${employeeName} Salary - ${monthToday}`,
            accountType: "EXPENSE",
            amount: salary,
            type: "DEBIT",
            branchId: employeePayslip.Employee.branchId,
            description: `Salary paid to ${employeeName} for ${monthToday}`,
            journalEntryId: nextJournalEntryNumber,
            subAccountType: "WAGES_EXPENSE",
            attachment: fileName,
            status: "Paid",
          },
        }),
      ]);
    }

    await createDepartmentLog(
      "Human Resource",
      `Created payslip for ${employeeName} for the month of ${monthToday}`
    );

    return { success: "Payslip saved successfully", fileName };
  } catch (error: any) {
    console.error("Error saving payslip to PDF", {
      error: error.message,
      stack: error.stack,
      input: {
        fileName,
        batDeduction,
        salary,
        monthToday,
        employeeId,
        employeeName,
      },
    });
    return {
      error: `Failed to save payslip. ${error.message || "Unknown error"}`,
    };
  }
};

export const createPurchaseRequest = async (values: any) => {
  const { user } = await useUser();

  try {
    const employee = await db.employee.findUnique({
      where: {
        id: user?.employeeId,
      },
      include: {
        Department: true,
      },
    });

    if (!employee) {
      return { error: "Employee not found" };
    }

    console.log("Passed Data", values);

    const purchaseRequest = await db.purchaseRequest.create({
      data: {
        department: values.department || employee.Department.name,
        employeeId: user?.employeeId as string,
        purchaseCode: generatePurchaseCode(),
        PurchaseRequestItem: {
          create: values.items.map(
            (item: { itemId: any; quantity: any; totalAmount: any }) => {
              return {
                itemId: item.itemId,
                quantity: item.quantity,
                totalAmount: item.totalAmount,
              };
            }
          ),
        },
      },
    });

    return {
      success: "Purchase request created successfully",
      data: purchaseRequest,
    };
  } catch (error: any) {
    console.error("Error creating purchase request", error);
    return {
      error: `Failed to create purchase request. Please try again. ${error.message || ""}`,
    };
  }
};

export const updatePurchaseRequest = async (
  values: any,
  purchaseId: string
) => {
  if (!purchaseId) {
    return { error: "Purchase request ID is required" };
  }

  try {
    // First, delete all existing PurchaseRequestItems for this purchase request
    await db.purchaseRequestItem.deleteMany({
      where: {
        purchaseRequestId: purchaseId,
      },
    });
    // Then, update the purchase request itself (like department)
    await db.purchaseRequest.update({
      where: { id: purchaseId },
      data: {
        department: values.department,
        isEdited: true,
        PurchaseRequestItem: {
          create: values.items.map((item: any) => ({
            quantity: item.quantity,
            totalAmount: item.totalAmount,
            Item: {
              connect: { id: item.itemId },
            },
          })),
        },
      },
    });

    return { success: "Purchase request updated successfully" };
  } catch (error: any) {
    console.error("Error updating purchase request", error);
    return {
      error: `Failed to update purchase request. Please try again. ${error.message || ""}`,
    };
  }
};

export const createWithdrawalRequest = async (values: any) => {
  const { user } = await useUser();

  try {
    const employee = await db.employee.findUnique({
      where: {
        id: user?.employeeId,
      },
      include: {
        Department: true,
      },
    });

    if (!employee) {
      return { error: "Employee not found" };
    }

    const withdrawal = await db.withdrawal.create({
      data: {
        department: values.department || employee.Department.name,
        employeeId: user?.employeeId as string,
        withdrawalCode: generateWithdrawalCode(),
        WithdrawalItem: {
          create: values.items.map((item: { itemId: any; quantity: any }) => {
            return {
              itemId: item.itemId,
              quantity: item.quantity,
            };
          }),
        },
      },
    });

    return {
      success: "Withdrawal created successfully",
      data: withdrawal,
    };
  } catch (error: any) {
    console.error("Error creating withdrawal", error);
    return {
      error: `Failed to create withdrawal. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateWithdrawalRequest = async (
  values: any,
  withdrawalId: string
) => {
  if (!withdrawalId) {
    return { error: "Withdrawal ID is required" };
  }

  try {
    await db.withdrawalItem.deleteMany({
      where: {
        withdrawalId,
      },
    });

    await db.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        department: values.department,
        WithdrawalItem: {
          create: values.items.map((item: any) => ({
            quantity: item.quantity,
            Item: {
              connect: { id: item.itemId },
            },
          })),
        },
      },
    });

    return { success: "Withdrawal updated successfully" };
  } catch (error: any) {
    console.error("Error updating withdrawal", error);
    return {
      error: `Failed to update withdrawal. Please try again. ${error.message || ""}`,
    };
  }
};

export const getPurchaseRequestById = async (id: string) => {
  if (!id) {
    return { error: "Purchase request ID is required" };
  }

  try {
    const purchaseRequest = await db.purchaseRequest.findUnique({
      where: {
        id,
      },
      include: {
        PurchaseRequestItem: {
          include: {
            Item: true,
          },
        },
      },
    });

    return { purchaseRequest };
  } catch (error: any) {
    console.error("Error fetching purchase request", error);
    return {
      error: `Failed to fetch purchase request. Please try again. ${error.message || ""}`,
    };
  }
};

export const getWithdrawalById = async (id: string) => {
  if (!id) {
    return { error: "Withdrawal ID is required" };
  }

  try {
    const withdrawal = await db.withdrawal.findUnique({
      where: {
        id,
      },
      include: {
        WithdrawalItem: {
          include: {
            Item: true,
          },
        },
      },
    });

    return { withdrawal };
  } catch (error: any) {
    console.error("Error fetching withdrawal item", error);
    return {
      error: `Failed to fetch withdrawal item. Please try again. ${error.message || ""}`,
    };
  }
};

export const updatePurchaseRequestStatus = async (
  id: string,
  status: string,
  remarks: string
) => {
  if (!id) {
    return { error: "Purchase request ID is required" };
  }

  try {
    const purchaseRequest = await db.purchaseRequest.findUnique({
      where: { id },
      include: {
        PurchaseRequestItem: {
          include: {
            Item: {
              include: { Supplier: true },
            },
          },
        },
        requestedBy: true,
      },
    });

    if (!purchaseRequest) {
      return { error: "Purchase request not found" };
    }

    // Update status and remarks
    await db.purchaseRequest.update({
      where: { id },
      data: {
        financeStatus: status,
        financeRemark: remarks,
      },
    });

    await db.purchaseRequestItem.updateMany({
      where: { purchaseRequestId: id },
      data: {
        financeItemStatus: status,
      },
    });

    if (status === "Approved") {
      // Group items by supplier
      const supplierMap: Record<
        string,
        {
          supplierName: string;
          supplierId: string;
          totalAmount: number;
          itemNames: string[];
        }
      > = {};

      for (const item of purchaseRequest.PurchaseRequestItem) {
        const supplier = item.Item.Supplier;
        if (!supplierMap[supplier.id]) {
          supplierMap[supplier.id] = {
            supplierName: supplier.name,
            supplierId: supplier.id,
            totalAmount: 0,
            itemNames: [],
          };
        }

        supplierMap[supplier.id].totalAmount += item.totalAmount ?? 0;
        supplierMap[supplier.id].itemNames.push(item.Item.name);
      }

      // Create a transaction per supplier
      for (const supplierId in supplierMap) {
        const supplier = supplierMap[supplierId];

        // Get the latest journal entry number
        const latestTransaction = await db.transaction.findFirst({
          orderBy: { createdAt: "desc" },
          select: { journalEntryId: true },
        });

        let nextJournalEntryNumber = "JE000001";
        if (latestTransaction?.journalEntryId) {
          const currentNumber = parseInt(
            latestTransaction.journalEntryId.replace("JE", "")
          );
          const nextNumber = currentNumber + 1;
          nextJournalEntryNumber = `JE${nextNumber.toString().padStart(6, "0")}`;
        }

        await db.transaction.create({
          data: {
            accountType: "EXPENSE",
            type: "CREDIT",
            supplierId: supplier.supplierId,
            name: `Purchase Request - ${supplier.supplierName}`,
            amount: supplier.totalAmount,
            branchId: purchaseRequest.requestedBy.branchId,
            description: `Items: ${supplier.itemNames.join(", ")}`,
            journalEntryId: nextJournalEntryNumber,
            subAccountType: "SUPPLIES_EXPENSE",
          },
        });
      }
    }

    await createDepartmentLog(
      "Finance",
      `Updated purchase request status to ${status} for ID ${id}`
    );

    return { success: "Purchase request status updated successfully" };
  } catch (error: any) {
    console.error("Error updating purchase request status", error);
    return {
      error: `Failed to update purchase request status. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateWithdrawalStatus = async (
  id: string,
  status: string,
  remarks: string
) => {
  if (!id) {
    return { error: "Withdrawal ID is required" };
  }

  try {
    const withdrawal = await db.withdrawal.findUnique({
      where: { id },
      include: {
        WithdrawalItem: {
          include: {
            Item: true,
          },
        },
      },
    });

    if (!withdrawal) {
      return { error: "Withdrawal not found" };
    }

    // Update status and remarks
    await db.withdrawal.update({
      where: { id },
      data: {
        status,
        remarks,
      },
    });

    if (status === "Approved") {
      // Process each withdrawal item individually
      for (const item of withdrawal.WithdrawalItem) {
        // Find the inventory record for this item
        const inventory = await db.inventory.findFirst({
          where: { itemId: item.itemId },
        });

        if (inventory) {
          // Update the inventory quantity
          await db.inventory.update({
            where: { id: inventory.id },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
        }
      }
    }

    await createDepartmentLog(
      "Inventory",
      `Updated withdrawal status to ${status} for ID ${id}`
    );

    return { success: "Withdrawal status updated successfully" };
  } catch (error: any) {
    console.error("Error updating withdrawal status", error);
    return {
      error: `Failed to update withdrawal status. Please try again. ${error.message || ""}`,
    };
  }
};

export const createClient = async (
  values: z.infer<typeof ClientManagementValidators>
) => {
  const { user } = await useUser();
  const validatedField = ClientManagementValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, email, password } = validatedField.data;

  try {
    await db.client.create({
      data: {
        name,
        email,
        password,
        address: "",
        contactNo: "",
        branchId: user?.Employee.branchId,
      },
    });

    await createDepartmentLog(
      "Customer Relationship",
      `Created a new client: ${name}`
    );

    // send automatic account in email
    await sendAccountToEmail(email, password, name);

    return { success: "Client created successfully" };
  } catch (error: any) {
    console.error("Error creating client", error);
    return {
      error: `Failed to create client. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateClient = async (
  values: z.infer<typeof ClientManagementValidators>,
  id: string
) => {
  if (!id) {
    return { error: "Client ID is required" };
  }

  const validatedField = ClientManagementValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, email, password, address, contactNo, logo } =
    validatedField.data;

  try {
    await db.client.update({
      where: { id },
      data: {
        name,
        email,
        password,
        address,
        contactNo,
        logo,
      },
    });

    await createDepartmentLog(
      "Customer Relationship",
      `Updated client information for ${name}`
    );

    return { success: "Client updated successfully" };
  } catch (error: any) {
    console.error("Error updating client", error);
    return {
      error: `Failed to update client. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteClient = async (id: string) => {
  if (!id) {
    return { error: "Client ID is required" };
  }

  try {
    await db.employee.updateMany({
      where: {
        clientId: id,
      },
      data: {
        clientId: null,
      },
    });

    await db.client.delete({
      where: { id },
    });

    await createDepartmentLog(
      "Customer Relationship",
      `Deleted client with ID ${id}`
    );

    return { success: "Client deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting client", error);
    return {
      error: `Failed to delete client. Please try again. ${error.message || ""}`,
    };
  }
};

export const createSupplier = async (
  values: z.infer<typeof SupplierManagementValidators>
) => {
  const { user } = await useUser();
  const validatedField = SupplierManagementValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, email, password } = validatedField.data;

  try {
    await db.supplier.create({
      data: {
        name,
        email,
        password,
        address: "",
        contactNo: "",
        branchId: user?.Employee.branchId,
      },
    });

    await createDepartmentLog("Procurement", `Created a new supplier: ${name}`);

    // send automatic account in email
    await sendAccountToEmail(email, password, name);

    return { success: "Supplier created successfully" };
  } catch (error: any) {
    console.error("Error creating Supplier", error);
    return {
      error: `Failed to create Supplier. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateSupplier = async (
  values: z.infer<typeof SupplierManagementValidators>,
  id: string
) => {
  if (!id) {
    return { error: "Supplier ID is required" };
  }

  const validatedField = SupplierManagementValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, email, password, address, contactNo, logo } =
    validatedField.data;

  try {
    await db.supplier.update({
      where: { id },
      data: {
        name,
        email,
        password,
        address,
        contactNo,
        logo,
      },
    });

    await createDepartmentLog(
      "Procurement",
      `Updated supplier information for ${name}`
    );

    return { success: "Supplier updated successfully" };
  } catch (error: any) {
    console.error("Error updating Supplier", error);
    return {
      error: `Failed to update Supplier. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteSupplier = async (id: string) => {
  if (!id) {
    return { error: "Supplier ID is required" };
  }

  try {
    await db.items.deleteMany({
      where: {
        supplierId: id,
      },
    });

    await db.supplier.delete({
      where: { id },
    });

    await createDepartmentLog("Procurement", `Deleted supplier with ID ${id}`);

    return { success: "Supplier deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting Supplier", error);
    return {
      error: `Failed to delete Supplier. Please try again. ${error.message || ""}`,
    };
  }
};

export const getAllClients = async (branchId: string) => {
  try {
    const clients = await db.client.findMany({
      where: {
        branchId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, data: clients };
  } catch (error) {
    console.error("Error fetching clients", error);
    return { success: false, error: "Failed to fetch clients" };
  }
};

export const createAccomplishmentReport = async (
  values: z.infer<typeof AccomplishmentReportValidators>
) => {
  const { user } = await useUser();
  const validatedField = AccomplishmentReportValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { report, date, images, remarks } = validatedField.data;

  try {
    await db.accomplishmentReport.create({
      data: {
        report,
        date,
        images,
        remarks,
        employeeId: user?.employeeId as string,
      },
    });

    return { success: "Accomplishment report created successfully" };
  } catch (error: any) {
    console.error("Error creating accomplishment report", error);
    return {
      error: `Failed to create accomplishment report. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateAccomplishmentReport = async (
  values: z.infer<typeof AccomplishmentReportValidators>,
  id: string
) => {
  if (!id) {
    return { error: "Accomplishment report ID is required" };
  }

  const validatedField = AccomplishmentReportValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { report, date, images, remarks } = validatedField.data;

  try {
    await db.accomplishmentReport.update({
      where: { id },
      data: {
        report,
        date,
        images,
        remarks,
      },
    });

    return { success: "Accomplishment report updated successfully" };
  } catch (error: any) {
    console.error("Error updating accomplishment report", error);
    return {
      error: `Failed to update accomplishment report. Please try again. ${error.message || ""}`,
    };
  }
};

export const getAllNotificationsOperations = async (branch: string) => {
  try {
    const notifications = await db.accomplishmentReport.findMany({
      where: {
        isViewed: false,
        Employee: {
          branchId: branch,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        Employee: true,
      },
    });

    return { success: true, data: notifications };
  } catch (error) {
    console.error("Error fetching notifications", error);
    return { success: false, error: "Failed to fetch notifications" };
  }
};

export const viewedNotificationOperations = async (id: string) => {
  try {
    const notifications = await db.accomplishmentReport.update({
      where: {
        id,
      },
      data: {
        isViewed: true,
      },
    });

    return { success: true, data: notifications };
  } catch (error) {
    console.error("Error updating notifications", error);
    return { success: false, error: "Failed to update notifications" };
  }
};

export const createItem = async (values: z.infer<typeof ItemValidators>) => {
  const validatedField = ItemValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    name,
    unitPrice,
    description,
    supplierId,
    isSmallItem,
    specification,
  } = validatedField.data;

  try {
    await db.items.create({
      data: {
        name,
        unitPrice,
        description,
        supplierId,
        isSmallItem,
        specification,
      },
    });

    await createDepartmentLog("Procurement", `Created a new item: ${name}`);

    return { success: "Item created successfully" };
  } catch (error: any) {
    console.error("Error creating item", error);
    return {
      error: `Failed to create item. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateItem = async (
  values: z.infer<typeof ItemValidators>,
  id: string
) => {
  if (!id) {
    return { error: "Item ID is required" };
  }

  const validatedField = ItemValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    name,
    unitPrice,
    description,
    supplierId,
    isSmallItem,
    specification,
  } = validatedField.data;

  try {
    await db.items.update({
      where: { id },
      data: {
        name,
        unitPrice,
        description,
        supplierId,
        isSmallItem,
        specification,
      },
    });

    await createDepartmentLog(
      "Procurement",
      `Updated item information for ${name}`
    );

    return { success: "Item updated successfully" };
  } catch (error: any) {
    console.error("Error updating item", error);
    return {
      error: `Failed to update item. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteItem = async (id: string) => {
  if (!id) {
    return { error: "Item ID is required" };
  }

  try {
    await db.items.delete({
      where: { id },
    });

    await createDepartmentLog("Procurement", `Deleted item with ID ${id}`);

    return { success: "Item deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting item", error);
    return {
      error: `Failed to delete item. Please try again. ${error.message || ""}`,
    };
  }
};

export const createAccountPayable = async (
  values: z.infer<typeof AccountPayableValidators>
) => {
  const { user } = await useUser();
  const validatedField = AccountPayableValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    name,
    supplierId,
    accountType,
    amount,
    description,
    subAccountType,
    attachment,
  } = validatedField.data;

  try {
    const latestTransaction = await db.transaction.findFirst({
      orderBy: { createdAt: "desc" },
      select: { journalEntryId: true },
    });

    let nextJournalEntryNumber = "JE000001";
    if (latestTransaction?.journalEntryId) {
      const currentNumber = parseInt(
        latestTransaction.journalEntryId.replace("JE", "")
      );
      const nextNumber = currentNumber + 1;
      nextJournalEntryNumber = `JE${nextNumber.toString().padStart(6, "0")}`;
    }

    await db.transaction.create({
      data: {
        name,
        supplierId,
        accountType,
        amount,
        type: "CREDIT",
        branchId: user?.Employee.branchId,
        description,
        journalEntryId: nextJournalEntryNumber,
        subAccountType,
        attachment,
      },
    });

    await createDepartmentLog(
      "Finance",
      `Created a new account payable: ${name}`
    );

    return { success: "Account payable created successfully" };
  } catch (error: any) {
    console.error("Error creating account payable", error);
    return {
      error: `Failed to create account payable. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateAccountPayable = async (
  values: z.infer<typeof AccountPayableValidators>,
  id: string
) => {
  const { user } = await useUser();

  if (!id) {
    return { error: "Account payable ID is required" };
  }

  const validatedField = AccountPayableValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    name,
    supplierId,
    accountType,
    amount,
    description,
    subAccountType,
    attachment,
  } = validatedField.data;

  try {
    const existingTransaction = await db.transaction.findUnique({
      where: { id },
      select: { journalEntryId: true },
    });

    let journalEntryNumber = existingTransaction?.journalEntryId;
    if (!journalEntryNumber) {
      const latestTransaction = await db.transaction.findFirst({
        orderBy: { createdAt: "desc" },
        select: { journalEntryId: true },
      });

      let nextJournalEntryNumber = "JE000001";
      if (latestTransaction?.journalEntryId) {
        const currentNumber = parseInt(
          latestTransaction.journalEntryId.replace("JE", "")
        );
        const nextNumber = currentNumber + 1;
        nextJournalEntryNumber = `JE${nextNumber.toString().padStart(6, "0")}`;
      }
      journalEntryNumber = nextJournalEntryNumber;
    }

    await db.transaction.update({
      where: { id },
      data: {
        name,
        supplierId,
        accountType,
        amount,
        type: "CREDIT",
        description,
        branchId: user?.Employee.branchId,
        journalEntryId: journalEntryNumber,
        subAccountType,
        attachment,
      },
    });

    await createDepartmentLog(
      "Finance",
      `Updated account payable information for ${name}`
    );

    return { success: "Account payable updated successfully" };
  } catch (error: any) {
    console.error("Error updating account payable", error);
    return {
      error: `Failed to update account payable. Please try again. ${error.message || ""}`,
    };
  }
};

export const createAccountReceivable = async (
  values: z.infer<typeof AccountReceivableValidators>
) => {
  const { user } = await useUser();
  const validatedField = AccountReceivableValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    name,
    clientId,
    accountType,
    amount,
    description,
    subAccountType,
    attachment,
  } = validatedField.data;

  try {
    const latestTransaction = await db.transaction.findFirst({
      orderBy: { createdAt: "desc" },
      select: { journalEntryId: true },
    });

    let nextJournalEntryNumber = "JE000001";
    if (latestTransaction?.journalEntryId) {
      const currentNumber = parseInt(
        latestTransaction.journalEntryId.replace("JE", "")
      );
      const nextNumber = currentNumber + 1;
      nextJournalEntryNumber = `JE${nextNumber.toString().padStart(6, "0")}`;
    }

    await db.transaction.create({
      data: {
        name,
        clientId,
        accountType,
        amount,
        type: "DEBIT",
        branchId: user?.Employee.branchId,
        description,
        journalEntryId: nextJournalEntryNumber,
        subAccountType,
        attachment,
      },
    });

    await createDepartmentLog(
      "Finance",
      `Created a new account receivable: ${name}`
    );

    return { success: "Account receivable created successfully" };
  } catch (error: any) {
    console.error("Error creating account receivable", error);
    return {
      error: `Failed to create account receivable. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateAccountReceivable = async (
  values: z.infer<typeof AccountReceivableValidators>,
  id: string
) => {
  const { user } = await useUser();
  if (!id) {
    return { error: "Account Receivable ID is required" };
  }

  const validatedField = AccountReceivableValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    name,
    clientId,
    accountType,
    amount,
    description,
    subAccountType,
    attachment,
  } = validatedField.data;

  try {
    const existingTransaction = await db.transaction.findUnique({
      where: { id },
      select: { journalEntryId: true },
    });

    let journalEntryNumber = existingTransaction?.journalEntryId;
    if (!journalEntryNumber) {
      const latestTransaction = await db.transaction.findFirst({
        orderBy: { createdAt: "desc" },
        select: { journalEntryId: true },
      });

      let nextJournalEntryNumber = "JE000001";
      if (latestTransaction?.journalEntryId) {
        const currentNumber = parseInt(
          latestTransaction.journalEntryId.replace("JE", "")
        );
        const nextNumber = currentNumber + 1;
        nextJournalEntryNumber = `JE${nextNumber.toString().padStart(6, "0")}`;
      }
      journalEntryNumber = nextJournalEntryNumber;
    }

    await db.transaction.update({
      where: { id },
      data: {
        name,
        clientId,
        accountType,
        amount,
        type: "DEBIT",
        branchId: user?.Employee.branchId,
        description,
        journalEntryId: journalEntryNumber,
        attachment,
        subAccountType,
      },
    });

    await createDepartmentLog(
      "Finance",
      `Updated account receivable information for ${name}`
    );

    return { success: "Account receivable updated successfully" };
  } catch (error: any) {
    console.error("Error updating account receivable", error);
    return {
      error: `Failed to update account receivable. Please try again. ${error.message || ""}`,
    };
  }
};

export const markAsPaid = async (id: string) => {
  if (!id) {
    return { error: "Transaction ID is required" };
  }

  try {
    await db.transaction.update({
      where: { id },
      data: {
        status: "Paid",
      },
    });

    await createDepartmentLog(
      "Finance",
      `Marked transaction with ID ${id} as paid`
    );

    return { success: "Transaction marked as paid successfully" };
  } catch (error: any) {
    console.error("Error marking transaction as paid", error);
    return {
      error: `Failed to mark transaction as paid. Please try again. ${error.message || ""}`,
    };
  }
};

export const createTransaction = async (
  values: z.infer<typeof TransactionValidators>
) => {
  const { user } = await useUser();

  const validatedField = TransactionValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    name,
    supplierId,
    clientId,
    type,
    accountType,
    amount,
    description,
    subAccountType,
    attachment,
  } = validatedField.data;

  try {
    const result = await db.$transaction(async (tx) => {
      // Find the latest inside the transaction
      const latestTransaction = await tx.transaction.findFirst({
        orderBy: { createdAt: "desc" },
        select: { journalEntryId: true },
      });

      let newJournalEntryNumber = "JE000001"; // default if none exist

      if (latestTransaction?.journalEntryId) {
        const latestNumber = parseInt(
          latestTransaction.journalEntryId.replace("JE", "")
        );
        const incrementedNumber = latestNumber + 1;
        newJournalEntryNumber = `JE${incrementedNumber
          .toString()
          .padStart(6, "0")}`;
      }

      // Create inside the same transaction
      const newTransaction = await tx.transaction.create({
        data: {
          name,
          supplierId,
          clientId,
          accountType,
          amount,
          type,
          branchId: user?.Employee.branchId,
          description,
          subAccountType,
          attachment,
          journalEntryId: newJournalEntryNumber,
        },
      });

      return newTransaction;
    });

    await createDepartmentLog("Finance", `Created a new transaction: ${name}`);

    return { success: "Transaction created successfully", data: result };
  } catch (error: any) {
    console.error("Error creating transaction", error);
    return {
      error: `Failed to create transaction. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updateTransaction = async (
  values: z.infer<typeof TransactionValidators>,
  id: string
) => {
  const { user } = await useUser();

  if (!id) {
    return { error: "Transaction ID is required" };
  }

  const validatedField = TransactionValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    name,
    supplierId,
    clientId,
    type,
    accountType,
    amount,
    description,
    subAccountType,
    attachment,
  } = validatedField.data;

  try {
    await db.$transaction(async (tx) => {
      const existingTransaction = await tx.transaction.findUnique({
        where: { id },
        select: { journalEntryId: true },
      });

      let journalEntryNumber = existingTransaction?.journalEntryId;

      // If missing, generate a new journal entry number
      if (!journalEntryNumber) {
        const latestTransaction = await tx.transaction.findFirst({
          orderBy: { createdAt: "desc" },
          select: { journalEntryId: true },
        });

        let newJournalEntryNumber = "JE000001"; // default if none exists
        if (latestTransaction?.journalEntryId) {
          const latestNumber = parseInt(
            latestTransaction.journalEntryId.replace("JE", "")
          );
          const incrementedNumber = latestNumber + 1;
          newJournalEntryNumber = `JE${incrementedNumber
            .toString()
            .padStart(6, "0")}`;
        }

        journalEntryNumber = newJournalEntryNumber;
      }

      await tx.transaction.update({
        where: { id },
        data: {
          name,
          supplierId,
          clientId,
          accountType,
          amount,
          type,
          description,
          branchId: user?.Employee.branchId,
          subAccountType,
          attachment,
          journalEntryId: journalEntryNumber,
        },
      });
    });

    await createDepartmentLog(
      "Finance",
      `Updated transaction information for ${name}`
    );

    return { success: "Transaction updated successfully" };
  } catch (error: any) {
    console.error("Error updating transaction", error);
    return {
      error: `Failed to update transaction. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const addTreshold = async (id: string, treshold: number) => {
  if (!id) {
    return { error: "Item ID is required" };
  }

  try {
    await db.inventory.update({
      where: { id },
      data: {
        treshold,
      },
    });

    await createDepartmentLog(
      "Inventory",
      `Set reorder threshold for item ID ${id} to ${treshold}`
    );

    return { success: "Reorder threshold set successfully" };
  } catch (error: any) {
    console.error("Error setting reorder threshold", error);
    return {
      error: `Failed to set reorder threshold. Please try again. ${error.message || ""}`,
    };
  }
};

export const getItemById = async (id: string) => {
  if (!id) {
    return { error: "Item ID is required" };
  }

  try {
    const item = await db.items.findUnique({
      where: { id },
      include: {
        Supplier: true,
      },
    });

    return { item };
  } catch (error: any) {
    console.error("Error fetching item", error);
    return {
      error: `Failed to fetch item. Please try again. ${error.message || ""}`,
    };
  }
};

export const createJobPost = async (
  values: z.infer<typeof JobPostValidators>
) => {
  const { user } = await useUser();
  const validatedField = JobPostValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { title, description, attachment, jobPosition, department } =
    validatedField.data;

  try {
    await db.jobPosting.create({
      data: {
        title,
        description,
        attachment,
        jobTitleId: jobPosition,
        branchId: user?.Employee.branchId,
        departmentId: department,
      },
    });

    await createDepartmentLog(
      "Human Resource",
      `Created a new job post: ${title}`
    );

    return { success: "Job post created successfully" };
  } catch (error: any) {
    console.error("Error creating job post", error);
    return {
      error: `Failed to create job post. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateJobPost = async (
  values: z.infer<typeof JobPostValidators>,
  id: string
) => {
  if (!id) {
    return { error: "Job post ID is required" };
  }

  const validatedField = JobPostValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    title,
    description,
    attachment,
    financialStatus,
    adminApproval,
    jobPosition,
    department,
  } = validatedField.data;

  try {
    await db.jobPosting.update({
      where: { id },
      data: {
        title,
        description,
        attachment,
        finacialStatus: financialStatus,
        adminApproval,
        jobTitleId: jobPosition,
        departmentId: department,
      },
    });

    return { success: "Job post updated successfully" };
  } catch (error: any) {
    console.error("Error updating job post", error);
    return {
      error: `Failed to update job post. Please try again. ${error.message || ""}`,
    };
  }
};

export const submitApplication = async (
  data: {
    firstName: string;
    lastName: string;
    email: string;
    branch: string;
    department: string;
    jobTitle: string;
    resume: string;
  },
  jobPostId: string
) => {
  try {
    await db.applicantList.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        branchId: data.branch,
        resume: data.resume,
        departmentId: data.department,
        jobTitleId: data.jobTitle,
        jobPostingId: jobPostId,
      },
    });

    return { success: "Application submitted successfully" };
  } catch (error: any) {
    console.error("Error submitting application", error);
    return {
      error: `Failed to submit application. Please try again. ${error.message || ""}`,
    };
  }
};

export const createLeave = async (
  values: z.infer<typeof LeaveManagementValidators>
) => {
  const { userId } = await useUser();
  const validatedField = LeaveManagementValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    leaveType,
    startDate,
    endDate,
    leaveReason,
    attachment,
    isPaid,
    daysUsed,
    year,
  } = validatedField.data;

  try {
    // Get employee ID from user
    const user = await db.userAccount.findUnique({
      where: { id: userId },
      select: { employeeId: true },
    });

    if (!user?.employeeId) {
      return { error: "Employee not found" };
    }

    // Check balance if this is a paid leave request
    if (isPaid) {
      const balance = await getEmployeeLeaveBalance(user.employeeId, year);
      if (daysUsed > balance.paidLeaveTotal - balance.paidLeaveUsed) {
        return { error: "Not enough paid leave days available" };
      }
    }

    // Create the leave request
    const leave = await db.leaveManagement.create({
      data: {
        employeeId: user.employeeId,
        leaveType,
        startDate,
        endDate,
        leaveReason,
        attachment,
        isPaid,
        daysUsed,
        year,
        status: "Pending",
      },
    });

    return {
      success: "Leave requested successfully",
      data: leave,
    };
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

  const {
    leaveType,
    startDate,
    endDate,
    leaveReason,
    attachment,
    isPaid,
    daysUsed,
    year,
  } = validatedField.data;

  try {
    // First get the existing leave to check for changes
    const existingLeave = await db.leaveManagement.findUnique({
      where: { id },
      select: {
        employeeId: true,
        status: true,
        isPaid: true,
        daysUsed: true,
        year: true,
      },
    });

    if (!existingLeave) {
      return { error: "Leave not found" };
    }

    // Update the leave request
    const updatedLeave = await db.leaveManagement.update({
      where: { id },
      data: {
        leaveType,
        startDate,
        endDate,
        leaveReason,
        attachment,
        isPaid,
        daysUsed,
        year,
      },
    });

    // Handle leave balance adjustments if status changed to Approved
    if (updatedLeave.status === "Approved" && isPaid) {
      // If this was previously not approved or was unpaid, we need to add to balance
      if (existingLeave.status !== "Approved" || !existingLeave.isPaid) {
        await db.employeeLeaveBalance.upsert({
          where: {
            employeeId_year: {
              employeeId: existingLeave.employeeId,
              year,
            },
          },
          create: {
            employeeId: existingLeave.employeeId,
            year,
            paidLeaveUsed: daysUsed,
            paidLeaveTotal: 5,
          },
          update: {
            paidLeaveUsed: {
              increment: daysUsed,
            },
          },
        });
      }
      // If daysUsed changed and it was previously approved/paid
      else if (existingLeave.daysUsed !== daysUsed) {
        const difference = daysUsed - existingLeave.daysUsed;
        await db.employeeLeaveBalance.update({
          where: {
            employeeId_year: {
              employeeId: existingLeave.employeeId,
              year,
            },
          },
          data: {
            paidLeaveUsed: {
              increment: difference,
            },
          },
        });
      }
    }

    return {
      success: "Leave updated successfully",
      data: updatedLeave,
    };
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

export const approveLeave = async (leaveId: string) => {
  const { user } = await useUser();
  try {
    // First get the leave details
    const leave = await db.leaveManagement.findUnique({
      where: { id: leaveId },
      select: {
        employeeId: true,
        isPaid: true,
        daysUsed: true,
        year: true,
        status: true,
      },
    });

    if (!leave) {
      return { error: "Leave not found" };
    }

    // Update leave status to Approved
    const updatedLeave = await db.leaveManagement.update({
      where: { id: leaveId },
      data: {
        status: "Approved",
        approvedById: user?.employeeId,
      },
    });

    // If paid leave, update the balance
    if (leave.isPaid) {
      await db.employeeLeaveBalance.upsert({
        where: {
          employeeId_year: {
            employeeId: leave.employeeId,
            year: leave.year,
          },
        },
        create: {
          employeeId: leave.employeeId,
          year: leave.year,
          paidLeaveUsed: leave.daysUsed,
          paidLeaveTotal: 5,
        },
        update: {
          paidLeaveUsed: {
            increment: leave.daysUsed,
          },
        },
      });
    }

    await createDepartmentLog(
      "Operation",
      `Approved leave request for employee ID ${leave.employeeId}`
    );

    return {
      success: "Leave approved successfully",
      data: updatedLeave,
    };
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
    await createDepartmentLog(
      "Operation",
      `Rejected leave request for employee ID ${res.Employee.id}`
    );

    return { success: "Leave rejected successfully" };
  } catch (error: any) {
    console.error("Error rejecting leave", error);
    return {
      error: `Failed to reject leave. Please try again. ${error.message || ""}`,
    };
  }
};

export const getEmployeeLeaveBalance = async (
  employeeId: string,
  year: number
) => {
  if (!employeeId || !year) {
    throw new Error("Missing required parameters: employeeId or year");
  }

  try {
    let balance = await db.employeeLeaveBalance.findUnique({
      where: {
        employeeId_year: {
          employeeId,
          year,
        },
      },
    });

    if (!balance) {
      balance = await db.employeeLeaveBalance.create({
        data: {
          year,
          employeeId,
          paidLeaveTotal: 5,
          paidLeaveUsed: 0,
        },
      });
    }

    return {
      paidLeaveTotal: balance.paidLeaveTotal,
      paidLeaveUsed: balance.paidLeaveUsed,
    };
  } catch (error) {
    console.error("Error in getEmployeeLeaveBalance:", error);
    throw error;
  }
};

export const updateLeaveBalance = async (
  employeeId: string,
  year: number,
  daysUsed: number,
  isPaid: boolean
) => {
  if (isPaid) {
    await db.employeeLeaveBalance.update({
      where: {
        employeeId_year: {
          employeeId,
          year,
        },
      },
      data: {
        paidLeaveUsed: {
          increment: daysUsed,
        },
      },
    });
  }
};

export const createEvaluation = async (data: {
  employeeId: string;
  clientId: string | null;
  date: Date;
  average: number;
  summary: string;
  comments?: string;
  ratings: {
    criteria: string;
    description: string;
    rating: number;
    comments?: string;
  }[];
}) => {
  try {
    // Create the evaluation first
    const evaluation = await db.evaluation.create({
      data: {
        date: data.date,
        average: data.average,
        summary: data.summary,
        comments: data.comments,
        employeeId: data.employeeId,
        clientId: data.clientId,
      },
    });

    // Then create all the ratings
    const ratings = await db.evaluationRating.createMany({
      data: data.ratings.map((rating) => ({
        criteria: rating.criteria,
        description: rating.description,
        rating: rating.rating,
        comments: rating.comments,
        evaluationId: evaluation.id,
      })),
    });

    return { evaluation, ratings };
  } catch (error) {
    console.error("Error creating evaluation:", error);
    return { error: "Failed to create evaluation" };
  }
};

export const getEmployeeEvaluations = async (employeeId: string) => {
  try {
    const evaluations = await db.evaluation.findMany({
      where: { employeeId },
      include: {
        ratings: true,
        client: true,
      },
      orderBy: {
        date: "desc",
      },
    });
    return evaluations;
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    throw new Error("Failed to fetch evaluations");
  }
};

export const createTicket = async (
  values: z.infer<typeof TicketValidators>
) => {
  const { user } = await useClient();
  const validatedField = TicketValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { type, priority, title, description, attachments, employeeId } =
    validatedField.data;

  try {
    await db.ticket.create({
      data: {
        type,
        priority,
        title,
        description,
        attachments,
        employeeId,
        clientId: user?.id,
      },
    });

    return { success: "Ticket created successfully" };
  } catch (error: any) {
    console.error("Error creating ticket", error);
    return {
      error: `Failed to create ticket. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateTicket = async (
  values: z.infer<typeof TicketValidators>,
  id: string
) => {
  const { user } = await useClient();
  if (!id) {
    return { error: "Ticket ID is required" };
  }

  const validatedField = TicketValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { type, priority, title, description, attachments, employeeId } =
    validatedField.data;

  try {
    await db.ticket.update({
      where: { id },
      data: {
        type,
        priority,
        title,
        description,
        attachments,
        employeeId,
        clientId: user?.id,
      },
    });

    return { success: "Ticket updated successfully" };
  } catch (error: any) {
    console.error("Error updating ticket", error);
    return {
      error: `Failed to update ticket. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteTicket = async (id: string) => {
  if (!id) {
    return { error: "Ticket ID is required" };
  }

  try {
    await db.ticket.delete({
      where: { id },
    });

    return { success: "Ticket deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting ticket", error);
    return {
      error: `Failed to delete ticket. Please try again. ${error.message || ""}`,
    };
  }
};

export const sendTrainingStatus = async (
  currentStatus: TrainingStatus,
  employeeId: string,
  status: "Passed" | "Failed",
  clientId?: string,
  branch?: string,
  data?: {
    average: number;
    summary: string;
    comments?: string;
    ratings: {
      rating: number;
      comments: string;
    }[];
  }
) => {
  // Fetch employee with user account and company data
  const [employee, company] = await Promise.all([
    db.employee.findUnique({
      where: { id: employeeId },
      include: {
        UserAccount: true,
      },
    }),
    clientId ? db.client.findUnique({ where: { id: clientId } }) : null,
  ]);

  if (!employee || !employee.UserAccount || employee.UserAccount.length === 0) {
    return { error: "Employee not found or missing user account" };
  }

  // Correct status progression
  const statusFlow: TrainingStatus[] = [
    "Initial Interview",
    "Final Interview",
    "Orientation",
    "Physical Training",
    "Customer Service Training",
    "Deployment",
  ];

  // Validate current status exists in flow
  const currentIndex = statusFlow.indexOf(currentStatus);
  if (currentIndex === -1) {
    return { error: "Invalid current status" };
  }

  // Get next status
  const getNextStatus = () => {
    return statusFlow[currentIndex + 1] || currentStatus;
  };

  // Determine new status
  let newTrainingStatus: TrainingStatus = currentStatus;
  if (status === "Passed") {
    newTrainingStatus = getNextStatus();
  } else if (status === "Failed") {
    newTrainingStatus = "Deployed";
  }

  // Calculate date 2 days from now
  const twoDaysLater = new Date();
  twoDaysLater.setDate(twoDaysLater.getDate() + 2);

  // Update employee data
  const updateData = {
    status,
    trainingStatus: newTrainingStatus,
    ...(newTrainingStatus === "Deployed" &&
      status === "Passed" && {
        clientId,
        isNewEmployee: false,
      }),
    updatedAt: new Date(),
  };

  await db.employee.update({
    where: { id: employeeId },
    data: updateData,
  });

  // Prepare email content with 2 days later date
  const emailContent: TrainingStatusEmailProps = {
    email: employee.UserAccount[0].email,
    trainingStatus: currentStatus,
    applicationStatus: status as "Passed" | "Failed",
    date: twoDaysLater.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time: "8:00 AM",
    location: "BAT Security Services INC. Office",
    branch,
    company: company?.name,
    remarks: data?.comments,
    averageRating: data?.average,
    failureReason: "",
    overallPerformance: data?.summary,
  };

  // Email sending configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "bats3curity.9395@gmail.com",
      pass: process.env.EMAIL_PASSWORD || "wfffyihhttplludl",
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "bats3curity.9395@gmail.com",
      to: employee.UserAccount[0].email,
      subject: `${currentStatus} Status Update - BAT Security Services INC.`,
      html: await TrainingStatusEmailHTML(emailContent),
    });

    await createDepartmentLog(
      "Operation",
      `Updated training status for employee ID ${employeeId} to ${newTrainingStatus}`
    );

    await createDepartmentLog(
      "Human Resource",
      `Updated training status for employee ID ${employeeId} to ${newTrainingStatus}`
    );

    return { success: "Status updated and notification sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error);
    return { error: "Failed to send notification email." };
  }
};

export const assignToClient = async (
  employeeId: string,
  clientId: string,
  email: string
) => {
  if (!employeeId || !clientId) {
    return { error: "Employee ID and Client ID are required" };
  }

  try {
    const userAccount = await db.userAccount.findFirst({
      where: {
        employeeId,
      },
      include: {
        Employee: {
          include: {
            Branch: true,
          },
        },
      },
    });

    if (!userAccount) {
      return { error: "User account not found" };
    }

    const client = await db.client.findUnique({
      where: { id: clientId },
    });

    await db.employee.update({
      where: { id: employeeId },
      data: {
        clientId,
        isNewEmployee: false,
        trainingStatus: "Deployed",
      },
    });

    const fullName = `${userAccount.Employee.firstName} ${userAccount.Employee.lastName}`;

    await sendAccountToEmail(email, userAccount.password, fullName);

    // Calculate date 2 days from now
    const twoDaysLater = new Date();
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);

    // Prepare email content with 2 days later date
    const emailContent: TrainingStatusEmailProps = {
      email,
      trainingStatus: "Deployment",
      applicationStatus: "Passed",
      date: twoDaysLater.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: "8:00 AM",
      location: "BAT Security Services INC. Office",
      branch: userAccount?.Employee.Branch.name,
      company: client?.name,
      remarks: "",
      failureReason: "",
    };

    // Email sending configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "bats3curity.9395@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "wfffyihhttplludl",
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER || "bats3curity.9395@gmail.com",
      to: email,
      subject: `You are now ready for deployment - BAT Security Services INC.`,
      html: await TrainingStatusEmailHTML(emailContent),
    });

    await createDepartmentLog(
      "Operation",
      `Assigned employee ID ${employeeId} to client ID ${clientId}`
    );

    return { success: "Status updated and notification sent successfully." };
  } catch (error: any) {
    console.error("Error assigning employee to client", error);
    return {
      error: `Failed to assign employee to client. Please try again. ${error.message || ""}`,
    };
  }
};

export const contactQuery = async (values: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const { name, email, message, subject } = values;
  try {
    await db.contact.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    const emailContent = {
      name,
      email,
      subject,
      message,
    };

    // Email sending configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "bats3curity.9395@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "wfffyihhttplludl",
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER || "bats3curity.9395@gmail.com",
      subject: `You have a new inquiry - BAT Security Services INC.`,
      html: await InquiryEmailHTML(emailContent),
    });

    return { success: "Message sent successfully" };
  } catch (error: any) {
    console.error("Error sending message", error);
    return {
      error: `Failed to send message. Please try again. ${error.message || ""}`,
    };
  }
};

export const changePayrollStatus = async (
  baseSalaryId: string,
  status: string,
  reason: string
) => {
  if (!baseSalaryId) {
    return { error: "Employee ID is required" };
  }

  try {
    await db.baseSalary.update({
      where: { id: baseSalaryId },
      data: {
        status,
        reason,
      },
    });

    await createDepartmentLog(
      "Finance",
      `Updated payroll status for employee ID ${baseSalaryId} to ${status}`
    );

    return { success: "Payroll status updated successfully" };
  } catch (error: any) {
    console.error("Error updating payroll status", error);
    return {
      error: `Failed to update payroll status. Please try again. ${error.message || ""}`,
    };
  }
};

export async function updateAccount(
  data: {
    firstName: string;
    lastName: string;
    profilePicture?: string | null;
    newPassword?: string;
    confirmPassword?: string;
  },
  employeeId: string
) {
  try {
    // First, find the user account to get its ID
    const userAccount = await db.userAccount.findFirst({
      where: { employeeId: employeeId },
    });

    if (!userAccount) {
      throw new Error("User account not found");
    }

    // Update password if provided
    if (data.newPassword) {
      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      await db.userAccount.update({
        where: { id: userAccount.id }, // Using id instead of employeeId
        data: { password: hashedPassword },
      });
    }

    // Update employee details
    const updatedEmployee = await db.employee.update({
      where: { id: employeeId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        profilePicture: data.profilePicture || null,
      },
      include: { UserAccount: true },
    });

    return updatedEmployee;
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
}

export async function updateProfileImage(imageUrl: string, employeeId: string) {
  if (!employeeId) {
    throw new Error("Unauthorized");
  }

  try {
    const updatedEmployee = await db.employee.update({
      where: { id: employeeId },
      data: { profilePicture: imageUrl },
    });

    return updatedEmployee;
  } catch (error) {
    console.error("Error updating profile image:", error);
    throw error;
  }
}

export async function updateClientAccount(
  data: {
    name: string;
    email: string;
    logo?: string | null;
    address?: string;
    contactNo?: string;
    newPassword?: string;
  },
  clientId: string
) {
  try {
    // Update password if provided
    if (data.newPassword) {
      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      await db.client.update({
        where: { id: clientId },
        data: { password: hashedPassword },
      });
    }

    // Update client details
    const updatedClient = await db.client.update({
      where: { id: clientId },
      data: {
        name: data.name,
        email: data.email,
        logo: data.logo || null,
        address: data.address,
        contactNo: data.contactNo,
      },
    });

    return updatedClient;
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
}

export async function updateClientLogo(imageUrl: string, clientId: string) {
  if (!clientId) {
    throw new Error("Unauthorized");
  }

  try {
    const updatedClient = await db.client.update({
      where: { id: clientId },
      data: { logo: imageUrl },
    });

    return updatedClient;
  } catch (error) {
    console.error("Error updating logo:", error);
    throw error;
  }
}

export async function updateSupplierLogo(imageUrl: string, supplierId: string) {
  if (!supplierId) {
    throw new Error("Unauthorized");
  }

  try {
    const updatedSupplier = await db.supplier.update({
      where: { id: supplierId },
      data: { logo: imageUrl },
    });

    return updatedSupplier;
  } catch (error) {
    console.error("Error updating logo:", error);
    throw error;
  }
}

export async function updateSupplierAccount(
  data: {
    name: string;
    email: string;
    logo?: string | null;
    address?: string;
    contactNo?: string;
    newPassword?: string;
  },
  supplierId: string
) {
  try {
    // Update password if provided
    if (data.newPassword) {
      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      await db.supplier.update({
        where: { id: supplierId },
        data: { password: hashedPassword },
      });
    }

    // Update supplier details
    const updatedSupplier = await db.supplier.update({
      where: { id: supplierId },
      data: {
        name: data.name,
        email: data.email,
        logo: data.logo || null,
        address: data.address,
        contactNo: data.contactNo,
      },
    });

    return updatedSupplier;
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
}

export const createRequestApplicant = async (
  values: z.infer<typeof ApplicantRequestValidators>,
  clientId: string
) => {
  const validatedField = ApplicantRequestValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { genderRequirements, totalApplicants, minAge, maxAge } =
    validatedField.data;

  try {
    await db.applicantRequest.create({
      data: {
        genderRequirements: { create: genderRequirements },
        totalApplicants,
        clientId,
        minAge,
        maxAge,
      },
    });

    return { success: "Applicant request created successfully" };
  } catch (error: any) {
    console.error("Error creating applicant request", error);
    return {
      error: `Failed to create applicant request. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateRequestApplicant = async (
  values: z.infer<typeof ApplicantRequestValidators>,
  id: string
) => {
  const validatedField = ApplicantRequestValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { genderRequirements, totalApplicants, minAge, maxAge } =
    validatedField.data;

  try {
    await db.applicantRequest.update({
      where: { id },
      data: {
        genderRequirements: { create: genderRequirements },
        totalApplicants,
        minAge,
        maxAge,
      },
    });
    return { success: "Applicant request updated successfully" };
  } catch (error: any) {
    console.error("Error updating applicant request", error);
    return {
      error: `Failed to update applicant request. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateTicketStatus = async (id: string, status: TicketStatus) => {
  if (!id) {
    return { error: "Ticket ID is required" };
  }

  try {
    await db.ticket.update({
      where: { id },
      data: {
        status: status,
      },
    });

    await createDepartmentLog(
      "Customer Relationship",
      `Updated ticket status for ticket ID ${id} to ${status}`
    );

    return { success: "Ticket status updated successfully" };
  } catch (error: any) {
    console.error("Error updating ticket status", error);
    return {
      error: `Failed to update ticket status. Please try again. ${error.message || ""}`,
    };
  }
};

export const createBranch = async (branch: string) => {
  if (!branch) {
    return { error: "Branch name is required" };
  }

  try {
    const branchData = await db.branch.create({
      data: {
        name: branch,
      },
    });

    return {
      success: "Branch created successfully",
      branchData: branchData.id,
    };
  } catch (error: any) {
    console.error("Error creating branch", error);
    return {
      error: `Failed to create branch. Please try again. ${error.message || ""}`,
    };
  }
};

export const sendContractToEmployee = async (
  file: string,
  employeeId: string,
  email: string,
  name: string
) => {
  if (!file || !employeeId || !email) {
    return { error: "File, employee ID, and email are required" };
  }

  const signUrl = `https://bat-security-services-inc.vercel.app/contract-signing?employeeId=${employeeId}&file=${file}`;

  const htmlContent = await ContractEmailHTML({
    name,
    file,
    signUrl,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bats3curity.9395@gmail.com",
      pass: "wfffyihhttplludl",
    },
  });

  const message = {
    from: "bats3curity.9395@gmail.com",
    to: email,
    subject: `Action Required: Please Sign Your Employment Contract - BAT Security Services INC.`,
    text: `Dear ${name},\n\nPlease review and sign your employment contract by clicking the link below:\n\n${signUrl}\n\nThis contract must be signed within 24 hours of receipt. If you have any questions about the terms, please contact HR before signing.\n\nBest regards,\nBAT Security Services INC.`,
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

export const employeeContractSigning = async (
  agreed: boolean,
  signature: string,
  employeeId: string
) => {
  if (!employeeId) {
    return { error: "Employee ID is required" };
  }

  try {
    if (agreed) {
      await db.employee.update({
        where: { id: employeeId },
        data: {
          isSignedContract: agreed,
          signedContract: signature,
        },
      });
    } else {
      await db.employee.update({
        where: { id: employeeId },
        data: {
          isSignedContract: false,
          signedContract: null,
          clientId: null,
        },
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error signing contract", error);
    return {
      error: `Failed to sign contract. Please try again. ${error.message || ""}`,
    };
  }
};

export async function getScheduledInterviews(date: Date) {
  try {
    // Get all interviews for the selected date
    const interviews = await db.applicantList.findMany({
      where: {
        interviewDate: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
      select: {
        interviewStartTime: true,
        interviewEndTime: true,
      },
    });

    return interviews.map((interview) => ({
      start: interview.interviewStartTime!,
      end: interview.interviewEndTime!,
    }));
  } catch (error) {
    console.error("Error fetching scheduled interviews:", error);
    return [];
  }
}

export const assignShiftEmployee = async (id: string, shift: string) => {
  if (!id || !shift) {
    return { error: "Employee ID and shift are required" };
  }

  try {
    await db.employee.update({
      where: { id },
      data: {
        shift,
      },
    });

    return { success: "Shift assigned successfully" };
  } catch (error: any) {
    console.error("Error assigning shift", error);
    return {
      error: `Failed to assign shift. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteJobPosting = async (id: string) => {
  if (!id) {
    return { error: "Job ID is required" };
  }

  try {
    await db.jobPosting.delete({
      where: { id },
    });

    return { success: "Job posting deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting job posting", error);
    return {
      error: `Failed to delete job posting. Please try again. ${error.message || ""}`,
    };
  }
};
