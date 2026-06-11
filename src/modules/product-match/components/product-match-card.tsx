"use client";

import Link from "next/link";

import { ProductMatchExplanationCard } from "@/modules/product-match/components/product-match-explanation-card";
import type {
  ProductMatchDto,
  ProductMatchLevel,
} from "@/modules/product-match/product-match.dto";
import type {
  ProductCategory,
  ProductPriceRange,
} from "@/modules/products/product.types";
import type {
  SkinConcern,
  SkinType,
} from "@/modules/skin-profile/skin-profile.types";
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

const skinTypeLabels: Record<SkinType, string> = {
  oily: "da dầu",
  dry: "da khô",
  combination: "da hỗn hợp",
  normal: "da thường",
  sensitive: "da nhạy cảm",
  unknown: "loại da chưa rõ",
};

const concernLabels: Record<SkinConcern, string> = {
  acne: "mụn",
  oiliness: "dầu thừa",
  dryness: "khô căng",
  redness: "đỏ da",
  dark_spots: "thâm hoặc đốm tối màu",
  texture: "bề mặt da chưa đều",
  barrier_support: "hàng rào da",
  unknown: "mối quan tâm chưa rõ",
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

type ProductMatchSignalItem = {
  label: string;
  tone: "positive" | "caution";
};

function getMatchedSignalItems(item: ProductMatchDto) {
  const { matchedSignals } = item;
  const signals: ProductMatchSignalItem[] = [];

  if (matchedSignals.skinType) {
    const matchedSkinTypeLabels = matchedSignals.skinTypes
      ?.map((skinType) => skinTypeLabels[skinType])
      .join(", ");

    signals.push({
      label: matchedSkinTypeLabels
        ? `Phù hợp với hồ sơ da: ${matchedSkinTypeLabels}`
        : "Phù hợp với dữ liệu hồ sơ da",
      tone: "positive",
    });
  }

  if (matchedSignals.concerns.length > 0) {
    const matchedConcernLabels = matchedSignals.concerns
      .map((concern) => concernLabels[concern])
      .join(", ");

    signals.push({
      label: `Liên quan đến mối quan tâm: ${matchedConcernLabels}`,
      tone: "positive",
    });
  }

  if (matchedSignals.budget) {
    signals.push({
      label: "Phù hợp với ngân sách đã nhập",
      tone: "positive",
    });
  }

  if (matchedSignals.sensitivity) {
    signals.push({
      label: "Cần xem kỹ nếu da dễ kích ứng",
      tone: "caution",
    });
  }

  if (matchedSignals.avoidedIngredients.length > 0) {
    signals.push({
      label: "Có thành phần bạn muốn tránh",
      tone: "caution",
    });
  }

  return signals;
}

export function ProductMatchCard({
  item,
  onSavedChange,
}: ProductMatchCardProps) {
  const product = item.product;
  const matchedSignalItems = getMatchedSignalItems(item);
  const explanationHeadingId = `product-match-explanation-${product.id}`;

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
              Mức độ phù hợp: {item.matchScore}/100
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {item.matchExplanation ? (
          <div className="space-y-3">
            {matchedSignalItems.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {matchedSignalItems.map((signal) => (
                  <Badge
                    key={signal.label}
                    variant={
                      signal.tone === "positive" ? "secondary" : "outline"
                    }
                  >
                    {signal.label}
                  </Badge>
                ))}
              </div>
            ) : null}
            <ProductMatchExplanationCard
              explanation={item.matchExplanation}
              headingId={explanationHeadingId}
              match={item}
              showMatchBadges={false}
              title="Lý do gợi ý"
            />
          </div>
        ) : null}

        <div
          className="rounded-2xl border border-border bg-muted/30 p-3"
          data-testid="product-match-next-action"
        >
          <p className="text-sm font-semibold text-foreground">Bước tiếp theo</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Xem chi tiết để kiểm tra thông tin sản phẩm, rồi lưu sản phẩm nếu phù
            hợp với routine chăm sóc da của bạn.
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
          <Button asChild variant="outline">
            <Link
              data-testid="product-match-view-details-link"
              href={`${routes.PRODUCTS}/${product.id}`}
            >
              Xem chi tiết sản phẩm
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
