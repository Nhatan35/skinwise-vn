"use client";

import { RefreshCcw, Search, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import {
  AdminProductClientError,
  listAdminProducts,
  updateAdminProductVerificationStatus,
  type AdminProductListClientInput,
} from "@/modules/products/admin-product.client";
import type { ProductDto } from "@/modules/products/product.dto";
import {
  PRODUCT_VERIFICATION_STATUSES,
  type ProductVerificationStatus,
} from "@/modules/products/product.types";
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

type ProductReviewFilterState = {
  q: string;
  verificationStatus: ProductVerificationStatus | "";
};

type FeedbackState = {
  message: string;
  type: "error" | "success";
};

const initialFilters: ProductReviewFilterState = {
  q: "",
  verificationStatus: "",
};

export const adminProductVerificationStatusLabels: Record<
  ProductVerificationStatus,
  string
> = {
  unverified: "Pending review",
  reviewed: "Reviewed",
  verified: "Verified",
};

const statusVisibilityCopy: Record<ProductVerificationStatus, string> = {
  unverified: "Hidden from public catalogue",
  reviewed: "Visible in public catalogue",
  verified: "Visible in public catalogue",
};

function toClientInput(
  filters: ProductReviewFilterState,
): AdminProductListClientInput {
  const q = filters.q.trim();

  return {
    ...(q ? { q } : {}),
    ...(filters.verificationStatus
      ? { verificationStatus: filters.verificationStatus }
      : {}),
  };
}

function hasActiveFilters(filters: ProductReviewFilterState) {
  return Boolean(filters.q.trim() || filters.verificationStatus);
}

function isUnauthorizedError(error: unknown) {
  return (
    error instanceof AdminProductClientError &&
    (error.status === 401 ||
      error.status === 403 ||
      error.code === "UNAUTHORIZED" ||
      error.code === "FORBIDDEN")
  );
}

function getUnauthorizedMessage(error: AdminProductClientError) {
  if (error.status === 401 || error.code === "UNAUTHORIZED") {
    return "You must be signed in with an admin account to review products.";
  }

  return "This page is available only to SkinWise admin users. Product review data is not shown for this account.";
}

function getLoadErrorMessage(error: unknown) {
  if (error instanceof AdminProductClientError) {
    return "Could not load admin products. Please retry or refresh the page.";
  }

  return "Could not load admin products. Please retry or refresh the page.";
}

function getUpdateErrorMessage(error: unknown) {
  if (error instanceof AdminProductClientError) {
    if (error.status === 401 || error.code === "UNAUTHORIZED") {
      return "You must be signed in with an admin account before changing product status.";
    }

    if (error.status === 403 || error.code === "FORBIDDEN") {
      return "Only admin users can change product review status.";
    }

    if (error.status === 404 || error.code === "NOT_FOUND") {
      return "The product could not be found. Refresh the review list and try again.";
    }
  }

  return "Could not update product verification status. Please retry.";
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function AdminProductReview() {
  const [draftFilters, setDraftFilters] =
    useState<ProductReviewFilterState>(initialFilters);
  const [activeFilters, setActiveFilters] =
    useState<ProductReviewFilterState>(initialFilters);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [unauthorizedMessage, setUnauthorizedMessage] = useState<string | null>(
    null,
  );
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null,
  );
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadReviewProducts() {
      setIsLoading(true);
      setLoadError(null);
      setUnauthorizedMessage(null);
      setFeedback(null);

      try {
        const items = await listAdminProducts(toClientInput(activeFilters));

        if (!isMounted) {
          return;
        }

        setProducts(items);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setProducts([]);

        if (isUnauthorizedError(error)) {
          setUnauthorizedMessage(
            getUnauthorizedMessage(error as AdminProductClientError),
          );
          return;
        }

        setLoadError(getLoadErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadReviewProducts();

    return () => {
      isMounted = false;
    };
  }, [activeFilters, reloadKey]);

  function updateFilter<Field extends keyof ProductReviewFilterState>(
    field: Field,
    value: ProductReviewFilterState[Field],
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

  async function handleStatusChange(
    product: ProductDto,
    verificationStatus: ProductVerificationStatus,
  ) {
    if (product.verificationStatus === verificationStatus) {
      return;
    }

    setUpdatingProductId(product.id);
    setFeedback(null);

    try {
      const updatedProduct = await updateAdminProductVerificationStatus(
        product.id,
        verificationStatus,
      );

      setProducts((current) =>
        current.map((item) =>
          item.id === updatedProduct.id ? updatedProduct : item,
        ),
      );
      setFeedback({
        message: `${updatedProduct.name} is now ${
          adminProductVerificationStatusLabels[
            updatedProduct.verificationStatus
          ]
        }.`,
        type: "success",
      });
    } catch (error) {
      setFeedback({
        message: getUpdateErrorMessage(error),
        type: "error",
      });
    } finally {
      setUpdatingProductId(null);
    }
  }

  const activeFilterCount = products.length;
  const hasFilters = hasActiveFilters(activeFilters);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-1">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_16rem]">
              <div className="space-y-2">
                <Label htmlFor="admin-product-search">Search products</Label>
                <Input
                  id="admin-product-search"
                  onChange={(event) => updateFilter("q", event.target.value)}
                  placeholder="Name, brand, ingredient, active, or tag"
                  value={draftFilters.q}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-product-status-filter">
                  Verification status
                </Label>
                <Select
                  onValueChange={(value) =>
                    updateFilter(
                      "verificationStatus",
                      value === ALL_FILTER_VALUE
                        ? ""
                        : (value as ProductVerificationStatus),
                    )
                  }
                  value={draftFilters.verificationStatus || ALL_FILTER_VALUE}
                >
                  <SelectTrigger
                    className="min-h-11 w-full rounded-xl bg-card"
                    id="admin-product-status-filter"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_FILTER_VALUE}>
                      All statuses
                    </SelectItem>
                    {PRODUCT_VERIFICATION_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {adminProductVerificationStatusLabels[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                aria-label="Clear admin product filters"
                onClick={handleClearFilters}
                type="button"
                variant="outline"
              >
                <X aria-hidden="true" />
                Clear filters
              </Button>
              <Button aria-label="Search admin products" type="submit">
                <Search aria-hidden="true" />
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Alert>
        <AlertTitle>Review boundary</AlertTitle>
        <AlertDescription>
          This page changes only product verificationStatus. Public product
          visibility remains based on reviewed or verified status.
        </AlertDescription>
      </Alert>

      {feedback ? (
        <Alert
          role={feedback.type === "success" ? "status" : "alert"}
          variant={feedback.type === "error" ? "destructive" : "default"}
        >
          <AlertTitle>
            {feedback.type === "success" ? "Status updated" : "Update failed"}
          </AlertTitle>
          <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
      ) : null}

      {unauthorizedMessage ? (
        <AdminProductUnauthorizedState description={unauthorizedMessage} />
      ) : null}

      {loadError ? (
        <ErrorState
          action={
            <Button
              onClick={() => setReloadKey((current) => current + 1)}
              type="button"
            >
              <RefreshCcw aria-hidden="true" />
              Retry
            </Button>
          }
          description={loadError}
          title="Could not load admin products"
        />
      ) : null}

      {isLoading ? (
        <Card>
          <CardContent>
            <LoadingState label="Loading admin product review queue..." />
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !loadError && !unauthorizedMessage ? (
        <p className="text-sm text-muted-foreground" role="status">
          {hasFilters
            ? `Showing ${activeFilterCount} products matching the current review filters.`
            : `Showing ${activeFilterCount} products across all verification statuses.`}
        </p>
      ) : null}

      {!isLoading &&
      !loadError &&
      !unauthorizedMessage &&
      products.length === 0 ? (
        <EmptyState
          action={
            hasFilters ? (
              <Button
                onClick={handleClearFilters}
                type="button"
                variant="outline"
              >
                Clear filters
              </Button>
            ) : null
          }
          description={
            hasFilters
              ? "No products match the current admin review filters. Clear the search or status filter and try again."
              : "There are no products available for admin review yet."
          }
          title={
            hasFilters
              ? "No products match this review filter"
              : "No products to review"
          }
        />
      ) : null}

      {!isLoading &&
      !loadError &&
      !unauthorizedMessage &&
      products.length > 0 ? (
        <div className="space-y-3" data-testid="admin-product-review-list">
          {products.map((product) => (
            <AdminProductReviewRow
              isUpdating={updatingProductId === product.id}
              key={product.id}
              onStatusChange={(verificationStatus) =>
                void handleStatusChange(product, verificationStatus)
              }
              product={product}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

type AdminProductReviewRowProps = {
  isUpdating: boolean;
  onStatusChange: (verificationStatus: ProductVerificationStatus) => void;
  product: ProductDto;
};

function AdminProductReviewRow({
  isUpdating,
  onStatusChange,
  product,
}: AdminProductReviewRowProps) {
  return (
    <article
      className="rounded-2xl border border-border bg-card p-4 shadow-sm shadow-stone-950/5"
      data-testid="admin-product-review-row"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{product.category}</Badge>
            <Badge variant="outline">{product.priceRange}</Badge>
            <Badge>
              {adminProductVerificationStatusLabels[product.verificationStatus]}
            </Badge>
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {product.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.brand || "No brand recorded"}
            </p>
          </div>

          {product.keyActives.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {product.keyActives.slice(0, 4).map((active) => (
                <Badge key={active} variant="outline">
                  {active}
                </Badge>
              ))}
            </div>
          ) : null}

          <p className="text-xs text-muted-foreground">
            Updated {formatUpdatedAt(product.updatedAt)}
          </p>
        </div>

        <div className="space-y-2 rounded-xl border border-border bg-background p-3">
          <Label htmlFor={`admin-product-status-${product.id}`}>
            Verification status
          </Label>
          <Select
            disabled={isUpdating}
            onValueChange={(value) =>
              onStatusChange(value as ProductVerificationStatus)
            }
            value={product.verificationStatus}
          >
            <SelectTrigger
              className="min-h-11 w-full rounded-xl bg-card"
              id={`admin-product-status-${product.id}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_VERIFICATION_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {adminProductVerificationStatusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {statusVisibilityCopy[product.verificationStatus]}
          </p>
          {isUpdating ? (
            <p className="text-xs font-medium text-primary" role="status">
              Updating status...
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function AdminProductUnauthorizedState({
  description,
}: {
  description: string;
}) {
  return <ErrorState description={description} title="Admin access required" />;
}
