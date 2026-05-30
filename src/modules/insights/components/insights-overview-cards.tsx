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
  dryness: "Dryness",
  oiliness: "Oiliness",
  redness: "Redness",
  stinging: "Stinging",
  new_breakouts: "New breakouts",
  itchiness: "Itchiness",
  other: "Other",
};

type InsightsOverviewCardsProps = {
  insights: InsightsDto;
};

export function getSymptomLabel(symptom: string) {
  return symptomLabels[symptom] ?? symptom;
}

export function InsightsOverviewCards({ insights }: InsightsOverviewCardsProps) {
  const mostCommonSymptom = insights.journalActivity.mostCommonSymptoms[0];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Routine completion rate</CardTitle>
          <CardDescription>Completed routine slots in this period.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {insights.routineConsistency.completionRate}%
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {insights.routineConsistency.completedRoutineSlots}/
            {insights.routineConsistency.totalRoutineSlots} completed slots
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current streak</CardTitle>
          <CardDescription>Completed days counted back from the end date.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {insights.routineConsistency.currentStreak}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Best streak: {insights.routineConsistency.bestStreak} day(s)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Journal entries</CardTitle>
          <CardDescription>Self-tracked journal activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {insights.journalActivity.totalEntries}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {insights.journalActivity.activeJournalDays} active journal day(s)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most common symptom</CardTitle>
          <CardDescription>Based on your logged data only.</CardDescription>
        </CardHeader>
        <CardContent>
          {mostCommonSymptom ? (
            <div className="space-y-2">
              <Badge variant="secondary">{getSymptomLabel(mostCommonSymptom.symptom)}</Badge>
              <p className="text-sm text-muted-foreground">
                Appeared {mostCommonSymptom.count} time(s) in this period.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No symptoms recorded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
