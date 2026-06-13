"use client";

import Link from "next/link";
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
import { routes } from "@/shared/constants/routes";

function getProductMatchLoadErrorMessage(error: unknown) {
  if (error instanceof ProductMatchClientError) {
    if (error.code === "UNAUTHORIZED" || error.status === 401) {
      return "Bạn cần đăng nhập để dùng Product Match.";
    }
  }

  return "Không thể chuẩn bị Product Match. Vui lòng kiểm tra hồ sơ da hoặc thử lại sau.";
}

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
      setProductMatch(null);
      setLoadError(getProductMatchLoadErrorMessage(error));
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
          setProductMatch(null);
          setLoadError(getProductMatchLoadErrorMessage(error));
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
    return <LoadingState label="Đang chuẩn bị Product Match..." />;
  }

  if (loadError) {
    return (
      <ErrorState
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => void loadProductMatches()} size="sm" variant="outline">
              Thử lại
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={routes.SKIN_PROFILE}>Cập nhật hồ sơ da</Link>
            </Button>
          </div>
        }
        description={loadError}
        title="Không thể chuẩn bị Product Match"
      />
    );
  }

  if (!productMatch) {
    return (
      <ErrorState
        description="Không thể chuẩn bị Product Match. Vui lòng kiểm tra hồ sơ da hoặc thử lại sau."
        title="Không thể chuẩn bị Product Match"
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
        <p className="mt-3 text-sm font-semibold text-foreground">
          Kết quả này có ý nghĩa gì?
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Điểm phù hợp là tín hiệu tương thích MVP dựa trên hồ sơ da đã lưu và
          thông tin sản phẩm hiện có. Điểm cao hơn nghĩa là sản phẩm có nhiều
          yếu tố khớp hơn với loại da, mối quan tâm, ngân sách hoặc danh sách
          thành phần muốn tránh; đây là dữ liệu để cân nhắc, không phải kết
          luận chuyên môn.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Hãy xem lý do phù hợp, lưu ý cần kiểm tra, bảng thành phần và thử
          trên một vùng da nhỏ trước khi dùng thường xuyên.
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
