import Link from "next/link";

import { DashboardCard } from "@/modules/dashboard/components/dashboard-card";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

type RoutineSummaryCardProps = {
  routines: DashboardDto["routines"];
};

export function RoutineSummaryCard({ routines }: RoutineSummaryCardProps) {
  return (
    <DashboardCard title="Routine của bạn">
      <div className="space-y-4">
        {!routines.hasAnyRoutine ? (
          <p className="text-sm leading-6 text-stone-600">
            Bạn chưa có routine nào. Hãy tạo routine sáng hoặc tối đầu tiên.
          </p>
        ) : null}
        <dl className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-lg bg-stone-100 p-3">
            <dt className="font-medium text-stone-700">Tổng số routine</dt>
            <dd className="mt-1 text-2xl font-semibold text-stone-950">
              {routines.total}
            </dd>
          </div>
          <div className="rounded-lg bg-stone-100 p-3">
            <dt className="font-medium text-stone-700">Buổi sáng</dt>
            <dd className="mt-1 text-2xl font-semibold text-stone-950">
              {routines.morning}
            </dd>
          </div>
          <div className="rounded-lg bg-stone-100 p-3">
            <dt className="font-medium text-stone-700">Buổi tối</dt>
            <dd className="mt-1 text-2xl font-semibold text-stone-950">
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
