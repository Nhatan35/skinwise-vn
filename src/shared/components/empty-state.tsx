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
  className?: string;
  description: string;
  title: string;
};

export function EmptyState({
  action,
  className,
  description,
  title,
}: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed bg-card/80 text-center", className)}>
      <CardHeader className="items-center">
        <div aria-hidden="true" className="mb-2 size-12 rounded-2xl bg-secondary" />
        <CardTitle>{title}</CardTitle>
        <CardDescription className="max-w-xl">{description}</CardDescription>
      </CardHeader>
      {action ? <CardContent>{action}</CardContent> : null}
    </Card>
  );
}
