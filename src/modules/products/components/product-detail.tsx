"use client";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Info,
  ListChecks,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getProduct,
  ProductClientError,
} from "@/modules/products/product.client";
import {
  buildProductDetailDecisionSupport,
  type ProductDetailDecisionSupport,
} from "@/modules/products/product-detail-decision-support";
import type { ProductDto } from "@/modules/products/product.dto";
import type {
  ProductCategory,
  ProductPriceRange,
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
import { routes } from "@/shared/constants/routes";

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
            savedProducts.some(
              (savedProduct) => savedProduct.productId === productId,
            ),
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
        action={<ProductsLinkButton label="Xem tất cả sản phẩm" />}
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
            <ProductsLinkButton label="Xem tất cả sản phẩm" />
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
        action={<ProductsLinkButton label="Xem tất cả sản phẩm" />}
        description="Hãy quay lại catalogue và mở lại sản phẩm."
        title="Không tìm thấy sản phẩm"
      />
    );
  }

  const decisionSupport = buildProductDetailDecisionSupport(product);

  return (
    <article className="space-y-5">
      <ProductHero
        decisionSupport={decisionSupport}
        isSaved={isSaved}
        onSavedChange={setIsSaved}
        product={product}
      />

      <Alert>
        <Info aria-hidden="true" />
        <AlertTitle>Thông tin tham khảo</AlertTitle>
        <AlertDescription>
          Nội dung dưới đây dựa trên dữ liệu sản phẩm hiện có, giúp bạn cân nhắc
          trước khi thêm sản phẩm mới vào routine. Thông tin này không thay thế
          tư vấn y tế.
        </AlertDescription>
      </Alert>

      {savedStateError ? (
        <Alert variant="destructive">
          <AlertTriangle aria-hidden="true" />
          <AlertTitle>Chưa tải được trạng thái đã lưu</AlertTitle>
          <AlertDescription>
            {savedStateError} Bạn vẫn có thể xem chi tiết sản phẩm.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)]">
        <div className="space-y-5">
          <OverviewSection overview={decisionSupport.overview} />
          <SuitableForSection decisionSupport={decisionSupport} />
          <IngredientSection
            decisionSupport={decisionSupport}
            ingredientsText={product.ingredientsText}
          />
        </div>
        <div className="space-y-5">
          <CautionSection cautions={decisionSupport.cautions} />
          <RoutineUsageSection tips={decisionSupport.routineUsageTips} />
          <DataQualitySection notes={decisionSupport.dataQualityNotes} />
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <SavedProductToggleButton
            initialSaved={isSaved}
            key={`${product.id}-${isSaved ? "saved" : "unsaved"}-footer`}
            mode="full"
            onChange={setIsSaved}
            productId={product.id}
          />
          <ProductMatchLinkButton />
          <ProductsLinkButton label="Xem tất cả sản phẩm" />
        </CardContent>
      </Card>
    </article>
  );
}

type ProductHeroProps = {
  decisionSupport: ProductDetailDecisionSupport;
  isSaved: boolean;
  onSavedChange: (isSaved: boolean) => void;
  product: ProductDto;
};

function ProductHero({
  decisionSupport,
  isSaved,
  onSavedChange,
  product,
}: ProductHeroProps) {
  return (
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
            <ProductsLinkButton label="Xem tất cả sản phẩm" />
            <ProductMatchLinkButton />
            <SavedProductToggleButton
              initialSaved={isSaved}
              key={`${product.id}-${isSaved ? "saved" : "unsaved"}-hero`}
              mode="full"
              onChange={onSavedChange}
              productId={product.id}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          {decisionSupport.overview}
        </p>
        <p className="text-xs text-muted-foreground">
          Product ID: {product.id} · Updated {formatUpdatedAt(product.updatedAt)}
        </p>
      </CardContent>
    </Card>
  );
}

function OverviewSection({ overview }: { overview: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tổng quan sản phẩm</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{overview}</p>
      </CardContent>
    </Card>
  );
}

function SuitableForSection({
  decisionSupport,
}: {
  decisionSupport: ProductDetailDecisionSupport;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Phù hợp với</CardTitle>
      </CardHeader>
      <CardContent>
        {decisionSupport.suitableFor.length > 0 ? (
          <BadgeList values={decisionSupport.suitableFor} />
        ) : (
          <NoteText>
            Dữ liệu về loại da hoặc mối quan tâm của sản phẩm chưa đầy đủ.
          </NoteText>
        )}
      </CardContent>
    </Card>
  );
}

function IngredientSection({
  decisionSupport,
  ingredientsText,
}: {
  decisionSupport: ProductDetailDecisionSupport;
  ingredientsText: string;
}) {
  const hasIngredientsText = ingredientsText.trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thành phần / hoạt chất nổi bật</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Các thành phần dưới đây được hiển thị từ dữ liệu sản phẩm hiện có. Bạn
          vẫn nên kiểm tra nhãn sản phẩm thực tế trước khi sử dụng.
        </p>
        {decisionSupport.ingredientHighlights.length > 0 ? (
          <BadgeList
            values={decisionSupport.ingredientHighlights}
            variant="secondary"
          />
        ) : (
          <NoteText>
            Dữ liệu thành phần chưa đầy đủ. Bạn nên kiểm tra bảng thành phần
            trên bao bì hoặc website chính thức của sản phẩm.
          </NoteText>
        )}
        {hasIngredientsText ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Bảng thành phần
            </h3>
            <p className="max-h-32 overflow-auto rounded-2xl bg-secondary p-3 text-sm leading-6 text-muted-foreground">
              {ingredientsText}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function CautionSection({ cautions }: { cautions: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cần lưu ý</CardTitle>
      </CardHeader>
      <CardContent>
        <IconTextList items={cautions} tone="caution" />
      </CardContent>
    </Card>
  );
}

function RoutineUsageSection({ tips }: { tips: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gợi ý dùng trong routine</CardTitle>
      </CardHeader>
      <CardContent>
        <IconTextList items={tips} tone="routine" />
      </CardContent>
    </Card>
  );
}

function DataQualitySection({ notes }: { notes: string[] }) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ghi chú dữ liệu</CardTitle>
      </CardHeader>
      <CardContent>
        <IconTextList items={notes} tone="info" />
      </CardContent>
    </Card>
  );
}

function ProductMatchLinkButton() {
  return (
    <Button asChild variant="outline">
      <Link href={routes.PRODUCT_MATCH}>Quay lại Product Match</Link>
    </Button>
  );
}

function ProductsLinkButton({ label }: { label: string }) {
  return (
    <Button asChild aria-label={label} variant="outline">
      <Link href={routes.PRODUCTS}>
        <ArrowLeft aria-hidden="true" />
        {label}
      </Link>
    </Button>
  );
}

type BadgeListProps = {
  values: string[];
  variant?: "outline" | "secondary";
};

function BadgeList({ values, variant = "outline" }: BadgeListProps) {
  if (values.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <Badge key={value} variant={variant}>
          {value}
        </Badge>
      ))}
    </div>
  );
}

type IconTextListProps = {
  items: string[];
  tone: "caution" | "info" | "routine";
};

function IconTextList({ items, tone }: IconTextListProps) {
  if (items.length === 0) {
    return null;
  }

  const Icon =
    tone === "caution" ? AlertTriangle : tone === "routine" ? ListChecks : Info;
  const iconClassName =
    tone === "caution"
      ? "text-amber-700"
      : tone === "routine"
        ? "text-primary"
        : "text-muted-foreground";

  return (
    <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
      {items.map((item) => (
        <li className="flex gap-2" key={item}>
          <Icon
            aria-hidden="true"
            className={`mt-1 size-4 shrink-0 ${iconClassName}`}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function NoteText({ children }: { children: string }) {
  return (
    <p className="flex gap-2 text-sm leading-6 text-muted-foreground">
      <CheckCircle2
        aria-hidden="true"
        className="mt-1 size-4 shrink-0 text-muted-foreground"
      />
      <span>{children}</span>
    </p>
  );
}
