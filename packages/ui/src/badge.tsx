import type { HTMLAttributes } from "react";
import { cn } from "./utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    "default" | "secondary" | "success" | "warning" | "danger" | "outline";
}

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-brand text-white",
  secondary: "bg-surface text-muted-foreground",
  success: "bg-success-surface text-success",
  warning: "bg-warning-surface text-warning",
  danger: "bg-danger-border/40 text-danger",
  outline: "border border-border bg-transparent text-foreground",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
