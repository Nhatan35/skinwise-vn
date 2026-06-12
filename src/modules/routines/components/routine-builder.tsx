"use client";

import { Check, Pencil, Plus, RotateCcw, Save, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { ZodIssue } from "zod";

import type { RoutineAnalysisDto } from "@/modules/ai-analysis/routine-analysis.dto";
import type { ProductDto } from "@/modules/products/product.dto";
import type {
  ProductConcern,
  ProductSkinType,
} from "@/modules/products/product.types";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import {
  getBrowserLocalDate,
  getBrowserTimezone,
  groupRoutineLogsByRoutineId,
} from "@/modules/routine-logs/routine-log.client";
import { RoutineAnalysisPanel } from "@/modules/routines/components/routine-analysis-panel";
import { RoutineLogControls } from "@/modules/routines/components/routine-log-controls";
import { RoutineLogStatusBadge } from "@/modules/routines/components/routine-log-status-badge";
import type { RoutineDto } from "@/modules/routines/routine.dto";
import {
  applyRoutineProductSelection,
  buildRoutineProductOptions,
  findRoutineProductOption,
  type RoutineProductOption,
  type RoutineProductOptions,
} from "@/modules/routines/routine-product-options";
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
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import { listSavedProducts } from "@/modules/saved-products/saved-product.client";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { routes } from "@/shared/constants/routes";
import { cn } from "@/shared/utils";

const ROUTINES_API_PATH = "/api/routines";
const PRODUCTS_API_PATH = "/api/products?limit=50";
const ROUTINE_LOGS_API_PATH = "/api/routine-logs";
const MANUAL_PRODUCT_VALUE = "__manual_product__";
const ANALYZE_ROUTE_SEGMENT = "analyze";
const ANALYSIS_HISTORY_ROUTE_SEGMENT = "analyses";
const ROUTINE_STEP_LIMIT = 15;

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
  productId?: string;
  customProductName: string;
  category: RoutineStepCategory | "";
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

const concernLabels: Record<ProductConcern, string> = {
  acne: "mụn",
  barrier_support: "hỗ trợ hàng rào da",
  dark_spots: "đốm nâu",
  dryness: "khô da",
  oiliness: "dầu thừa",
  redness: "đỏ da",
  texture: "bề mặt da",
  unknown: "chưa rõ",
};

const skinTypeLabels: Record<ProductSkinType, string> = {
  combination: "da hỗn hợp",
  dry: "da khô",
  normal: "da thường",
  oily: "da dầu",
  sensitive: "da nhạy cảm",
  unknown: "chưa rõ",
};

const timeOfDayDescriptions: Record<RoutineTimeOfDay, string> = {
  morning:
    "Routine buổi sáng thường ưu tiên làm sạch nhẹ, dưỡng ẩm, hỗ trợ hàng rào da và kem chống nắng khi phù hợp.",
  evening:
    "Routine buổi tối thường phù hợp hơn cho phục hồi hoặc hoạt chất, nhưng nên tránh dùng quá nhiều hoạt chất mạnh cùng lúc.",
};

function createBlankStep(): RoutineFormStepState {
  return {
    productId: undefined,
    customProductName: "",
    category: "cleanser",
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
            productId: step.productId,
            customProductName: step.customProductName ?? "",
            category: step.category,
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
    steps: formState.steps.map((step, index) => {
      const baseStep = {
        category: step.category,
        order: index + 1,
        frequency: step.frequency,
        ...(step.instructions.trim()
          ? { instructions: step.instructions.trim() }
          : {}),
      };

      if (step.productId) {
        return {
          ...baseStep,
          productId: step.productId,
        };
      }

      return {
        ...baseStep,
        customProductName: step.customProductName.trim(),
      };
    }),
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

function getAnalysisApiErrorMessage(error?: ApiError | null) {
  if (error?.code === "UNAUTHORIZED") {
    return "Bạn cần đăng nhập để tiếp tục.";
  }

  if (error?.code === "VALIDATION_ERROR") {
    return "Yêu cầu phân tích chưa hợp lệ. Vui lòng thử lại.";
  }

  if (error?.code === "NOT_FOUND") {
    return "Không tìm thấy routine này. Vui lòng tải lại trang và thử lại.";
  }

  return "Hiện chưa thể phân tích routine. Vui lòng thử lại sau.";
}

function getRoutineLogLoadErrorMessage(error?: ApiError | null) {
  if (error?.code === "UNAUTHORIZED") {
    return "Bạn cần đăng nhập để tải nhật ký routine hôm nay.";
  }

  if (error?.code === "VALIDATION_ERROR") {
    return "Ngày ghi nhận routine chưa hợp lệ. Vui lòng tải lại trang.";
  }

  return "Không thể tải nhật ký routine hôm nay.";
}

function getRoutineLogsEndpoint(localDate: string) {
  return `${ROUTINE_LOGS_API_PATH}?localDate=${encodeURIComponent(localDate)}`;
}

function getAnalyzeEndpoint(routineId: string) {
  return `${ROUTINES_API_PATH}/${routineId}/${ANALYZE_ROUTE_SEGMENT}`;
}

function getAnalysisHistoryEndpoint(routineId: string) {
  return `${ROUTINES_API_PATH}/${routineId}/${ANALYSIS_HISTORY_ROUTE_SEGMENT}`;
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

  if (key.endsWith(".productId")) {
    return "Sản phẩm đã chọn chưa hợp lệ. Vui lòng chọn lại hoặc nhập thủ công.";
  }

  if (key.endsWith(".customProductName")) {
    return "Vui lòng chọn sản phẩm có sẵn hoặc nhập tên sản phẩm thủ công.";
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

function getProductOptionLabel(option: RoutineProductOption) {
  const brandAndName = option.brand
    ? `${option.brand} — ${option.name}`
    : option.name;
  const categoryLabel = option.category ? ` — ${categoryLabels[option.category]}` : "";
  const savedPrefix = option.source === "saved" ? "[Đã lưu] " : "";

  return `${savedPrefix}${brandAndName}${categoryLabel}`;
}

function getProductOptionSourceLabel(option: RoutineProductOption) {
  return option.source === "saved" ? "Sản phẩm đã lưu" : "Catalogue";
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

export function RoutineBuilder() {
  const [routines, setRoutines] = useState<RoutineDto[]>([]);
  const [formState, setFormState] =
    useState<RoutineFormState>(createBlankFormState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formMode, setFormMode] = useState<FormMode>("none");
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [productLoadError, setProductLoadError] = useState<string | null>(null);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [savedProducts, setSavedProducts] = useState<SavedProductDto[]>([]);
  const [savedProductLoadError, setSavedProductLoadError] = useState<
    string | null
  >(null);
  const [isSavedProductLoading, setIsSavedProductLoading] = useState(false);
  const [routineLogLocalDate] = useState(() => getBrowserLocalDate());
  const [routineLogTimezone] = useState(() => getBrowserTimezone());
  const [routineLogsByRoutineId, setRoutineLogsByRoutineId] = useState<
    Record<string, RoutineLogDto>
  >({});
  const [isRoutineLogLoading, setIsRoutineLogLoading] = useState(false);
  const [routineLogLoadError, setRoutineLogLoadError] = useState<string | null>(
    null,
  );
  const [deletingRoutineId, setDeletingRoutineId] = useState<string | null>(
    null,
  );
  const [latestAnalysisByRoutineId, setLatestAnalysisByRoutineId] = useState<
    Record<string, RoutineAnalysisDto | null>
  >({});
  const [analysisHistoryByRoutineId, setAnalysisHistoryByRoutineId] = useState<
    Record<string, RoutineAnalysisDto[]>
  >({});
  const [
    analysisHistoryLoadedByRoutineId,
    setAnalysisHistoryLoadedByRoutineId,
  ] = useState<Record<string, boolean>>({});
  const [analysisErrorByRoutineId, setAnalysisErrorByRoutineId] = useState<
    Record<string, string | null>
  >({});
  const [analyzingRoutineIds, setAnalyzingRoutineIds] = useState<
    Record<string, boolean>
  >({});
  const [loadingHistoryRoutineIds, setLoadingHistoryRoutineIds] = useState<
    Record<string, boolean>
  >({});
  const [reloadKey, setReloadKey] = useState(0);
  const productOptions = useMemo(
    () =>
      buildRoutineProductOptions({
        catalogueProducts: products,
        savedProducts,
      }),
    [products, savedProducts],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setIsProductLoading(true);
      setProductLoadError(null);

      try {
        const response = await fetch(PRODUCTS_API_PATH, {
          headers: {
            Accept: "application/json",
          },
          method: "GET",
        });
        const body = await readApiResponse<{ items: ProductDto[] }>(response);

        if (!isMounted) {
          return;
        }

        if (!response.ok || body.error) {
          setProducts([]);
          setProductLoadError(
            "Chưa tải được danh sách sản phẩm. Bạn vẫn có thể nhập thủ công.",
          );
          return;
        }

        setProducts(body.data.items);
      } catch {
        if (isMounted) {
          setProducts([]);
          setProductLoadError(
            "Chưa tải được danh sách sản phẩm. Bạn vẫn có thể nhập thủ công.",
          );
        }
      } finally {
        if (isMounted) {
          setIsProductLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSavedProductOptions() {
      setIsSavedProductLoading(true);
      setSavedProductLoadError(null);

      try {
        const loadedSavedProducts = await listSavedProducts();

        if (!isMounted) {
          return;
        }

        setSavedProducts(loadedSavedProducts);
      } catch {
        if (isMounted) {
          setSavedProducts([]);
          setSavedProductLoadError("Chưa tải được sản phẩm đã lưu.");
        }
      } finally {
        if (isMounted) {
          setIsSavedProductLoading(false);
        }
      }
    }

    void loadSavedProductOptions();

    return () => {
      isMounted = false;
    };
  }, []);

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
        const body = await readApiResponse<{ routines: RoutineDto[] }>(
          response,
        );

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
          setLoadError(
            "Không thể tải routine của bạn. Vui lòng thử lại hoặc làm mới trang.",
          );
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

  useEffect(() => {
    let isMounted = true;

    async function loadRoutineLogs() {
      setIsRoutineLogLoading(true);
      setRoutineLogLoadError(null);

      try {
        const response = await fetch(
          getRoutineLogsEndpoint(routineLogLocalDate),
          {
            headers: {
              Accept: "application/json",
            },
            method: "GET",
          },
        );
        const body = await readApiResponse<{ routineLogs: RoutineLogDto[] }>(
          response,
        );

        if (!isMounted) {
          return;
        }

        if (!response.ok || body.error) {
          setRoutineLogsByRoutineId({});
          setRoutineLogLoadError(getRoutineLogLoadErrorMessage(body.error));
          return;
        }

        setRoutineLogsByRoutineId(
          groupRoutineLogsByRoutineId(body.data.routineLogs),
        );
      } catch {
        if (isMounted) {
          setRoutineLogsByRoutineId({});
          setRoutineLogLoadError("Không thể tải nhật ký routine hôm nay.");
        }
      } finally {
        if (isMounted) {
          setIsRoutineLogLoading(false);
        }
      }
    }

    void loadRoutineLogs();

    return () => {
      isMounted = false;
    };
  }, [routineLogLocalDate, reloadKey]);

  function handleRoutineLogSaved(routineLog: RoutineLogDto) {
    setRoutineLogsByRoutineId((current) => ({
      ...current,
      [routineLog.routineId]: routineLog,
    }));
    setRoutineLogLoadError(null);
  }

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

  function updateRoutineField<
    Field extends keyof Omit<RoutineFormState, "steps">,
  >(field: Field, value: RoutineFormState[Field]) {
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

  function clearStepProductErrors(index: number) {
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[`steps.${index}.productId`];
      delete next[`steps.${index}.customProductName`];
      delete next[`steps.${index}.category`];
      return next;
    });
  }

  function updateStepProductSelection(index: number, value: string) {
    setFormState((current) => ({
      ...current,
      steps: current.steps.map((step, stepIndex) => {
        if (stepIndex !== index) {
          return step;
        }

        if (value === MANUAL_PRODUCT_VALUE) {
          return {
            ...step,
            productId: undefined,
          };
        }

        const selectedProduct = findRoutineProductOption(
          productOptions.combinedProductOptions,
          value,
        );

        if (!selectedProduct) {
          return {
            ...step,
            productId: undefined,
          };
        }

        const previousProduct = findRoutineProductOption(
          productOptions.combinedProductOptions,
          step.productId,
        );

        return applyRoutineProductSelection({
          previousOption: previousProduct,
          selectedOption: selectedProduct,
          step,
        });
      }),
    }));
    clearStepProductErrors(index);
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
      if (formMode === "edit" && editingRoutineId) {
        setLatestAnalysisByRoutineId((current) => ({
          ...current,
          [editingRoutineId]: null,
        }));
      }
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
      setLatestAnalysisByRoutineId((current) => {
        const next = { ...current };
        delete next[routine.id];
        return next;
      });
      setAnalysisHistoryByRoutineId((current) => {
        const next = { ...current };
        delete next[routine.id];
        return next;
      });
      setAnalysisHistoryLoadedByRoutineId((current) => {
        const next = { ...current };
        delete next[routine.id];
        return next;
      });
      setAnalysisErrorByRoutineId((current) => {
        const next = { ...current };
        delete next[routine.id];
        return next;
      });
      setRoutineLogsByRoutineId((current) => {
        const next = { ...current };
        delete next[routine.id];
        return next;
      });
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

  async function analyzeRoutine(routine: RoutineDto) {
    if (analyzingRoutineIds[routine.id]) {
      return;
    }

    setApiError(null);
    setSuccessMessage(null);
    setAnalysisErrorByRoutineId((current) => ({
      ...current,
      [routine.id]: null,
    }));
    setAnalyzingRoutineIds((current) => ({
      ...current,
      [routine.id]: true,
    }));

    try {
      const response = await fetch(getAnalyzeEndpoint(routine.id), {
        headers: {
          Accept: "application/json",
        },
        method: "POST",
      });
      const body = await readApiResponse<RoutineAnalysisDto>(response);

      if (!response.ok || body.error) {
        setAnalysisErrorByRoutineId((current) => ({
          ...current,
          [routine.id]: getAnalysisApiErrorMessage(body.error),
        }));
        return;
      }

      setLatestAnalysisByRoutineId((current) => ({
        ...current,
        [routine.id]: body.data,
      }));
      setAnalysisHistoryByRoutineId((current) => ({
        ...current,
        [routine.id]: [
          body.data,
          ...(current[routine.id] ?? []).filter(
            (analysis) => analysis.analysisId !== body.data.analysisId,
          ),
        ],
      }));
      setAnalysisHistoryLoadedByRoutineId((current) => ({
        ...current,
        [routine.id]: true,
      }));
      setSuccessMessage("Đã phân tích routine.");
    } catch {
      setAnalysisErrorByRoutineId((current) => ({
        ...current,
        [routine.id]: "Hiện chưa thể phân tích routine. Vui lòng thử lại sau.",
      }));
    } finally {
      setAnalyzingRoutineIds((current) => ({
        ...current,
        [routine.id]: false,
      }));
    }
  }

  async function loadAnalysisHistory(routine: RoutineDto) {
    if (loadingHistoryRoutineIds[routine.id]) {
      return;
    }

    setAnalysisErrorByRoutineId((current) => ({
      ...current,
      [routine.id]: null,
    }));
    setLoadingHistoryRoutineIds((current) => ({
      ...current,
      [routine.id]: true,
    }));

    try {
      const response = await fetch(getAnalysisHistoryEndpoint(routine.id), {
        headers: {
          Accept: "application/json",
        },
        method: "GET",
      });
      const body = await readApiResponse<{ analyses: RoutineAnalysisDto[] }>(
        response,
      );

      if (!response.ok || body.error) {
        setAnalysisErrorByRoutineId((current) => ({
          ...current,
          [routine.id]: getAnalysisApiErrorMessage(body.error),
        }));
        return;
      }

      setAnalysisHistoryByRoutineId((current) => ({
        ...current,
        [routine.id]: body.data.analyses,
      }));
      setAnalysisHistoryLoadedByRoutineId((current) => ({
        ...current,
        [routine.id]: true,
      }));
      setLatestAnalysisByRoutineId((current) => ({
        ...current,
        [routine.id]: current[routine.id] ?? body.data.analyses[0] ?? null,
      }));
    } catch {
      setAnalysisErrorByRoutineId((current) => ({
        ...current,
        [routine.id]:
          "Hiện chưa thể tải lịch sử phân tích. Vui lòng thử lại sau.",
      }));
    } finally {
      setLoadingHistoryRoutineIds((current) => ({
        ...current,
        [routine.id]: false,
      }));
    }
  }

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardContent>
          <LoadingState label="Đang chuẩn bị routine builder..." />
        </CardContent>
      </Card>
    );
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
              <Link href={routes.SAVED_PRODUCTS}>Xem sản phẩm đã lưu</Link>
            </Button>
          </div>
        }
        description={loadError}
        title="Không thể tải routine của bạn"
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
          isProductLoading={isProductLoading}
          isSavedProductLoading={isSavedProductLoading}
          isSaving={isSaving}
          onAddStep={addStep}
          onCancel={cancelForm}
          onRemoveStep={removeStep}
          onRoutineFieldChange={updateRoutineField}
          onStepFieldChange={updateStepField}
          onStepProductSelectionChange={updateStepProductSelection}
          onSubmit={handleSubmit}
          productLoadError={productLoadError}
          productOptions={productOptions}
          savedProductLoadError={savedProductLoadError}
        />
      ) : null}

      {routines.length === 0 && formMode === "none" ? (
        <EmptyState
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                data-testid="routine-create-button"
                onClick={startCreate}
                type="button"
              >
                <Plus aria-hidden="true" />
                Tạo routine
              </Button>
              <Button asChild variant="outline">
                <Link href={routes.SAVED_PRODUCTS}>Xem sản phẩm đã lưu</Link>
              </Button>
            </div>
          }
          actionClassName="flex justify-center"
          description="Bạn chưa có routine nào. Hãy bắt đầu từ sản phẩm đã lưu hoặc thêm thủ công một routine đơn giản, sau đó thêm từng sản phẩm một để theo dõi cảm nhận của da."
          title="Chưa có routine nào"
        />
      ) : (
        <RoutineList
          analysisErrorByRoutineId={analysisErrorByRoutineId}
          analysisHistoryByRoutineId={analysisHistoryByRoutineId}
          analysisHistoryLoadedByRoutineId={analysisHistoryLoadedByRoutineId}
          analyzingRoutineIds={analyzingRoutineIds}
          deletingRoutineId={deletingRoutineId}
          isRoutineLogLoading={isRoutineLogLoading}
          latestAnalysisByRoutineId={latestAnalysisByRoutineId}
          loadingHistoryRoutineIds={loadingHistoryRoutineIds}
          onAnalyze={analyzeRoutine}
          onCreate={startCreate}
          onDelete={deleteRoutine}
          onEdit={startEdit}
          onLoadAnalysisHistory={loadAnalysisHistory}
          onRoutineLogSaved={handleRoutineLogSaved}
          routineLogLoadError={routineLogLoadError}
          routineLogLocalDate={routineLogLocalDate}
          routineLogTimezone={routineLogTimezone}
          routineLogsByRoutineId={routineLogsByRoutineId}
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
  isProductLoading: boolean;
  isSavedProductLoading: boolean;
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
  onStepProductSelectionChange: (index: number, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  productLoadError: string | null;
  productOptions: RoutineProductOptions;
  savedProductLoadError: string | null;
};

function RoutineForm({
  fieldErrors,
  formMode,
  formState,
  isProductLoading,
  isSavedProductLoading,
  isSaving,
  onAddStep,
  onCancel,
  onRemoveStep,
  onRoutineFieldChange,
  onStepFieldChange,
  onStepProductSelectionChange,
  onSubmit,
  productLoadError,
  productOptions,
  savedProductLoadError,
}: RoutineFormProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>
          {formMode === "create" ? "Tạo routine" : "Chỉnh sửa routine"}
        </CardTitle>
        <CardDescription>
          Ưu tiên xem lại sản phẩm đã lưu và đọc thông tin tham khảo trước khi
          thêm vào routine. Không nên thêm quá nhiều sản phẩm mới cùng lúc.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" data-testid="routine-form" onSubmit={onSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="routine-name">Tên routine</Label>
              <Input
                aria-describedby={
                  fieldErrors.name ? "routine-name-error" : undefined
                }
                aria-invalid={fieldErrors.name ? true : undefined}
                data-testid="routine-name-input"
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

          {formState.timeOfDay ? (
            <div
              className="rounded-md border border-border bg-secondary/40 p-3 text-sm leading-6 text-muted-foreground"
              data-testid="routine-time-of-day-guidance"
            >
              {timeOfDayDescriptions[formState.timeOfDay]}
            </div>
          ) : null}

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Các bước trong routine
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Thứ tự các bước sẽ được lưu từ trên xuống dưới. Bạn có thể
                  chọn sản phẩm đã lưu, sản phẩm trong catalogue hoặc nhập thủ
                  công. Cần có ít nhất một bước và tối đa {ROUTINE_STEP_LIMIT}{" "}
                  bước.
                </p>
              </div>
              <Button
                data-testid="routine-add-step-button"
                disabled={formState.steps.length >= ROUTINE_STEP_LIMIT}
                onClick={onAddStep}
                type="button"
                variant="outline"
              >
                <Plus aria-hidden="true" />
                Thêm bước
              </Button>
            </div>

            {productLoadError ? (
              <Alert>
                <AlertTitle>Chưa tải được Product Picker</AlertTitle>
                <AlertDescription>{productLoadError}</AlertDescription>
              </Alert>
            ) : null}

            {savedProductLoadError ? (
              <Alert>
                <AlertTitle>Chưa tải được sản phẩm đã lưu</AlertTitle>
                <AlertDescription>
                  {savedProductLoadError} Catalogue và nhập thủ công vẫn có thể
                  dùng như bình thường.
                </AlertDescription>
              </Alert>
            ) : null}

            {isSavedProductLoading ? (
              <p className="text-xs text-muted-foreground">
                Đang tải sản phẩm đã lưu...
              </p>
            ) : null}

            <Alert data-testid="routine-saved-products-guidance">
              <AlertTitle>Thông tin tham khảo trước khi thêm vào routine</AlertTitle>
              <AlertDescription>
                Sản phẩm đã lưu giúp bạn xem lại lựa chọn dễ hơn, nhưng không
                cần đưa tất cả vào routine. Hãy chọn sản phẩm đã đọc kỹ chi tiết
                và bắt đầu chậm để theo dõi cảm nhận của da.
              </AlertDescription>
            </Alert>

            {!isSavedProductLoading &&
            !savedProductLoadError &&
            productOptions.savedProductOptions.length === 0 ? (
              <Alert>
                <AlertTitle>Bạn chưa lưu sản phẩm nào</AlertTitle>
                <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Bạn chưa lưu sản phẩm nào. Hãy xem gợi ý sản phẩm để lưu sản
                    phẩm phù hợp trước khi xây routine.
                  </span>
                  <Button asChild size="sm" variant="outline">
                    <Link href={routes.PRODUCT_MATCH}>Xem gợi ý sản phẩm</Link>
                  </Button>
                </AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-4">
              {formState.steps.map((step, index) => (
                <div
                  className="border border-border bg-secondary/50 p-4"
                  data-testid="routine-step-form"
                  key={`routine-step-${index}`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Bước {index + 1}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Bước {index + 1} trong thứ tự sử dụng. Xóa bước này
                        chỉ xóa khỏi routine, không xóa sản phẩm khỏi catalogue
                        hoặc danh sách đã lưu.
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

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`step-product-${index}`}>Sản phẩm</Label>
                      <Select
                        onValueChange={(value) =>
                          onStepProductSelectionChange(index, value)
                        }
                        value={step.productId ?? MANUAL_PRODUCT_VALUE}
                      >
                        <SelectTrigger
                          aria-describedby={
                            fieldErrors[`steps.${index}.productId`]
                              ? `step-product-${index}-error`
                              : undefined
                          }
                          aria-invalid={
                            fieldErrors[`steps.${index}.productId`]
                              ? true
                              : undefined
                          }
                          className={cn(
                            "w-full",
                            fieldErrors[`steps.${index}.productId`]
                              ? "border-red-400"
                              : "",
                          )}
                          data-testid="routine-step-product-select"
                          id={`step-product-${index}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {productOptions.savedProductOptions.length > 0 ? (
                            <SelectGroup>
                              <SelectLabel>Sản phẩm đã lưu</SelectLabel>
                              {productOptions.savedProductOptions.map(
                                (option) => (
                                  <SelectItem
                                    data-testid="routine-saved-product-option"
                                    key={option.id}
                                    value={option.id}
                                  >
                                    {getProductOptionLabel(option)}
                                  </SelectItem>
                                ),
                              )}
                            </SelectGroup>
                          ) : null}
                          {productOptions.savedProductOptions.length > 0 &&
                          productOptions.catalogueProductOptions.length > 0 ? (
                            <SelectSeparator />
                          ) : null}
                          {productOptions.catalogueProductOptions.length > 0 ? (
                            <SelectGroup>
                              <SelectLabel>Tất cả sản phẩm</SelectLabel>
                              {productOptions.catalogueProductOptions.map(
                                (option) => (
                                  <SelectItem
                                    data-testid="routine-catalogue-product-option"
                                    key={option.id}
                                    value={option.id}
                                  >
                                    {getProductOptionLabel(option)}
                                  </SelectItem>
                                ),
                              )}
                            </SelectGroup>
                          ) : null}
                          {productOptions.savedProductOptions.length > 0 ||
                          productOptions.catalogueProductOptions.length > 0 ? (
                            <SelectSeparator />
                          ) : null}
                          <SelectGroup>
                            <SelectLabel>Nhập thủ công</SelectLabel>
                            <SelectItem value={MANUAL_PRODUCT_VALUE}>
                              Tự nhập tên sản phẩm
                            </SelectItem>
                          </SelectGroup>
                          {step.productId &&
                          !findRoutineProductOption(
                            productOptions.combinedProductOptions,
                            step.productId,
                          ) ? (
                            <>
                              <SelectSeparator />
                              <SelectGroup>
                                <SelectLabel>Sản phẩm đã chọn</SelectLabel>
                                <SelectItem value={step.productId}>
                                  Sản phẩm đã chọn trước đó
                                </SelectItem>
                              </SelectGroup>
                            </>
                          ) : null}
                        </SelectContent>
                      </Select>
                      <SelectedProductContext
                        option={findRoutineProductOption(
                          productOptions.combinedProductOptions,
                          step.productId,
                        )}
                      />
                      {isProductLoading ? (
                        <p className="text-xs text-muted-foreground">
                          Đang tải danh sách sản phẩm...
                        </p>
                      ) : null}
                      {fieldErrors[`steps.${index}.productId`] ? (
                        <p
                          className="text-sm text-red-700"
                          id={`step-product-${index}-error`}
                        >
                          {fieldErrors[`steps.${index}.productId`]}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`step-name-${index}`}>
                        Tên sản phẩm thủ công
                      </Label>
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
                        data-testid="routine-step-product-input"
                        disabled={Boolean(step.productId)}
                        id={`step-name-${index}`}
                        onChange={(event) =>
                          onStepFieldChange(
                            index,
                            "customProductName",
                            event.target.value,
                          )
                        }
                        placeholder={
                          step.productId
                            ? "Đang dùng sản phẩm đã chọn"
                            : "Ví dụ: Sữa rửa mặt dịu nhẹ"
                        }
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
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
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
                      data-testid="routine-step-instructions-input"
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

          <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-muted-foreground">
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
              <Button data-testid="routine-save-button" disabled={isSaving} type="submit">
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

function SelectedProductContext({
  option,
}: {
  option?: RoutineProductOption;
}) {
  if (!option) {
    return null;
  }

  return (
    <div
      className="space-y-2 rounded-md border border-border bg-card p-3 text-xs text-muted-foreground"
      data-testid="routine-selected-product-context"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-foreground">Sản phẩm đã chọn</span>
        <Badge variant={option.source === "saved" ? "secondary" : "outline"}>
          Nguồn: {getProductOptionSourceLabel(option)}
        </Badge>
        {option.warnings.length > 0 ? (
          <Badge variant="outline">Có lưu ý cần đọc</Badge>
        ) : null}
      </div>
      <dl className="grid gap-2 sm:grid-cols-2">
        {option.brand ? (
          <div>
            <dt className="font-medium text-foreground">Thương hiệu</dt>
            <dd>{option.brand}</dd>
          </div>
        ) : null}
        {option.category ? (
          <div>
            <dt className="font-medium text-foreground">Danh mục</dt>
            <dd>{categoryLabels[option.category]}</dd>
          </div>
        ) : null}
        {option.keyActives.length > 0 ? (
          <div>
            <dt className="font-medium text-foreground">Hoạt chất chính</dt>
            <dd>{option.keyActives.slice(0, 3).join(", ")}</dd>
          </div>
        ) : null}
        {option.concerns.length > 0 ? (
          <div>
            <dt className="font-medium text-foreground">Nhu cầu liên quan</dt>
            <dd>
              {option.concerns
                .slice(0, 3)
                .map((concern) => concernLabels[concern])
                .join(", ")}
            </dd>
          </div>
        ) : null}
        {option.skinTypes.length > 0 ? (
          <div>
            <dt className="font-medium text-foreground">Loại da gợi ý</dt>
            <dd>
              {option.skinTypes
                .slice(0, 3)
                .map((skinType) => skinTypeLabels[skinType])
                .join(", ")}
            </dd>
          </div>
        ) : null}
        {option.warnings.length > 0 ? (
          <div className="sm:col-span-2">
            <dt className="font-medium text-foreground">Lưu ý sản phẩm</dt>
            <dd>{option.warnings.slice(0, 2).join("; ")}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}

type RoutineListProps = {
  analysisErrorByRoutineId: Record<string, string | null>;
  analysisHistoryByRoutineId: Record<string, RoutineAnalysisDto[]>;
  analysisHistoryLoadedByRoutineId: Record<string, boolean>;
  analyzingRoutineIds: Record<string, boolean>;
  deletingRoutineId: string | null;
  isRoutineLogLoading: boolean;
  latestAnalysisByRoutineId: Record<string, RoutineAnalysisDto | null>;
  loadingHistoryRoutineIds: Record<string, boolean>;
  onAnalyze: (routine: RoutineDto) => void;
  onCreate: () => void;
  onDelete: (routine: RoutineDto) => void;
  onEdit: (routine: RoutineDto) => void;
  onLoadAnalysisHistory: (routine: RoutineDto) => void;
  onRoutineLogSaved: (routineLog: RoutineLogDto) => void;
  routineLogLoadError: string | null;
  routineLogLocalDate: string;
  routineLogTimezone: string;
  routineLogsByRoutineId: Record<string, RoutineLogDto>;
  routines: RoutineDto[];
};

function RoutineList({
  analysisErrorByRoutineId,
  analysisHistoryByRoutineId,
  analysisHistoryLoadedByRoutineId,
  analyzingRoutineIds,
  deletingRoutineId,
  isRoutineLogLoading,
  latestAnalysisByRoutineId,
  loadingHistoryRoutineIds,
  onAnalyze,
  onCreate,
  onDelete,
  onEdit,
  onLoadAnalysisHistory,
  onRoutineLogSaved,
  routineLogLoadError,
  routineLogLocalDate,
  routineLogTimezone,
  routineLogsByRoutineId,
  routines,
}: RoutineListProps) {
  if (routines.length === 0) {
    return null;
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Danh sách routines</CardTitle>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Sau khi tạo hoặc xem lại routine, bước tiếp theo là ghi nhận
              routine hôm nay rồi viết nhật ký nếu có cảm nhận đáng chú ý.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline">
              <Link data-testid="routine-today-log-link" href={routes.TODAY_LOG}>
                Ghi nhận routine hôm nay
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={routes.JOURNAL}>Xem nhật ký</Link>
            </Button>
            <Button data-testid="routine-create-button" onClick={onCreate} type="button">
              <Plus aria-hidden="true" />
              Tạo routine
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert data-testid="routine-log-journal-guidance">
          <AlertTitle>Bước tiếp theo sau routine</AlertTitle>
          <AlertDescription>
            Ghi nhận routine để theo dõi độ đều đặn, rồi dùng nhật ký chăm sóc
            da để ghi lại cảm nhận, thói quen và thay đổi bạn tự quan sát.
            Không cần kết luận quá sớm sau một vài lần dùng. Nếu có cảm giác
            bất thường kéo dài, hãy dừng bước liên quan và tìm tư vấn chuyên môn.
          </AlertDescription>
        </Alert>

        {isRoutineLogLoading ? (
          <p className="text-sm text-muted-foreground">
            Đang tải nhật ký routine hôm nay...
          </p>
        ) : null}

        {routineLogLoadError ? (
          <Alert variant="destructive">
            <AlertTitle>Chưa tải được nhật ký hôm nay</AlertTitle>
            <AlertDescription>{routineLogLoadError}</AlertDescription>
          </Alert>
        ) : null}

        {routines.map((routine) => (
          <div
            className="border border-border bg-secondary/50 p-4"
            data-testid="routine-card"
            key={routine.id}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {routine.name}
                  </h3>
                  <Badge variant="secondary">
                    {timeOfDayLabels[routine.timeOfDay]}
                  </Badge>
                  <RoutineLogStatusBadge
                    hasLog={Boolean(routineLogsByRoutineId[routine.id])}
                    status={routineLogsByRoutineId[routine.id]?.status}
                    testId="routine-log-status-badge"
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Cập nhật: {formatUpdatedAt(routine.updatedAt)}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {timeOfDayDescriptions[routine.timeOfDay]}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  data-testid="routine-edit-button"
                  onClick={() => onEdit(routine)}
                  type="button"
                  variant="outline"
                >
                  <Pencil aria-hidden="true" />
                  Sửa
                </Button>
                <Button
                  data-testid="routine-delete-button"
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
                  className="border border-border bg-card p-3"
                  key={step.stepId}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        Bước {index + 1}: {getRoutineStepDisplayName(step)}
                      </p>
                      {step.keyActivesSnapshot?.length ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <Badge variant="outline">Hoạt chất chính</Badge>
                          {step.keyActivesSnapshot.map((active) => (
                            <Badge key={active} variant="secondary">
                              {active}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
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
              disabled={isRoutineLogLoading}
              localDate={routineLogLocalDate}
              log={routineLogsByRoutineId[routine.id]}
              onSaved={onRoutineLogSaved}
              routine={routine}
              timezone={routineLogTimezone}
            />

            <RoutineAnalysisPanel
              error={analysisErrorByRoutineId[routine.id] ?? null}
              history={analysisHistoryByRoutineId[routine.id] ?? []}
              isAnalyzing={analyzingRoutineIds[routine.id] ?? false}
              isHistoryLoaded={
                analysisHistoryLoadedByRoutineId[routine.id] ?? false
              }
              isHistoryLoading={loadingHistoryRoutineIds[routine.id] ?? false}
              latestAnalysis={latestAnalysisByRoutineId[routine.id] ?? null}
              onAnalyze={() => onAnalyze(routine)}
              onLoadHistory={() => onLoadAnalysisHistory(routine)}
            />
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
          data-testid={`${id}-select`}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          className={cn("w-full", error ? "border-red-400" : "")}
          id={id}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              data-testid={`${id}-option-${option.value}`}
              key={option.value}
              value={option.value}
            >
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
