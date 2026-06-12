"use client";

import { RotateCcw, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import { IngredientCard } from "@/modules/ingredients/components/ingredient-card";
import {
  IngredientClientError,
  listIngredients,
  type IngredientListClientInput,
} from "@/modules/ingredients/ingredient.client";
import type { IngredientDto } from "@/modules/ingredients/ingredient.dto";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
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
import { routes } from "@/shared/constants/routes";

const ALL_FILTER_VALUE = "all";

type IngredientFilterState = {
  function: string;
  q: string;
};

const initialIngredientFilters: IngredientFilterState = {
  function: "",
  q: "",
};

type IngredientLibraryProps = {
  initialQuery?: string;
};

function buildInitialIngredientFilters(
  initialQuery = "",
): IngredientFilterState {
  return {
    ...initialIngredientFilters,
    q: initialQuery.trim(),
  };
}

const ingredientFunctionLabels: Record<string, string> = {
  active: "Hoạt chất",
  skin_conditioning: "Hỗ trợ điều hòa da",
  barrier_support: "Hỗ trợ hàng rào da",
  hydration_support: "Hỗ trợ cấp ẩm",
  humectant: "Hút ẩm",
  emollient: "Làm mềm da",
  oil_balance: "Hỗ trợ dầu thừa",
  soothing_support: "Làm dịu",
  soothing: "Làm dịu",
  exfoliant: "Tẩy tế bào chết",
  antioxidant: "Chống oxy hóa",
  texture_support: "Hỗ trợ bề mặt da",
  tone_support: "Hỗ trợ sắc tố/độ đều màu",
  blemish_support: "Hỗ trợ da dễ nổi mụn",
  redness_support: "Hỗ trợ da dễ đỏ",
  retinoid: "Nhóm retinoid",
  uv_filter: "Màng lọc UV",
  botanical_extract: "Chiết xuất thực vật",
  fragrance_component: "Thành phần hương liệu",
  occlusive: "Khóa ẩm",
  skin_protective: "Bảo vệ da",
  solvent: "Dung môi",
  sensory_agent: "Hỗ trợ cảm quan",
  absorbent: "Hấp thụ dầu/ẩm",
};

function toClientInput(
  filters: IngredientFilterState,
): IngredientListClientInput {
  const q = filters.q.trim();

  return {
    limit: 50,
    ...(q ? { q } : {}),
    ...(filters.function ? { function: filters.function } : {}),
  };
}

function hasActiveIngredientFilters(filters: IngredientFilterState) {
  return Boolean(filters.q.trim() || filters.function);
}

function getActiveIngredientFilterLabels(filters: IngredientFilterState) {
  const items: string[] = [];
  const q = filters.q.trim();

  if (q) {
    items.push(`Từ khóa: ${q}`);
  }

  if (filters.function) {
    items.push(
      `Công dụng: ${
        ingredientFunctionLabels[filters.function] ?? filters.function
      }`,
    );
  }

  return items;
}

function getLoadErrorMessage(error: unknown) {
  if (error instanceof IngredientClientError) {
    if (error.code === "UNAUTHORIZED" || error.status === 401) {
      return "Bạn cần đăng nhập để xem thư viện thành phần.";
    }

    return "Không thể tải thư viện thành phần. Vui lòng thử lại hoặc làm mới trang.";
  }

  return "Không thể tải thư viện thành phần. Vui lòng thử lại hoặc làm mới trang.";
}

export function IngredientLibrary({
  initialQuery = "",
}: IngredientLibraryProps) {
  const initialFilters = buildInitialIngredientFilters(initialQuery);
  const [draftFilters, setDraftFilters] = useState<IngredientFilterState>(
    initialFilters,
  );
  const [activeFilters, setActiveFilters] = useState<IngredientFilterState>(
    initialFilters,
  );
  const [ingredients, setIngredients] = useState<IngredientDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadIngredientLibrary() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const items = await listIngredients(toClientInput(activeFilters));

        if (!isMounted) {
          return;
        }

        setIngredients(items);
      } catch (error) {
        if (isMounted) {
          setIngredients([]);
          setLoadError(getLoadErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadIngredientLibrary();

    return () => {
      isMounted = false;
    };
  }, [activeFilters, reloadKey]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextFilters: IngredientFilterState = {
      function: draftFilters.function,
      q: draftFilters.q.trim(),
    };

    setDraftFilters(nextFilters);

    if (
      nextFilters.q === activeFilters.q &&
      nextFilters.function === activeFilters.function
    ) {
      setReloadKey((current) => current + 1);
      return;
    }

    setActiveFilters(nextFilters);
  }

  function handleReset() {
    setDraftFilters(initialIngredientFilters);

    if (!hasActiveIngredientFilters(activeFilters)) {
      setReloadKey((current) => current + 1);
      return;
    }

    setActiveFilters(initialIngredientFilters);
  }

  const hasActiveFilters = hasActiveIngredientFilters(activeFilters);
  const activeIngredientFilterLabels =
    getActiveIngredientFilterLabels(activeFilters);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-1">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <div className="space-y-2">
                <Label htmlFor="ingredient-search">Tìm kiếm thành phần</Label>
                <Input
                  data-testid="ingredient-search"
                  id="ingredient-search"
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      q: event.target.value,
                    }))
                  }
                  placeholder="INCI name, alias, công dụng hoặc cách dùng phổ biến"
                  value={draftFilters.q}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredient-function">Lọc theo công dụng</Label>
                <Select
                  onValueChange={(value) =>
                    setDraftFilters((current) => ({
                      ...current,
                      function: value === ALL_FILTER_VALUE ? "" : value,
                    }))
                  }
                  value={draftFilters.function || ALL_FILTER_VALUE}
                >
                  <SelectTrigger
                    className="min-h-11 w-full rounded-xl bg-card"
                    id="ingredient-function"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_FILTER_VALUE}>
                      Tất cả công dụng
                    </SelectItem>
                    {Object.entries(ingredientFunctionLabels).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
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
                aria-label="Xóa bộ lọc"
                onClick={handleReset}
                type="button"
                variant="outline"
              >
                <X aria-hidden="true" />
                Xóa bộ lọc
              </Button>
              <Button aria-label="Tìm thành phần" type="submit">
                <Search aria-hidden="true" />
                Tìm thành phần
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {loadError ? (
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
          title="Không thể tải thư viện thành phần"
        />
      ) : null}

      {!loadError ? (
        <Alert>
          <AlertTitle>Thư viện thành phần tham khảo</AlertTitle>
          <AlertDescription>
            Thông tin thành phần giúp bạn hiểu routine tốt hơn. Nội dung này
            không phải chẩn đoán y khoa, lời khuyên điều trị hoặc cam kết phù
            hợp với mọi người.
          </AlertDescription>
        </Alert>
      ) : null}

      {!isLoading && !loadError ? (
        <div className="space-y-1 text-sm text-muted-foreground">
          <p aria-live="polite">
            {hasActiveFilters
              ? `Đang hiển thị ${ingredients.length} thành phần phù hợp với bộ lọc hiện tại.`
              : `Đang hiển thị ${ingredients.length} thành phần.`}
          </p>
          {hasActiveFilters ? (
            <p>
              Bộ lọc đang áp dụng: {activeIngredientFilterLabels.join(" · ")}
            </p>
          ) : (
            <p>
              Bạn có thể tìm theo tên INCI, alias, công dụng hoặc cách dùng
              thường gặp.
            </p>
          )}
          <p>
            Muốn xem sản phẩm liên quan?{" "}
            <Link
              className="font-medium text-primary underline-offset-4 hover:underline"
              href={routes.PRODUCTS}
            >
              Tìm trong catalogue sản phẩm
            </Link>
            .
          </p>
        </div>
      ) : null}

      {isLoading ? (
        <Card>
          <CardContent>
            <LoadingState label="Đang tải thư viện thành phần..." />
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !loadError && ingredients.length === 0 ? (
        <EmptyState
          action={
            hasActiveFilters ? (
              <Button onClick={handleReset} type="button" variant="outline">
                Xóa bộ lọc
              </Button>
            ) : null
          }
          description={
            hasActiveFilters
              ? "Bộ lọc hiện tại có thể đang quá hẹp. Hãy thử tìm bằng tên INCI, alias hoặc chọn lại nhóm công dụng."
              : "Hiện chưa có thành phần nào trong thư viện. Bạn có thể quay lại sau khi dữ liệu được bổ sung."
          }
          title={
            hasActiveFilters
              ? "Không tìm thấy thành phần phù hợp"
              : "Chưa có thành phần trong thư viện"
          }
        />
      ) : null}

      {!isLoading && !loadError && ingredients.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ingredients.map((ingredient) => (
            <IngredientCard ingredient={ingredient} key={ingredient.id} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
