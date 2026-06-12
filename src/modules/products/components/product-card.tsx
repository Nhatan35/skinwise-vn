import Link from "next/link";

import type { ProductDto } from "@/modules/products/product.dto";
import type {
  ProductCategory,
  ProductConcern,
  ProductPriceRange,
  ProductSkinType,
  ProductVerificationStatus,
} from "@/modules/products/product.types";
import { SavedProductToggleButton } from "@/modules/saved-products/components/saved-product-toggle-button";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { routes } from "@/shared/constants/routes";

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

type ProductCardProps = {
  initialSaved?: boolean;
  onSavedChange?: (isSaved: boolean) => void;
  product: ProductDto;
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function ProductCard({
  initialSaved = false,
  onSavedChange,
  product,
}: ProductCardProps) {
  return (
    <Card className="h-full" data-testid="product-card">
      <div className="mx-5 mt-5 rounded-3xl bg-[linear-gradient(135deg,#F6EFE8,#E7F3EA)] p-5">
        <div className="mb-8 flex items-center justify-between gap-3">
          <Badge variant="secondary">{categoryLabels[product.category]}</Badge>
          <Badge variant="outline">{verificationLabels[product.verificationStatus]}</Badge>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {product.brand || "SkinWise"}
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
          {product.name}
        </h3>
      </div>

      <CardHeader>
        <div>
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            {product.brand ? `${product.brand} · ` : ""}
            {priceRangeLabels[product.priceRange]}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {product.keyActives.length > 0 ? (
          <ProductBadgeGroup
            label="Hoạt chất chính"
            values={product.keyActives}
            variant="secondary"
          />
        ) : null}

        <ProductBadgeGroup
          label="Loại da có thể phù hợp"
          values={product.skinTypes.map((skinType) => skinTypeLabels[skinType])}
        />

        <ProductBadgeGroup
          label="Mối quan tâm"
          values={product.concerns.map((concern) => concernLabels[concern])}
        />

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Thành phần</h4>
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {product.ingredientsText}
          </p>
        </div>

        {product.tags.length > 0 ? (
          <ProductBadgeGroup label="Tags" values={product.tags} />
        ) : null}

        {product.suitableFor.length > 0 ? (
          <ProductTextList label="Có thể phù hợp" values={product.suitableFor} />
        ) : null}

        {product.notRecommendedFor.length > 0 ? (
          <ProductTextList
            label="Không khuyến nghị cho"
            values={product.notRecommendedFor}
          />
        ) : null}

        {product.warnings.length > 0 ? (
          <ProductTextList label="Cần xem lại" values={product.warnings} />
        ) : null}

        <p className="border-t border-border pt-4 text-xs text-muted-foreground">
          Updated {formatUpdatedAt(product.updatedAt)}
        </p>

        <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
          <Button asChild aria-label="Xem chi tiết" variant="outline">
            <Link href={`${routes.PRODUCTS}/${product.id}`}>Xem chi tiết</Link>
          </Button>
          <SavedProductToggleButton
            initialSaved={initialSaved}
            onChange={onSavedChange}
            productId={product.id}
          />
        </div>
      </CardContent>
    </Card>
  );
}

type ProductBadgeGroupProps = {
  label: string;
  values: string[];
  variant?: "outline" | "secondary";
};

function ProductBadgeGroup({
  label,
  values,
  variant = "outline",
}: ProductBadgeGroupProps) {
  if (values.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-foreground">{label}</h4>
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

type ProductTextListProps = {
  label: string;
  values: string[];
};

function ProductTextList({ label, values }: ProductTextListProps) {
  if (values.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 rounded-2xl bg-[#FFF1D6] p-3">
      <h4 className="text-sm font-semibold text-amber-950">{label}</h4>
      <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-amber-950/80">
        {values.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </div>
  );
}
