import type { HTMLAttributes } from "react";
import { cn } from "./utils";

type CardPartProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardPartProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface text-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardPartProps) {
  return (
    <div className={cn("flex flex-col gap-1 p-6", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: CardPartProps) {
  return (
    <h2
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: CardPartProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: CardPartProps) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardPartProps) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
  );
}
