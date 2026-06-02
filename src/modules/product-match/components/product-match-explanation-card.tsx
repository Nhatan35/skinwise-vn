"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";

import type {
  ProductMatchDto,
  ProductMatchExplanationDto,
  ProductMatchIngredientHighlight,
  ProductMatchLevel,
} from "@/modules/product-match/product-match.dto";
import { buildProductMatchExplanationViewModel } from "@/modules/product-match/product-match-explanation";
import { Badge } from "@/shared/components/ui/badge";

const matchLevelLabels: Record<ProductMatchLevel, string> = {
  strong: "Phù hợp cao",
  good: "Phù hợp tốt",
  cautious: "Cần xem kỹ",
  low: "Phù hợp thấp",
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

const ingredientEffectLabels: Record<
  ProductMatchIngredientHighlight["effect"],
  string
> = {
  positive: "Tín hiệu hỗ trợ",
  caution: "Cần xem kỹ",
  neutral: "Dữ liệu tham khảo",
};

type ProductMatchExplanationCardProps = {
  explanation: ProductMatchExplanationDto;
  headingId: string;
  match?: ProductMatchDto;
  showMatchBadges?: boolean;
  title: string;
};

export function ProductMatchExplanationCard({
  explanation,
  headingId,
  match,
  showMatchBadges = true,
  title,
}: ProductMatchExplanationCardProps) {
  const fallback = buildProductMatchExplanationViewModel({
    reasons: match?.reasons ?? [],
    cautions: match?.cautions ?? [],
  });
  const positiveReasons =
    explanation.positiveReasons.length > 0
      ? explanation.positiveReasons.map((reason) => reason.message)
      : fallback.visibleReasons;
  const cautionReasons =
    explanation.cautionReasons.length > 0
      ? explanation.cautionReasons.map((reason) => reason.message)
      : fallback.visibleCautions;

  return (
    <section
      aria-labelledby={headingId}
      className="space-y-4 rounded-2xl border border-border bg-muted/30 p-4"
      data-testid="product-match-explanation-card"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="text-base font-semibold text-foreground" id={headingId}>
          {title}
        </h3>
        {match && showMatchBadges ? (
          <div className="flex flex-wrap gap-2">
            <Badge
              data-testid="product-match-level"
              variant={matchLevelVariants[match.matchLevel]}
            >
              {matchLevelLabels[match.matchLevel]}
            </Badge>
            <Badge data-testid="product-match-score" variant="outline">
              Điểm phù hợp: {match.matchScore}/100
            </Badge>
          </div>
        ) : null}
      </div>

      <div className="space-y-3" data-testid="product-match-explanation-summary">
        <p className="text-sm leading-6 text-muted-foreground">
          {explanation.summary}
        </p>
        <p className="rounded-xl border border-border bg-card p-3 text-sm leading-6 text-muted-foreground">
          {explanation.usageNote}
        </p>
      </div>

      <div className="space-y-3" data-testid="product-match-reasons">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <CheckCircle2 aria-hidden="true" className="size-4" />
          Tín hiệu phù hợp:
        </h4>
        <IconTextList icon="positive" items={positiveReasons} />
      </div>

      <div className="space-y-3" data-testid="product-match-cautions">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <AlertTriangle aria-hidden="true" className="size-4" />
          Cần lưu ý:
        </h4>
        <IconTextList icon="caution" items={cautionReasons} />
      </div>

      <ProductMatchIngredientHighlights explanation={explanation} />

      {explanation.dataQualityNotes && explanation.dataQualityNotes.length > 0 ? (
        <div className="space-y-3" data-testid="product-match-data-quality-notes">
          <h4 className="text-sm font-semibold text-foreground">
            Ghi chú dữ liệu
          </h4>
          <IconTextList icon="caution" items={explanation.dataQualityNotes} />
        </div>
      ) : null}
    </section>
  );
}

function ProductMatchIngredientHighlights({
  explanation,
}: {
  explanation: ProductMatchExplanationDto;
}) {
  if (explanation.ingredientHighlights.length === 0) {
    return (
      <p
        className="text-sm leading-6 text-muted-foreground"
        data-testid="product-match-ingredient-highlights"
      >
        Chưa đủ dữ liệu thành phần để giải thích mức độ phù hợp của sản phẩm này.
      </p>
    );
  }

  return (
    <div className="space-y-3" data-testid="product-match-ingredient-highlights">
      <h4 className="text-sm font-semibold text-foreground">
        Thành phần liên quan
      </h4>
      <ul className="grid gap-2">
        {explanation.ingredientHighlights.map((highlight) => (
          <li
            className="rounded-xl border border-border bg-card p-3 text-sm leading-6"
            key={`${highlight.ingredientName}-${highlight.effect}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-foreground">
                {highlight.ingredientName}
              </span>
              <Badge
                variant={highlight.effect === "caution" ? "outline" : "secondary"}
              >
                {ingredientEffectLabels[highlight.effect]}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">{highlight.reason}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IconTextList({
  icon,
  items,
}: {
  icon: "positive" | "caution";
  items: string[];
}) {
  const Icon = icon === "positive" ? CheckCircle2 : AlertTriangle;
  const iconClassName =
    icon === "positive" ? "text-emerald-700" : "text-amber-700";

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
