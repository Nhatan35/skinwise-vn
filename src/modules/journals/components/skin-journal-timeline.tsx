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

  return "Unable to delete this journal entry. Please try again.";
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
          setLoadError("Unable to load Skin Journal. Please try again.");
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
          setProductLoadError("Could not load the product catalogue.");
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
          ? "Journal entry created."
          : "Journal entry updated.",
      type: "success",
    });
  }

  async function handleDelete(entry: SkinJournalDto) {
    if (deletingEntryId !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Delete journal entry for ${entry.localDate}?`,
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
        message: "Journal entry deleted.",
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
      <Card className="border-stone-200 bg-white">
        <CardContent>
          <LoadingState label="Loading Skin Journal" />
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
            Retry
          </Button>
        }
        description={loadError}
        title="Skin Journal could not load"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-stone-950">
            Journal timeline
          </h3>
          <p className="mt-1 text-sm text-stone-600">
            Entries are sorted by local date, newest first.
          </p>
        </div>
        <Button onClick={startCreate} type="button">
          <Plus aria-hidden="true" />
          New entry
        </Button>
      </div>

      {feedback ? (
        <Alert variant={feedback.type === "error" ? "destructive" : "default"}>
          {feedback.type === "success" ? <Check aria-hidden="true" /> : null}
          <AlertTitle>
            {feedback.type === "success" ? "Saved" : "Action failed"}
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
          <AlertTitle>Product catalogue unavailable</AlertTitle>
          <AlertDescription>{productLoadError}</AlertDescription>
        </Alert>
      ) : null}

      {sortedEntries.length === 0 && formMode !== "create" ? (
        <EmptyState
          action={
            <Button onClick={startCreate} type="button">
              <Plus aria-hidden="true" />
              Create first entry
            </Button>
          }
          description="Track today's observations, routine context, symptoms, sleep, stress, and notes."
          title="No journal entries yet"
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
