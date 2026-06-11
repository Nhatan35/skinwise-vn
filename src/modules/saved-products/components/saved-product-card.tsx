import { CheckCircle2, Plus } from "lucide-react";
import Link from "next/link";

import type { ProductCategory } from "@/modules/products/product.types";
import { SavedProductToggleButton } from "@/modules/saved-products/components/saved-product-toggle-button";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { routes } from "@/shared/constants/routes";

type SavedProductCardProps = {
  comparisonDisabled?: boolean;
  isSelectedForComparison?: boolean;
  item: SavedProductDto;
  onComparisonToggle?: (productId: string) => void;
  onRemoved: (productId: string) => void;
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

function formatSavedAt(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function SavedProductCard({
  comparisonDisabled = false,
  isSelectedForComparison = false,
  item,
  onComparisonToggle,
  onRemoved,
}: SavedProductCardProps) {
  const product = item.product;
  const keyActives = product.keyActives.slice(0, 4);
  const hiddenKeyActiveCount = product.keyActives.length - keyActives.length;
  const ComparisonIcon = isSelectedForComparison ? CheckCircle2 : Plus;

  return (
    <Card className="h-full" data-testid="saved-product-card">
      <CardHeader>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-primary">
            {product.brand}
          </p>
          <CardTitle className="text-xl">{product.name}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{categoryLabels[product.category]}</Badge>
            <Badge variant="secondary">
              Đã lưu {formatSavedAt(item.createdAt)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {keyActives.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Thành phần nổi bật
            </h3>
            <div className="flex flex-wrap gap-2">
              {keyActives.map((ingredient) => (
                <Badge key={ingredient} variant="outline">
                  {ingredient}
                </Badge>
              ))}
              {hiddenKeyActiveCount > 0 ? (
                <Badge variant="outline">
                  +{hiddenKeyActiveCount} mục khác
                </Badge>
              ) : null}
            </div>
          </div>
        ) : null}

        {product.warnings.length > 0 ? (
          <div className="rounded-2xl bg-[#FFF1D6] p-3">
            <h3 className="text-sm font-semibold text-amber-950">Cần xem lại</h3>
            <p className="mt-1 text-sm leading-6 text-amber-950/80">
              {product.warnings[0]}
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
          {onComparisonToggle ? (
            <Button
              aria-pressed={isSelectedForComparison}
              data-testid="saved-product-comparison-toggle"
              disabled={comparisonDisabled && !isSelectedForComparison}
              onClick={() => onComparisonToggle(item.productId)}
              type="button"
              variant={isSelectedForComparison ? "secondary" : "outline"}
            >
              <ComparisonIcon aria-hidden="true" />
              {isSelectedForComparison ? "Đã chọn so sánh" : "Thêm vào so sánh"}
            </Button>
          ) : null}
          <Button asChild aria-label="Xem chi tiết" variant="outline">
            <Link href={`${routes.PRODUCTS}/${product.id}`}>Xem chi tiết</Link>
          </Button>
          <SavedProductToggleButton
            initialSaved
            mode="full"
            onSuccess={(isSaved) => {
              if (!isSaved) {
                onRemoved(product.id);
              }
            }}
            productId={product.id}
          />
        </div>
      </CardContent>
    </Card>
  );
}
