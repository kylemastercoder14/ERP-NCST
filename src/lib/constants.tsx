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
        title: "Payroll Approval",
        url: "/head/payroll-approval",
      },
      {
        title: "Attendance Management",
        url: "/head/attendance-management",
      },
      {
        title: "Overtime Request",
        url: "/head/attendance-management/overtime-undertime",
      },
      {
        title: "Leave Management",
        url: "/head/leave-management",
      },
      {
        title: "Payroll Management",
        url: "/head/payroll-management/payslip-generation",
      },
    ],
  },
  {
    title: "Others",
    url: "#",
    items: [
      {
        title: "Job Posting",
        url: "/head/job-posting",
      },
      {
        title: "Withdrawal Management",
        url: "/head/withdrawal-management",
      },
      {
        title: "Purchase Request",
        url: "/head/purchase-request",
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
        title: "Shift Monitoring",
        url: "/head/shift-monitoring",
      },
      {
        title: "Onboarding & Training",
        url: "/head/onboarding-training",
      },
      {
        title: "Employee Evaluation",
        url: "/head/employee-evaluation",
      },
      {
        title: "Attendance Management",
        url: "/head/attendance-management",
      },
      {
        title: "Overtime Request",
        url: "/head/attendance-management/overtime-undertime",
      },
      {
        title: "Leave Management",
        url: "/head/leave-management",
      },
      {
        title: "Payroll Management",
        url: "/head/payroll-management/payslip-generation",
      },
    ],
  },
  {
    title: "Others",
    url: "#",
    items: [
      {
        title: "Withdrawal Management",
        url: "/head/withdrawal-management",
      },
      {
        title: "Purchase Request",
        url: "/head/purchase-request",
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
        title: "Applicants List",
        url: "/head/applicants-list",
      },
      {
        title: "Applicant Request",
        url: "/head/client-management/applicant-request",
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
      {
        title: "Onboarding & Training",
        url: "/head/onboarding-training",
      },
    ],
  },
  {
    title: "Others", // dont mind this
    url: "#",
    items: [
      {
        title: "Job Posting",
        url: "/head/job-posting",
      },
      {
        title: "Withdrawal Management",
        url: "/head/withdrawal-management",
      },
      {
        title: "Purchase Request",
        url: "/head/purchase-request",
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
        title: "Inquiries",
        url: "/head/inquiries",
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
          {
            title: "Applicant Request",
            url: "/head/client-management/applicant-request",
          },
        ],
      },
      {
        title: "Ticket Management",
        url: "/head/ticket-management",
      },
      {
        title: "Attendance Management",
        url: "/head/attendance-management",
      },
      {
        title: "Overtime Request",
        url: "/head/attendance-management/overtime-undertime",
      },
      {
        title: "Leave Management",
        url: "/head/leave-management",
      },
      {
        title: "Payroll Management",
        url: "/head/payroll-management/payslip-generation",
      },
    ],
  },
  {
    title: "Others",
    url: "#",
    items: [
      {
        title: "Withdrawal Management",
        url: "/head/withdrawal-management",
      },
      {
        title: "Purchase Request",
        url: "/head/purchase-request",
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
        title: "Attendance Management",
        url: "/head/attendance-management",
      },
      {
        title: "Overtime Request",
        url: "/head/attendance-management/overtime-undertime",
      },
      {
        title: "Leave Management",
        url: "/head/leave-management",
      },
      {
        title: "Payroll Management",
        url: "/head/payroll-management/payslip-generation",
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
        title: "Withdrawal Management",
        url: "/head/withdrawal-management",
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
        title: "Items List",
        url: "/head/items-list",
      },
      {
        title: "Inventory Management",
        url: "/head/inventory-management",
      },
      {
        title: "List of Purchase Orders",
        url: "/head/purchase-orders",
      },
      {
        title: "Attendance Management",
        url: "/head/attendance-management",
      },
      {
        title: "Overtime Request",
        url: "/head/attendance-management/overtime-undertime",
      },
      {
        title: "Leave Management",
        url: "/head/leave-management",
      },
      {
        title: "Payroll Management",
        url: "/head/payroll-management/payslip-generation",
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
        title: "Withdrawal Management",
        url: "/head/withdrawal-management",
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
        title: "List of Purchase Orders",
        url: "/supplier/purchase-orders",
      },
    ],
  },
];

export const SIDEBAR_CLIENT = [
  {
    title: "General",
    url: "#",
    items: [
      {
        title: "Employee Management",
        url: "/client/employee-management",
      },
      {
        title: "Submit Ticket",
        url: "/client/submit-ticket",
      },
      {
        title: "Applicant Request",
        url: "/client/applicant-request",
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

export const SIDEBAR_TRAINER = [
  {
    title: "General",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/head/dashboard",
      },
      {
        title: "Orientation",
        url: "/head/orientation",
      },
      {
        title: "Physical Training",
        url: "/head/physical-training",
      },
      {
        title: "Customer Service Training",
        url: "/head/customer-service-training",
      },
    ],
  },
];

export const SIDEBAR_SUPERADMIN = [
  {
    title: "General",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/superadmin/dashboard",
      },
      {
        title: "Job Posting Approval",
        url: "/superadmin/job-posting",
      },
      {
        title: "Site Settings",
        url: "/superadmin/settings",
      },
      {
        title: "Onboarding & Training",
        url: "/superadmin/onboarding-training",
      },
      {
        title: "Logs",
        url: "/superadmin/logs",
      },
    ],
  },
  {
    title: "Human Resource Management",
    url: "#",
    items: [
      {
        title: "Applicants List",
        url: "/superadmin/applicants-list",
      },
      {
        title: "Employee Management",
        url: "#",
        items: [
          // show this in collapsible
          {
            title: "Employee List",
            url: "/superadmin/employee-management",
          },
          {
            title: "Add Employee",
            url: "/superadmin/employee-management/create",
          },
        ],
      },
      {
        title: "Attendance Management",
        url: "#",
        items: [
          {
            title: "Attendance Monitoring",
            url: "/superadmin/attendance-management",
          },
          {
            title: "Overtime Request",
            url: "/superadmin/attendance-management/overtime-undertime",
          },
        ],
      },
      {
        title: "Payroll Management",
        url: "/superadmin/payroll-management",
        items: [
          {
            title: "Base Salary",
            url: "/superadmin/payroll-management/base-salary",
          },
          {
            title: "Payslip Generation",
            url: "/superadmin/payroll-management/payslip-generation",
          },
        ],
      },
      {
        title: "Leave Management",
        url: "/superadmin/leave-management",
      },
    ],
  },
  {
    title: "CRM",
    url: "#",
    items: [
      {
        title: "Client Management",
        url: "#",
        items: [
          {
            title: "Client List",
            url: "/superadmin/client-management",
          },
          { title: "Add Client", url: "/superadmin/client-management/create" },
        ],
      },
      {
        title: "Ticket Management",
        url: "/superadmin/ticket-management",
      },
    ],
  },
  {
    title: "Finance & Accounting",
    url: "#",
    items: [
      {
        title: "Sales Management",
        url: "#",
        items: [
          // show this in collapsible
          {
            title: "Ledger",
            url: "/superadmin/sales-management",
          },
          {
            title: "Accounts Payable",
            url: "/superadmin/sales-management/accounts-payable",
          },
          {
            title: "Accounts Receivable",
            url: "/superadmin/sales-management/accounts-receivable",
          },
        ],
      },
    ],
  },
  {
    title: "Operations Management",
    url: "#",
    items: [
      {
        title: "Deployment Scheduling",
        url: "/superadmin/deployment-scheduling",
      },
      {
        title: "Shift Monitoring",
        url: "/superadmin/shift-monitoring",
      },
      {
        title: "Employee Evaluation",
        url: "/superadmin/employee-evaluation",
      },
    ],
  },
  {
    title: "Procurement Management",
    url: "#",
    items: [
      {
        title: "Items List",
        url: "/superadmin/items-list",
      },
      {
        title: "Supplier Management",
        url: "/superadmin/supplier-management",
      },
      {
        title: "Purchase Request",
        url: "/superadmin/purchase-request",
      },
      {
        title: "Withdrawal Management",
        url: "/superadmin/withdrawal-management",
      },
    ],
  },
  {
    title: "Inventory",
    url: "#",
    items: [
      {
        title: "Inventory Management",
        url: "/superadmin/inventory-management",
      },
      {
        title: "List of Purchase Orders",
        url: "/superadmin/purchase-orders",
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
  RICHTEXT = "richText",
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

export const subAccountOptions: Record<
  string,
  { label: string; value: string }[]
> = {
  ASSET: [
    { label: "Cash", value: "CASH" },
    { label: "Petty Cash", value: "PETTY_CASH" },
    { label: "Office Supplies or Prepaid Expenses", value: "OFFICE_SUPPLIES" },
    { label: "Inventory", value: "INVENTORY" },
    { label: "Accounts Receivable", value: "ACCOUNTS_RECEIVABLE" },
    { label: "Prepaid Insurance", value: "PREPAID_INSURANCE" },
    { label: "Equipment", value: "EQUIPMENT" },
    { label: "Furniture and Fixtures", value: "FURNITURE_FIXTURES" },
    { label: "Building", value: "BUILDING" },
    { label: "Land", value: "LAND" },
    { label: "Vehicles", value: "VEHICLES" },
    { label: "Investments", value: "INVESTMENTS" },
  ],
  LIABILITY: [
    { label: "Accounts Payable", value: "ACCOUNTS_PAYABLE" },
    { label: "Sales Tax Payable", value: "SALES_TAX_PAYABLE" },
    { label: "Wages Payable", value: "WAGES_PAYABLE" },
    { label: "Payroll Taxes Payable", value: "PAYROLL_TAXES_PAYABLE" },
    { label: "Interest Payable", value: "INTEREST_PAYABLE" },
    { label: "Unearned Revenue", value: "UNEARNED_REVENUE" },
    { label: "Mortgage Payable", value: "MORTGAGE_PAYABLE" },
    { label: "Notes Payable", value: "NOTES_PAYABLE" },
    { label: "Credit Card Payable", value: "CREDIT_CARD_PAYABLE" },
    { label: "Accrued Expenses", value: "ACCRUED_EXPENSES" },
  ],
  EQUITY: [
    { label: "Owner's Capital", value: "OWNERS_CAPITAL" },
    { label: "Owner's Draw", value: "OWNERS_DRAW" },
    { label: "Dividends", value: "DIVIDENDS" },
    { label: "Common Stock", value: "COMMON_STOCK" },
    { label: "Preferred Stock", value: "PREFERRED_STOCK" },
    { label: "Retained Earnings", value: "RETAINED_EARNINGS" },
    { label: "Additional Paid-In Capital", value: "PAID_IN_CAPITAL" },
    { label: "Treasury Stock", value: "TREASURY_STOCK" },
  ],
  INCOME: [
    { label: "Service Revenue", value: "SERVICE_REVENUE" },
    { label: "Sales Revenue", value: "SALES_REVENUE" },
    { label: "Interest Revenue", value: "INTEREST_REVENUE" },
    { label: "Rental Income", value: "RENTAL_INCOME" },
    { label: "Commission Income", value: "COMMISSION_INCOME" },
    { label: "Consulting Income", value: "CONSULTING_INCOME" },
    { label: "Other Income", value: "OTHER_INCOME" },
  ],
  EXPENSE: [
    { label: "Cost of Goods Sold", value: "COST_OF_GOODS_SOLD" },
    { label: "Utilities Expense", value: "UTILITIES_EXPENSE" },
    { label: "Wages Expense", value: "WAGES_EXPENSE" },
    { label: "Rent Expense", value: "RENT_EXPENSE" },
    { label: "Supplies Expense", value: "SUPPLIES_EXPENSE" },
    { label: "Insurance Expense", value: "INSURANCE_EXPENSE" },
    { label: "Advertising Expense", value: "ADVERTISING_EXPENSE" },
    { label: "Bank Fees Expense", value: "BANK_FEES_EXPENSE" },
    { label: "Depreciation Expense", value: "DEPRECIATION_EXPENSE" },
    { label: "Maintenance and Repairs", value: "MAINTENANCE_REPAIRS" },
    { label: "Travel Expense", value: "TRAVEL_EXPENSE" },
    { label: "Meals and Entertainment", value: "MEALS_ENTERTAINMENT" },
    { label: "Professional Fees", value: "PROFESSIONAL_FEES" },
    {
      label: "Telephone and Internet Expense",
      value: "TELEPHONE_INTERNET_EXPENSE",
    },
  ],
};
