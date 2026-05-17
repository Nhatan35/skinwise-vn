import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type DashboardCardProps = {
  action?: ReactNode;
  children: ReactNode;
  title: string;
};

export function DashboardCard({ action, children, title }: DashboardCardProps) {
  return (
    <Card className="border-stone-200 bg-white">
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
