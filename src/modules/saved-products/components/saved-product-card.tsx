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

type SavedProductCardProps = {
  item: SavedProductDto;
  onRemoved: (productId: string) => void;
};

const categoryLabels: Record<ProductCategory, string> = {
  cleanser: "Cleanser",
  moisturizer: "Moisturizer",
  sunscreen: "Sunscreen",
  treatment: "Treatment",
  toner: "Toner",
  serum: "Serum",
  mask: "Mask",
  other: "Other",
};

function formatSavedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function SavedProductCard({ item, onRemoved }: SavedProductCardProps) {
  const product = item.product;
  const keyActives = product.keyActives.slice(0, 4);
  const hiddenKeyActiveCount = product.keyActives.length - keyActives.length;

  return (
    <Card className="border-stone-200 bg-white" data-testid="saved-product-card">
      <CardHeader>
        <div className="space-y-2">
          <p className="text-sm font-medium text-emerald-700">
            {product.brand}
          </p>
          <CardTitle className="text-xl">{product.name}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{categoryLabels[product.category]}</Badge>
            <Badge variant="secondary">
              Saved {formatSavedAt(item.createdAt)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {keyActives.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-stone-900">
              Key ingredients
            </h3>
            <div className="flex flex-wrap gap-2">
              {keyActives.map((ingredient) => (
                <Badge key={ingredient} variant="outline">
                  {ingredient}
                </Badge>
              ))}
              {hiddenKeyActiveCount > 0 ? (
                <Badge variant="outline">+{hiddenKeyActiveCount} more</Badge>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 border-t border-stone-200 pt-4 sm:flex-row">
          <Button asChild variant="outline">
            <Link href={`/products/${product.id}`}>View details</Link>
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
