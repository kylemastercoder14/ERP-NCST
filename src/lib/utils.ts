import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  SIDEBAR_HEAD_ACCOUNTING,
  SIDEBAR_HEAD_CRM,
  SIDEBAR_HEAD_HR,
  SIDEBAR_HEAD_OPERATION,
} from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSidebarItems = (position: string) => {
  switch (position) {
    case "ACCOUNTING":
      return SIDEBAR_HEAD_ACCOUNTING;
    case "OPERATION":
      return SIDEBAR_HEAD_OPERATION;
    case "Human Resource":
      return SIDEBAR_HEAD_HR;
    case "CRM":
      return SIDEBAR_HEAD_CRM;
    default:
      return [];
  }
};

export function generateRandomPassword(length: number = 10): string {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

  let password = "";

  // Ensure at least one character from each character set
  password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
  password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
  password += numberChars[Math.floor(Math.random() * numberChars.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Fill the rest of the password with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to randomize the position of the initial characters
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}
