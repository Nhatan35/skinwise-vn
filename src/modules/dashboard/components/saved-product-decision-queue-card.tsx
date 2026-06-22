import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DashboardCard } from "@/modules/dashboard/components/dashboard-card";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

type SavedProductDecisionQueueCardProps = {
  savedProductDecisionQueue: DashboardDto["savedProductDecisionQueue"];
};

function getQueueStateMessage(
  savedProductDecisionQueue: DashboardDto["savedProductDecisionQueue"],
) {
  if (savedProductDecisionQueue.totalSavedProducts === 0) {
    return "Bạn chưa lưu sản phẩm nào. Khi lưu sản phẩm, dashboard sẽ giúp bạn xem sản phẩm nào cần cân nhắc tiếp.";
  }

  if (savedProductDecisionQueue.reviewNeededCount === 0) {
    return "Các sản phẩm đã lưu hiện đã có đủ trạng thái, kế hoạch routine và ghi chú cá nhân.";
  }

  return "Tóm tắt này giúp bạn biết sản phẩm nào vẫn cần xem lại trước khi đưa vào routine.";
}

export function SavedProductDecisionQueueCard({
  savedProductDecisionQueue,
}: SavedProductDecisionQueueCardProps) {
  const hasSavedProducts = savedProductDecisionQueue.totalSavedProducts > 0;
  const hasReviewNeeded = savedProductDecisionQueue.reviewNeededCount > 0;
  const decisionStatusBreakdown = [
    {
      label: "Đang cân nhắc",
      count: savedProductDecisionQueue.consideringCount,
      testId: "dashboard-saved-product-decision-considering",
    },
    {
      label: "Đang dùng thử",
      count: savedProductDecisionQueue.testingCount,
      testId: "dashboard-saved-product-decision-testing",
    },
    {
      label: "Tạm dừng",
      count: savedProductDecisionQueue.pausedCount,
      testId: "dashboard-saved-product-decision-paused",
    },
    {
      label: "Muốn giữ lại",
      count: savedProductDecisionQueue.keptCount,
      testId: "dashboard-saved-product-decision-kept",
    },
    {
      label: "Chưa chọn trạng thái",
      count: savedProductDecisionQueue.unsetDecisionStatusCount,
      testId: "dashboard-saved-product-decision-unset",
    },
  ];

  return (
    <DashboardCard
      action={
        <Badge
          variant={
            !hasSavedProducts || hasReviewNeeded ? "outline" : "secondary"
          }
        >
          {!hasSavedProducts
            ? "Chưa có"
            : hasReviewNeeded
              ? `${savedProductDecisionQueue.reviewNeededCount} cần xem lại`
              : "Đã đủ thông tin"}
        </Badge>
      }
      className="xl:col-span-2"
      testId="dashboard-saved-product-decision-queue-card"
      title="Hàng chờ xem lại sản phẩm"
    >
      <div className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          {getQueueStateMessage(savedProductDecisionQueue)}
        </p>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-2xl bg-secondary p-3">
            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              Tổng sản phẩm đã lưu
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {savedProductDecisionQueue.totalSavedProducts}
            </p>
          </div>
          <div className="rounded-2xl bg-secondary p-3">
            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              Cần xem lại
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {savedProductDecisionQueue.reviewNeededCount}
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl border border-border bg-background p-3"
          data-testid="dashboard-saved-product-decision-breakdown"
        >
          <p className="text-sm font-semibold text-foreground">
            Trạng thái quyết định cá nhân
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {decisionStatusBreakdown.map((item) => (
              <li
                className="flex items-center justify-between gap-3 rounded-xl bg-secondary/60 px-3 py-2"
                data-testid={item.testId}
                key={item.label}
              >
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
                <Badge variant="outline">{item.count} sản phẩm</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div
            className="rounded-2xl border border-border bg-background p-3"
            data-testid="dashboard-saved-product-missing-routine-slot"
          >
            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              Thiếu kế hoạch routine
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {savedProductDecisionQueue.withoutPlannedRoutineSlotCount}
            </p>
          </div>
          <div
            className="rounded-2xl border border-border bg-background p-3"
            data-testid="dashboard-saved-product-missing-personal-note"
          >
            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              Thiếu ghi chú cá nhân
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {savedProductDecisionQueue.withoutPersonalNoteCount}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-secondary/40 p-3">
          <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            Bước tiếp theo
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {savedProductDecisionQueue.nextAction.description}
          </p>
        </div>

        <p className="text-xs leading-5 text-muted-foreground">
          Đây là công cụ tổ chức cá nhân, không phải khuyến nghị điều trị hoặc
          đảm bảo sản phẩm phù hợp với da.
        </p>

        <Button asChild size="sm" variant="outline">
          <Link href={savedProductDecisionQueue.nextAction.href}>
            {savedProductDecisionQueue.nextAction.label}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </DashboardCard>
  );
}
