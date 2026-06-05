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
    if (error.code === "UNAUTHORIZED" || error.status === 401) {
      return "Bạn cần đăng nhập để xem sản phẩm đã lưu.";
    }

    return "Không thể tải sản phẩm đã lưu. Vui lòng thử lại hoặc làm mới trang.";
  }

  return "Không thể tải sản phẩm đã lưu. Vui lòng thử lại hoặc làm mới trang.";
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
            Thử lại
          </Button>
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
          <Button asChild aria-label="Xem sản phẩm">
            <Link href={routes.PRODUCTS}>Xem sản phẩm</Link>
          </Button>
        }
        description="Hãy khám phá danh mục sản phẩm và lưu những sản phẩm bạn muốn xem lại hoặc so sánh sau."
        title="Chưa có sản phẩm đã lưu"
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
