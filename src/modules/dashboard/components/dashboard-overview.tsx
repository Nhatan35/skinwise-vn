"use client";

import { useEffect, useState } from "react";

import { LatestAnalysisCard } from "@/modules/dashboard/components/latest-analysis-card";
import { LatestJournalCard } from "@/modules/dashboard/components/latest-journal-card";
import { NextActionsCard } from "@/modules/dashboard/components/next-actions-card";
import { PrimaryNextActionCard } from "@/modules/dashboard/components/primary-next-action-card";
import { RoutineSummaryCard } from "@/modules/dashboard/components/routine-summary-card";
import { SavedProductsSummaryCard } from "@/modules/dashboard/components/saved-products-summary-card";
import { SkinProfileSummaryCard } from "@/modules/dashboard/components/skin-profile-summary-card";
import { TodayRoutineProgressCard } from "@/modules/dashboard/components/today-routine-progress-card";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { getBrowserLocalDate } from "@/modules/routine-logs/routine-log.client";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { Button } from "@/shared/components/ui/button";

const DASHBOARD_API_PATH = "/api/dashboard";

type ApiError = {
  code: string;
  details?: unknown;
  message: string;
};

type DashboardApiResponse =
  | {
      data: {
        dashboard: DashboardDto;
      };
      error: null;
    }
  | {
      data: null;
      error: ApiError;
    };

async function readDashboardResponse(response: Response) {
  try {
    return (await response.json()) as DashboardApiResponse;
  } catch {
    return {
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "Invalid response body.",
      },
    } satisfies DashboardApiResponse;
  }
}

function getDashboardLoadErrorMessage(error?: ApiError | null) {
  if (error?.code === "UNAUTHORIZED") {
    return "Bạn cần đăng nhập để xem dashboard.";
  }

  if (error?.code === "VALIDATION_ERROR") {
    return "Ngày dashboard không hợp lệ. Vui lòng tải lại trang.";
  }

  return "Không thể tải dashboard. Vui lòng thử lại.";
}

export function DashboardOverview() {
  const [dashboard, setDashboard] = useState<DashboardDto | null>(null);
  const [dashboardLocalDate] = useState(() => getBrowserLocalDate());
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [dashboardLoadError, setDashboardLoadError] = useState<string | null>(
    null,
  );

  async function loadDashboard() {
    setIsLoadingDashboard(true);
    setDashboardLoadError(null);

    try {
      const response = await fetch(
        `${DASHBOARD_API_PATH}?localDate=${encodeURIComponent(dashboardLocalDate)}`,
        {
          headers: {
            Accept: "application/json",
          },
          method: "GET",
        },
      );
      const body = await readDashboardResponse(response);

      if (!response.ok || !body.data) {
        setDashboardLoadError(getDashboardLoadErrorMessage(body.error));
        setDashboard(null);
        return;
      }

      setDashboard(body.data.dashboard);
    } catch {
      setDashboardLoadError("Không thể tải dashboard. Vui lòng thử lại.");
      setDashboard(null);
    } finally {
      setIsLoadingDashboard(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialDashboard() {
      setIsLoadingDashboard(true);
      setDashboardLoadError(null);

      try {
        const response = await fetch(
          `${DASHBOARD_API_PATH}?localDate=${encodeURIComponent(dashboardLocalDate)}`,
          {
            headers: {
              Accept: "application/json",
            },
            method: "GET",
          },
        );
        const body = await readDashboardResponse(response);

        if (!isMounted) {
          return;
        }

        if (!response.ok || !body.data) {
          setDashboardLoadError(getDashboardLoadErrorMessage(body.error));
          setDashboard(null);
          return;
        }

        setDashboard(body.data.dashboard);
      } catch {
        if (isMounted) {
          setDashboardLoadError("Không thể tải dashboard. Vui lòng thử lại.");
          setDashboard(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingDashboard(false);
        }
      }
    }

    void loadInitialDashboard();

    return () => {
      isMounted = false;
    };
  }, [dashboardLocalDate]);

  if (isLoadingDashboard) {
    return <LoadingState label="Đang tải dashboard" />;
  }

  if (dashboardLoadError) {
    return (
      <ErrorState
        action={
          <Button onClick={() => void loadDashboard()} size="sm" variant="outline">
            Thử lại
          </Button>
        }
        description={dashboardLoadError}
        title="Không thể tải dashboard"
      />
    );
  }

  if (!dashboard) {
    return (
      <ErrorState
        description="Không thể tải dashboard. Vui lòng thử lại."
        title="Không thể tải dashboard"
      />
    );
  }

  const primaryNextAction = dashboard.nextActions[0];

  return (
    <div className="space-y-5">
      {primaryNextAction ? (
        <PrimaryNextActionCard nextAction={primaryNextAction} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SkinProfileSummaryCard
          profileCompletion={dashboard.profileCompletion}
          skinProfile={dashboard.skinProfile}
        />
        <TodayRoutineProgressCard progress={dashboard.todayRoutineLogs} />
        <RoutineSummaryCard
          routineConsistency={dashboard.routineConsistency}
          routines={dashboard.routines}
        />
        <SavedProductsSummaryCard savedProducts={dashboard.savedProducts} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <LatestJournalCard
          journalTrend={dashboard.journalTrend}
          latestJournal={dashboard.latestJournal}
        />
        <LatestAnalysisCard latestAnalysis={dashboard.latestRoutineAnalysis} />
        <NextActionsCard nextActions={dashboard.nextActions} />
      </div>
    </div>
  );
}
