"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getProduct,
  ProductClientError,
} from "@/modules/products/product.client";
import type { ProductDto } from "@/modules/products/product.dto";
import type {
  ProductCategory,
  ProductConcern,
  ProductPriceRange,
  ProductSkinType,
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

type ProductDetailProps = {
  productId: string;
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

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
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
            savedProducts.some((savedProduct) => savedProduct.productId === productId),
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
      <Card className="border-stone-200 bg-white">
        <CardContent>
          <LoadingState label="Loading product details" />
        </CardContent>
      </Card>
    );
  }

  if (loadError?.status === 404) {
    return (
      <EmptyState
        action={<BackToProductsButton />}
        description="This product may be unavailable or not visible in the catalogue."
        title="Product not found"
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
              Retry
            </Button>
            <BackToProductsButton />
          </div>
        }
        description={loadError.message}
        title="Product details could not load"
      />
    );
  }

  if (!product) {
    return (
      <EmptyState
        action={<BackToProductsButton />}
        description="Try returning to the product catalogue and opening the product again."
        title="Product not found"
      />
    );
  }

  const suitabilityVisible =
    product.skinTypes.length > 0 ||
    product.concerns.length > 0 ||
    product.suitableFor.length > 0 ||
    product.notRecommendedFor.length > 0;

  return (
    <article className="space-y-4">
      <Card className="border-stone-200 bg-white">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">
                {product.brand}
              </p>
              <CardTitle className="mt-2 text-3xl">{product.name}</CardTitle>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline">
                  {categoryLabels[product.category]}
                </Badge>
                <Badge variant="outline">
                  {priceRangeLabels[product.priceRange]}
                </Badge>
                <Badge variant="secondary">
                  {verificationLabels[product.verificationStatus]}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
              <BackToProductsButton />
              <SavedProductToggleButton
                initialSaved={isSaved}
                key={`${product.id}-${isSaved ? "saved" : "unsaved"}`}
                mode="full"
                onChange={setIsSaved}
                productId={product.id}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-stone-500">
            Product ID: {product.id} - Updated{" "}
            {formatUpdatedAt(product.updatedAt)}
          </p>
        </CardContent>
      </Card>

      <Alert>
        <AlertTitle>Educational product details</AlertTitle>
        <AlertDescription>
          Product details are for routine planning and ingredient education.
          They are not medical diagnosis or treatment advice.
        </AlertDescription>
      </Alert>

      {savedStateError ? (
        <Alert variant="destructive">
          <AlertTitle>Saved state unavailable</AlertTitle>
          <AlertDescription>
            {savedStateError} Product details still work.
          </AlertDescription>
        </Alert>
      ) : null}

      <Card className="border-stone-200 bg-white">
        <CardHeader>
          <CardTitle>Product information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <DetailField
            label="Category"
            value={categoryLabels[product.category]}
          />
          <DetailField
            label="Price range"
            value={priceRangeLabels[product.priceRange]}
          />
          <DetailField
            label="Verification status"
            value={verificationLabels[product.verificationStatus]}
          />
        </CardContent>
      </Card>

      <Card className="border-stone-200 bg-white">
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-stone-900">
              Ingredients text
            </h3>
            <p className="text-sm leading-6 text-stone-700">
              {product.ingredientsText}
            </p>
          </div>
          <BadgeGroup
            label="Key actives"
            values={product.keyActives}
            variant="secondary"
          />
        </CardContent>
      </Card>

      {suitabilityVisible ? (
        <Card className="border-stone-200 bg-white">
          <CardHeader>
            <CardTitle>Suitability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <BadgeGroup
              label="Skin types"
              values={product.skinTypes.map((skinType) => skinTypeLabels[skinType])}
            />
            <BadgeGroup
              label="Concerns"
              values={product.concerns.map((concern) => concernLabels[concern])}
            />
            <TextList label="Suitable for" values={product.suitableFor} />
            <TextList
              label="Not recommended for"
              values={product.notRecommendedFor}
            />
          </CardContent>
        </Card>
      ) : null}

      {product.warnings.length > 0 ? (
        <Card className="border-stone-200 bg-white">
          <CardHeader>
            <CardTitle>Safety</CardTitle>
          </CardHeader>
          <CardContent>
            <TextList label="Warnings" values={product.warnings} />
          </CardContent>
        </Card>
      ) : null}

      {product.tags.length > 0 ? (
        <Card className="border-stone-200 bg-white">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <BadgeGroup label="Tags" values={product.tags} />
          </CardContent>
        </Card>
      ) : null}
    </article>
  );
}

function BackToProductsButton() {
  return (
    <Button asChild variant="outline">
      <Link href="/products">
        <ArrowLeft aria-hidden="true" />
        Back to products
      </Link>
    </Button>
  );
}

type DetailFieldProps = {
  label: string;
  value: string;
};

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase text-stone-500">{label}</p>
      <p className="text-sm text-stone-900">{value}</p>
    </div>
  );
}

type BadgeGroupProps = {
  label: string;
  values: string[];
  variant?: "outline" | "secondary";
};

function BadgeGroup({ label, values, variant = "outline" }: BadgeGroupProps) {
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

type TextListProps = {
  label: string;
  values: string[];
};

function TextList({ label, values }: TextListProps) {
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
