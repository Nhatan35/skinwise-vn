import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DashboardCard } from "@/modules/dashboard/components/dashboard-card";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

type RoutineCoverageSummaryCardProps = {
  routineCoverage: DashboardDto["routineCoverage"];
};

type CoverageItem = DashboardDto["routineCoverage"]["coverageItems"][number];

const coverageStatusLabels: Record<CoverageItem["status"], string> = {
  complete: "Đã ghi nhận",
  note: "Ghi chú",
  missing: "Cần xem lại",
};

const coverageItemLabels: Record<CoverageItem["id"], string> = {
  "routine-created": "Routine đã được tạo",
  "morning-routine": "Routine buổi sáng",
  "evening-routine": "Routine buổi tối",
  "morning-sunscreen": "Chống nắng buổi sáng",
  moisturizer: "Dưỡng ẩm",
};

const coverageBadgeVariants: Record<
  CoverageItem["status"],
  "outline" | "secondary"
> = {
  complete: "secondary",
  note: "outline",
  missing: "outline",
};

export function RoutineCoverageSummaryCard({
  routineCoverage,
}: RoutineCoverageSummaryCardProps) {
  return (
    <DashboardCard
      action={
        <Badge variant="secondary">
          {routineCoverage.totalRoutines} routine
        </Badge>
      }
      className="xl:col-span-2"
      testId="dashboard-routine-coverage-summary-card"
      title="Tổng quan routine"
    >
      <div className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Phần này chỉ giúp bạn xem cấu trúc routine ở mức thói quen và không thay thế tư vấn chuyên môn.
        </p>

        <div className="rounded-2xl bg-secondary p-3">
          <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            Tổng số routine hiện có
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {routineCoverage.totalRoutines}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {routineCoverage.summary}
          </p>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {routineCoverage.coverageItems.map((item) => (
            <div
              className="rounded-2xl border border-border bg-background p-3"
              data-testid={`dashboard-routine-coverage-item-${item.id}`}
              key={item.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {coverageItemLabels[item.id]}
                </p>
                <Badge variant={coverageBadgeVariants[item.status]}>
                  {coverageStatusLabels[item.status]}
                </Badge>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-secondary/40 p-3">
          {routineCoverage.cautionItems.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">
                {routineCoverage.cautionItems.length} mục cần kiểm tra lại
              </p>
              <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                {routineCoverage.cautionItems.map((item) => (
                  <li key={item.id}>
                    <span className="font-medium text-foreground">
                      {item.label}
                    </span>
                    <span className="block">{item.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              Routine đã có các phần cơ bản được ghi nhận. Bạn có thể tiếp tục
              theo dõi và cập nhật khi thói quen thay đổi.
            </p>
          )}
        </div>

        <div
          className="rounded-2xl border border-border bg-background p-3"
          data-testid="dashboard-routine-coverage-next-action"
        >
          <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            Bước nên kiểm tra tiếp theo
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {routineCoverage.nextAction.label}
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {routineCoverage.nextAction.description}
          </p>
        </div>

        <Button asChild size="sm" variant="outline">
          <Link href={routineCoverage.nextAction.href}>
            Quản lý routine
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </DashboardCard>
  );
}
