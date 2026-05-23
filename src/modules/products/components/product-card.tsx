import Link from "next/link";

import type { ProductDto } from "@/modules/products/product.dto";
import type {
  ProductCategory,
  ProductConcern,
  ProductPriceRange,
  ProductSkinType,
  ProductVerificationStatus,
} from "@/modules/products/product.types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

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

const priceRangeLabels: Record<ProductPriceRange, string> = {
  budget: "Budget",
  mid: "Mid range",
  premium: "Premium",
  unknown: "Unknown price",
};

const skinTypeLabels: Record<ProductSkinType, string> = {
  oily: "Oily",
  dry: "Dry",
  combination: "Combination",
  normal: "Normal",
  sensitive: "Sensitive",
  unknown: "Unknown",
};

const concernLabels: Record<ProductConcern, string> = {
  acne: "Acne",
  oiliness: "Oiliness",
  dryness: "Dryness",
  redness: "Redness",
  dark_spots: "Dark spots",
  texture: "Texture",
  barrier_support: "Barrier support",
  unknown: "Unknown",
};

const verificationLabels: Record<ProductVerificationStatus, string> = {
  reviewed: "Reviewed",
  unverified: "Unverified",
  verified: "Verified",
};

type ProductCardProps = {
  product: ProductDto;
};

function formatProductName(product: ProductDto) {
  return product.brand ? `${product.brand} - ${product.name}` : product.name;
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="border-stone-200 bg-white">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl">{formatProductName(product)}</CardTitle>
            <p className="mt-2 text-sm text-stone-600">
              {categoryLabels[product.category]} -{" "}
              {priceRangeLabels[product.priceRange]}
            </p>
          </div>
          <Badge variant="secondary">
            {verificationLabels[product.verificationStatus]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {product.keyActives.length > 0 ? (
          <ProductBadgeGroup
            label="Key actives"
            values={product.keyActives}
            variant="secondary"
          />
        ) : null}

        <ProductBadgeGroup
          label="Skin types"
          values={product.skinTypes.map((skinType) => skinTypeLabels[skinType])}
        />

        <ProductBadgeGroup
          label="Concerns"
          values={product.concerns.map((concern) => concernLabels[concern])}
        />

        {product.tags.length > 0 ? (
          <ProductBadgeGroup label="Tags" values={product.tags} />
        ) : null}

        {product.suitableFor.length > 0 ? (
          <ProductTextList label="Suitable for" values={product.suitableFor} />
        ) : null}

        {product.notRecommendedFor.length > 0 ? (
          <ProductTextList
            label="Not recommended for"
            values={product.notRecommendedFor}
          />
        ) : null}

        {product.warnings.length > 0 ? (
          <ProductTextList label="Warnings" values={product.warnings} />
        ) : null}

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-stone-900">
            Ingredient text
          </h3>
          <p className="text-sm leading-6 text-stone-700">
            {product.ingredientsText}
          </p>
        </div>

        <p className="border-t border-stone-200 pt-4 text-xs text-stone-500">
          Updated {formatUpdatedAt(product.updatedAt)}
        </p>

        <div className="border-t border-stone-200 pt-4">
          <Button asChild variant="outline">
            <Link href={`/products/${product.id}`}>View details</Link>
          </Button>
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
      <h3 className="text-sm font-medium text-stone-900">{label}</h3>
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
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-stone-900">{label}</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-stone-700">
        {values.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </div>
  );
}
