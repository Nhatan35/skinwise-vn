"use client";

import {
  Check,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type { ZodIssue } from "zod";

import type { RoutineDto } from "@/modules/routines/routine.dto";
import {
  createRoutineSchema,
  updateRoutineSchema,
} from "@/modules/routines/routine.schema";
import {
  ROUTINE_STEP_CATEGORIES,
  ROUTINE_STEP_FREQUENCIES,
  ROUTINE_TIME_OF_DAY,
  type RoutineStepCategory,
  type RoutineStepFrequency,
  type RoutineTimeOfDay,
} from "@/modules/routines/routine.types";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/utils";

const ROUTINES_API_PATH = "/api/routines";

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

type RoutineFormStepState = {
  category: RoutineStepCategory | "";
  customProductName: string;
  frequency: RoutineStepFrequency | "";
  instructions: string;
};

type RoutineFormState = {
  name: string;
  steps: RoutineFormStepState[];
  timeOfDay: RoutineTimeOfDay | "";
};

type FormMode = "create" | "edit" | "none";
type FieldErrors = Partial<Record<string, string>>;

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

function createBlankStep(): RoutineFormStepState {
  return {
    category: "cleanser",
    customProductName: "",
    frequency: "daily",
    instructions: "",
  };
}

function createBlankFormState(): RoutineFormState {
  return {
    name: "",
    steps: [createBlankStep()],
    timeOfDay: "morning",
  };
}

function routineToFormState(routine: RoutineDto): RoutineFormState {
  return {
    name: routine.name,
    steps:
      routine.steps.length > 0
        ? routine.steps.map((step) => ({
            category: step.category,
            customProductName: step.customProductName ?? "",
            frequency: step.frequency,
            instructions: step.instructions ?? "",
          }))
        : [createBlankStep()],
    timeOfDay: routine.timeOfDay,
  };
}

function buildRoutinePayload(formState: RoutineFormState) {
  const routinePayload = {
    name: formState.name,
    timeOfDay: formState.timeOfDay,
    steps: formState.steps.map((step, index) => ({
      customProductName: step.customProductName,
      category: step.category,
      order: index + 1,
      frequency: step.frequency,
      ...(step.instructions.trim()
        ? { instructions: step.instructions.trim() }
        : {}),
    })),
  };

  return routinePayload;
}

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

function getApiErrorMessage(error?: ApiError | null) {
  if (error?.code === "UNAUTHORIZED") {
    return "Bạn cần đăng nhập để tiếp tục.";
  }

  if (error?.code === "VALIDATION_ERROR") {
    return "Một vài thông tin chưa hợp lệ. Vui lòng kiểm tra lại các trường được đánh dấu.";
  }

  if (error?.code === "NOT_FOUND") {
    return "Không tìm thấy routine này. Vui lòng tải lại trang và thử lại.";
  }

  return "Hiện chưa thể xử lý routine. Vui lòng thử lại sau.";
}

function getIssueKey(issue: ZodIssue) {
  const [root, index, field] = issue.path;

  if (root === "steps" && typeof index === "number") {
    if (typeof field === "string") {
      return `steps.${index}.${field}`;
    }

    return `steps.${index}.customProductName`;
  }

  return typeof root === "string" ? root : "form";
}

function getIssueMessage(issue: ZodIssue) {
  const key = getIssueKey(issue);

  if (key === "name") {
    return "Vui lòng nhập tên routine, tối đa 100 ký tự.";
  }

  if (key === "timeOfDay") {
    return "Vui lòng chọn buổi sử dụng routine.";
  }

  if (key.endsWith(".customProductName")) {
    return "Vui lòng nhập tên sản phẩm tùy chỉnh.";
  }

  if (key.endsWith(".category")) {
    return "Vui lòng chọn nhóm bước.";
  }

  if (key.endsWith(".frequency")) {
    return "Vui lòng chọn tần suất.";
  }

  if (key.endsWith(".instructions")) {
    return "Hướng dẫn tối đa 1000 ký tự.";
  }

  return "Một vài thông tin chưa hợp lệ.";
}

function mapValidationIssues(issues: ZodIssue[]): FieldErrors {
  return issues.reduce<FieldErrors>(
    (errors, issue) => ({
      ...errors,
      [getIssueKey(issue)]: getIssueMessage(issue),
    }),
    {},
  );
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function RoutineBuilder() {
  const [routines, setRoutines] = useState<RoutineDto[]>([]);
  const [formState, setFormState] = useState<RoutineFormState>(
    createBlankFormState,
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formMode, setFormMode] = useState<FormMode>("none");
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingRoutineId, setDeletingRoutineId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadRoutines() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await fetch(ROUTINES_API_PATH, {
          headers: {
            Accept: "application/json",
          },
          method: "GET",
        });
        const body = await readApiResponse<{ routines: RoutineDto[] }>(response);

        if (!isMounted) {
          return;
        }

        if (!response.ok || body.error) {
          setLoadError(getApiErrorMessage(body.error));
          return;
        }

        setRoutines(body.data.routines);
      } catch {
        if (isMounted) {
          setLoadError("Hiện chưa thể tải routines. Vui lòng thử lại sau.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadRoutines();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  function startCreate() {
    setFormState(createBlankFormState());
    setFieldErrors({});
    setApiError(null);
    setSuccessMessage(null);
    setEditingRoutineId(null);
    setFormMode("create");
  }

  function startEdit(routine: RoutineDto) {
    setFormState(routineToFormState(routine));
    setFieldErrors({});
    setApiError(null);
    setSuccessMessage(null);
    setEditingRoutineId(routine.id);
    setFormMode("edit");
  }

  function cancelForm() {
    setFormState(createBlankFormState());
    setFieldErrors({});
    setApiError(null);
    setEditingRoutineId(null);
    setFormMode("none");
  }

  function clearFieldError(field: string) {
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function updateRoutineField<Field extends keyof Omit<RoutineFormState, "steps">>(
    field: Field,
    value: RoutineFormState[Field],
  ) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
    clearFieldError(field);
  }

  function updateStepField<Field extends keyof RoutineFormStepState>(
    index: number,
    field: Field,
    value: RoutineFormStepState[Field],
  ) {
    setFormState((current) => ({
      ...current,
      steps: current.steps.map((step, stepIndex) =>
        stepIndex === index
          ? {
              ...step,
              [field]: value,
            }
          : step,
      ),
    }));
    clearFieldError(`steps.${index}.${field}`);
  }

  function addStep() {
    setFormState((current) => ({
      ...current,
      steps:
        current.steps.length >= 15
          ? current.steps
          : [...current.steps, createBlankStep()],
    }));
  }

  function removeStep(index: number) {
    setFormState((current) => ({
      ...current,
      steps:
        current.steps.length <= 1
          ? current.steps
          : current.steps.filter((_, stepIndex) => stepIndex !== index),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    setApiError(null);
    setSuccessMessage(null);
    setFieldErrors({});

    const routinePayload = buildRoutinePayload(formState);
    const validation =
      formMode === "create"
        ? createRoutineSchema.safeParse(routinePayload)
        : updateRoutineSchema.safeParse(routinePayload);

    if (!validation.success) {
      setFieldErrors(mapValidationIssues(validation.error.issues));
      return;
    }

    const endpoint =
      formMode === "create"
        ? ROUTINES_API_PATH
        : `${ROUTINES_API_PATH}/${editingRoutineId}`;
    const method = formMode === "create" ? "POST" : "PATCH";

    setIsSaving(true);

    try {
      const response = await fetch(endpoint, {
        body: JSON.stringify(validation.data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method,
      });
      const body = await readApiResponse<{ routine: RoutineDto }>(response);

      if (!response.ok || body.error) {
        setApiError(getApiErrorMessage(body.error));
        return;
      }

      setRoutines((current) =>
        formMode === "create"
          ? [body.data.routine, ...current]
          : current.map((routine) =>
              routine.id === body.data.routine.id ? body.data.routine : routine,
            ),
      );
      setSuccessMessage(
        formMode === "create" ? "Đã tạo routine." : "Đã lưu routine.",
      );
      setFormMode("none");
      setEditingRoutineId(null);
      setFormState(createBlankFormState());
    } catch {
      setApiError("Hiện chưa thể lưu routine. Vui lòng thử lại sau.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteRoutine(routine: RoutineDto) {
    if (deletingRoutineId !== null) {
      return;
    }

    const confirmed = window.confirm(`Xóa routine "${routine.name}"?`);

    if (!confirmed) {
      return;
    }

    setApiError(null);
    setSuccessMessage(null);
    setDeletingRoutineId(routine.id);

    try {
      const response = await fetch(`${ROUTINES_API_PATH}/${routine.id}`, {
        headers: {
          Accept: "application/json",
        },
        method: "DELETE",
      });
      const body = await readApiResponse<{ deleted: true }>(response);

      if (!response.ok || body.error) {
        setApiError(getApiErrorMessage(body.error));
        return;
      }

      setRoutines((current) =>
        current.filter((item) => item.id !== routine.id),
      );
      if (editingRoutineId === routine.id) {
        cancelForm();
      }
      setSuccessMessage("Đã xóa routine.");
    } catch {
      setApiError("Hiện chưa thể xóa routine. Vui lòng thử lại sau.");
    } finally {
      setDeletingRoutineId(null);
    }
  }

  if (isLoading) {
    return (
      <Card className="border-stone-200 bg-white">
        <CardContent>
          <LoadingState label="Đang tải routines" />
        </CardContent>
      </Card>
    );
  }

  if (loadError) {
    return (
      <ErrorState
        action={
          <Button
            onClick={() => setReloadKey((current) => current + 1)}
            type="button"
          >
            <RotateCcw aria-hidden="true" />
            Thử lại
          </Button>
        }
        description={loadError}
        title="Chưa tải được routines"
      />
    );
  }

  return (
    <div className="space-y-6">
      {apiError ? (
        <Alert variant="destructive">
          <AlertTitle>Chưa xử lý được routine</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      ) : null}

      {successMessage ? (
        <Alert>
          <Check aria-hidden="true" />
          <AlertTitle>Thành công</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : null}

      {formMode !== "none" ? (
        <RoutineForm
          fieldErrors={fieldErrors}
          formMode={formMode}
          formState={formState}
          isSaving={isSaving}
          onAddStep={addStep}
          onCancel={cancelForm}
          onRemoveStep={removeStep}
          onRoutineFieldChange={updateRoutineField}
          onStepFieldChange={updateStepField}
          onSubmit={handleSubmit}
        />
      ) : null}

      {routines.length === 0 && formMode === "none" ? (
        <EmptyState
          action={
            <Button onClick={startCreate} type="button">
              <Plus aria-hidden="true" />
              Tạo routine
            </Button>
          }
          description="Bạn chưa có routine nào. Hãy bắt đầu bằng một routine đơn giản với các sản phẩm bạn đang dùng."
          title="Chưa có routine nào"
        />
      ) : (
        <RoutineList
          deletingRoutineId={deletingRoutineId}
          onCreate={startCreate}
          onDelete={deleteRoutine}
          onEdit={startEdit}
          routines={routines}
        />
      )}
    </div>
  );
}

type RoutineFormProps = {
  fieldErrors: FieldErrors;
  formMode: Exclude<FormMode, "none">;
  formState: RoutineFormState;
  isSaving: boolean;
  onAddStep: () => void;
  onCancel: () => void;
  onRemoveStep: (index: number) => void;
  onRoutineFieldChange: <Field extends keyof Omit<RoutineFormState, "steps">>(
    field: Field,
    value: RoutineFormState[Field],
  ) => void;
  onStepFieldChange: <Field extends keyof RoutineFormStepState>(
    index: number,
    field: Field,
    value: RoutineFormStepState[Field],
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function RoutineForm({
  fieldErrors,
  formMode,
  formState,
  isSaving,
  onAddStep,
  onCancel,
  onRemoveStep,
  onRoutineFieldChange,
  onStepFieldChange,
  onSubmit,
}: RoutineFormProps) {
  return (
    <Card className="border-stone-200 bg-white">
      <CardHeader>
        <CardTitle>
          {formMode === "create" ? "Tạo routine" : "Chỉnh sửa routine"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="routine-name">Tên routine</Label>
              <Input
                aria-describedby={fieldErrors.name ? "routine-name-error" : undefined}
                aria-invalid={fieldErrors.name ? true : undefined}
                id="routine-name"
                onChange={(event) =>
                  onRoutineFieldChange("name", event.target.value)
                }
                placeholder="Ví dụ: Routine tối đơn giản"
                value={formState.name}
              />
              {fieldErrors.name ? (
                <p className="text-sm text-red-700" id="routine-name-error">
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>

            <SelectField
              error={fieldErrors.timeOfDay}
              id="routine-time-of-day"
              label="Buổi sử dụng"
              onValueChange={(value) =>
                onRoutineFieldChange("timeOfDay", value as RoutineTimeOfDay)
              }
              options={ROUTINE_TIME_OF_DAY.map((value) => ({
                label: timeOfDayLabels[value],
                value,
              }))}
              value={formState.timeOfDay}
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-stone-950">
                  Các bước trong routine
                </h3>
                <p className="mt-1 text-sm text-stone-600">
                  Thứ tự được tính từ trên xuống dưới. Cần có ít nhất một bước.
                </p>
              </div>
              <Button
                disabled={formState.steps.length >= 15}
                onClick={onAddStep}
                type="button"
                variant="outline"
              >
                <Plus aria-hidden="true" />
                Thêm bước
              </Button>
            </div>

            <div className="space-y-4">
              {formState.steps.map((step, index) => (
                <div
                  className="border border-stone-200 bg-stone-50 p-4"
                  key={`routine-step-${index}`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-stone-950">
                        Bước {index + 1}
                      </p>
                      <p className="text-xs text-stone-600">
                        Nhập tên sản phẩm tùy chỉnh.
                      </p>
                    </div>
                    <Button
                      disabled={formState.steps.length <= 1}
                      onClick={() => onRemoveStep(index)}
                      type="button"
                      variant="ghost"
                    >
                      <X aria-hidden="true" />
                      Bỏ bước
                    </Button>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor={`step-name-${index}`}>Tên sản phẩm</Label>
                      <Input
                        aria-describedby={
                          fieldErrors[`steps.${index}.customProductName`]
                            ? `step-name-${index}-error`
                            : undefined
                        }
                        aria-invalid={
                          fieldErrors[`steps.${index}.customProductName`]
                            ? true
                            : undefined
                        }
                        id={`step-name-${index}`}
                        onChange={(event) =>
                          onStepFieldChange(
                            index,
                            "customProductName",
                            event.target.value,
                          )
                        }
                        placeholder="Ví dụ: Sữa rửa mặt dịu nhẹ"
                        value={step.customProductName}
                      />
                      {fieldErrors[`steps.${index}.customProductName`] ? (
                        <p
                          className="text-sm text-red-700"
                          id={`step-name-${index}-error`}
                        >
                          {fieldErrors[`steps.${index}.customProductName`]}
                        </p>
                      ) : null}
                    </div>

                    <SelectField
                      error={fieldErrors[`steps.${index}.category`]}
                      id={`step-category-${index}`}
                      label="Nhóm bước"
                      onValueChange={(value) =>
                        onStepFieldChange(
                          index,
                          "category",
                          value as RoutineStepCategory,
                        )
                      }
                      options={ROUTINE_STEP_CATEGORIES.map((value) => ({
                        label: categoryLabels[value],
                        value,
                      }))}
                      value={step.category}
                    />

                    <SelectField
                      error={fieldErrors[`steps.${index}.frequency`]}
                      id={`step-frequency-${index}`}
                      label="Tần suất"
                      onValueChange={(value) =>
                        onStepFieldChange(
                          index,
                          "frequency",
                          value as RoutineStepFrequency,
                        )
                      }
                      options={ROUTINE_STEP_FREQUENCIES.map((value) => ({
                        label: frequencyLabels[value],
                        value,
                      }))}
                      value={step.frequency}
                    />
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label htmlFor={`step-instructions-${index}`}>
                      Hướng dẫn tùy chọn
                    </Label>
                    <Textarea
                      aria-describedby={
                        fieldErrors[`steps.${index}.instructions`]
                          ? `step-instructions-${index}-error`
                          : undefined
                      }
                      aria-invalid={
                        fieldErrors[`steps.${index}.instructions`]
                          ? true
                          : undefined
                      }
                      id={`step-instructions-${index}`}
                      onChange={(event) =>
                        onStepFieldChange(
                          index,
                          "instructions",
                          event.target.value,
                        )
                      }
                      placeholder="Ví dụ: Massage nhẹ trong 30 giây"
                      rows={3}
                      value={step.instructions}
                    />
                    {fieldErrors[`steps.${index}.instructions`] ? (
                      <p
                        className="text-sm text-red-700"
                        id={`step-instructions-${index}-error`}
                      >
                        {fieldErrors[`steps.${index}.instructions`]}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-stone-600">
              Thông tin này chỉ mang tính giáo dục và không thay thế tư vấn từ
              chuyên gia y tế.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                disabled={isSaving}
                onClick={onCancel}
                type="button"
                variant="outline"
              >
                <X aria-hidden="true" />
                Hủy
              </Button>
              <Button disabled={isSaving} type="submit">
                <Save aria-hidden="true" />
                {isSaving ? "Đang lưu..." : "Lưu routine"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

type RoutineListProps = {
  deletingRoutineId: string | null;
  onCreate: () => void;
  onDelete: (routine: RoutineDto) => void;
  onEdit: (routine: RoutineDto) => void;
  routines: RoutineDto[];
};

function RoutineList({
  deletingRoutineId,
  onCreate,
  onDelete,
  onEdit,
  routines,
}: RoutineListProps) {
  if (routines.length === 0) {
    return null;
  }

  return (
    <Card className="border-stone-200 bg-white">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Danh sách routines</CardTitle>
          <Button onClick={onCreate} type="button">
            <Plus aria-hidden="true" />
            Tạo routine
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {routines.map((routine) => (
          <div
            className="border border-stone-200 bg-stone-50 p-4"
            key={routine.id}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-stone-950">
                    {routine.name}
                  </h3>
                  <Badge variant="secondary">
                    {timeOfDayLabels[routine.timeOfDay]}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-stone-600">
                  Cập nhật: {formatUpdatedAt(routine.updatedAt)}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button onClick={() => onEdit(routine)} type="button" variant="outline">
                  <Pencil aria-hidden="true" />
                  Sửa
                </Button>
                <Button
                  disabled={deletingRoutineId !== null}
                  onClick={() => onDelete(routine)}
                  type="button"
                  variant="destructive"
                >
                  <Trash2 aria-hidden="true" />
                  {deletingRoutineId === routine.id ? "Đang xóa..." : "Xóa"}
                </Button>
              </div>
            </div>

            <ol className="mt-4 space-y-3">
              {routine.steps.map((step, index) => (
                <li
                  className="border border-stone-200 bg-white p-3"
                  key={step.stepId}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-stone-950">
                        {index + 1}. {step.customProductName ?? "Sản phẩm tùy chỉnh"}
                      </p>
                      {step.instructions ? (
                        <p className="mt-1 text-sm text-stone-600">
                          {step.instructions}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{categoryLabels[step.category]}</Badge>
                      <Badge variant="outline">{frequencyLabels[step.frequency]}</Badge>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

type SelectFieldProps = {
  error?: string;
  id: string;
  label: string;
  onValueChange: (value: string) => void;
  options: Array<{
    label: string;
    value: string;
  }>;
  value: string;
};

function SelectField({
  error,
  id,
  label,
  onValueChange,
  options,
  value,
}: SelectFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          className={cn("w-full", error ? "border-red-400" : "")}
          id={id}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? (
        <p className="text-sm text-red-700" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
