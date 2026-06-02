import type { InsightsDto } from "@/modules/insights/insights.dto";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

const symptomLabels: Record<string, string> = {
  dryness: "Khô da",
  oiliness: "Dầu nhiều",
  redness: "Đỏ da",
  stinging: "Châm chích",
  new_breakouts: "Nốt mụn mới",
  itchiness: "Ngứa",
  other: "Khác",
};

type InsightsOverviewCardsProps = {
  insights: InsightsDto;
};

export function getSymptomLabel(symptom: string) {
  return symptomLabels[symptom] ?? symptom;
}

export function InsightsOverviewCards({ insights }: InsightsOverviewCardsProps) {
  const mostCommonSymptom = insights.journalActivity.mostCommonSymptoms[0];
  const hasRoutineSlots = insights.routineConsistency.totalRoutineSlots > 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Tỷ lệ hoàn thành routine</CardTitle>
          <CardDescription>
            Dựa trên các checklist routine bạn đã ghi nhận trong giai đoạn này.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {hasRoutineSlots ? `${insights.routineConsistency.completionRate}%` : "Chưa có"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {hasRoutineSlots
              ? `${insights.routineConsistency.completedRoutineSlots}/${insights.routineConsistency.totalRoutineSlots} lượt routine đã hoàn thành.`
              : "Tạo routine và ghi log để bắt đầu theo dõi độ đều đặn."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chuỗi ngày gần đây</CardTitle>
          <CardDescription>
            Số ngày hoàn thành routine liên tiếp tính từ cuối giai đoạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {insights.routineConsistency.currentStreak}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Chuỗi dài nhất: {insights.routineConsistency.bestStreak} ngày.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nhật ký da</CardTitle>
          <CardDescription>
            Số lần bạn ghi lại cảm nhận, triệu chứng hoặc sản phẩm đã dùng.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {insights.journalActivity.totalEntries}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {insights.journalActivity.activeJournalDays > 0
              ? `${insights.journalActivity.activeJournalDays} ngày có nhật ký.`
              : "Chưa có nhật ký trong giai đoạn này."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Triệu chứng thường gặp</CardTitle>
          <CardDescription>
            Dựa trên các mục bạn tự ghi nhận trong nhật ký da.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mostCommonSymptom ? (
            <div className="space-y-2">
              <Badge variant="secondary">{getSymptomLabel(mostCommonSymptom.symptom)}</Badge>
              <p className="text-sm text-muted-foreground">
                Xuất hiện {mostCommonSymptom.count} lần trong giai đoạn này.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Chưa có triệu chứng tự ghi nhận trong nhật ký.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
