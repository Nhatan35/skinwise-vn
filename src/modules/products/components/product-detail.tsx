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

import { ProductMatchExplanationCard } from "@/modules/product-match/components/product-match-explanation-card";
import {
  getProductMatchForProduct,
  ProductMatchClientError,
} from "@/modules/product-match/product-match.client";
import type { ProductDetailMatchResponseDto } from "@/modules/product-match/product-match.dto";
import {
  getProduct,
  ProductClientError,
} from "@/modules/products/product.client";
import {
  buildProductDetailDecisionSupport,
  type ProductDetailDecisionSupport,
} from "@/modules/products/product-detail-decision-support";
import {
  ProductDetailSavedDecisionShortcut,
  type ProductDetailSavedDecisionState,
} from "@/modules/products/components/product-detail-saved-decision-shortcut";
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
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
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
  treatment: "Sản phẩm hoạt chất",
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
      message:
        "Không thể tải thông tin sản phẩm này. Vui lòng quay lại danh mục sản phẩm hoặc thử lại sau.",
      status: error.status,
    };
  }

  return {
    message:
      "Không thể tải thông tin sản phẩm này. Vui lòng quay lại danh mục sản phẩm hoặc thử lại sau.",
    status: 500,
  };
}

function getSavedDecisionState(
  error: unknown,
): Exclude<ProductDetailSavedDecisionState, "loading" | "ready"> {
  if (error instanceof SavedProductClientError) {
    if (error.code === "UNAUTHORIZED" || error.status === 401) {
      return "signed-out";
    }
  }

  return "error";
}

function getProductMatchError(error: unknown) {
  if (error instanceof ProductMatchClientError) {
    return error.message;
  }

  return "Không thể tải giải thích phù hợp cá nhân hóa.";
}

function getIngredientSearchHref(ingredientName: string) {
  return `${routes.INGREDIENTS}?q=${encodeURIComponent(ingredientName)}`;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [productMatch, setProductMatch] =
    useState<ProductDetailMatchResponseDto | null>(null);
  const [savedProduct, setSavedProduct] = useState<SavedProductDto | null>(
    null,
  );
  const [savedDecisionState, setSavedDecisionState] =
    useState<ProductDetailSavedDecisionState>("loading");
  const [isSaveActionPending, setIsSaveActionPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductMatchLoading, setIsProductMatchLoading] = useState(false);
  const [loadError, setLoadError] = useState<{
    message: string;
    status: number;
  } | null>(null);
  const [productMatchError, setProductMatchError] = useState<string | null>(
    null,
  );
  const [reloadKey, setReloadKey] = useState(0);
  const isSaved = savedProduct !== null;

  async function loadPersonalizedMatch() {
    setIsProductMatchLoading(true);
    setProductMatchError(null);

    try {
      setProductMatch(await getProductMatchForProduct(productId));
    } catch (error) {
      setProductMatch(null);
      setProductMatchError(getProductMatchError(error));
    } finally {
      setIsProductMatchLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadProductDetail() {
      setIsLoading(true);
      setLoadError(null);
      setProduct(null);
      setProductMatch(null);
      setSavedProduct(null);
      setSavedDecisionState("loading");
      setIsSaveActionPending(false);
      setProductMatchError(null);
      setIsProductMatchLoading(false);

      try {
        const loadedProduct = await getProduct(productId);

        if (!isMounted) {
          return;
        }

        setProduct(loadedProduct);
        setIsLoading(false);
        setIsProductMatchLoading(true);

        const [savedProductsResult, productMatchResult] =
          await Promise.allSettled([
            listSavedProducts(),
            getProductMatchForProduct(productId),
          ]);

        if (!isMounted) {
          return;
        }

        if (savedProductsResult.status === "fulfilled") {
          setSavedProduct(
            savedProductsResult.value.find(
              (item) => item.productId === productId,
            ) ?? null,
          );
          setSavedDecisionState("ready");
        } else {
          setSavedDecisionState(
            getSavedDecisionState(savedProductsResult.reason),
          );
        }

        if (productMatchResult.status === "fulfilled") {
          setProductMatch(productMatchResult.value);
        } else {
          setProductMatchError(getProductMatchError(productMatchResult.reason));
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(getLoadError(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsProductMatchLoading(false);
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
          <LoadingState label="Đang tải thông tin sản phẩm..." />
        </CardContent>
      </Card>
    );
  }

  if (loadError?.status === 404) {
    return (
      <EmptyState
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <ProductsLinkButton label="Xem sản phẩm" />
            <ProductMatchLinkButton />
          </div>
        }
        description="Sản phẩm này có thể không còn khả dụng trong danh mục. Hãy quay lại danh mục để chọn sản phẩm khác."
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
            <ProductsLinkButton label="Xem sản phẩm" />
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
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <ProductsLinkButton label="Xem sản phẩm" />
            <ProductMatchLinkButton />
          </div>
        }
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
        isSaveActionPending={isSaveActionPending}
        onSavedProductChange={(item) => {
          setSavedProduct(item);
          setSavedDecisionState("ready");
        }}
        onSaveActionPendingChange={setIsSaveActionPending}
        product={product}
      />

      <Alert>
        <Info aria-hidden="true" />
        <AlertTitle>Thông tin tham khảo</AlertTitle>
        <AlertDescription>
          Nội dung dưới đây dựa trên dữ liệu sản phẩm hiện có, giúp bạn cân nhắc
          trước khi thêm sản phẩm mới vào routine. Thông tin này không thay thế
          tư vấn chuyên môn.
        </AlertDescription>
      </Alert>

      <ProductDetailPersonalizedMatchSection
        errorMessage={productMatchError}
        isLoading={isProductMatchLoading}
        onRetry={() => void loadPersonalizedMatch()}
        productMatch={productMatch}
      />

      <ProductDetailSavedDecisionShortcut
        item={savedProduct}
        onUpdated={setSavedProduct}
        state={savedDecisionState}
      />

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

      <SaveDecisionSupportSection isSaved={isSaved} />

      <Card>
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <SavedProductToggleButton
            disabled={isSaveActionPending}
            initialSaved={isSaved}
            mode="full"
            onPendingChange={setIsSaveActionPending}
            onSavedProductChange={(item) => {
              setSavedProduct(item);
              setSavedDecisionState("ready");
            }}
            productId={product.id}
            productName={product.name}
          />
          <ProductMatchLinkButton />
          <ProductsLinkButton label="Xem sản phẩm" />
        </CardContent>
      </Card>
    </article>
  );
}

type ProductHeroProps = {
  decisionSupport: ProductDetailDecisionSupport;
  isSaved: boolean;
  isSaveActionPending: boolean;
  onSavedProductChange: (item: SavedProductDto | null) => void;
  onSaveActionPendingChange: (isPending: boolean) => void;
  product: ProductDto;
};

function ProductHero({
  decisionSupport,
  isSaved,
  isSaveActionPending,
  onSavedProductChange,
  onSaveActionPendingChange,
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
            <ProductsLinkButton label="Xem sản phẩm" />
            <ProductMatchLinkButton />
            <SavedProductToggleButton
              disabled={isSaveActionPending}
              initialSaved={isSaved}
              mode="full"
              onPendingChange={onSaveActionPendingChange}
              onSavedProductChange={onSavedProductChange}
              productId={product.id}
              productName={product.name}
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

function ProductDetailPersonalizedMatchSection({
  errorMessage,
  isLoading,
  onRetry,
  productMatch,
}: {
  errorMessage: string | null;
  isLoading: boolean;
  onRetry: () => void;
  productMatch: ProductDetailMatchResponseDto | null;
}) {
  const headingId = "product-detail-personalized-match";

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <LoadingState label="Đang tải giải thích phù hợp cá nhân hóa..." />
        </CardContent>
      </Card>
    );
  }

  if (errorMessage) {
    return (
      <Alert>
        <AlertTriangle aria-hidden="true" />
        <AlertTitle>Chưa tải được giải thích cá nhân hóa</AlertTitle>
        <AlertDescription className="space-y-3">
          <span className="block">
            {errorMessage} Bạn vẫn có thể xem thông tin sản phẩm bên dưới.
          </span>
          <Button onClick={onRetry} size="sm" type="button" variant="outline">
            <RotateCcw aria-hidden="true" />
            Thử lại
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!productMatch) {
    return null;
  }

  const interpretationNote = (
    <Alert data-testid="product-detail-match-interpretation-note">
      <Info aria-hidden="true" />
      <AlertTitle>Cách đọc điểm phù hợp</AlertTitle>
      <AlertDescription>
        Kết quả này dựa trên hồ sơ da đã lưu và thông tin sản phẩm hiện có. Hãy
        xem đây là tín hiệu để cân nhắc, rồi kiểm tra bảng thành phần và phản
        ứng da thực tế.
      </AlertDescription>
    </Alert>
  );

  if (productMatch.matchAvailable) {
    return (
      <div className="space-y-3">
        {interpretationNote}
        <ProductMatchExplanationCard
          explanation={
            productMatch.match.matchExplanation ?? {
              summary:
                "Giải thích chi tiết còn giới hạn vì một số metadata còn thiếu.",
              positiveReasons: [],
              cautionReasons: [],
              ingredientHighlights: [],
              usageNote:
                "Hãy thử trên một vùng da nhỏ trước và đưa sản phẩm vào routine từ từ.",
              dataQualityNotes: [
                "Chưa tải được dữ liệu giải thích chi tiết cho sản phẩm này.",
              ],
            }
          }
          headingId={headingId}
          match={productMatch.match}
          title="Điểm phù hợp cá nhân hóa"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {interpretationNote}
      <ProductMatchExplanationCard
        explanation={productMatch.matchExplanation}
        headingId={headingId}
        title="Điểm phù hợp cá nhân hóa"
      />
    </div>
  );
}

function OverviewSection({ overview }: { overview: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tóm tắt sản phẩm</CardTitle>
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
        <CardTitle>Vì sao nên xem xét sản phẩm này</CardTitle>
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
        <div className="space-y-3 rounded-2xl border border-border bg-secondary/40 p-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              Tìm hiểu thành phần nổi bật
            </h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Các thông tin trong thư viện thành phần chỉ mang tính giáo dục,
              giúp bạn hiểu vai trò thường gặp của thành phần trong mỹ phẩm.
              Nội dung này không thay thế tư vấn chuyên môn hoặc hướng dẫn điều
              trị.
            </p>
          </div>
          {decisionSupport.ingredientHighlights.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {decisionSupport.ingredientHighlights.map((ingredientName) => (
                <Button
                  asChild
                  key={ingredientName}
                  size="sm"
                  variant="outline"
                >
                  <Link href={getIngredientSearchHref(ingredientName)}>
                    Tra cứu {ingredientName} trong thư viện
                  </Link>
                </Button>
              ))}
            </div>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link href={routes.INGREDIENTS}>Mở thư viện thành phần</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CautionSection({ cautions }: { cautions: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lưu ý an toàn</CardTitle>
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

function SaveDecisionSupportSection({ isSaved }: { isSaved: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bước tiếp theo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm leading-6 text-muted-foreground">
          <p>
            {isSaved
              ? "Sản phẩm đã lưu có thể được xem lại trong danh sách sản phẩm đã lưu."
              : "Lưu sản phẩm để xem lại khi bạn xây dựng routine chăm sóc da."}
          </p>
          <p>
            Việc lưu sản phẩm chỉ giúp bạn theo dõi và cân nhắc sau; bạn vẫn nên
            kiểm tra kỹ thông tin sản phẩm trước khi thêm vào routine.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild>
            <Link href={routes.SAVED_PRODUCTS}>Xem sản phẩm đã lưu</Link>
          </Button>
          <ProductMatchLinkButton />
        </div>
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
