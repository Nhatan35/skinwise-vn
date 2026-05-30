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
        <CardTitle>Top symptoms</CardTitle>
        <CardDescription>
          Based on your logged data, these symptoms appeared most often in this period.
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
                <Badge variant="secondary">{symptom.count} time(s)</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No symptom data yet. When you record symptoms in your journal, they
            will appear here as a simple count.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
