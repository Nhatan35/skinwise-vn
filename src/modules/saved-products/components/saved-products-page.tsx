"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { SavedProductCard } from "@/modules/saved-products/components/saved-product-card";
import { SavedProductsComparisonPanel } from "@/modules/saved-products/components/saved-products-comparison-panel";
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

export function SavedProductsPage() {
  const [items, setItems] = useState<SavedProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    () => new Set(),
  );

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

  const selectedItems = items.filter((item) =>
    selectedProductIds.has(item.productId),
  );
  const canShowComparison = selectedItems.length >= 2;
  const hasReachedComparisonLimit = selectedProductIds.size >= 3;

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
              sản phẩm không có nghĩa là sản phẩm chắc chắn phù hợp với mọi routine.
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

      {canShowComparison ? (
        <SavedProductsComparisonPanel
          items={selectedItems}
          onClear={handleClearComparison}
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const isSelectedForComparison = selectedProductIds.has(
            item.productId,
          );

          return (
            <SavedProductCard
              comparisonDisabled={
                hasReachedComparisonLimit && !isSelectedForComparison
              }
              isSelectedForComparison={isSelectedForComparison}
              item={item}
              key={item.id}
              onComparisonToggle={handleComparisonToggle}
              onRemoved={handleRemoved}
            />
          );
        })}
      </div>
    </div>
  );
}
