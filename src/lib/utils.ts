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
    case "HR":
      return SIDEBAR_HEAD_HR;
    case "CRM":
      return SIDEBAR_HEAD_CRM;
    default:
      return [];
  }
};
