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
  return (
    <DashboardCard
      action={<Badge variant="secondary">{progress.completionRate}%</Badge>}
      title="Tiến độ hôm nay"
    >
      <div className="space-y-4">
        <p className="text-sm text-stone-600">Ngày: {progress.localDate}</p>
        {progress.totalRoutines === 0 ? (
          <p className="text-sm leading-6 text-stone-600">
            Bạn chưa có routine nào để ghi nhận tiến độ hôm nay.
          </p>
        ) : progress.completed + progress.partial + progress.skipped === 0 ? (
          <p className="text-sm leading-6 text-stone-600">
            Bạn chưa ghi nhận routine hôm nay.
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-emerald-50 p-3">
            <p className="font-medium text-emerald-900">Hoàn thành</p>
            <p className="mt-1 text-2xl font-semibold">{progress.completed}</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-3">
            <p className="font-medium text-amber-900">Một phần</p>
            <p className="mt-1 text-2xl font-semibold">{progress.partial}</p>
          </div>
          <div className="rounded-lg bg-stone-100 p-3">
            <p className="font-medium text-stone-900">Bỏ qua</p>
            <p className="mt-1 text-2xl font-semibold">{progress.skipped}</p>
          </div>
          <div className="rounded-lg bg-stone-100 p-3">
            <p className="font-medium text-stone-900">Chưa ghi nhận</p>
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
