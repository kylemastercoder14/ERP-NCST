/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { z } from "zod";
import { RegistrationValidators } from "@/validators";
import nodemailer from "nodemailer";
import { OtpVerificationHTML } from "@/components/email-templates/otp-verification";

export const createAccount = async (
  values: z.infer<typeof RegistrationValidators>
) => {
  const validatedField = RegistrationValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { firstName, lastName, employeeId, email, password, role, position } =
    validatedField.data;

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
        employeeId,
      },
    });

    if (existingUser) {
      return { error: "User already exist" };
    }

    // six-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // insert otpExpiry in the database, the value is the current time plus 15 minutes only
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

    await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        employeeId,
        role,
        position,
        otpCode,
        otpExpiry,
      },
    });

    await sendOtpCodeEmail(email, otpCode);

    return { success: "User created successfully" };
  } catch (error: any) {
    return {
      error: `Failed to create user. Please try again. ${error.message || ""}`,
    };
  }
};

export const verifyAccount = async (otpCode: string, email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return { error: "OTP code has expired" };
    }

    if (user.otpCode !== otpCode) {
      return { error: "Invalid OTP code" };
    }

    await db.user.update({
      where: {
        email,
      },
      data: {
        isEmailVerified: true,
      },
    });

    return { success: "Account verified successfully" };
  } catch (error: any) {
    return {
      error: `Failed to verify account. Please try again. ${error.message || ""}`,
    };
  }
};

export const resendOtpCode = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // insert otpExpiry in the database, the value is the current time plus 15 minutes only
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

    await db.user.update({
      where: {
        email,
      },
      data: {
        otpCode,
        otpExpiry,
      },
    });

    await sendOtpCodeEmail(email, otpCode);

    return { success: "OTP code sent successfully" };
  } catch (error: any) {
    return {
      error: `Failed to resend OTP code. Please try again. ${error.message || ""}`,
    };
  }
};

export const sendOtpCodeEmail = async (email: string, otpCode: string) => {
  const htmlContent = await OtpVerificationHTML({
    otpCode,
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
    subject: "Verify your email address",
    text: `Your OTP code is ${otpCode}`,
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
