export const SIDEBAR_HEAD_ACCOUNTING = [
  {
    title: "General",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/head/dashboard",
      },
      {
        title: "Client Payment Management",
        url: "/head/client-payment-management",
      },
      {
        title: "Collection Tracking",
        url: "/head/collection-tracking",
      },
      {
        title: "Invoice Generation",
        url: "/head/invoice-generation",
      },
      {
        title: "Payroll Management",
        url: "/head/payroll-management",
      },
      {
        title: "Expense Management",
        url: "/head/expense-management",
      },
    ],
  },
  {
    title: "Others",
    url: "#",
    items: [
      {
        title: "Reports Management",
        url: "/head/reports-management",
      },
      {
        title: "Settings",
        url: "/head/settings",
      },
      {
        title: "Logs",
        url: "/head/logs",
      },
    ],
  },
];

export const SIDEBAR_HEAD_OPERATION = [
  {
    title: "General",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/head/dashboard",
      },
      {
        title: "Deployment Scheduling",
        url: "/head/deployment-scheduling",
      },
      {
        title: "Assignment Tracking",
        url: "/head/assignment-tracking",
      },
      {
        title: "Shift Monitoring",
        url: "/head/shift-monitoring",
      },
    ],
  },
  {
    title: "Others",
    url: "#",
    items: [
      {
        title: "Reports Management",
        url: "/head/reports-management",
      },
      {
        title: "Settings",
        url: "/head/settings",
      },
      {
        title: "Logs",
        url: "/head/logs",
      },
    ],
  },
];

export const SIDEBAR_HEAD_HR = [
  {
    title: "General",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/head/dashboard",
      },
      {
        title: "Applicant Management",
        url: "/head/applicant-management",
      },
      {
        title: "Employee Records Management",
        url: "/head/employee-records-management",
      },
      {
        title: "Onboarding & Training",
        url: "/head/onboarding-training",
      },
    ],
  },
  {
    title: "Others",
    url: "#",
    items: [
      {
        title: "Reports Management",
        url: "/head/reports-management",
      },
      {
        title: "Settings",
        url: "/head/settings",
      },
      {
        title: "Logs",
        url: "/head/logs",
      },
    ],
  },
];

export const SIDEBAR_HEAD_CRM = [
  {
    title: "General",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/head/dashboard",
      },
      {
        title: "Hotline Management",
        url: "/head/hotline-management",
      },
      {
        title: "Client Management",
        url: "/head/client-management",
      },
      {
        title: "Sales Monitoring",
        url: "/head/sales-monitoring",
      },
    ],
  },
  {
    title: "Others",
    url: "#",
    items: [
      {
        title: "Reports Management",
        url: "/head/reports-management",
      },
      {
        title: "Settings",
        url: "/head/settings",
      },
      {
        title: "Logs",
        url: "/head/logs",
      },
    ],
  },
];

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  OTP_INPUT = "otpInput",
  SELECT = "select",
  MULTISELECT = "multiSelect",
  TAGSINPUT = "tagsInput",
  RADIO = "radio",
  CHECKBOX = "checkbox",
  SWITCH = "switch",
  SLIDER = "slider",
  DATE_PICKER = "datePicker",
  DROP_ZONE = "dropZone",
  SKELETON = "skeleton",
  HIDDEN = "hidden",
  HONEY_POT = "honeyPot",
  SIGNATURE = "signature",
}

export const OPT_LENGTH = 6;

export const DATE_YEAR_MIN = 1970;
export const DATE_DEFAULT_FORMAT = "yyyy-MM-dd"; // 2022-08-11
export const DATETIME_DEFAULT_FORMAT = "yyyy-MM-dd h:mm a"; // 2022-08-11 1:00 PM
export const DATE_DISPLAY_FORMAT = "PPP";

export const MAX_UPLOAD_FILE_SIZE = 5242880; // 5MB
export const DEFAULT_MAX_FILES = 5;
export const DEFAULT_MIN_FILE = 1;

export enum UploaderType {
  MULTIPLE_ANY = "multiple_any",
  SINGLE_ANY = "single_any",
  SINGLE_DOCUMENT = "single_document",
  MULTIPLE_DOCUMENT = "multiple_documents",
  SINGLE_IMAGE = "single_image",
  MULTIPLE_IMAGE = "multiple_images",
}

export const AcceptedFileTypes = {
  document: {
    "application/pdf": [".pdf"],
    "application/msword": [".doc", ".docx"],
    "application/vnd.ms-excel": [".xls", ".xlsx"],
    "text/csv": [".csv"],
  },
  image: { "image/*": [".jpg", ".jpeg", ".png", ".heic", ".heif"] },
  default: {
    "application/pdf": [".pdf"],
    "application/msword": [".doc", ".docx"],
    "application/vnd.ms-excel": [".xls", ".xlsx"],
    "text/csv": [".csv"],
    "text/plain": [".txt"],
    "image/*": [".jpg", ".jpeg", ".png", ".heic", ".heif"],
  },
};
