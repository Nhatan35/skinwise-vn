"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import type {
  ProductMatchDto,
  ProductMatchLevel,
} from "@/modules/product-match/product-match.dto";
import { buildProductMatchExplanationViewModel } from "@/modules/product-match/product-match-explanation";
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

type ProductMatchSignalItem = {
  label: string;
  tone: "positive" | "caution";
};

function getMatchedSignalItems(item: ProductMatchDto) {
  const { matchedSignals } = item;
  const signals: ProductMatchSignalItem[] = [];

  if (matchedSignals.skinType) {
    signals.push({
      label: "Loại da có tín hiệu khớp",
      tone: "positive",
    });
  }

  if (matchedSignals.concerns.length > 0) {
    signals.push({
      label: `${matchedSignals.concerns.length} mối quan tâm có tín hiệu khớp`,
      tone: "positive",
    });
  }

  if (matchedSignals.budget) {
    signals.push({
      label: "Ngân sách có tín hiệu khớp",
      tone: "positive",
    });
  }

  if (matchedSignals.sensitivity) {
    signals.push({
      label: "Độ nhạy cảm cần xem kỹ",
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
  const explanation = buildProductMatchExplanationViewModel({
    reasons: item.reasons,
    cautions: item.cautions,
  });
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
              Điểm phù hợp: {item.matchScore}/100
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <section
          aria-labelledby={explanationHeadingId}
          className="space-y-4 rounded-2xl border border-border bg-muted/30 p-4"
        >
          <h3
            className="text-base font-semibold text-foreground"
            id={explanationHeadingId}
          >
            Vì sao được gợi ý
          </h3>

          <div className="space-y-3" data-testid="product-match-reasons">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CheckCircle2 aria-hidden="true" className="size-4" />
              Phù hợp với bạn vì:
            </h4>
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
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">
                Dựa trên hồ sơ hiện tại, SkinWise chưa thấy nhiều tín hiệu khớp
                rõ ràng.
              </p>
            )}
            <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
              {explanation.visibleReasons.map((reason) => (
                <li className="flex gap-2" key={reason}>
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-emerald-700"
                  />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
            {explanation.hiddenReasonsCount > 0 ? (
              <p className="text-xs font-medium text-muted-foreground">
                +{explanation.hiddenReasonsCount} lý do khác trong dữ liệu gợi ý
              </p>
            ) : null}
          </div>

          <div className="space-y-3" data-testid="product-match-cautions">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlertTriangle aria-hidden="true" className="size-4" />
              Cần lưu ý:
            </h4>
            <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
              {explanation.visibleCautions.map((caution) => (
                <li className="flex gap-2" key={caution}>
                  <AlertTriangle
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-amber-700"
                  />
                  <span>{caution}</span>
                </li>
              ))}
            </ul>
            {explanation.hiddenCautionsCount > 0 ? (
              <p className="text-xs font-medium text-muted-foreground">
                +{explanation.hiddenCautionsCount} lưu ý khác trong dữ liệu gợi ý
              </p>
            ) : null}
          </div>
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
