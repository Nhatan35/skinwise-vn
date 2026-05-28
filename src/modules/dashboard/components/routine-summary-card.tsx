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
    <DashboardCard testId="dashboard-routine-summary-card" title="Routine của bạn">
      <div className="space-y-4">
        {!routines.hasAnyRoutine ? (
          <p className="text-sm leading-6 text-muted-foreground">
            Bạn chưa có routine nào. Hãy tạo routine sáng hoặc tối đầu tiên.
          </p>
        ) : null}
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
