"use client";

import { useEffect, useState } from "react";

import { ProductMatchCard } from "@/modules/product-match/components/product-match-card";
import {
  ProductMatchNoProductsEmptyState,
  ProductMatchNoProfileEmptyState,
} from "@/modules/product-match/components/product-match-empty-state";
import { ProductMatchSummary } from "@/modules/product-match/components/product-match-summary";
import {
  getProductMatches,
  ProductMatchClientError,
} from "@/modules/product-match/product-match.client";
import type { ProductMatchResponseDto } from "@/modules/product-match/product-match.dto";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { Button } from "@/shared/components/ui/button";

export function ProductMatchPage() {
  const [productMatch, setProductMatch] =
    useState<ProductMatchResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function loadProductMatches() {
    setIsLoading(true);
    setLoadError(null);

    try {
      setProductMatch(await getProductMatches());
    } catch (error) {
      const message =
        error instanceof ProductMatchClientError
          ? error.message
          : "Không thể tải gợi ý sản phẩm.";

      setProductMatch(null);
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialProductMatches() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const nextProductMatch = await getProductMatches();

        if (isMounted) {
          setProductMatch(nextProductMatch);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof ProductMatchClientError
              ? error.message
              : "Không thể tải gợi ý sản phẩm.";

          setProductMatch(null);
          setLoadError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialProductMatches();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingState label="Đang tải gợi ý sản phẩm" />;
  }

  if (loadError) {
    return (
      <ErrorState
        action={
          <Button onClick={() => void loadProductMatches()} size="sm" variant="outline">
            Thử lại
          </Button>
        }
        description={loadError}
        title="Không thể tải gợi ý sản phẩm"
      />
    );
  }

  if (!productMatch) {
    return (
      <ErrorState
        description="Không thể tải gợi ý sản phẩm."
        title="Không thể tải gợi ý sản phẩm"
      />
    );
  }

  if (!productMatch.skinProfileExists) {
    return <ProductMatchNoProfileEmptyState />;
  }

  function handleSavedChange(productId: string, isSaved: boolean) {
    setProductMatch((currentProductMatch) => {
      if (!currentProductMatch) {
        return currentProductMatch;
      }

      return {
        ...currentProductMatch,
        items: currentProductMatch.items.map((item) =>
          item.product.id === productId ? { ...item, isSaved } : item,
        ),
      };
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm shadow-stone-950/5">
        <p className="text-sm font-semibold text-primary">
          Được tạo lúc{" "}
          {new Date(productMatch.generatedAt).toLocaleString("vi-VN")}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Gợi ý sản phẩm được tạo theo quy tắc cố định và chỉ mang tính tham
          khảo. Nên xem kỹ bảng thành phần, thử trên một vùng da nhỏ và thêm
          sản phẩm mới từ từ.
        </p>
      </div>

      <ProductMatchSummary productMatch={productMatch} />

      {productMatch.items.length === 0 ? (
        <ProductMatchNoProductsEmptyState />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {productMatch.items.map((item) => (
            <ProductMatchCard
              item={item}
              key={item.product.id}
              onSavedChange={handleSavedChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
