import {
  AlarmClock,
  AlertCircle,
  CircleHelp,
  CreditCard,
  FileText,
  User,
  CheckCircle,
  Clock,
  Wrench,
  ArrowDown,
  AlertTriangle,
} from "lucide-react";

// Ticket Type Mapping
export const ticketTypeMap = {
  technical: {
    label: "Technical",
    icon: <Wrench className="w-3 h-3" />,
    variant: "secondary" as const,
  },
  billing: {
    label: "Billing",
    icon: <CreditCard className="w-3 h-3" />,
    variant: "outline" as const,
  },
  general: {
    label: "General",
    icon: <CircleHelp className="w-3 h-3" />,
    variant: "default" as const,
  },
  employee: {
    label: "Employee",
    icon: <User className="w-3 h-3" />,
    variant: "secondary" as const,
  },
  other: {
    label: "Other",
    icon: <FileText className="w-3 h-3" />,
    variant: "outline" as const,
  },
};

// Priority Mapping
export const priorityMap = {
  low: {
    label: "Low",
    icon: <ArrowDown className="w-3 h-3" />,
    variant: "outline" as const,
  },
  medium: {
    label: "Medium",
    icon: <AlertCircle className="w-3 h-3" />,
    variant: "secondary" as const,
  },
  high: {
    label: "High",
    icon: <AlertTriangle className="w-3 h-3" />,
    variant: "destructive" as const,
  },
  critical: {
    label: "Critical",
    icon: <AlertTriangle className="w-3 h-3" />,
    variant: "destructive" as const,
  },
};

// Status Mapping
export const statusMap = {
  Open: {
    label: "Open",
    icon: <Clock className="w-3 h-3" />,
    variant: "secondary" as const,
  },
  InProgress: {
    label: "In Progress",
    icon: <AlarmClock className="w-3 h-3" />,
    variant: "outline" as const,
  },
  Resolved: {
    label: "Resolved",
    icon: <CheckCircle className="w-3 h-3" />,
    variant: "success" as const,
  },
  Closed: {
    label: "Closed",
    icon: <CheckCircle className="w-3 h-3" />,
    variant: "default" as const,
  },
};
