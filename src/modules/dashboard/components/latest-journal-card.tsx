import Link from "next/link";

import { DashboardCard } from "@/modules/dashboard/components/dashboard-card";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

type LatestJournalCardProps = {
  latestJournal: DashboardDto["latestJournal"];
};

const symptomLabels = {
  dryness: "Dryness",
  oiliness: "Oiliness",
  redness: "Redness",
  stinging: "Stinging",
  new_breakouts: "New breakouts",
  itchiness: "Itchiness",
  other: "Other",
};

const stressLevelLabels = {
  low: "Low stress",
  medium: "Medium stress",
  high: "High stress",
};

export function LatestJournalCard({ latestJournal }: LatestJournalCardProps) {
  if (!latestJournal.exists) {
    return (
      <DashboardCard testId="dashboard-latest-journal-card" title="Latest Journal Entry">
        <div className="space-y-4">
          <p className="text-sm leading-6 text-stone-600">
            No skin journal entries yet. Add a short, private note for today to
            keep your skincare tracking context complete.
          </p>
          <Button asChild size="sm">
            <Link href={routes.JOURNAL}>Add today&apos;s journal</Link>
          </Button>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      action={<Badge variant="secondary">{latestJournal.localDate}</Badge>}
      testId="dashboard-latest-journal-card"
      title="Latest Journal Entry"
    >
      <div className="space-y-4">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-medium text-stone-900">Entry date</dt>
            <dd className="mt-1 text-stone-600">{latestJournal.localDate}</dd>
          </div>

          <div>
            <dt className="font-medium text-stone-900">Observations</dt>
            <dd className="mt-1 text-stone-600">
              {latestJournal.observations.length > 0
                ? latestJournal.observations.join(", ")
                : "No observations recorded."}
            </dd>
          </div>

          <div>
            <dt className="font-medium text-stone-900">Symptoms</dt>
            <dd className="mt-1 text-stone-600">
              {latestJournal.symptoms.length > 0
                ? latestJournal.symptoms
                    .map((symptom) => symptomLabels[symptom])
                    .join(", ")
                : "No symptoms recorded."}
            </dd>
          </div>

          {latestJournal.stressLevel ? (
            <div>
              <dt className="font-medium text-stone-900">Stress level</dt>
              <dd className="mt-1 text-stone-600">
                {stressLevelLabels[latestJournal.stressLevel]}
              </dd>
            </div>
          ) : null}

          {latestJournal.notesPreview ? (
            <div>
              <dt className="font-medium text-stone-900">Notes</dt>
              <dd className="mt-1 text-stone-600">
                {latestJournal.notesPreview}
              </dd>
            </div>
          ) : null}

          <div>
            <dt className="font-medium text-stone-900">Products used</dt>
            <dd className="mt-1 text-stone-600">
              {latestJournal.productsUsedCount} products
            </dd>
          </div>
        </dl>

        <Button asChild size="sm" variant="outline">
          <Link href={routes.JOURNAL}>View journal</Link>
        </Button>
      </div>
    </DashboardCard>
  );
}
