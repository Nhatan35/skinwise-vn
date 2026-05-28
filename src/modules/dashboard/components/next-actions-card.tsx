import Link from "next/link";

import { DashboardCard } from "@/modules/dashboard/components/dashboard-card";
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
            className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 p-3 text-sm"
            key={`${action.href}-${action.label}`}
          >
            <Link className="font-medium text-emerald-800" href={action.href}>
              {action.label}
            </Link>
            <Badge variant="outline">{priorityLabels[action.priority]}</Badge>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
