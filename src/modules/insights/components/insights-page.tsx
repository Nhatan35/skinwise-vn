"use client";

import { useEffect, useState } from "react";

import { InsightsNextActionsCard } from "@/modules/insights/components/insights-next-actions-card";
import { InsightsOverviewCards } from "@/modules/insights/components/insights-overview-cards";
import { ProductUsageCard } from "@/modules/insights/components/product-usage-card";
import { RoutineConsistencyCalendar } from "@/modules/insights/components/routine-consistency-calendar";
import { SymptomTrendCard } from "@/modules/insights/components/symptom-trend-card";
import { getDefaultInsightsRange, getInsights } from "@/modules/insights/insights.client";
import type { InsightsDto } from "@/modules/insights/insights.dto";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { Button } from "@/shared/components/ui/button";

function hasNoTrackingData(insights: InsightsDto) {
  return (
    insights.routineConsistency.completedRoutineSlots +
      insights.routineConsistency.partialRoutineSlots +
      insights.routineConsistency.skippedRoutineSlots ===
      0 && insights.journalActivity.totalEntries === 0
  );
}

export function InsightsPage() {
  const [dateRange] = useState(() => getDefaultInsightsRange());
  const [insights, setInsights] = useState<InsightsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function loadInsights() {
    setIsLoading(true);
    setLoadError(null);

    try {
      setInsights(await getInsights(dateRange));
    } catch {
      setInsights(null);
      setLoadError("We couldn’t load your insights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialInsights() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const nextInsights = await getInsights(dateRange);

        if (isMounted) {
          setInsights(nextInsights);
        }
      } catch {
        if (isMounted) {
          setInsights(null);
          setLoadError("We couldn’t load your insights. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialInsights();

    return () => {
      isMounted = false;
    };
  }, [dateRange]);

  if (isLoading) {
    return <LoadingState label="Loading Skin Progress Insights" />;
  }

  if (loadError) {
    return (
      <ErrorState
        action={
          <Button onClick={() => void loadInsights()} size="sm" variant="outline">
            Try again
          </Button>
        }
        description={loadError}
        title="We couldn’t load your insights"
      />
    );
  }

  if (!insights) {
    return (
      <ErrorState
        description="We couldn’t load your insights. Please try again."
        title="We couldn’t load your insights"
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm shadow-stone-950/5">
        <p className="text-sm font-semibold text-primary">
          {insights.dateRange.from} → {insights.dateRange.to}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          This page summarizes your self-tracked data and is not medical advice.
        </p>
      </div>

      {hasNoTrackingData(insights) ? (
        <EmptyState
          description="Start by logging your routine or writing a skin journal entry."
          title="Not enough tracking data yet."
        />
      ) : null}

      <InsightsOverviewCards insights={insights} />
      <RoutineConsistencyCalendar calendarDays={insights.calendarDays} />

      <div className="grid gap-4 xl:grid-cols-3">
        <SymptomTrendCard symptoms={insights.journalActivity.mostCommonSymptoms} />
        <ProductUsageCard products={insights.productUsage.mostUsedProducts} />
        <InsightsNextActionsCard nextActions={insights.nextActions} />
      </div>
    </div>
  );
}
