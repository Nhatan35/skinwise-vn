"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
import { routes } from "@/shared/constants/routes";

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
      setLoadError("Chưa thể tải Insights lúc này. Vui lòng thử lại sau.");
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
          setLoadError("Chưa thể tải Insights lúc này. Vui lòng thử lại sau.");
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
    return <LoadingState label="Đang tải Insights tiến trình chăm sóc da" />;
  }

  if (loadError) {
    return (
      <ErrorState
        action={
          <Button onClick={() => void loadInsights()} size="sm" variant="outline">
            Thử lại
          </Button>
        }
        description={loadError}
        title="Không thể tải Insights"
      />
    );
  }

  if (!insights) {
    return (
      <ErrorState
        description="Chưa thể tải Insights lúc này. Vui lòng thử lại sau."
        title="Không thể tải Insights"
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm shadow-stone-950/5">
        <p className="text-sm font-semibold text-primary">
          Giai đoạn {insights.dateRange.from} đến {insights.dateRange.to}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Insights giúp bạn nhìn lại thói quen chăm sóc da dựa trên routine log
          và nhật ký da đã ghi nhận. Các số liệu này hỗ trợ tự theo dõi và điều
          chỉnh thói quen, không phải chẩn đoán y khoa.
        </p>
      </div>

      {hasNoTrackingData(insights) ? (
        <EmptyState
          action={
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Button asChild size="sm">
                <Link href={routes.TODAY_LOG}>Ghi nhận routine hôm nay</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={routes.JOURNAL}>Thêm nhật ký da</Link>
              </Button>
            </div>
          }
          description="Chưa có routine log hoặc nhật ký da trong giai đoạn này. Hãy ghi nhận routine hôm nay hoặc thêm một ghi chú ngắn để Insights có dữ liệu phản ánh thói quen của bạn."
          title="Chưa đủ dữ liệu theo dõi"
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
