"use client";

import { Check, ListChecks, XCircle } from "lucide-react";
import { useState } from "react";

import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import {
  buildCompletedRoutineLogPayload,
  buildPartialRoutineLogPayload,
  buildSkippedRoutineLogPayload,
  getCompletedStepCount,
  RoutineLogClientValidationError,
  type RoutineLogUpsertPayload,
} from "@/modules/routine-logs/routine-log.client";
import type { RoutineDto } from "@/modules/routines/routine.dto";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";

const ROUTINE_LOGS_API_PATH = "/api/routine-logs";

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

type RoutineLogControlsProps = {
  disabled?: boolean;
  localDate: string;
  log?: RoutineLogDto;
  onSaved: (routineLog: RoutineLogDto) => void;
  routine: RoutineDto;
  timezone: string;
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

function getRoutineLogApiErrorMessage(error?: ApiError | null) {
  if (error?.code === "UNAUTHORIZED") {
    return "Bạn cần đăng nhập để lưu trạng thái routine.";
  }

  if (error?.code === "NOT_FOUND") {
    return "Routine này không còn tồn tại hoặc bạn không có quyền truy cập.";
  }

  if (error?.code === "VALIDATION_ERROR") {
    return "Trạng thái routine chưa hợp lệ. Vui lòng kiểm tra lại.";
  }

  return "Không thể lưu trạng thái routine. Vui lòng thử lại.";
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

function getInitialPartialStepIds(log?: RoutineLogDto) {
  return log?.status === "partial" ? (log.completedStepIds ?? []) : [];
}

export function RoutineLogControls({
  disabled = false,
  localDate,
  log,
  onSaved,
  routine,
  timezone,
}: RoutineLogControlsProps) {
  const activeLogId = log?.id ?? "new-routine-log";
  const initialSelectedStepIds = getInitialPartialStepIds(log);
  const [isPartialOpen, setIsPartialOpen] = useState(false);
  const [partialDraft, setPartialDraft] = useState(() => ({
    logId: activeLogId,
    stepIds: initialSelectedStepIds,
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const selectedStepIds =
    partialDraft.logId === activeLogId
      ? partialDraft.stepIds
      : initialSelectedStepIds;
  const completedStepCount = getCompletedStepCount(routine, log);
  const canPartiallyComplete = routine.steps.length >= 2;
  const controlsDisabled = disabled || isSaving;

  async function saveRoutineLog(payload: RoutineLogUpsertPayload) {
    setIsSaving(true);
    setSaveError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(ROUTINE_LOGS_API_PATH, {
        body: JSON.stringify(payload),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PUT",
      });
      const body = await readApiResponse<{ routineLog: RoutineLogDto }>(
        response,
      );

      if (!response.ok || body.error) {
        setSaveError(getRoutineLogApiErrorMessage(body.error));
        return;
      }

      onSaved(body.data.routineLog);
      setPartialDraft({
        logId: body.data.routineLog.id,
        stepIds: getInitialPartialStepIds(body.data.routineLog),
      });
      setIsPartialOpen(false);
      setSuccessMessage("Đã lưu trạng thái routine.");
    } catch {
      setSaveError("Không thể lưu trạng thái routine. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  }

  function toggleSelectedStepId(stepId: string) {
    setPartialDraft({
      logId: activeLogId,
      stepIds: selectedStepIds.includes(stepId)
        ? selectedStepIds.filter((currentStepId) => currentStepId !== stepId)
        : [...selectedStepIds, stepId],
    });
    setSaveError(null);
    setSuccessMessage(null);
  }

  function saveCompletedLog() {
    void saveRoutineLog(
      buildCompletedRoutineLogPayload(routine, localDate, timezone),
    );
  }

  function saveSkippedLog() {
    void saveRoutineLog(
      buildSkippedRoutineLogPayload(routine, localDate, timezone),
    );
  }

  function savePartialLog() {
    try {
      const payload = buildPartialRoutineLogPayload(
        routine,
        selectedStepIds,
        localDate,
        timezone,
      );

      void saveRoutineLog(payload);
    } catch (error) {
      setSaveError(
        error instanceof RoutineLogClientValidationError
          ? error.message
          : "Không thể lưu trạng thái routine. Vui lòng thử lại.",
      );
      setSuccessMessage(null);
    }
  }

  return (
    <div className="mt-4 space-y-3 border-t border-border pt-4" data-testid="routine-log-controls">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Nhật ký hôm nay</p>
          <p className="text-xs text-muted-foreground">
            Ngày {localDate} · Múi giờ {timezone}
          </p>
          {log?.status === "partial" ? (
            <p className="text-xs text-muted-foreground">
              Đã hoàn thành {completedStepCount}/{routine.steps.length} bước
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            data-testid="routine-log-completed-button"
            disabled={controlsDisabled}
            onClick={saveCompletedLog}
            size="sm"
            type="button"
          >
            <Check aria-hidden="true" />
            {isSaving ? "Đang lưu..." : "Hoàn thành"}
          </Button>
          <Button
            data-testid="routine-log-partial-button"
            disabled={controlsDisabled || !canPartiallyComplete}
            onClick={() => {
              setIsPartialOpen((current) => !current);
              setSaveError(null);
              setSuccessMessage(null);
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            <ListChecks aria-hidden="true" />
            Một phần
          </Button>
          <Button
            data-testid="routine-log-skipped-button"
            disabled={controlsDisabled}
            onClick={saveSkippedLog}
            size="sm"
            type="button"
            variant="outline"
          >
            <XCircle aria-hidden="true" />
            Bỏ qua
          </Button>
        </div>
      </div>

      {!canPartiallyComplete ? (
        <p className="text-xs text-muted-foreground">
          Routine cần ít nhất 2 bước để ghi nhận một phần.
        </p>
      ) : null}

      {isPartialOpen ? (
        <div className="space-y-3 rounded-lg border border-border bg-card p-3">
          <div>
            <p className="text-sm font-medium text-foreground">
              Chọn các bước đã hoàn thành
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Nếu đã hoàn thành tất cả các bước, hãy chọn Hoàn thành.
            </p>
          </div>

          <div className="space-y-2">
            {routine.steps.map((step, index) => (
              <Label
                className="flex cursor-pointer items-start gap-2 rounded-md border border-border bg-secondary/50 p-2 text-sm font-normal text-muted-foreground"
                htmlFor={`routine-log-${routine.id}-${step.stepId}`}
                key={step.stepId}
              >
                <input
                  checked={selectedStepIds.includes(step.stepId)}
                  className="mt-1"
                  disabled={controlsDisabled}
                  id={`routine-log-${routine.id}-${step.stepId}`}
                  onChange={() => toggleSelectedStepId(step.stepId)}
                  type="checkbox"
                />
                <span>
                  {index + 1}. {getRoutineStepDisplayName(step)}
                </span>
              </Label>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              data-testid="routine-log-save-partial-button"
              disabled={controlsDisabled}
              onClick={savePartialLog}
              size="sm"
              type="button"
            >
              <SaveIcon />
              {isSaving ? "Đang lưu..." : "Lưu một phần"}
            </Button>
            <Badge variant="outline">
              Đã chọn {selectedStepIds.length}/{routine.steps.length} bước
            </Badge>
          </div>
        </div>
      ) : null}

      {saveError ? (
        <Alert variant="destructive">
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      ) : null}

      {successMessage ? (
        <Alert>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}

function SaveIcon() {
  return <Check aria-hidden="true" />;
}
