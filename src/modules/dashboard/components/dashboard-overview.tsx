"use client";

import Link from "next/link";
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
import { routes } from "@/shared/constants/routes";

import { OnboardingProgressCard } from "./onboarding-progress-card";

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
    return "Ngày dashboard không hợp lệ. Vui lòng làm mới trang.";
  }

  return "Không thể tải tổng quan dashboard. Vui lòng thử lại hoặc làm mới trang.";
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
      setDashboardLoadError(
        "Không thể tải tổng quan dashboard. Vui lòng thử lại hoặc làm mới trang.",
      );
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
          setDashboardLoadError(
            "Không thể tải tổng quan dashboard. Vui lòng thử lại hoặc làm mới trang.",
          );
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
    return <LoadingState label="Đang tải dashboard chăm sóc da..." />;
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
        title="Không thể tải tổng quan dashboard"
      />
    );
  }

  if (!dashboard) {
    return (
      <ErrorState
        description="Không thể tải tổng quan dashboard. Vui lòng thử lại hoặc làm mới trang."
        title="Không thể tải tổng quan dashboard"
      />
    );
  }

  const primaryNextAction = dashboard.nextActions[0];
  const isFirstTimeDashboard =
    !dashboard.skinProfile.exists &&
    !dashboard.routines.hasAnyRoutine &&
    !dashboard.latestJournal.exists;

  return (
    <div className="space-y-5">
      {isFirstTimeDashboard ? (
        <FirstTimeDashboardGuidance />
      ) : primaryNextAction ? (
        <PrimaryNextActionCard nextAction={primaryNextAction} />
      ) : null}

      <OnboardingProgressCard dashboard={dashboard} />

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

function FirstTimeDashboardGuidance() {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm shadow-stone-950/5 sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">
            Bắt đầu hành trình chăm sóc da của bạn
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Hoàn thiện hồ sơ da, tạo routine và ghi nhật ký để dashboard có
            thêm dữ liệu hiển thị tiến trình.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
          <Button asChild>
            <Link href={routes.ONBOARDING_SKIN_PROFILE}>Tạo hồ sơ da</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={routes.TODAY_LOG}>Đi tới routine hôm nay</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={routes.JOURNAL}>Thêm nhật ký</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
