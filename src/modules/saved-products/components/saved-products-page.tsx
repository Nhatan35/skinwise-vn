"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { SavedProductCard } from "@/modules/saved-products/components/saved-product-card";
import {
  listSavedProducts,
  SavedProductClientError,
} from "@/modules/saved-products/saved-product.client";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import { routes } from "@/shared/constants/routes";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

function getLoadErrorMessage(error: unknown) {
  if (error instanceof SavedProductClientError) {
    return error.message;
  }

  return "Could not load saved products.";
}

export function SavedProductsPage() {
  const [items, setItems] = useState<SavedProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

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
      } catch (error) {
        if (isMounted) {
          setItems([]);
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

  function handleRemoved(productId: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
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
        title="Saved products could not load"
      />
    );
  }

  if (isLoading) {
    return (
      <Card className="border-stone-200 bg-white">
        <CardContent>
          <LoadingState label="Loading saved products" />
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        action={
          <Button asChild>
            <Link href={routes.PRODUCTS}>Browse products</Link>
          </Button>
        }
        description="Save products from the catalogue or detail pages, then return here to revisit them."
        title="No saved products yet"
      />
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {items.map((item) => (
        <SavedProductCard
          item={item}
          key={item.id}
          onRemoved={handleRemoved}
        />
      ))}
    </div>
  );
}
