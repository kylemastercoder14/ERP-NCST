import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  SIDEBAR_EMPLOYEE,
  SIDEBAR_HEAD_ACCOUNTING,
  SIDEBAR_HEAD_CRM,
  SIDEBAR_HEAD_HR,
  SIDEBAR_HEAD_OPERATION,
  SIDEBAR_HEAD_PROCUREMENT,
  SIDEBAR_REPORTING_MANAGER,
  SIDEBAR_REPORTING_MANAGER_PROCUREMENT,
  SIDEBAR_HEAD_INVENTORY,
  SIDEBAR_SUPPLIER,
  SIDEBAR_CLIENT,
  SIDEBAR_SUPERADMIN,
} from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generatePurchaseCode = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // last 2 digits ng year
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 01-12
  const day = String(now.getDate()).padStart(2, "0"); // 01-31
  const random = Math.floor(1000 + Math.random() * 9000); // random 4 digits

  return `PR-${year}${month}${day}-${random}`;
};

export const generateWithdrawalCode = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // last 2 digits ng year
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 01-12
  const day = String(now.getDate()).padStart(2, "0"); // 01-31
  const random = Math.floor(1000 + Math.random() * 9000); // random 4 digits

  return `WD-${year}${month}${day}-${random}`;
};

export const getSidebarItems = (department?: string, position?: string) => {
  if (!department || !position) return [];

  if (department === "Human Resource" && position === "Head Department") {
    return SIDEBAR_HEAD_HR;
  } else if (department === "Superadmin" && position === "Admin") {
    return SIDEBAR_SUPERADMIN;
  } else if (department === "Supplier" && position === "Staff") {
    return SIDEBAR_SUPPLIER;
  } else if (department === "Client" && position === "Staff") {
    return SIDEBAR_CLIENT;
  } else if (department === "Inventory" && position === "Head Department") {
    return SIDEBAR_HEAD_INVENTORY;
  } else if (department === "Finance" && position === "Head Department") {
    return SIDEBAR_HEAD_ACCOUNTING;
  } else if (
    department === "Customer Relationship" &&
    position === "Head Department"
  ) {
    return SIDEBAR_HEAD_CRM;
  } else if (department === "Procurement" && position === "Head Department") {
    return SIDEBAR_HEAD_PROCUREMENT;
  } else if (
    department === "Human Resource" &&
    position === "Assistant Supervisor"
  ) {
    return SIDEBAR_HEAD_HR;
  } else if (
    department === "Human Resource" &&
    position === "Reporting Manager"
  ) {
    return SIDEBAR_HEAD_HR;
  } else if (department === "Operation" && position === "Head Department") {
    return SIDEBAR_HEAD_OPERATION;
  } else if (position === "Regular Employee") {
    return SIDEBAR_EMPLOYEE;
  } else if (position === "Reporting Manager") {
    if (department === "Procurement" || department === "Finance") {
      return SIDEBAR_REPORTING_MANAGER_PROCUREMENT;
    } else {
      return SIDEBAR_REPORTING_MANAGER;
    }
  }
};

export const calculateOvertimeHours = (
  extraShifts: {
    type: string;
    timeStart: string;
    timeEnd: string;
    status: string;
  }[]
) => {
  return extraShifts
    .filter((shift) => shift.type === "Overtime" && shift.status === "Approved")
    .reduce((totalHours, shift) => {
      const start = new Date(shift.timeStart);
      const end = new Date(shift.timeEnd);

      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return totalHours + hours;
    }, 0);
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

export function isSameDate(a: string | Date, b: string | Date) {
  const dateA = new Date(a);
  const dateB = new Date(b);
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

/**
 * regular expression to check for valid hour format (01-23)
 */
export function isValidHour(value: string) {
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value);
}

/**
 * regular expression to check for valid 12 hour format (01-12)
 */
export function isValid12Hour(value: string) {
  return /^(0[1-9]|1[0-2])$/.test(value);
}

/**
 * regular expression to check for valid minute format (00-59)
 */
export function isValidMinuteOrSecond(value: string) {
  return /^[0-5][0-9]$/.test(value);
}

type GetValidNumberConfig = { max: number; min?: number; loop?: boolean };

export function getValidNumber(
  value: string,
  { max, min = 0, loop = false }: GetValidNumberConfig
) {
  let numericValue = parseInt(value, 10);

  if (!isNaN(numericValue)) {
    if (!loop) {
      if (numericValue > max) numericValue = max;
      if (numericValue < min) numericValue = min;
    } else {
      if (numericValue > max) numericValue = min;
      if (numericValue < min) numericValue = max;
    }
    return numericValue.toString().padStart(2, "0");
  }

  return "00";
}

export function getValidHour(value: string) {
  if (isValidHour(value)) return value;
  return getValidNumber(value, { max: 23 });
}

export function getValid12Hour(value: string) {
  if (isValid12Hour(value)) return value;
  return getValidNumber(value, { min: 1, max: 12 });
}

export function getValidMinuteOrSecond(value: string) {
  if (isValidMinuteOrSecond(value)) return value;
  return getValidNumber(value, { max: 59 });
}

type GetValidArrowNumberConfig = {
  min: number;
  max: number;
  step: number;
};

export function getValidArrowNumber(
  value: string,
  { min, max, step }: GetValidArrowNumberConfig
) {
  let numericValue = parseInt(value, 10);
  if (!isNaN(numericValue)) {
    numericValue += step;
    return getValidNumber(String(numericValue), { min, max, loop: true });
  }
  return "00";
}

export function getValidArrowHour(value: string, step: number) {
  return getValidArrowNumber(value, { min: 0, max: 23, step });
}

export function getValidArrow12Hour(value: string, step: number) {
  return getValidArrowNumber(value, { min: 1, max: 12, step });
}

export function getValidArrowMinuteOrSecond(value: string, step: number) {
  return getValidArrowNumber(value, { min: 0, max: 59, step });
}

export function setMinutes(date: Date, value: string) {
  const minutes = getValidMinuteOrSecond(value);
  date.setMinutes(parseInt(minutes, 10));
  return date;
}

export function setSeconds(date: Date, value: string) {
  const seconds = getValidMinuteOrSecond(value);
  date.setSeconds(parseInt(seconds, 10));
  return date;
}

export function setHours(date: Date, value: string) {
  const hours = getValidHour(value);
  date.setHours(parseInt(hours, 10));
  return date;
}

export function set12Hours(date: Date, value: string, period: Period) {
  const hours = parseInt(getValid12Hour(value), 10);
  const convertedHours = convert12HourTo24Hour(hours, period);
  date.setHours(convertedHours);
  return date;
}

export type TimePickerType = "minutes" | "seconds" | "hours" | "12hours";
export type Period = "AM" | "PM";

export function setDateByType(
  date: Date | string | null | undefined,
  value: string,
  type: TimePickerType,
  period?: Period
) {
  if (!(date instanceof Date)) {
    date = new Date(); // Ensure it's a valid Date object
  }

  switch (type) {
    case "minutes":
      return setMinutes(date, value);
    case "seconds":
      return setSeconds(date, value);
    case "hours":
      return setHours(date, value);
    case "12hours": {
      if (!period) return date;
      return set12Hours(date, value, period);
    }
    default:
      return date;
  }
}

export function getDateByType(
  date: Date | string | null | undefined,
  type: TimePickerType
) {
  if (!(date instanceof Date)) {
    date = new Date(); // Ensure it's a Date object
  }

  switch (type) {
    case "minutes":
      return getValidMinuteOrSecond(String(date.getMinutes()));
    case "seconds":
      return getValidMinuteOrSecond(String(date.getSeconds()));
    case "hours":
      return getValidHour(String(date.getHours()));
    case "12hours": {
      const hours = display12HourValue(date.getHours());
      return getValid12Hour(String(hours));
    }
    default:
      return "00";
  }
}

export function getArrowByType(
  value: string,
  step: number,
  type: TimePickerType
) {
  switch (type) {
    case "minutes":
      return getValidArrowMinuteOrSecond(value, step);
    case "seconds":
      return getValidArrowMinuteOrSecond(value, step);
    case "hours":
      return getValidArrowHour(value, step);
    case "12hours":
      return getValidArrow12Hour(value, step);
    default:
      return "00";
  }
}

/**
 * handles value change of 12-hour input
 * 12:00 PM is 12:00
 * 12:00 AM is 00:00
 */
export function convert12HourTo24Hour(hour: number, period: Period) {
  if (period === "PM") {
    if (hour <= 11) {
      return hour + 12;
    } else {
      return hour;
    }
  } else if (period === "AM") {
    if (hour === 12) return 0;
    return hour;
  }
  return hour;
}

/**
 * time is stored in the 24-hour form,
 * but needs to be displayed to the user
 * in its 12-hour representation
 */
export function display12HourValue(hours: number) {
  if (hours === 0 || hours === 12) return "12";
  if (hours >= 22) return `${hours - 12}`;
  if (hours % 12 > 9) return `${hours}`;
  return `0${hours % 12}`;
}

export const getTrend = (percentage: number): "up" | "down" | "neutral" => {
  if (percentage > 0) return "up";
  if (percentage < 0) return "down";
  return "neutral";
};

export function calculatePercentageDifference(
  previous: number,
  current: number
): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value);
};

export const generateDynamicColors = (count: number) => {
  // Base color palette (can be extended)
  const baseColors = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--destructive))",
    "hsl(var(--success))",
    "hsl(var(--warning))",
    "hsl(var(--muted))",
    "hsl(var(--accent))",
  ];

  // If we have more items than base colors, generate additional colors
  if (count > baseColors.length) {
    const additionalColors = [];
    const hueStep = 360 / (count - baseColors.length);

    for (let i = 0; i < count - baseColors.length; i++) {
      const hue = Math.floor(i * hueStep);
      additionalColors.push(`hsl(${hue}, 70%, 50%)`);
    }

    return [...baseColors, ...additionalColors];
  }

  return baseColors.slice(0, count);
};

export const procurementChartConfig = {
  purchaseRequests: {
    label: "Purchase Requests",
    color: "hsl(var(--primary))",
  },
  approvedRequests: {
    label: "Approved Requests",
    color: "hsl(var(--chart-2))",
  },
  totalSpend: {
    label: "Total Spend",
    color: "hsl(var(--chart-3))",
    fillOpacity: 0.6,
  },
  pendingDeliveries: {
    label: "Pending Deliveries",
    color: "hsl(var(--chart-4))",
  },
} as const;
