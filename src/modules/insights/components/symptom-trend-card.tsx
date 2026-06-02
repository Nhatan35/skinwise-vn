import type { InsightsDto } from "@/modules/insights/insights.dto";
import { getSymptomLabel } from "@/modules/insights/components/insights-overview-cards";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type SymptomTrendCardProps = {
  symptoms: InsightsDto["journalActivity"]["mostCommonSymptoms"];
};

export function SymptomTrendCard({ symptoms }: SymptomTrendCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Xu hướng nhật ký da</CardTitle>
        <CardDescription>
          Dựa trên triệu chứng bạn tự ghi nhận trong nhật ký. Khi dữ liệu còn
          ít, hãy xem đây là gợi ý để quan sát thêm thay vì kết luận chắc chắn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {symptoms.length > 0 ? (
          <ul className="space-y-3">
            {symptoms.map((symptom) => (
              <li
                className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-secondary/40 px-4 py-3"
                key={symptom.symptom}
              >
                <span className="font-medium">{getSymptomLabel(symptom.symptom)}</span>
                <Badge variant="secondary">{symptom.count} lần</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Chưa có dữ liệu triệu chứng trong nhật ký. Thêm một ghi chú ngắn để
            theo dõi cảm nhận của da theo thời gian.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
