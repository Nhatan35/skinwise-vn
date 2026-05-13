import type { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";

type ErrorStateProps = {
  action?: ReactNode;
  description: string;
  title?: string;
};

export function ErrorState({
  action,
  description,
  title = "Something went wrong",
}: ErrorStateProps) {
  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <span>{description}</span>
        {action ? <span className="mt-3 block">{action}</span> : null}
      </AlertDescription>
    </Alert>
  );
}
