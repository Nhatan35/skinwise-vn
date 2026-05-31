"use client";

import Link from "next/link";

import type {
  ProductMatchDto,
  ProductMatchLevel,
} from "@/modules/product-match/product-match.dto";
import type {
  ProductCategory,
  ProductPriceRange,
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

const matchLevelLabels: Record<ProductMatchLevel, string> = {
  strong: "Phù hợp cao",
  good: "Phù hợp tốt",
  cautious: "Cần xem kỹ",
  low: "Phù hợp thấp",
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

const matchLevelVariants: Record<
  ProductMatchLevel,
  "default" | "outline" | "secondary"
> = {
  strong: "default",
  good: "secondary",
  cautious: "outline",
  low: "outline",
};

type ProductMatchCardProps = {
  item: ProductMatchDto;
  onSavedChange?: (productId: string, isSaved: boolean) => void;
};

export function ProductMatchCard({
  item,
  onSavedChange,
}: ProductMatchCardProps) {
  const product = item.product;

  return (
    <Card data-testid="product-match-card">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              {product.brand || "Catalogue SkinWise"}
            </p>
            <CardTitle className="mt-2 text-xl">{product.name}</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              {categoryLabels[product.category]} -{" "}
              {priceRangeLabels[product.priceRange]}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              data-testid="product-match-level"
              variant={matchLevelVariants[item.matchLevel]}
            >
              {matchLevelLabels[item.matchLevel]}
            </Badge>
            <Badge data-testid="product-match-score" variant="outline">
              Điểm phù hợp: {item.matchScore}/100
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <section className="space-y-2" data-testid="product-match-reasons">
          <h3 className="text-sm font-semibold text-foreground">
            Vì sao có thể phù hợp
          </h3>
          {item.reasons.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
              {item.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Chưa có đủ tín hiệu rõ ràng từ hồ sơ da. Nên xem kỹ trước khi
              thêm vào routine.
            </p>
          )}
        </section>

        <section className="space-y-2" data-testid="product-match-cautions">
          <h3 className="text-sm font-semibold text-foreground">
            Cần xem kỹ trước khi dùng
          </h3>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
            {item.cautions.map((caution) => (
              <li key={caution}>{caution}</li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
          <Button asChild variant="outline">
            <Link
              data-testid="product-match-view-details-link"
              href={`${routes.PRODUCTS}/${product.id}`}
            >
              Xem chi tiết
            </Link>
          </Button>
          <SavedProductToggleButton
            initialSaved={item.isSaved}
            key={`${product.id}-${item.isSaved ? "saved" : "unsaved"}`}
            onChange={(isSaved) => onSavedChange?.(product.id, isSaved)}
            productId={product.id}
          />
        </div>
      </CardContent>
    </Card>
  );
}
