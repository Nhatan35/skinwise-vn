import type { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { cn } from "@/shared/utils";

type ErrorStateProps = {
  action?: ReactNode;
  className?: string;
  description: string;
  title?: string;
};

export function ErrorState({
  action,
  className,
  description,
  title = "Chưa thể tải nội dung",
}: ErrorStateProps) {
  return (
    <Alert className={cn("space-y-2", className)} variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{description}</p>
        {action ? <div>{action}</div> : null}
      </AlertDescription>
    </Alert>
  );
}
