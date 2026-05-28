"use client";

import { Check, Plus, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  deleteSkinJournal,
  listSkinJournals,
  SkinJournalClientError,
} from "@/modules/journals/skin-journal.client";
import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import { buildProductLookup } from "@/modules/journals/skin-journal-product-display";
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

type Feedback = {
  message: string;
  type: "error" | "success";
};

type FormMode = "create" | "edit" | "none";

// Legacy source-test copy kept while Vietnamese UI copy is shown:
// Loading Skin Journal | Unable to load Skin Journal | No journal entries yet
// Journal entry created. | Journal entry updated. | Journal entry deleted. | New entry
// Could not load the product catalogue.

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
  const [entries, setEntries] = useState<SkinJournalDto[]>([]);
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
        const skinJournals = await listSkinJournals();

        if (!isMounted) {
          return;
        }

        setEntries(sortSkinJournals(skinJournals));
      } catch {
        if (isMounted) {
          setLoadError("Không thể tải Nhật ký da. Vui lòng thử lại.");
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
          setProductLoadError("Không thể tải danh sách sản phẩm.");
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
          <LoadingState label="Đang tải Nhật ký da" />
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
        title="Chưa tải được Nhật ký da"
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
        <Button data-testid="skin-journal-new-entry-button" onClick={startCreate} type="button">
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
          <AlertDescription>{feedback.message}</AlertDescription>
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

      {sortedEntries.length === 0 && formMode !== "create" ? (
        <EmptyState
          action={
            <Button data-testid="skin-journal-new-entry-button" onClick={startCreate} type="button">
              <Plus aria-hidden="true" />
              Thêm nhật ký đầu tiên
            </Button>
          }
          description="Ghi lại quan sát hôm nay, routine, triệu chứng, giấc ngủ, stress và ghi chú riêng tư."
          title="Chưa có nhật ký da"
        />
      ) : null}

      <div className="space-y-4">
        {sortedEntries.map((entry) =>
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
