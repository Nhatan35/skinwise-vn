import type { InsightsDto, InsightsDayStatus } from "@/modules/insights/insights.dto";
import { getSymptomLabel } from "@/modules/insights/components/insights-overview-cards";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/utils";

const dayStatusLabels: Record<InsightsDayStatus, string> = {
  completed: "Completed",
  partial: "Partial",
  skipped: "Skipped",
  not_logged: "Not logged",
};

const dayStatusClassNames: Record<InsightsDayStatus, string> = {
  completed: "border-primary bg-primary/10 text-primary",
  partial: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  skipped: "border-muted-foreground/30 bg-secondary text-muted-foreground",
  not_logged: "border-dashed bg-card text-muted-foreground",
};

type RoutineConsistencyCalendarProps = {
  calendarDays: InsightsDto["calendarDays"];
};

export function RoutineConsistencyCalendar({
  calendarDays,
}: RoutineConsistencyCalendarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Routine consistency calendar</CardTitle>
        <CardDescription>
          Each day summarizes routine slots and whether a journal entry exists.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          {(Object.keys(dayStatusLabels) as InsightsDayStatus[]).map((status) => (
            <div className="flex items-center gap-2" key={status}>
              <span
                aria-hidden="true"
                className={cn("size-3 rounded border", dayStatusClassNames[status])}
              />
              <span className="text-muted-foreground">{dayStatusLabels[status]}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-7">
          {calendarDays.map((day) => (
            <div
              className={cn(
                "min-h-32 rounded-2xl border p-3 text-sm",
                dayStatusClassNames[day.routineSummary.dayStatus],
              )}
              data-day-status={day.routineSummary.dayStatus}
              key={day.localDate}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold">{day.localDate.slice(5)}</span>
                {day.hasJournalEntry ? <Badge variant="outline">Journal</Badge> : null}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                <dt>Done</dt>
                <dd className="text-right font-semibold">{day.routineSummary.completed}</dd>
                <dt>Partial</dt>
                <dd className="text-right font-semibold">{day.routineSummary.partial}</dd>
                <dt>Skipped</dt>
                <dd className="text-right font-semibold">{day.routineSummary.skipped}</dd>
                <dt>Missing</dt>
                <dd className="text-right font-semibold">{day.routineSummary.notLogged}</dd>
              </dl>
              {day.symptoms.length > 0 ? (
                <p className="mt-3 line-clamp-2 text-xs">
                  {day.symptoms.map(getSymptomLabel).join(", ")}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
