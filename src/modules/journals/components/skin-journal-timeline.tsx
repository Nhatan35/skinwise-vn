"use client";

import { Check, Plus, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  deleteSkinJournal,
  listSkinJournals,
  SkinJournalClientError,
} from "@/modules/journals/skin-journal.client";
import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import {
  filterSkinJournalEntries,
  getSkinJournalFilterOptions,
  hasActiveSkinJournalFilters,
  type SkinJournalFilterState,
} from "@/modules/journals/skin-journal-filters";
import { buildProductLookup } from "@/modules/journals/skin-journal-product-display";
import { SkinJournalFilterPanel } from "@/modules/journals/components/skin-journal-filter-panel";
import { SkinJournalEntryCard } from "@/modules/journals/components/skin-journal-entry-card";
import { SkinJournalEntryForm } from "@/modules/journals/components/skin-journal-entry-form";
import { listProducts } from "@/modules/products/product.client";
import type { ProductDto } from "@/modules/products/product.dto";
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
import { routes } from "@/shared/constants/routes";

type Feedback = {
  message: string;
  type: "error" | "success";
};

type FormMode = "create" | "edit" | "none";

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

function getBrowserLocalDate(date = new Date()) {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join("-");
}

function sortSkinJournals(entries: SkinJournalDto[]) {
  return [...entries].sort((first, second) => {
    const localDateOrder = second.localDate.localeCompare(first.localDate);

    if (localDateOrder !== 0) {
      return localDateOrder;
    }

    return second.createdAt.localeCompare(first.createdAt);
  });
}

function upsertSkinJournal(
  entries: SkinJournalDto[],
  entry: SkinJournalDto,
) {
  const exists = entries.some((item) => item.id === entry.id);
  const nextEntries = exists
    ? entries.map((item) => (item.id === entry.id ? entry : item))
    : [entry, ...entries];

  return sortSkinJournals(nextEntries);
}

function getDeleteErrorMessage(error: unknown) {
  if (error instanceof SkinJournalClientError) {
    return error.message;
  }

  return "Không thể xóa nhật ký này. Vui lòng thử lại.";
}

export function SkinJournalTimeline() {
  const [currentLocalDate] = useState(() => getBrowserLocalDate());
  const [entries, setEntries] = useState<SkinJournalDto[]>([]);
  const [filterState, setFilterState] = useState<SkinJournalFilterState>({
    dateRange: "all",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [productLoadError, setProductLoadError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [formMode, setFormMode] = useState<FormMode>("none");
  const [editingEntry, setEditingEntry] = useState<SkinJournalDto | null>(null);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadEntries() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const skinJournals = await listSkinJournals({ limit: 50 });

        if (!isMounted) {
          return;
        }

        setEntries(sortSkinJournals(skinJournals));
      } catch {
        if (isMounted) {
          setLoadError(
            "Không thể tải nhật ký da. Vui lòng thử lại hoặc làm mới trang.",
          );
          setEntries([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadEntries();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    let isMounted = true;

    async function loadProductCatalogue() {
      setIsProductLoading(true);
      setProductLoadError(null);

      try {
        const visibleProducts = await listProducts();

        if (!isMounted) {
          return;
        }

        setProducts(visibleProducts);
      } catch {
        if (isMounted) {
          setProducts([]);
          setProductLoadError(
            "Không thể tải danh mục sản phẩm. Bạn vẫn có thể lưu nhật ký không kèm sản phẩm.",
          );
        }
      } finally {
        if (isMounted) {
          setIsProductLoading(false);
        }
      }
    }

    void loadProductCatalogue();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedEntries = useMemo(() => sortSkinJournals(entries), [entries]);
  const productLookup = useMemo(() => buildProductLookup(products), [products]);
  const filterOptions = useMemo(
    () => getSkinJournalFilterOptions(sortedEntries),
    [sortedEntries],
  );
  const hasActiveFilters = hasActiveSkinJournalFilters(filterState);
  const filteredEntries = useMemo(
    () =>
      filterSkinJournalEntries(sortedEntries, filterState, {
        currentLocalDate,
      }),
    [currentLocalDate, filterState, sortedEntries],
  );
  const showFilterEmptyState =
    sortedEntries.length > 0 &&
    hasActiveFilters &&
    filteredEntries.length === 0;

  function startCreate() {
    setFormMode("create");
    setEditingEntry(null);
    setFeedback(null);
  }

  function startEdit(entry: SkinJournalDto) {
    setFormMode("edit");
    setEditingEntry(entry);
    setFeedback(null);
  }

  function cancelForm() {
    setFormMode("none");
    setEditingEntry(null);
  }

  function clearFilters() {
    setFilterState({ dateRange: "all" });
  }

  function handleSaved(entry: SkinJournalDto) {
    setEntries((current) => upsertSkinJournal(current, entry));
    setFormMode("none");
    setEditingEntry(null);
    setFeedback({
      message:
        formMode === "create"
          ? "Đã thêm nhật ký."
          : "Đã cập nhật nhật ký.",
      type: "success",
    });
  }

  async function handleDelete(entry: SkinJournalDto) {
    if (deletingEntryId !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Bạn muốn xóa nhật ký ngày ${entry.localDate}?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingEntryId(entry.id);
    setFeedback(null);

    try {
      await deleteSkinJournal(entry.id);
      setEntries((current) => current.filter((item) => item.id !== entry.id));
      if (editingEntry?.id === entry.id) {
        cancelForm();
      }
      setFeedback({
        message: "Đã xóa nhật ký.",
        type: "success",
      });
    } catch (error) {
      setFeedback({
        message: getDeleteErrorMessage(error),
        type: "error",
      });
    } finally {
      setDeletingEntryId(null);
    }
  }

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardContent>
          <LoadingState label="Đang tải nhật ký da..." />
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
        title="Không thể tải nhật ký da"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Dòng thời gian nhật ký
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Nhật ký được sắp xếp theo ngày, mới nhất ở trên.
          </p>
        </div>
        <Button
          data-testid="skin-journal-new-entry-button"
          onClick={startCreate}
          type="button"
        >
          <Plus aria-hidden="true" />
          Thêm nhật ký
        </Button>
      </div>

      {feedback ? (
        <Alert variant={feedback.type === "error" ? "destructive" : "default"}>
          {feedback.type === "success" ? <Check aria-hidden="true" /> : null}
          <AlertTitle>
            {feedback.type === "success" ? "Đã lưu" : "Thao tác thất bại"}
          </AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{feedback.message}</p>
            {feedback.type === "success" ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild size="sm" variant="outline">
                  <Link href={routes.ROUTINES}>Xem lại routine</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={routes.INSIGHTS}>Xem insights</Link>
                </Button>
              </div>
            ) : null}
          </AlertDescription>
        </Alert>
      ) : null}

      {formMode === "create" ? (
        <SkinJournalEntryForm
          isProductLoading={isProductLoading}
          mode="create"
          onCancel={cancelForm}
          onSaved={handleSaved}
          productLoadError={productLoadError}
          products={products}
        />
      ) : null}

      {productLoadError ? (
        <Alert>
          <AlertTitle>Chưa tải được danh sách sản phẩm</AlertTitle>
          <AlertDescription>{productLoadError}</AlertDescription>
        </Alert>
      ) : null}

      <SkinJournalFilterPanel
        filters={filterState}
        hasActiveFilters={hasActiveFilters}
        matchingCount={filteredEntries.length}
        onChange={setFilterState}
        onClear={clearFilters}
        options={filterOptions}
        productLookup={productLookup}
        totalCount={sortedEntries.length}
      />

      {sortedEntries.length === 0 && formMode !== "create" ? (
        <EmptyState
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                data-testid="skin-journal-new-entry-button"
                onClick={startCreate}
                type="button"
              >
                <Plus aria-hidden="true" />
                Thêm nhật ký
              </Button>
              <Button asChild variant="outline">
                <Link href={routes.ROUTINES}>Xem routine</Link>
              </Button>
            </div>
          }
          description="Bạn chưa có ghi nhận nào. Hãy thêm nhật ký đầu tiên sau khi dùng routine để theo dõi cảm nhận của da và thói quen chăm sóc theo thời gian."
          title="Chưa có nhật ký da"
        />
      ) : null}

      {showFilterEmptyState ? (
        <div data-testid="skin-journal-filter-empty-state">
          <EmptyState
            action={
              <Button onClick={clearFilters} type="button" variant="outline">
                Xóa bộ lọc
              </Button>
            }
            description="Không có nhật ký nào khớp với bộ lọc hiện tại. Bạn có thể xóa bộ lọc để xem lại các nhật ký gần đây."
            title="Không có nhật ký phù hợp"
          />
        </div>
      ) : null}

      <div className="space-y-4">
        {filteredEntries.map((entry) =>
          formMode === "edit" && editingEntry?.id === entry.id ? (
            <SkinJournalEntryForm
              entry={entry}
              isProductLoading={isProductLoading}
              key={entry.id}
              mode="edit"
              onCancel={cancelForm}
              onSaved={handleSaved}
              productLoadError={productLoadError}
              products={products}
            />
          ) : (
            <SkinJournalEntryCard
              entry={entry}
              isDeleting={deletingEntryId === entry.id}
              key={entry.id}
              onDelete={handleDelete}
              onEdit={startEdit}
              productLookup={productLookup}
            />
          ),
        )}
      </div>
    </div>
  );
}
