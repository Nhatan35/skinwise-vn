"use client";

import type { RoutineDto } from "@/modules/routines/routine.dto";
import {
  buildRoutineCoverageReview,
  type RoutineCoverageItemStatus,
} from "@/modules/routines/routine-coverage-review";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type RoutineCoverageReviewCardProps = {
  routines: RoutineDto[];
  onCreateRoutine?: () => void;
};

const statusLabels: Record<RoutineCoverageItemStatus, string> = {
  complete: "Đã có",
  note: "Ghi chú",
  missing: "Cần xem lại",
};

export function RoutineCoverageReviewCard({
  routines,
  onCreateRoutine,
}: RoutineCoverageReviewCardProps) {
  const review = buildRoutineCoverageReview(routines);
  const canCreateFromCard =
    review.nextAction.actionType === "create-routine" && onCreateRoutine;

  return (
    <Card
      className="border-border bg-card"
      data-testid="routine-coverage-review-card"
    >
      <CardHeader>
        <CardTitle>Đánh giá tổng quan routine</CardTitle>
        <CardDescription>
          Đây là phần kiểm tra thói quen và cấu trúc routine ở mức tham khảo,
          không phải chẩn đoán da hoặc lời khuyên điều trị.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-md border border-border bg-secondary/40 p-4">
          <p className="text-sm font-semibold text-foreground">
            {review.hasRoutines
              ? `Đang có ${review.totalRoutines} routine trong hồ sơ của bạn.`
              : "Bạn chưa có routine nào để đánh giá."}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {review.summary}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {review.coverageItems.map((item) => (
            <div
              className="rounded-md border border-border bg-background p-3"
              data-testid={`routine-coverage-item-${item.id}`}
              key={item.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {item.label}
                </p>
                <Badge variant={item.status === "complete" ? "secondary" : "outline"}>
                  {statusLabels[item.status]}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {review.cautionItems.length > 0 ? (
          <Alert data-testid="routine-coverage-cautions">
            <AlertTitle>Điểm cần kiểm tra lại</AlertTitle>
            <AlertDescription>
              <ul className="mt-3 space-y-3">
                {review.cautionItems.map((item) => (
                  <li key={item.id}>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="mt-1 leading-6">{item.description}</p>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert data-testid="routine-coverage-positive-summary">
            <AlertTitle>Chưa thấy thiếu hụt cấu trúc lớn</AlertTitle>
            <AlertDescription>
              Tiếp tục theo dõi cảm nhận của da và cập nhật routine khi thói
              quen sử dụng thay đổi.
            </AlertDescription>
          </Alert>
        )}

        <div
          className="flex flex-col gap-3 rounded-md border border-border bg-secondary/30 p-4 sm:flex-row sm:items-center sm:justify-between"
          data-testid="routine-coverage-next-action"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">
              {review.nextAction.label}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {review.nextAction.description}
            </p>
          </div>
          {canCreateFromCard ? (
            <Button onClick={canCreateFromCard} type="button">
              {review.nextAction.label}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
