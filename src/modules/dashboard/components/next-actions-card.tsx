import Link from "next/link";

import { DashboardCard } from "@/modules/dashboard/components/dashboard-card";
import { getDashboardNextActionDescription } from "@/modules/dashboard/dashboard-next-action-copy";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { Badge } from "@/shared/components/ui/badge";

const priorityLabels = {
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp",
};

type NextActionsCardProps = {
  nextActions: DashboardDto["nextActions"];
};

export function NextActionsCard({ nextActions }: NextActionsCardProps) {
  return (
    <DashboardCard testId="dashboard-next-actions-card" title="Gợi ý tiếp theo">
      <ul className="space-y-3">
        {nextActions.map((action) => (
          <li
            className="rounded-2xl border border-border bg-secondary/40 p-3 text-sm"
            key={`${action.href}-${action.label}`}
          >
            <div className="flex items-center justify-between gap-3">
              <Link className="font-semibold text-primary" href={action.href}>
                {action.label}
              </Link>
              <Badge variant="outline">{priorityLabels[action.priority]}</Badge>
            </div>
            <p className="mt-2 leading-6 text-muted-foreground">
              <span className="font-medium text-foreground">Lý do:</span>{" "}
              {getDashboardNextActionDescription(action)}
            </p>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
