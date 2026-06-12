"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { listSkinJournals } from "@/modules/journals/skin-journal.client";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import { TodayJournalPromptCard } from "@/modules/routine-logs/components/today-journal-prompt-card";
import { RoutineWeeklyReviewCard } from "@/modules/routine-logs/components/routine-weekly-review-card";
import {
  listRoutineLogsForDate,
  listRoutineLogsForDateRange,
  RoutineLogClientError,
  getBrowserLocalDate,
  getBrowserTimezone,
  groupRoutineLogsByRoutineId,
} from "@/modules/routine-logs/routine-log.client";
import { getTodayJournalPromptState } from "@/modules/routine-logs/today-journal-prompt";
import {
  addLocalDateDays,
  buildRoutineWeeklyReview,
} from "@/modules/routine-logs/routine-weekly-review";
import { RoutineLogControls } from "@/modules/routines/components/routine-log-controls";
import { RoutineLogStatusBadge } from "@/modules/routines/components/routine-log-status-badge";
import type { RoutineDto } from "@/modules/routines/routine.dto";
import type {
  RoutineStepCategory,
  RoutineStepFrequency,
  RoutineTimeOfDay,
} from "@/modules/routines/routine.types";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { routes } from "@/shared/constants/routes";

const ROUTINES_API_PATH = "/api/routines";
const ROUTINE_LOGS_API_PATH = "/api/routine-logs";
const WEEKLY_REVIEW_LOAD_ERROR =
  "Chưa thể tải lịch sử routine 7 ngày gần đây. Bạn vẫn có thể ghi nhận routine hôm nay.";

const timeOfDayLabels: Record<RoutineTimeOfDay, string> = {
  morning: "Buổi sáng",
  evening: "Buổi tối",
};

const categoryLabels: Record<RoutineStepCategory, string> = {
  cleanser: "Làm sạch",
  moisturizer: "Dưỡng ẩm",
  sunscreen: "Chống nắng",
  treatment: "Treatment",
  toner: "Toner",
  serum: "Serum",
  mask: "Mặt nạ",
  other: "Khác",
};

const frequencyLabels: Record<RoutineStepFrequency, string> = {
  daily: "Mỗi ngày",
  weekly_1_2: "1-2 lần/tuần",
  weekly_3_4: "3-4 lần/tuần",
  as_needed: "Khi cần",
};

type ApiError = {
  code: string;
  details?: unknown;
  message: string;
};

type ApiResponse<TData> =
  | {
      data: TData;
      error: null;
    }
  | {
      data: null;
      error: ApiError;
    };

type SummaryCounts = {
  total: number;
  completed: number;
  partial: number;
  skipped: number;
  notLogged: number;
};

type JournalTodayStatus = {
  hasJournalToday?: boolean;
  isKnown: boolean;
};

async function readApiResponse<TData>(
  response: Response,
): Promise<ApiResponse<TData>> {
  try {
    return (await response.json()) as ApiResponse<TData>;
  } catch {
    return {
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "Invalid response body.",
      },
    };
  }
}

function getRoutineLogDeleteEndpoint(routineLogId: string) {
  return `${ROUTINE_LOGS_API_PATH}/${encodeURIComponent(routineLogId)}`;
}

function getLoadErrorMessage(error?: ApiError | null) {
  if (error?.code === "UNAUTHORIZED") {
    return "Bạn cần đăng nhập để xem checklist routine hôm nay.";
  }

  if (error?.code === "VALIDATION_ERROR") {
    return "Ngày ghi nhận routine chưa hợp lệ. Vui lòng tải lại trang.";
  }

  return "Không thể tải checklist routine hôm nay. Vui lòng thử lại hoặc làm mới trang.";
}

function getRoutineStepDisplayName(step: RoutineDto["steps"][number]) {
  if (step.productNameSnapshot && step.brandSnapshot) {
    return `${step.brandSnapshot} — ${step.productNameSnapshot}`;
  }

  if (step.productNameSnapshot) {
    return step.productNameSnapshot;
  }

  if (step.customProductName) {
    return step.customProductName;
  }

  return "Sản phẩm chưa xác định";
}

function getSummaryCounts(
  routines: RoutineDto[],
  logsByRoutineId: Record<string, RoutineLogDto>,
): SummaryCounts {
  let completed = 0;
  let partial = 0;
  let skipped = 0;

  for (const routine of routines) {
    const status = logsByRoutineId[routine.id]?.status;

    if (status === "completed") {
      completed += 1;
    } else if (status === "partial") {
      partial += 1;
    } else if (status === "skipped") {
      skipped += 1;
    }
  }

  return {
    total: routines.length,
    completed,
    partial,
    skipped,
    notLogged: routines.length - completed - partial - skipped,
  };
}

export function TodayRoutineChecklist() {
  const [localDate] = useState(() => getBrowserLocalDate());
  const [timezone] = useState(() => getBrowserTimezone());
  const weeklyReviewFromDate = useMemo(
    () => addLocalDateDays(localDate, -6),
    [localDate],
  );
  const [routines, setRoutines] = useState<RoutineDto[]>([]);
  const [logsByRoutineId, setLogsByRoutineId] = useState<
    Record<string, RoutineLogDto>
  >({});
  const [weeklyRoutineLogs, setWeeklyRoutineLogs] = useState<RoutineLogDto[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isWeeklyReviewLoading, setIsWeeklyReviewLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [weeklyReviewError, setWeeklyReviewError] = useState<string | null>(
    null,
  );
  const [deletingLogIds, setDeletingLogIds] = useState<Record<string, boolean>>(
    {},
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState<
    string | null
  >(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [journalTodayStatus, setJournalTodayStatus] =
    useState<JournalTodayStatus>({
      isKnown: false,
    });

  useEffect(() => {
    let isMounted = true;

    async function loadTodayData() {
      setIsLoading(true);
      setLoadError(null);
      setWeeklyReviewError(null);

      try {
        const [routinesResponse, todayRoutineLogs] = await Promise.all([
          fetch(ROUTINES_API_PATH, {
            headers: {
              Accept: "application/json",
            },
            method: "GET",
          }),
          listRoutineLogsForDate(localDate),
        ]);
        const routinesBody =
          await readApiResponse<{ routines: RoutineDto[] }>(routinesResponse);

        if (!isMounted) {
          return;
        }

        if (!routinesResponse.ok || routinesBody.error) {
          setRoutines([]);
          setLogsByRoutineId({});
          setLoadError(getLoadErrorMessage(routinesBody.error));
          return;
        }

        setRoutines(routinesBody.data.routines);
        setLogsByRoutineId(groupRoutineLogsByRoutineId(todayRoutineLogs));
        setIsWeeklyReviewLoading(true);

        try {
          const recentRoutineLogs = await listRoutineLogsForDateRange(
            weeklyReviewFromDate,
            localDate,
          );

          if (isMounted) {
            setWeeklyRoutineLogs(recentRoutineLogs);
          }
        } catch {
          if (isMounted) {
            setWeeklyRoutineLogs([]);
            setWeeklyReviewError(WEEKLY_REVIEW_LOAD_ERROR);
          }
        }
      } catch (error) {
        if (isMounted) {
          setRoutines([]);
          setLogsByRoutineId({});
          setWeeklyRoutineLogs([]);
          if (error instanceof RoutineLogClientError) {
            setLoadError(
              getLoadErrorMessage({
                code: error.code,
                message: error.message,
              }),
            );
            return;
          }

          setLoadError(
            "Không thể tải checklist routine hôm nay. Vui lòng thử lại hoặc làm mới trang.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsWeeklyReviewLoading(false);
        }
      }
    }

    void loadTodayData();

    return () => {
      isMounted = false;
    };
  }, [localDate, weeklyReviewFromDate, reloadKey]);

  const summaryCounts = useMemo(
    () => getSummaryCounts(routines, logsByRoutineId),
    [logsByRoutineId, routines],
  );
  const hasRoutineLogToday =
    summaryCounts.completed + summaryCounts.partial + summaryCounts.skipped > 0;
  const morningRoutines = useMemo(
    () => routines.filter((routine) => routine.timeOfDay === "morning"),
    [routines],
  );
  const eveningRoutines = useMemo(
    () => routines.filter((routine) => routine.timeOfDay === "evening"),
    [routines],
  );
  const hasLoggedAllRoutines = routines.length > 0 && summaryCounts.notLogged === 0;
  const todayJournalPromptState = getTodayJournalPromptState({
    hasRoutineLogToday,
    hasJournalToday: journalTodayStatus.hasJournalToday,
    isJournalStatusKnown: journalTodayStatus.isKnown,
  });
  const weeklyReview = useMemo(
    () =>
      buildRoutineWeeklyReview({
        referenceLocalDate: localDate,
        routineLogs: weeklyRoutineLogs,
      }),
    [localDate, weeklyRoutineLogs],
  );

  useEffect(() => {
    if (!hasRoutineLogToday) {
      return;
    }

    let isMounted = true;

    async function loadJournalTodayStatus() {
      try {
        const journals = await listSkinJournals({
          from: localDate,
          to: localDate,
          limit: 1,
        });

        if (isMounted) {
          setJournalTodayStatus({
            hasJournalToday: journals.length > 0,
            isKnown: true,
          });
        }
      } catch {
        if (isMounted) {
          setJournalTodayStatus({ isKnown: false });
        }
      }
    }

    void loadJournalTodayStatus();

    return () => {
      isMounted = false;
    };
  }, [hasRoutineLogToday, localDate]);

  function handleLogSaved(updatedLog: RoutineLogDto) {
    setLogsByRoutineId((current) => ({
      ...current,
      [updatedLog.routineId]: updatedLog,
    }));
    setWeeklyRoutineLogs((current) => {
      const nextLogs = current.filter(
        (routineLog) =>
          !(
            routineLog.routineId === updatedLog.routineId &&
            routineLog.localDate === updatedLog.localDate
          ),
      );

      if (
        updatedLog.localDate < weeklyReviewFromDate ||
        updatedLog.localDate > localDate
      ) {
        return nextLogs;
      }

      return [...nextLogs, updatedLog];
    });
    setWeeklyReviewError(null);
    setDeleteError(null);
    setDeleteSuccessMessage(null);
  }

  async function deleteRoutineLog(routineId: string, routineLogId: string) {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa ghi nhận routine này cho hôm nay?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingLogIds((current) => ({ ...current, [routineLogId]: true }));
    setDeleteError(null);
    setDeleteSuccessMessage(null);

    try {
      const response = await fetch(getRoutineLogDeleteEndpoint(routineLogId), {
        headers: {
          Accept: "application/json",
        },
        method: "DELETE",
      });
      const body = await readApiResponse<{ deleted: true }>(response);

      if (!response.ok || body.error) {
        setDeleteError("Không thể xóa ghi nhận lúc này. Vui lòng thử lại.");
        return;
      }

      setLogsByRoutineId((current) => {
        const nextLogsByRoutineId = { ...current };
        delete nextLogsByRoutineId[routineId];

        return nextLogsByRoutineId;
      });
      setDeleteSuccessMessage("Đã xóa ghi nhận routine.");
      setWeeklyRoutineLogs((current) =>
        current.filter((routineLog) => routineLog.id !== routineLogId),
      );
      setWeeklyReviewError(null);
    } catch {
      setDeleteError("Không thể xóa ghi nhận lúc này. Vui lòng thử lại.");
    } finally {
      setDeletingLogIds((current) => ({ ...current, [routineLogId]: false }));
    }
  }

  function renderRoutineSection(title: string, sectionRoutines: RoutineDto[]) {
    return (
      <Card className="border-border bg-card" key={title}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sectionRoutines.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Chưa có routine trong nhóm này.
            </p>
          ) : (
            sectionRoutines.map((routine) => {
              const log = logsByRoutineId[routine.id];

              return (
                <article
                  className="border border-border bg-secondary/50 p-4"
                  data-testid="today-routine-card"
                  key={routine.id}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {routine.name}
                        </h3>
                        <Badge variant="secondary">
                          {timeOfDayLabels[routine.timeOfDay]}
                        </Badge>
                        <RoutineLogStatusBadge
                          hasLog={Boolean(log)}
                          status={log?.status}
                          testId="today-routine-status-badge"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {routine.steps.length} bước trong routine này.
                      </p>
                    </div>
                  </div>

                  <ol className="mt-4 space-y-3">
                    {routine.steps.map((step, index) => (
                      <li
                        className="border border-border bg-card p-3"
                        key={step.stepId}
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-medium text-foreground">
                              {index + 1}. {getRoutineStepDisplayName(step)}
                            </p>
                            {step.instructions ? (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {step.instructions}
                              </p>
                            ) : null}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">
                              {categoryLabels[step.category]}
                            </Badge>
                            <Badge variant="outline">
                              {frequencyLabels[step.frequency]}
                            </Badge>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <RoutineLogControls
                    localDate={localDate}
                    log={log}
                    onSaved={handleLogSaved}
                    routine={routine}
                    timezone={timezone}
                  />

                  {log ? (
                    <div className="mt-3 flex justify-end">
                      <Button
                        data-testid="routine-log-delete-button"
                        disabled={Boolean(deletingLogIds[log.id])}
                        onClick={() => deleteRoutineLog(routine.id, log.id)}
                        size="sm"
                        type="button"
                        variant="destructive"
                      >
                        {deletingLogIds[log.id]
                          ? "Đang xóa..."
                          : "Xóa ghi nhận"}
                      </Button>
                    </div>
                  ) : null}
                </article>
              );
            })
          )}
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <LoadingState label="Đang tải checklist routine hôm nay..." />;
  }

  if (loadError) {
    return (
      <ErrorState
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => setReloadKey((current) => current + 1)}
              type="button"
            >
              <RotateCcw aria-hidden="true" />
              Thử lại
            </Button>
            <Button asChild variant="outline">
              <Link href={routes.ROUTINES}>Xem routine</Link>
            </Button>
          </div>
        }
        description={loadError}
        title="Không thể tải checklist routine hôm nay"
      />
    );
  }

  if (routines.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          action={
            <Button asChild>
              <Link href={routes.ROUTINES}>Tạo routine</Link>
            </Button>
          }
          description="Hãy tạo routine buổi sáng hoặc buổi tối trước khi theo dõi tiến độ hằng ngày."
          title="Chưa có routine nào"
        />
        <RoutineWeeklyReviewCard
          errorMessage={weeklyReviewError}
          isLoading={isWeeklyReviewLoading}
          review={weeklyReview}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="today-routine-checklist">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Thông tin hôm nay</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-secondary/50 p-3">
            <p className="font-medium text-foreground">Ngày hôm nay</p>
            <p className="mt-1 text-muted-foreground">{localDate}</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/50 p-3">
            <p className="font-medium text-foreground">Múi giờ</p>
            <p className="mt-1 text-muted-foreground">{timezone}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card" data-testid="today-progress-summary">
        <CardHeader>
          <CardTitle>Tiến độ ghi nhận hôm nay</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-5">
          <SummaryItem label="Tổng routine" value={summaryCounts.total} />
          <SummaryItem label="Hoàn thành" value={summaryCounts.completed} />
          <SummaryItem label="Một phần" value={summaryCounts.partial} />
          <SummaryItem label="Bỏ qua" value={summaryCounts.skipped} />
          <SummaryItem label="Chưa ghi nhận" value={summaryCounts.notLogged} />
        </CardContent>
      </Card>

      <RoutineWeeklyReviewCard
        errorMessage={weeklyReviewError}
        isLoading={isWeeklyReviewLoading}
        review={weeklyReview}
      />

      <TodayJournalPromptCard
        journalHref={routes.JOURNAL}
        state={todayJournalPromptState}
      />

      {hasLoggedAllRoutines ? (
        <EmptyState
          action={
            <Button asChild variant="outline">
              <Link href={routes.DASHBOARD}>Xem dashboard</Link>
            </Button>
          }
          description="Bạn có thể quay lại dashboard để xem tiến độ hôm nay."
          title="Đã ghi nhận tất cả routine hôm nay"
        />
      ) : null}

      {deleteSuccessMessage ? (
        <Alert>
          <AlertDescription>{deleteSuccessMessage}</AlertDescription>
        </Alert>
      ) : null}

      {deleteError ? (
        <Alert variant="destructive">
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      ) : null}

      {renderRoutineSection("Routine buổi sáng", morningRoutines)}
      {renderRoutineSection("Routine buổi tối", eveningRoutines)}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-secondary/50 p-3">
      <p className="font-medium text-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
