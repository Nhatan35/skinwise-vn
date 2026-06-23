"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";

import { SavedProductCard } from "@/modules/saved-products/components/saved-product-card";
import { SavedProductsComparisonPanel } from "@/modules/saved-products/components/saved-products-comparison-panel";
import {
  listSavedProducts,
  SavedProductClientError,
} from "@/modules/saved-products/saved-product.client";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import {
  DEFAULT_SAVED_PRODUCTS_FILTERS,
  filterSavedProducts,
  getAvailableSavedProductTags,
  getSavedProductDecisionSummary,
  hasActiveSavedProductFilters,
  type SavedProductsFilterState,
} from "@/modules/saved-products/saved-product-filters";
import type { SavedProductReviewFilter } from "@/modules/saved-products/saved-product-review";
import { routes } from "@/shared/constants/routes";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const COMPARISON_GUIDANCE_ID = "saved-products-comparison-guidance";
const filterSelectClassName =
  "h-11 w-full rounded-xl border border-input bg-card px-3.5 text-sm shadow-sm shadow-stone-950/5 outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/25";
const reviewFilterOptions: Array<{
  value: SavedProductReviewFilter;
  label: string;
}> = [
  { value: "all", label: "Tất cả" },
  { value: "needs-review", label: "Cần xem lại" },
  { value: "considering", label: "Đang cân nhắc" },
  { value: "testing", label: "Đang dùng thử" },
  { value: "paused", label: "Tạm dừng" },
  { value: "kept", label: "Muốn giữ lại" },
  { value: "missing-decision-status", label: "Chưa chọn trạng thái" },
  { value: "missing-routine-slot", label: "Chưa có kế hoạch routine" },
  { value: "missing-personal-note", label: "Chưa có ghi chú" },
];

function getLoadErrorMessage(error: unknown) {
  if (error instanceof SavedProductClientError) {
    if (error.code === "UNAUTHORIZED" || error.status === 401) {
      return "Bạn cần đăng nhập để xem sản phẩm đã lưu.";
    }

    return "Không thể tải sản phẩm đã lưu. Vui lòng thử lại hoặc làm mới trang.";
  }

  return "Không thể tải sản phẩm đã lưu. Vui lòng thử lại hoặc làm mới trang.";
}

function pruneSelectedProductIds(
  currentIds: Set<string>,
  currentItems: SavedProductDto[],
) {
  const availableProductIds = new Set(
    currentItems.map((item) => item.productId),
  );
  const nextIds = new Set(
    [...currentIds].filter((productId) => availableProductIds.has(productId)),
  );

  return nextIds.size === currentIds.size ? currentIds : nextIds;
}

function getComparisonGuidance(selectedCount: number) {
  if (selectedCount === 0) {
    return "Chọn từ 2 đến 3 sản phẩm để xem thông tin cạnh nhau.";
  }

  if (selectedCount === 1) {
    return "Đã chọn 1/3 sản phẩm. Chọn thêm ít nhất một sản phẩm để bắt đầu so sánh.";
  }

  if (selectedCount === 2) {
    return "Đã chọn 2/3 sản phẩm. Bạn có thể so sánh ngay hoặc chọn thêm một sản phẩm.";
  }

  return "Đã chọn tối đa 3/3 sản phẩm. Hãy bỏ chọn một sản phẩm trước khi chọn sản phẩm khác.";
}

function getFilteredEmptyState(filters: SavedProductsFilterState) {
  if (filters.reviewFilter === "needs-review") {
    return {
      title: "Không có sản phẩm nào trong bộ lọc này.",
      description:
        "Hiện không có sản phẩm nào cần xem lại theo tiêu chí tổ chức cá nhân.",
    };
  }

  if (filters.tag.trim().length > 0) {
    return {
      title: "Không có sản phẩm nào trong bộ lọc này.",
      description: "Hãy bỏ bộ lọc tag để xem lại các sản phẩm đã lưu.",
    };
  }

  return {
    title: "Không có sản phẩm nào trong bộ lọc này.",
    description: "Bạn có thể đặt lại bộ lọc hoặc thử từ khóa khác.",
  };
}

export function SavedProductsPage() {
  const filterFieldId = useId();
  const [items, setItems] = useState<SavedProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [filters, setFilters] = useState<SavedProductsFilterState>(() => ({
    ...DEFAULT_SAVED_PRODUCTS_FILTERS,
  }));
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    () => new Set(),
  );
  const filteredItems = filterSavedProducts(items, filters);
  const availableTags = getAvailableSavedProductTags(items);
  const decisionSummary = getSavedProductDecisionSummary(items);
  const hasActiveFilters = hasActiveSavedProductFilters(filters);
  const selectedItems = items.filter((item) =>
    selectedProductIds.has(item.productId),
  );
  const visibleProductIds = new Set(
    filteredItems.map((item) => item.productId),
  );
  const hasHiddenSelectedProducts =
    hasActiveFilters &&
    selectedItems.some((item) => !visibleProductIds.has(item.productId));
  const canShowComparison = selectedItems.length >= 2;
  const hasReachedComparisonLimit = selectedProductIds.size >= 3;
  const searchInputId = `${filterFieldId}-search`;
  const reviewFilterGroupId = `${filterFieldId}-review-filter`;
  const decisionStatusFilterId = `${filterFieldId}-decision-status`;
  const plannedRoutineSlotFilterId = `${filterFieldId}-planned-routine-slot`;
  const noteStatusFilterId = `${filterFieldId}-note-status`;
  const tagFilterId = `${filterFieldId}-tag`;
  const filteredEmptyState = getFilteredEmptyState(filters);

  useEffect(() => {
    let isMounted = true;

    async function loadSavedProducts() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const savedProducts = await listSavedProducts();

        if (!isMounted) {
          return;
        }

        setItems(savedProducts);
        setSelectedProductIds((currentIds) =>
          pruneSelectedProductIds(currentIds, savedProducts),
        );
      } catch (error) {
        if (isMounted) {
          setItems([]);
          setSelectedProductIds((currentIds) =>
            currentIds.size === 0 ? currentIds : new Set(),
          );
          setLoadError(getLoadErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSavedProducts();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  function handleComparisonToggle(productId: string) {
    setSelectedProductIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(productId)) {
        nextIds.delete(productId);

        return nextIds;
      }

      if (nextIds.size >= 3) {
        return currentIds;
      }

      nextIds.add(productId);

      return nextIds;
    });
  }

  function handleClearComparison() {
    setSelectedProductIds(new Set());
  }

  function handleRemoved(productId: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    );
    setSelectedProductIds((currentIds) => {
      if (!currentIds.has(productId)) {
        return currentIds;
      }

      const nextIds = new Set(currentIds);

      nextIds.delete(productId);

      return nextIds;
    });
  }

  function handleUpdated(updatedItem: SavedProductDto) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      ),
    );
  }

  function handleFilterChange<TKey extends keyof SavedProductsFilterState>(
    field: TKey,
    value: SavedProductsFilterState[TKey],
  ) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }));
  }

  function handleResetFilters() {
    setFilters({ ...DEFAULT_SAVED_PRODUCTS_FILTERS });
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
              <Link href={routes.PRODUCT_MATCH}>Quay lại Product Match</Link>
            </Button>
          </div>
        }
        description={loadError}
        title="Không thể tải sản phẩm đã lưu"
      />
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <LoadingState label="Đang tải sản phẩm đã lưu..." />
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild aria-label="Xem gợi ý sản phẩm">
              <Link href={routes.PRODUCT_MATCH}>Xem gợi ý sản phẩm</Link>
            </Button>
            <Button asChild aria-label="Xây dựng routine" variant="outline">
              <Link href={routes.ROUTINES}>Xây dựng routine</Link>
            </Button>
          </div>
        }
        actionClassName="flex justify-center"
        description="Hãy lưu sản phẩm để dễ xem lại khi xây dựng routine chăm sóc da. Sau khi lưu, hãy đọc kỹ chi tiết sản phẩm và thêm từng sản phẩm một thay vì thêm tất cả cùng lúc."
        title="Chưa có sản phẩm đã lưu"
      />
    );
  }

  return (
    <div className="space-y-4">
      <section
        className="rounded-lg border border-border bg-secondary/40 p-4"
        data-testid="saved-products-routine-guidance"
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-primary">Bước tiếp theo</p>
            <h2 className="text-xl font-semibold text-foreground">
              Xem lại sản phẩm đã lưu trước khi xây dựng routine
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Sản phẩm đã lưu dùng để xem lại thông tin tham khảo, so sánh các lựa
              chọn và cân nhắc từng sản phẩm trước khi đưa vào routine. Việc lưu
              sản phẩm không đồng nghĩa với việc sản phẩm sẽ phù hợp với mọi routine.
            </p>
          </div>
          <Button asChild>
            <Link href={routes.ROUTINES}>
              Xây dựng routine
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-border bg-card/70 p-3">
            <h3 className="text-sm font-semibold text-foreground">
              Thông tin tham khảo
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Đọc lại danh mục, thành phần nổi bật và lưu ý sản phẩm trước khi
              quyết định thêm vào routine.
            </p>
          </div>
          <div className="rounded-md border border-border bg-card/70 p-3">
            <h3 className="text-sm font-semibold text-foreground">
              Lưu ý an toàn
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Không nên thêm quá nhiều sản phẩm mới cùng lúc. Hãy bắt đầu chậm
              và theo dõi cảm nhận của da.
            </p>
          </div>
          <div className="rounded-md border border-border bg-card/70 p-3">
            <h3 className="text-sm font-semibold text-foreground">
              Khi đã sẵn sàng
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Chọn một vài sản phẩm cần xem kỹ hơn, mở trang chi tiết nếu cần,
              rồi xây dựng routine đơn giản theo từng bước.
            </p>
          </div>
        </div>
      </section>

      <section
        className="space-y-5 rounded-lg border border-border bg-card p-4"
        data-testid="saved-products-decision-filters"
      >
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Lọc sản phẩm đã lưu
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Lọc nhanh các sản phẩm cần xem lại, còn thiếu trạng thái, kế hoạch
            routine hoặc ghi chú cá nhân.
          </p>
        </div>

        <div className="space-y-3">
          <p
            className="text-sm font-semibold text-foreground"
            id={reviewFilterGroupId}
          >
            Bộ lọc xem lại
          </p>
          <div
            aria-labelledby={reviewFilterGroupId}
            className="flex flex-wrap gap-2"
            data-testid="saved-products-review-filter-controls"
            role="group"
          >
            {reviewFilterOptions.map((option) => {
              const isSelected = filters.reviewFilter === option.value;

              return (
                <Button
                  aria-pressed={isSelected}
                  className="min-h-9 whitespace-normal"
                  data-testid={`saved-products-review-filter-${option.value}`}
                  key={option.value}
                  onClick={() =>
                    handleFilterChange("reviewFilter", option.value)
                  }
                  size="sm"
                  type="button"
                  variant={isSelected ? "secondary" : "outline"}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Đây là công cụ tổ chức cá nhân, không phải khuyến nghị điều trị
            hoặc đảm bảo sản phẩm phù hợp với da.
          </p>
        </div>

        <div
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
          data-testid="saved-products-decision-summary"
        >
          {[
            ["Tổng sản phẩm đã lưu", decisionSummary.total],
            ["Đang cân nhắc", decisionSummary.considering],
            ["Đang dùng thử", decisionSummary.testing],
            ["Tạm dừng", decisionSummary.paused],
            ["Muốn giữ lại", decisionSummary.kept],
            ["Chưa chọn trạng thái", decisionSummary.unset],
          ].map(([label, count]) => (
            <div
              className="rounded-md border border-border bg-secondary/30 p-3"
              key={label}
            >
              <p className="text-xs font-medium text-muted-foreground">
                {label}
              </p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {count}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-2">
            <Label htmlFor={searchInputId}>Tìm sản phẩm đã lưu</Label>
            <Input
              id={searchInputId}
              onChange={(event) => handleFilterChange("query", event.target.value)}
              placeholder="Tìm theo tên sản phẩm, thương hiệu hoặc ghi chú..."
              type="search"
              value={filters.query}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={decisionStatusFilterId}>
              Lọc theo trạng thái cân nhắc
            </Label>
            <select
              className={filterSelectClassName}
              id={decisionStatusFilterId}
              onChange={(event) =>
                handleFilterChange(
                  "decisionStatus",
                  event.target
                    .value as SavedProductsFilterState["decisionStatus"],
                )
              }
              value={filters.decisionStatus}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="considering">Đang cân nhắc</option>
              <option value="testing">Đang dùng thử</option>
              <option value="paused">Tạm dừng</option>
              <option value="kept">Muốn giữ lại</option>
              <option value="unset">Chưa chọn trạng thái</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={plannedRoutineSlotFilterId}>
              Lọc theo thời điểm dự định dùng
            </Label>
            <select
              className={filterSelectClassName}
              id={plannedRoutineSlotFilterId}
              onChange={(event) =>
                handleFilterChange(
                  "plannedRoutineSlot",
                  event.target
                    .value as SavedProductsFilterState["plannedRoutineSlot"],
                )
              }
              value={filters.plannedRoutineSlot}
            >
              <option value="all">Tất cả thời điểm</option>
              <option value="morning">Buổi sáng</option>
              <option value="evening">Buổi tối</option>
              <option value="either">Sáng hoặc tối</option>
              <option value="not_sure">Chưa chắc</option>
              <option value="unset">Chưa chọn thời điểm</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={noteStatusFilterId}>
              Lọc theo ghi chú cá nhân
            </Label>
            <select
              className={filterSelectClassName}
              id={noteStatusFilterId}
              onChange={(event) =>
                handleFilterChange(
                  "noteStatus",
                  event.target.value as SavedProductsFilterState["noteStatus"],
                )
              }
              value={filters.noteStatus}
            >
              <option value="all">Tất cả ghi chú</option>
              <option value="with_note">Có ghi chú</option>
              <option value="without_note">Chưa có ghi chú</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={tagFilterId}>Filter by tag</Label>
            <select
              className={filterSelectClassName}
              data-testid="saved-products-tag-filter"
              id={tagFilterId}
              onChange={(event) =>
                handleFilterChange("tag", event.target.value)
              }
              value={filters.tag}
            >
              <option value="">All tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button onClick={handleResetFilters} type="button" variant="outline">
            <RotateCcw aria-hidden="true" />
            Đặt lại bộ lọc
          </Button>
          {hasActiveFilters ? (
            <p
              aria-live="polite"
              className="text-sm text-muted-foreground"
              data-testid="saved-products-filtered-result-count"
              role="status"
            >
              Đang hiển thị {filteredItems.length}/{items.length} sản phẩm đã
              lưu.
            </p>
          ) : null}
        </div>
      </section>

      <p
        className="text-sm text-muted-foreground"
        id={COMPARISON_GUIDANCE_ID}
        role="status"
      >
        {getComparisonGuidance(selectedProductIds.size)}
      </p>

      {hasHiddenSelectedProducts ? (
        <p
          className="rounded-md border border-border bg-secondary/40 p-3 text-sm text-muted-foreground"
          data-testid="saved-products-hidden-selection-warning"
          role="status"
        >
          Một số sản phẩm đã chọn để so sánh có thể đang bị ẩn bởi bộ lọc.
        </p>
      ) : null}

      {canShowComparison ? (
        <SavedProductsComparisonPanel
          items={selectedItems}
          onClear={handleClearComparison}
        />
      ) : null}

      {filteredItems.length === 0 ? (
        <EmptyState
          action={
            <Button onClick={handleResetFilters} type="button" variant="outline">
              Đặt lại bộ lọc
            </Button>
          }
          description={
            filteredEmptyState.description
          }
          title={filteredEmptyState.title}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => {
            const isSelectedForComparison = selectedProductIds.has(
              item.productId,
            );

            return (
              <SavedProductCard
                comparisonDescriptionId={COMPARISON_GUIDANCE_ID}
                comparisonDisabled={
                  hasReachedComparisonLimit && !isSelectedForComparison
                }
                isSelectedForComparison={isSelectedForComparison}
                item={item}
                key={item.id}
                onComparisonToggle={handleComparisonToggle}
                onRemoved={handleRemoved}
                onUpdated={handleUpdated}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
