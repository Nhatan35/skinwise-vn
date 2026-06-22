"use client";

import { Pencil, Plus, RefreshCcw, Search, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import {
  AdminIngredientClientError,
  createAdminIngredient,
  listAdminIngredients,
  updateAdminIngredient,
} from "@/modules/ingredients/admin-ingredient.client";
import {
  AdminIngredientForm,
  type AdminIngredientFormPayload,
} from "@/modules/ingredients/components/admin-ingredient-form";
import type { IngredientDto } from "@/modules/ingredients/ingredient.dto";
import type {
  AdminCreateIngredientBodyInput,
  AdminIngredientListQueryInput,
  AdminUpdateIngredientBodyInput,
} from "@/modules/ingredients/ingredient.schema";
import type { IngredientEvidenceLevel } from "@/modules/ingredients/ingredient.types";
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
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const ALL_FILTER_VALUE = "all";

type IngredientManagementFilterState = {
  function: string;
  q: string;
};

type FeedbackState = {
  message: string;
  title: string;
  type: "error" | "success";
};

type IngredientEditorState =
  | {
      ingredient?: never;
      mode: "create";
    }
  | {
      ingredient: IngredientDto;
      mode: "edit";
    };

const initialFilters: IngredientManagementFilterState = {
  function: "",
  q: "",
};

const ingredientFunctionLabels: Record<string, string> = {
  absorbent: "Hấp thụ dầu/ẩm",
  active: "Hoạt chất",
  antioxidant: "Chống oxy hóa",
  barrier_support: "Hỗ trợ hàng rào da",
  blemish_support: "Hỗ trợ da dễ nổi mụn",
  botanical_extract: "Chiết xuất thực vật",
  emollient: "Làm mềm da",
  exfoliant: "Tẩy tế bào chết",
  fragrance_component: "Thành phần hương liệu",
  humectant: "Hút ẩm",
  hydration_support: "Hỗ trợ cấp ẩm",
  occlusive: "Khóa ẩm",
  oil_balance: "Hỗ trợ dầu thừa",
  redness_support: "Hỗ trợ da dễ đỏ",
  retinoid: "Nhóm retinoid",
  sensory_agent: "Hỗ trợ cảm quan",
  skin_conditioning: "Hỗ trợ điều hòa da",
  skin_protective: "Bảo vệ da",
  solvent: "Dung môi",
  soothing: "Làm dịu",
  soothing_support: "Làm dịu",
  texture_support: "Hỗ trợ bề mặt da",
  tone_support: "Hỗ trợ sắc tố/độ đều màu",
  uv_filter: "Màng lọc UV",
};

const evidenceLevelLabels: Record<IngredientEvidenceLevel, string> = {
  basic: "Cơ bản",
  moderate: "Trung bình",
  strong: "Mạnh",
  uncertain: "Chưa chắc chắn",
};

function toClientInput(
  filters: IngredientManagementFilterState,
): AdminIngredientListQueryInput {
  const q = filters.q.trim();

  return {
    limit: 50,
    ...(q ? { q } : {}),
    ...(filters.function ? { function: filters.function } : {}),
  };
}

function hasActiveFilters(filters: IngredientManagementFilterState) {
  return Boolean(filters.q.trim() || filters.function);
}

function isUnauthorizedError(error: unknown) {
  return (
    error instanceof AdminIngredientClientError &&
    (error.status === 401 ||
      error.status === 403 ||
      error.code === "UNAUTHORIZED" ||
      error.code === "FORBIDDEN")
  );
}

function getUnauthorizedMessage(error: AdminIngredientClientError) {
  if (error.status === 401 || error.code === "UNAUTHORIZED") {
    return "Bạn cần đăng nhập bằng tài khoản admin để quản lý thành phần.";
  }

  return "Trang này chỉ dành cho admin SkinWise. Dữ liệu quản lý thành phần không hiển thị cho tài khoản này.";
}

function getLoadErrorMessage() {
  return "Không thể tải danh sách thành phần admin. Vui lòng thử lại hoặc làm mới trang.";
}

function getSaveIngredientErrorMessage(error: unknown) {
  if (error instanceof AdminIngredientClientError) {
    if (error.status === 401 || error.code === "UNAUTHORIZED") {
      return "Bạn cần đăng nhập bằng tài khoản admin trước khi lưu thành phần.";
    }

    if (error.status === 403 || error.code === "FORBIDDEN") {
      return "Chỉ admin mới có thể tạo hoặc chỉnh sửa thành phần.";
    }

    if (error.status === 404 || error.code === "NOT_FOUND") {
      return "Không tìm thấy thành phần. Hãy tải lại danh sách và thử lại.";
    }

    if (error.status === 409 || error.code === "CONFLICT") {
      return "Tên INCI đã tồn tại. Vui lòng kiểm tra ingredient hiện có trước khi tạo hoặc đổi tên.";
    }

    if (error.status === 400 || error.code === "VALIDATION_ERROR") {
      return "Một số thông tin thành phần chưa hợp lệ. Vui lòng kiểm tra lại form.";
    }
  }

  return "Không thể lưu thành phần. Vui lòng thử lại.";
}

function upsertIngredient(
  ingredients: IngredientDto[],
  ingredient: IngredientDto,
) {
  const withoutIngredient = ingredients.filter(
    (item) => item.id !== ingredient.id,
  );

  return [ingredient, ...withoutIngredient].sort((first, second) =>
    first.inciName.localeCompare(second.inciName),
  );
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function AdminIngredientManagement() {
  const [draftFilters, setDraftFilters] =
    useState<IngredientManagementFilterState>(initialFilters);
  const [activeFilters, setActiveFilters] =
    useState<IngredientManagementFilterState>(initialFilters);
  const [ingredients, setIngredients] = useState<IngredientDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [unauthorizedMessage, setUnauthorizedMessage] = useState<string | null>(
    null,
  );
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [editor, setEditor] = useState<IngredientEditorState | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSavingIngredient, setIsSavingIngredient] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadAdminIngredients() {
      setIsLoading(true);
      setLoadError(null);
      setUnauthorizedMessage(null);
      setFeedback(null);

      try {
        const items = await listAdminIngredients(toClientInput(activeFilters));

        if (!isMounted) {
          return;
        }

        setIngredients(items);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setIngredients([]);

        if (isUnauthorizedError(error)) {
          setUnauthorizedMessage(
            getUnauthorizedMessage(error as AdminIngredientClientError),
          );
          return;
        }

        setLoadError(getLoadErrorMessage());
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadAdminIngredients();

    return () => {
      isMounted = false;
    };
  }, [activeFilters, reloadKey]);

  function updateFilter<Field extends keyof IngredientManagementFilterState>(
    field: Field,
    value: IngredientManagementFilterState[Field],
  ) {
    setDraftFilters((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveFilters(draftFilters);
  }

  function handleClearFilters() {
    setDraftFilters(initialFilters);
    setActiveFilters(initialFilters);
  }

  function handleCreateIngredient() {
    setEditor({ mode: "create" });
    setSaveError(null);
    setFeedback(null);
  }

  function handleEditIngredient(ingredient: IngredientDto) {
    setEditor({ ingredient, mode: "edit" });
    setSaveError(null);
    setFeedback(null);
  }

  function handleCancelEditor() {
    if (isSavingIngredient) {
      return;
    }

    setEditor(null);
    setSaveError(null);
  }

  async function handleSaveIngredient(payload: AdminIngredientFormPayload) {
    if (!editor || isSavingIngredient) {
      return;
    }

    setIsSavingIngredient(true);
    setSaveError(null);
    setFeedback(null);

    try {
      const savedIngredient =
        editor.mode === "create"
          ? await createAdminIngredient(
              payload as AdminCreateIngredientBodyInput,
            )
          : await updateAdminIngredient(
              editor.ingredient.id,
              payload as AdminUpdateIngredientBodyInput,
            );

      setIngredients((current) => upsertIngredient(current, savedIngredient));
      setEditor(null);
      setFeedback({
        message:
          editor.mode === "create"
            ? "Tạo thành phần thành công"
            : "Cập nhật thành phần thành công",
        title: "Đã lưu thành phần",
        type: "success",
      });
    } catch (error) {
      setSaveError(getSaveIngredientErrorMessage(error));
    } finally {
      setIsSavingIngredient(false);
    }
  }

  const activeFilterCount = ingredients.length;
  const hasFilters = hasActiveFilters(activeFilters);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          aria-label="Tạo thành phần"
          onClick={handleCreateIngredient}
          type="button"
        >
          <Plus aria-hidden="true" />
          Tạo thành phần
        </Button>
      </div>

      <Card>
        <CardContent className="pt-1">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_16rem]">
              <div className="space-y-2">
                <Label htmlFor="admin-ingredient-search">
                  Tìm kiếm thành phần
                </Label>
                <Input
                  id="admin-ingredient-search"
                  onChange={(event) => updateFilter("q", event.target.value)}
                  placeholder="Tên INCI, alias, công dụng hoặc cách dùng phổ biến"
                  value={draftFilters.q}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-ingredient-function-filter">
                  Lọc theo công dụng
                </Label>
                <Select
                  onValueChange={(value) =>
                    updateFilter(
                      "function",
                      value === ALL_FILTER_VALUE ? "" : value,
                    )
                  }
                  value={draftFilters.function || ALL_FILTER_VALUE}
                >
                  <SelectTrigger
                    className="min-h-11 w-full rounded-xl bg-card"
                    data-testid="admin-ingredient-function-filter-select"
                    id="admin-ingredient-function-filter"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_FILTER_VALUE}>
                      Tất cả công dụng
                    </SelectItem>
                    {Object.entries(ingredientFunctionLabels).map(
                      ([value, label]) => (
                        <SelectItem
                          data-testid={`admin-ingredient-function-filter-option-${value}`}
                          key={value}
                          value={value}
                        >
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                aria-label="Xóa bộ lọc thành phần admin"
                onClick={handleClearFilters}
                type="button"
                variant="outline"
              >
                <X aria-hidden="true" />
                Xóa bộ lọc
              </Button>
              <Button aria-label="Tìm thành phần admin" type="submit">
                <Search aria-hidden="true" />
                Tìm thành phần
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Alert>
        <AlertTitle>Phạm vi quản lý Lite</AlertTitle>
        <AlertDescription>
          Admin có thể tạo và chỉnh sửa dữ liệu Ingredient Library ở mức Lite.
          Thư viện người dùng, trang chi tiết và giải thích thành phần tiếp tục
          dùng API user-facing hiện có.
        </AlertDescription>
      </Alert>

      {editor ? (
        <AdminIngredientForm
          ingredient={editor.mode === "edit" ? editor.ingredient : undefined}
          isSaving={isSavingIngredient}
          key={
            editor.mode === "edit"
              ? `edit-${editor.ingredient.id}`
              : "create-ingredient"
          }
          mode={editor.mode}
          onCancel={handleCancelEditor}
          onSubmit={(payload) => void handleSaveIngredient(payload)}
          saveError={saveError}
        />
      ) : null}

      {feedback ? (
        <Alert
          role={feedback.type === "success" ? "status" : "alert"}
          variant={feedback.type === "error" ? "destructive" : "default"}
        >
          <AlertTitle>{feedback.title}</AlertTitle>
          <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
      ) : null}

      {unauthorizedMessage ? (
        <AdminIngredientUnauthorizedState description={unauthorizedMessage} />
      ) : null}

      {loadError ? (
        <ErrorState
          action={
            <Button
              onClick={() => setReloadKey((current) => current + 1)}
              type="button"
            >
              <RefreshCcw aria-hidden="true" />
              Thử lại
            </Button>
          }
          description={loadError}
          title="Không thể tải danh sách thành phần admin"
        />
      ) : null}

      {isLoading ? (
        <Card>
          <CardContent>
            <LoadingState label="Đang tải danh sách thành phần admin..." />
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !loadError && !unauthorizedMessage ? (
        <p className="text-sm text-muted-foreground" role="status">
          {hasFilters
            ? `Đang hiển thị ${activeFilterCount} thành phần phù hợp với bộ lọc admin.`
            : `Đang hiển thị ${activeFilterCount} thành phần trong Ingredient Library.`}
        </p>
      ) : null}

      {!isLoading &&
      !loadError &&
      !unauthorizedMessage &&
      ingredients.length === 0 ? (
        <EmptyState
          action={
            hasFilters ? (
              <Button
                onClick={handleClearFilters}
                type="button"
                variant="outline"
              >
                Xóa bộ lọc
              </Button>
            ) : null
          }
          description={
            hasFilters
              ? "Không có thành phần nào khớp bộ lọc admin hiện tại."
              : "Chưa có thành phần nào trong Ingredient Library."
          }
          title={
            hasFilters
              ? "Không tìm thấy thành phần phù hợp"
              : "Chưa có thành phần"
          }
        />
      ) : null}

      {!isLoading &&
      !loadError &&
      !unauthorizedMessage &&
      ingredients.length > 0 ? (
        <div className="space-y-3" data-testid="admin-ingredient-list">
          {ingredients.map((ingredient) => (
            <AdminIngredientManagementRow
              ingredient={ingredient}
              key={ingredient.id}
              onEdit={() => handleEditIngredient(ingredient)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

type AdminIngredientManagementRowProps = {
  ingredient: IngredientDto;
  onEdit: () => void;
};

function AdminIngredientManagementRow({
  ingredient,
  onEdit,
}: AdminIngredientManagementRowProps) {
  return (
    <article
      className="rounded-2xl border border-border bg-card p-4 shadow-sm shadow-stone-950/5"
      data-testid="admin-ingredient-row"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-start">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {evidenceLevelLabels[ingredient.evidenceLevel]}
            </Badge>
            {ingredient.functions.slice(0, 3).map((value) => (
              <Badge key={value} variant="outline">
                {ingredientFunctionLabels[value] ?? value}
              </Badge>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {ingredient.inciName}
            </h2>
            {ingredient.aliases.length > 0 ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {ingredient.aliases.slice(0, 3).join(", ")}
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                Chưa có alias.
              </p>
            )}
          </div>

          {ingredient.commonUses.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              {ingredient.commonUses.slice(0, 2).join(" · ")}
            </p>
          ) : null}

          <p className="text-xs text-muted-foreground">
            Cập nhật {formatUpdatedAt(ingredient.updatedAt)}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background p-3">
          <Button
            aria-label={`Chỉnh sửa ${ingredient.inciName}`}
            className="w-full"
            onClick={onEdit}
            type="button"
            variant="outline"
          >
            <Pencil aria-hidden="true" />
            Chỉnh sửa
          </Button>
        </div>
      </div>
    </article>
  );
}

function AdminIngredientUnauthorizedState({
  description,
}: {
  description: string;
}) {
  return (
    <ErrorState description={description} title="Cần quyền truy cập admin" />
  );
}
