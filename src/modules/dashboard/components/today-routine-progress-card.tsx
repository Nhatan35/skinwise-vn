import Link from "next/link";

import { DashboardCard } from "@/modules/dashboard/components/dashboard-card";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

type TodayRoutineProgressCardProps = {
  progress: DashboardDto["todayRoutineLogs"];
};

export function TodayRoutineProgressCard({
  progress,
}: TodayRoutineProgressCardProps) {
  const hasAnyLog = progress.completed + progress.partial + progress.skipped > 0;

  return (
    <DashboardCard
      action={<Badge variant="secondary">{progress.completionRate}%</Badge>}
      testId="dashboard-routine-progress-card"
      title="Tiến độ hôm nay"
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Ngày: {progress.localDate}</p>
        {progress.totalRoutines === 0 ? (
          <p className="text-sm leading-6 text-muted-foreground">
            Bạn chưa có routine nào để ghi nhận tiến độ hôm nay.
          </p>
        ) : !hasAnyLog ? (
          <p className="text-sm leading-6 text-muted-foreground">
            Bạn chưa ghi nhận routine hôm nay.
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-2xl bg-[#E7F3EA] p-3">
            <p className="font-semibold text-primary">Hoàn thành</p>
            <p className="mt-1 text-2xl font-semibold">{progress.completed}</p>
          </div>
          <div className="rounded-2xl bg-[#FFF1D6] p-3">
            <p className="font-semibold text-amber-900">Một phần</p>
            <p className="mt-1 text-2xl font-semibold">{progress.partial}</p>
          </div>
          <div className="rounded-2xl bg-secondary p-3">
            <p className="font-semibold text-foreground">Bỏ qua</p>
            <p className="mt-1 text-2xl font-semibold">{progress.skipped}</p>
          </div>
          <div className="rounded-2xl bg-secondary p-3">
            <p className="font-semibold text-foreground">Chưa ghi nhận</p>
            <p className="mt-1 text-2xl font-semibold">{progress.notLogged}</p>
          </div>
        </div>

        <Button asChild size="sm" variant="outline">
          <Link href={routes.TODAY_LOG}>Ghi nhận routine</Link>
        </Button>
      </div>
    </DashboardCard>
  );
}
