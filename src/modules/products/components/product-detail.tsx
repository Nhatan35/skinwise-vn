"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getProduct,
  ProductClientError,
} from "@/modules/products/product.client";
import type { ProductDto } from "@/modules/products/product.dto";
import type {
  ProductCategory,
  ProductConcern,
  ProductPriceRange,
  ProductSkinType,
  ProductVerificationStatus,
} from "@/modules/products/product.types";
import { SavedProductToggleButton } from "@/modules/saved-products/components/saved-product-toggle-button";
import {
  listSavedProducts,
  SavedProductClientError,
} from "@/modules/saved-products/saved-product.client";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type ProductDetailProps = {
  productId: string;
};

const categoryLabels: Record<ProductCategory, string> = {
  cleanser: "Sữa rửa mặt",
  moisturizer: "Dưỡng ẩm",
  sunscreen: "Chống nắng",
  treatment: "Treatment",
  toner: "Toner",
  serum: "Serum",
  mask: "Mặt nạ",
  other: "Khác",
};

const priceRangeLabels: Record<ProductPriceRange, string> = {
  budget: "Tiết kiệm",
  mid: "Tầm trung",
  premium: "Cao cấp",
  unknown: "Chưa rõ giá",
};

const skinTypeLabels: Record<ProductSkinType, string> = {
  oily: "Da dầu",
  dry: "Da khô",
  combination: "Da hỗn hợp",
  normal: "Da thường",
  sensitive: "Da nhạy cảm",
  unknown: "Chưa rõ",
};

const concernLabels: Record<ProductConcern, string> = {
  acne: "Mụn",
  oiliness: "Dầu thừa",
  dryness: "Khô căng",
  redness: "Đỏ da",
  dark_spots: "Thâm/đốm tối màu",
  texture: "Bề mặt da",
  barrier_support: "Hỗ trợ hàng rào da",
  unknown: "Chưa rõ",
};

const verificationLabels: Record<ProductVerificationStatus, string> = {
  reviewed: "Đã xem xét",
  unverified: "Chưa xác minh",
  verified: "Đã xác minh",
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function getLoadError(error: unknown) {
  if (error instanceof ProductClientError) {
    return {
      message: error.message,
      status: error.status,
    };
  }

  return {
    message: "Could not load the product details.",
    status: 500,
  };
}

function getSavedStateError(error: unknown) {
  if (error instanceof SavedProductClientError) {
    return error.message;
  }

  return "Could not load saved product state.";
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<{
    message: string;
    status: number;
  } | null>(null);
  const [savedStateError, setSavedStateError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadProductDetail() {
      setIsLoading(true);
      setLoadError(null);
      setProduct(null);
      setIsSaved(false);
      setSavedStateError(null);

      try {
        const loadedProduct = await getProduct(productId);

        if (!isMounted) {
          return;
        }

        setProduct(loadedProduct);
        setIsLoading(false);

        try {
          const savedProducts = await listSavedProducts();

          if (!isMounted) {
            return;
          }

          setIsSaved(
            savedProducts.some((savedProduct) => savedProduct.productId === productId),
          );
        } catch (error) {
          if (isMounted) {
            setSavedStateError(getSavedStateError(error));
          }
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(getLoadError(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProductDetail();

    return () => {
      isMounted = false;
    };
  }, [productId, reloadKey]);

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <LoadingState label="Đang tải thông tin sản phẩm" />
        </CardContent>
      </Card>
    );
  }

  if (loadError?.status === 404) {
    return (
      <EmptyState
        action={<BackToProductsButton />}
        description="Sản phẩm này có thể không còn khả dụng trong catalogue."
        title="Không tìm thấy sản phẩm"
      />
    );
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
            <BackToProductsButton />
          </div>
        }
        description={loadError.message}
        title="Không thể tải thông tin sản phẩm"
      />
    );
  }

  if (!product) {
    return (
      <EmptyState
        action={<BackToProductsButton />}
        description="Hãy quay lại catalogue và mở lại sản phẩm."
        title="Không tìm thấy sản phẩm"
      />
    );
  }

  const suitabilityVisible =
    product.skinTypes.length > 0 ||
    product.concerns.length > 0 ||
    product.suitableFor.length > 0 ||
    product.notRecommendedFor.length > 0;

  return (
    <article className="space-y-4">
      <Card>
        <CardHeader>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <p className="text-sm font-semibold text-primary">
                {product.brand || "SkinWise product"}
              </p>
              <CardTitle className="mt-2 text-3xl">{product.name}</CardTitle>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">{categoryLabels[product.category]}</Badge>
                <Badge variant="outline">{priceRangeLabels[product.priceRange]}</Badge>
                <Badge variant="secondary">
                  {verificationLabels[product.verificationStatus]}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
              <BackToProductsButton />
              <SavedProductToggleButton
                initialSaved={isSaved}
                key={`${product.id}-${isSaved ? "saved" : "unsaved"}`}
                mode="full"
                onChange={setIsSaved}
                productId={product.id}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Product ID: {product.id} · Updated {formatUpdatedAt(product.updatedAt)}
          </p>
        </CardContent>
      </Card>

      <Alert>
        <AlertTitle>Educational product details</AlertTitle>
        <AlertDescription>
          Thông tin sản phẩm phục vụ lập routine và giáo dục về thành phần. Nội
          dung này không phải chẩn đoán, điều trị hoặc lời khuyên y tế.
        </AlertDescription>
      </Alert>

      {savedStateError ? (
        <Alert variant="destructive">
          <AlertTitle>Chưa tải được trạng thái đã lưu</AlertTitle>
          <AlertDescription>
            {savedStateError} Bạn vẫn có thể xem chi tiết sản phẩm.
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Product information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <DetailField label="Danh mục" value={categoryLabels[product.category]} />
          <DetailField label="Mức giá" value={priceRangeLabels[product.priceRange]} />
          <DetailField
            label="Trạng thái xem xét"
            value={verificationLabels[product.verificationStatus]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Bảng thành phần
            </h3>
            <p className="text-sm leading-6 text-muted-foreground">
              {product.ingredientsText}
            </p>
          </div>
          <BadgeGroup
            label="Hoạt chất chính"
            values={product.keyActives}
            variant="secondary"
          />
        </CardContent>
      </Card>

      {suitabilityVisible ? (
        <Card>
          <CardHeader>
            <CardTitle>Có thể phù hợp / cần xem lại</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <BadgeGroup
              label="Loại da"
              values={product.skinTypes.map((skinType) => skinTypeLabels[skinType])}
            />
            <BadgeGroup
              label="Mối quan tâm"
              values={product.concerns.map((concern) => concernLabels[concern])}
            />
            <TextList label="Có thể phù hợp" values={product.suitableFor} />
            <TextList
              label="Không khuyến nghị cho"
              values={product.notRecommendedFor}
            />
          </CardContent>
        </Card>
      ) : null}

      {product.warnings.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Cần xem lại</CardTitle>
          </CardHeader>
          <CardContent>
            <TextList label="Ghi chú thận trọng" values={product.warnings} />
          </CardContent>
        </Card>
      ) : null}

      {product.tags.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <BadgeGroup label="Tags" values={product.tags} />
          </CardContent>
        </Card>
      ) : null}
    </article>
  );
}

function BackToProductsButton() {
  return (
    <Button asChild aria-label="Quay lại sản phẩm" variant="outline">
      <Link href="/products">
        <ArrowLeft aria-hidden="true" />
        Quay lại sản phẩm
      </Link>
    </Button>
  );
}

type DetailFieldProps = {
  label: string;
  value: string;
};

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="rounded-2xl bg-secondary p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

type BadgeGroupProps = {
  label: string;
  values: string[];
  variant?: "outline" | "secondary";
};

function BadgeGroup({ label, values, variant = "outline" }: BadgeGroupProps) {
  if (values.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <Badge key={value} variant={variant}>
            {value}
          </Badge>
        ))}
      </div>
    </div>
  );
}

type TextListProps = {
  label: string;
  values: string[];
};

function TextList({ label, values }: TextListProps) {
  if (values.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">{label}</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
        {values.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </div>
  );
}
