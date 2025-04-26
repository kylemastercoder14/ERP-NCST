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
        title: "Sales Management",
        url: "#",
        items: [
          // show this in collapsible
          {
            title: "Ledger",
            url: "/head/sales-management",
          },
          {
            title: "Accounts Payable",
            url: "/head/sales-management/accounts-payable",
          },
          {
            title: "Accounts Receivable",
            url: "/head/sales-management/accounts-receivable",
          },
        ],
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
    ],
  },
  {
    title: "Others",
    url: "#",
    items: [
      {
        title: "Purchase Request",
        url: "/head/purchase-request",
      },
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
        title: "Purchase Request",
        url: "/head/purchase-request",
      },
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
    title: "General", // dont mind this
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/head/dashboard",
      },
      {
        title: "Employee Management",
        url: "#",
        items: [
          // show this in collapsible
          {
            title: "Employee List",
            url: "/head/employee-management",
          },
          { title: "Add Employee", url: "/head/employee-management/create" },
        ],
      },
      {
        title: "Attendance Management",
        url: "#",
        items: [
          {
            title: "Attendance Monitoring",
            url: "/head/attendance-management",
          },
          {
            title: "Overtime Request",
            url: "/head/attendance-management/overtime-undertime",
          },
        ],
      },
      {
        title: "Payroll Management",
        url: "/head/payroll-management",
        items: [
          {
            title: "Base Salary",
            url: "/head/payroll-management/base-salary",
          },
          {
            title: "Payslip Generation",
            url: "/head/payroll-management/payslip-generation",
          },
        ],
      },
      {
        title: "Leave Management",
        url: "/head/leave-management",
      },
    ],
  },
  {
    title: "Others", // dont mind this
    url: "#",
    items: [
      {
        title: "Purchase Request",
        url: "/head/purchase-request",
      },
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
        url: "#",
        items: [
          // show this in collapsible
          {
            title: "Client List",
            url: "/head/client-management",
          },
          { title: "Add Client", url: "/head/client-management/create" },
        ],
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

export const SIDEBAR_HEAD_PROCUREMENT = [
  {
    title: "General",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/head/dashboard",
      },
      {
        title: "Items List",
        url: "/head/items-list",
      },
      {
        title: "Supplier Management",
        url: "/head/supplier-management",
      },
      {
        title: "Purchase Request",
        url: "/head/purchase-request",
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

export const SIDEBAR_HEAD_INVENTORY = [
  {
    title: "General",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/head/dashboard",
      },
      {
        title: "Inventory Management",
        url: "/head/inventory-management",
      },
      {
        title: "Withdrawal Management",
        url: "/head/withdrawal-management",
      },
      {
        title: "List of Purchase Orders",
        url: "/head/purchase-orders",
      },
      {
        title: "Purchase Request",
        url: "/head/purchase-request",
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

export const SIDEBAR_EMPLOYEE = [
  {
    title: "General",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/employee/dashboard",
      },
      {
        title: "Attendance Management",
        url: "/employee/attendance-management",
      },
      {
        title: "Leave Request",
        url: "/employee/leave-request",
      },
      {
        title: "Overtime Request",
        url: "/employee/overtime-request",
      },
      {
        title: "Payroll Management",
        url: "/employee/payroll-management",
      },
      {
        title: "Accomplishment Report",
        url: "/employee/accomplishment-report",
      },
    ],
  },
];

export const SIDEBAR_REPORTING_MANAGER = [
  {
    title: "General",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/reporting-manager/dashboard",
      },
      {
        title: "Attendance Management",
        url: "/reporting-manager/attendance-management",
      },
      {
        title: "Leave Request",
        url: "/reporting-manager/leave-management",
      },
      {
        title: "Overtime Request",
        url: "/reporting-manager/overtime-request",
      },
      {
        title: "Payroll Management",
        url: "/reporting-manager/payroll-management",
      },
    ],
  },
];

export const SIDEBAR_SUPPLIER = [
  {
    title: "General",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/supplier/dashboard",
      },
      {
        title: "List of Purchase Orders",
        url: "/supplier/purchase-orders",
      },
    ],
  },
];

export const SIDEBAR_REPORTING_MANAGER_PROCUREMENT = [
  {
    title: "General",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/reporting-manager/dashboard",
      },
      {
        title: "Attendance Management",
        url: "/reporting-manager/attendance-management",
      },
      {
        title: "Leave Request",
        url: "/reporting-manager/leave-management",
      },
      {
        title: "Overtime Request",
        url: "/reporting-manager/overtime-request",
      },
      {
        title: "Payroll Management",
        url: "/reporting-manager/payroll-management",
      },
      {
        title: "Purchase Requested",
        url: "/reporting-manager/purchase-requested",
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
  TIME_PICKER = "timePicker",
  DROP_ZONE = "dropZone",
  MULTIPLE_IMAGES = "multipleImages",
  SKELETON = "skeleton",
  HIDDEN = "hidden",
  HONEY_POT = "honeyPot",
  SIGNATURE = "signature",
  COMBOBOX = "combobox",
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

export const LEAVETYPE = [
  "Vacation Leave",
  "Sick Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Special Leave",
  "Emergency Leave",
  "Unpaid Leave",
  "Paid Leave",
];

export const SALARYTYPE = ["Hourly", "Daily", "Fixed"];

export const regularHolidays = [
  "2025-01-01", // New Year's Day
  "2025-04-08", // Maundy Thursday
  "2025-04-09", // Araw ng Kagitingan
  "2025-05-01", // Labor Day
  "2025-06-12", // Independence Day
  "2025-08-26", // National Heroes Day
  "2025-11-30", // Bonifacio Day
  "2025-12-25", // Christmas Day
  "2025-12-30", // Rizal Day
];

export const specialHolidays = [
  "2025-02-10", // Chinese New Year
  "2025-04-18", // Black Saturday
  "2025-08-21", // Ninoy Aquino Day
  "2025-11-01", // All Saints Day
  "2025-12-08", // Feast of the Immaculate Conception
  "2025-12-31", // Last Day of the Year
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
