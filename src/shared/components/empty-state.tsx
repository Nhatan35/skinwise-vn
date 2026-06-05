import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { cn } from "@/shared/utils";

type EmptyStateProps = {
  action?: ReactNode;
  actionClassName?: string;
  className?: string;
  description: string;
  title: string;
};

export function EmptyState({
  action,
  actionClassName,
  className,
  description,
  title,
}: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed bg-card/80 text-center", className)}>
      <CardHeader className="items-center gap-2 px-5 pt-6 pb-3 sm:px-6">
        <div aria-hidden="true" className="mb-1 size-10 rounded-full bg-secondary" />
        <CardTitle>{title}</CardTitle>
        <CardDescription className="max-w-xl">{description}</CardDescription>
      </CardHeader>
      {action ? (
        <CardContent className={cn("flex justify-center pt-0", actionClassName)}>
          {action}
        </CardContent>
      ) : null}
    </Card>
  );
}
