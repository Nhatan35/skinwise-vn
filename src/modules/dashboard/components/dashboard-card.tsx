import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { cn } from "@/shared/utils";

type DashboardCardProps = {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  testId?: string;
  title: string;
};

export function DashboardCard({
  action,
  children,
  className,
  testId,
  title,
}: DashboardCardProps) {
  return (
    <Card className={cn("h-full bg-card", className)} data-testid={testId}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{title}</CardTitle>
          {action ? <div>{action}</div> : null}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
