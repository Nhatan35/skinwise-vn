import Link from "next/link";

import { DashboardCard } from "@/modules/dashboard/components/dashboard-card";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

type RoutineSummaryCardProps = {
  routineConsistency: DashboardDto["routineConsistency"];
  routines: DashboardDto["routines"];
};

const consistencyLabels = {
  needs_attention: "Cần bắt đầu lại",
  building: "Đang xây dựng thói quen",
  good: "Duy trì khá tốt",
  excellent: "Rất ổn định",
};

export function RoutineSummaryCard({
  routineConsistency,
  routines,
}: RoutineSummaryCardProps) {
  return (
    <DashboardCard
      action={<Badge variant="secondary">{routineConsistency.rate}%</Badge>}
      testId="dashboard-routine-summary-card"
      title="Routine của bạn"
    >
      <div className="space-y-4">
        {!routines.hasAnyRoutine ? (
          <p className="text-sm leading-6 text-muted-foreground">
            Bạn chưa có routine nào. Hãy tạo routine sáng hoặc tối đầu tiên.
          </p>
        ) : null}
        <div className="rounded-2xl bg-secondary p-3 text-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-foreground">Routine 7 ngày</p>
              <p className="mt-1 text-2xl font-semibold text-primary">
                {routineConsistency.maintainedDays}/{routineConsistency.totalDays} ngày
              </p>
            </div>
            <span className="rounded-full bg-background px-2 py-1 text-xs font-semibold text-muted-foreground">
              Chuỗi {routineConsistency.currentStreak} ngày
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
            <div
              aria-hidden="true"
              className="h-full rounded-full bg-primary"
              style={{ width: `${routineConsistency.rate}%` }}
            />
          </div>
          <p className="mt-3 text-xs font-semibold leading-5 text-foreground">
            {consistencyLabels[routineConsistency.label]}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {routineConsistency.message}
          </p>
          <p className="mt-2 text-xs font-medium leading-5 text-primary">
            {routineConsistency.nextAction}
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-2xl bg-secondary p-3">
            <dt className="font-semibold text-muted-foreground">Tổng số routine</dt>
            <dd className="mt-1 text-2xl font-semibold text-foreground">
              {routines.total}
            </dd>
          </div>
          <div className="rounded-2xl bg-secondary p-3">
            <dt className="font-semibold text-muted-foreground">Buổi sáng</dt>
            <dd className="mt-1 text-2xl font-semibold text-foreground">
              {routines.morning}
            </dd>
          </div>
          <div className="rounded-2xl bg-secondary p-3">
            <dt className="font-semibold text-muted-foreground">Buổi tối</dt>
            <dd className="mt-1 text-2xl font-semibold text-foreground">
              {routines.evening}
            </dd>
          </div>
        </dl>
        <Button asChild size="sm" variant="outline">
          <Link href={routes.ROUTINES}>Quản lý routine</Link>
        </Button>
      </div>
    </DashboardCard>
  );
}
