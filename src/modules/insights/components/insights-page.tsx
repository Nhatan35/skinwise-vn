"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { InsightSummarySection } from "@/modules/insights/components/insight-summary-section";
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
      setLoadError(
        "Chưa thể chuẩn bị insights tiến trình. Hãy thêm hoạt động hoặc thử lại sau.",
      );
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
          setLoadError(
            "Chưa thể chuẩn bị insights tiến trình. Hãy thêm hoạt động hoặc thử lại sau.",
          );
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
    return <LoadingState label="Đang chuẩn bị insights tiến trình..." />;
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
        title="Chưa thể chuẩn bị insights"
      />
    );
  }

  if (!insights) {
    return (
      <ErrorState
        description="Chưa thể chuẩn bị insights tiến trình. Hãy thêm hoạt động hoặc thử lại sau."
        title="Chưa thể chuẩn bị insights"
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
          và nhật ký da đã ghi nhận. Các số liệu này chỉ hỗ trợ tự theo dõi;
          dữ liệu ngắn hạn có thể chưa đủ để rút ra kết luận chắc chắn và không
          thay thế tư vấn chuyên môn.
        </p>
      </div>

      {hasNoTrackingData(insights) ? (
        <EmptyState
          action={
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Button asChild size="sm">
                <Link href={routes.TODAY_LOG}>Đi tới routine hôm nay</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={routes.JOURNAL}>Thêm nhật ký</Link>
              </Button>
            </div>
          }
          description="Hãy hoàn thành routine và thêm nhật ký trong vài ngày để SkinWise có thêm dữ liệu hiển thị xu hướng."
          title="Chưa đủ dữ liệu để xem insights"
        />
      ) : null}

      <InsightSummarySection to={dateRange.to} />

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
