import type {
  RoutineWeeklyReview,
  RoutineWeeklyReviewDay,
  RoutineWeeklyReviewDayStatus,
} from "@/modules/routine-logs/routine-weekly-review";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type RoutineWeeklyReviewCardProps = {
  errorMessage?: string | null;
  isLoading?: boolean;
  review: RoutineWeeklyReview;
};

const statusLabels: Record<RoutineWeeklyReviewDayStatus, string> = {
  completed: "Hoàn thành",
  partial: "Một phần",
  skipped: "Đã bỏ qua",
  not_logged: "Chưa ghi nhận",
};

const statusBadgeVariants: Record<
  RoutineWeeklyReviewDayStatus,
  "outline" | "secondary"
> = {
  completed: "secondary",
  partial: "outline",
  skipped: "outline",
  not_logged: "outline",
};

export function RoutineWeeklyReviewCard({
  errorMessage,
  isLoading = false,
  review,
}: RoutineWeeklyReviewCardProps) {
  return (
    <Card data-testid="routine-weekly-review-card">
      <CardHeader>
        <CardTitle>Lịch sử routine 7 ngày gần đây</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p
          className="text-sm leading-6 text-muted-foreground"
          data-testid="routine-weekly-review-disclaimer"
        >
          Thông tin này giúp bạn theo dõi thói quen chăm sóc da, không đánh giá
          tình trạng da hoặc thay thế tư vấn chuyên môn. Không cần kết luận quá
          sớm từ một vài ngày ghi nhận.
        </p>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">
            Đang tải lịch sử routine gần đây...
          </p>
        ) : null}

        {errorMessage ? (
          <p className="text-sm text-red-700" role="alert">
            {errorMessage}
          </p>
        ) : null}

        {!isLoading && !errorMessage && !review.hasLogs ? (
          <div
            className="rounded-lg border border-dashed border-border bg-secondary/40 p-4"
            data-testid="routine-weekly-review-empty-state"
          >
            <p className="font-medium text-foreground">
              Chưa có dữ liệu routine trong 7 ngày gần đây.
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Bắt đầu ghi nhận routine hôm nay để xem lịch sử duy trì thói quen.
            </p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && review.hasLogs ? (
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <SummaryTile
              label="Số ngày đã ghi nhận"
              value={`${review.loggedDays}/${review.totalDays}`}
            />
            {review.completionRate !== null ? (
              <SummaryTile
                label="Tỉ lệ hoàn thành routine"
                value={`${review.completionRate}%`}
              />
            ) : null}
          </div>
        ) : null}

        <div className="space-y-2">
          {[...review.days].reverse().map((day) => (
            <RoutineWeeklyReviewDayRow day={day} key={day.localDate} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/50 p-3">
      <p className="font-medium text-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function RoutineWeeklyReviewDayRow({
  day,
}: {
  day: RoutineWeeklyReviewDay;
}) {
  const detail =
    day.totalLogs > 0
      ? `${day.completedCount} hoàn thành, ${day.partialCount} một phần, ${day.skippedCount} đã bỏ qua`
      : "Chưa có routine log trong ngày này";

  return (
    <div
      className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
      data-testid="routine-weekly-review-day"
    >
      <div>
        <p className="font-medium text-foreground">{getDayLabel(day.localDate)}</p>
        <p className="mt-1 text-muted-foreground">{detail}</p>
      </div>
      <Badge variant={statusBadgeVariants[day.status]}>
        {statusLabels[day.status]}
      </Badge>
    </div>
  );
}

function getDayLabel(localDate: string) {
  return `Ngày ${localDate}`;
}
