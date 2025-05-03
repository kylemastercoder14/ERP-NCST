import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TicketBadgeProps {
  variant: "default" | "secondary" | "destructive" | "outline" | "success";
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function TicketBadge({
  variant,
  className,
  children,
  icon,
}: TicketBadgeProps) {
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    success: "bg-green-500 text-white hover:bg-green-600",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </div>
  );
}
