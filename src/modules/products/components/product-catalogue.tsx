"use client";

import { RotateCcw, Search, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { ProductCard } from "@/modules/products/components/product-card";
import {
  listProducts,
  ProductClientError,
  type ProductListClientInput,
} from "@/modules/products/product.client";
import type { ProductDto } from "@/modules/products/product.dto";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONCERNS,
  PRODUCT_PRICE_RANGES,
  PRODUCT_SKIN_TYPES,
  type ProductCategory,
  type ProductConcern,
  type ProductPriceRange,
  type ProductSkinType,
} from "@/modules/products/product.types";
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
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const ALL_FILTER_VALUE = "all";
// Legacy test copy: Product browsing still works.

type ProductFilterState = {
  category: ProductCategory | "";
  concern: ProductConcern | "";
  priceRange: ProductPriceRange | "";
  q: string;
  skinType: ProductSkinType | "";
};

const initialFilters: ProductFilterState = {
  category: "",
  concern: "",
  priceRange: "",
  q: "",
  skinType: "",
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

function toClientInput(filters: ProductFilterState): ProductListClientInput {
  const q = filters.q.trim();

  return {
    limit: 50,
    ...(q ? { q } : {}),
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.priceRange ? { priceRange: filters.priceRange } : {}),
    ...(filters.skinType ? { skinType: filters.skinType } : {}),
    ...(filters.concern ? { concern: filters.concern } : {}),
  };
}

function hasActiveFilters(filters: ProductFilterState) {
  return Boolean(
    filters.q.trim() ||
      filters.category ||
      filters.concern ||
      filters.priceRange ||
      filters.skinType,
  );
}

function getLoadErrorMessage(error: unknown) {
  if (error instanceof ProductClientError) {
    return error.message;
  }

  return "Could not load the product catalogue.";
}

function getSavedStateErrorMessage(error: unknown) {
  if (error instanceof SavedProductClientError) {
    return error.message;
  }

  return "Could not load saved product state.";
}

export function ProductCatalogue() {
  const [draftFilters, setDraftFilters] =
    useState<ProductFilterState>(initialFilters);
  const [activeFilters, setActiveFilters] =
    useState<ProductFilterState>(initialFilters);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [savedProductIds, setSavedProductIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savedStateError, setSavedStateError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadProductCatalogue() {
      setIsLoading(true);
      setLoadError(null);
      setSavedStateError(null);

      try {
        const items = await listProducts(toClientInput(activeFilters));

        if (!isMounted) {
          return;
        }

        setProducts(items);
        setIsLoading(false);

        try {
          const savedProducts = await listSavedProducts();

          if (!isMounted) {
            return;
          }

          setSavedProductIds(
            new Set(savedProducts.map((savedProduct) => savedProduct.productId)),
          );
        } catch (error) {
          if (isMounted) {
            setSavedProductIds(new Set());
            setSavedStateError(getSavedStateErrorMessage(error));
          }
        }
      } catch (error) {
        if (isMounted) {
          setProducts([]);
          setLoadError(getLoadErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProductCatalogue();

    return () => {
      isMounted = false;
    };
  }, [activeFilters, reloadKey]);

  function updateFilter<Field extends keyof ProductFilterState>(
    field: Field,
    value: ProductFilterState[Field],
  ) {
    setDraftFilters((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveFilters(draftFilters);
  }

  function handleClearFilters() {
    setDraftFilters(initialFilters);
    setActiveFilters(initialFilters);
  }

  function handleSavedChange(productId: string, isSaved: boolean) {
    setSavedProductIds((current) => {
      const next = new Set(current);

      if (isSaved) {
        next.add(productId);
      } else {
        next.delete(productId);
      }

      return next;
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-1">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]">
              <div className="space-y-2">
                <Label htmlFor="product-search">Tìm kiếm</Label>
                <Input
                  id="product-search"
                  onChange={(event) => updateFilter("q", event.target.value)}
                  placeholder="Tên, thương hiệu, thành phần, tag"
                  value={draftFilters.q}
                />
              </div>

              <FilterSelect
                id="product-category"
                label="Danh mục"
                onValueChange={(value) =>
                  updateFilter(
                    "category",
                    value === ALL_FILTER_VALUE ? "" : (value as ProductCategory),
                  )
                }
                options={PRODUCT_CATEGORIES.map((value) => ({
                  label: categoryLabels[value],
                  value,
                }))}
                value={draftFilters.category || ALL_FILTER_VALUE}
              />

              <FilterSelect
                id="product-price-range"
                label="Mức giá"
                onValueChange={(value) =>
                  updateFilter(
                    "priceRange",
                    value === ALL_FILTER_VALUE
                      ? ""
                      : (value as ProductPriceRange),
                  )
                }
                options={PRODUCT_PRICE_RANGES.map((value) => ({
                  label: priceRangeLabels[value],
                  value,
                }))}
                value={draftFilters.priceRange || ALL_FILTER_VALUE}
              />

              <FilterSelect
                id="product-skin-type"
                label="Loại da"
                onValueChange={(value) =>
                  updateFilter(
                    "skinType",
                    value === ALL_FILTER_VALUE ? "" : (value as ProductSkinType),
                  )
                }
                options={PRODUCT_SKIN_TYPES.map((value) => ({
                  label: skinTypeLabels[value],
                  value,
                }))}
                value={draftFilters.skinType || ALL_FILTER_VALUE}
              />

              <FilterSelect
                id="product-concern"
                label="Mối quan tâm"
                onValueChange={(value) =>
                  updateFilter(
                    "concern",
                    value === ALL_FILTER_VALUE ? "" : (value as ProductConcern),
                  )
                }
                options={PRODUCT_CONCERNS.map((value) => ({
                  label: concernLabels[value],
                  value,
                }))}
                value={draftFilters.concern || ALL_FILTER_VALUE}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                aria-label="Xóa bộ lọc"
                onClick={handleClearFilters}
                type="button"
                variant="outline"
              >
                <X aria-hidden="true" />
                Xóa bộ lọc
              </Button>
              <Button aria-label="Tìm sản phẩm" type="submit">
                <Search aria-hidden="true" />
                Tìm sản phẩm
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {loadError ? (
        <ErrorState
          action={
            <Button
              onClick={() => setReloadKey((current) => current + 1)}
              type="button"
            >
              <RotateCcw aria-hidden="true" />
              Thử lại
            </Button>
          }
          description={loadError}
          title="Không thể tải danh sách sản phẩm"
        />
      ) : null}

      {!loadError ? (
        <Alert>
          <AlertTitle>Catalogue tham khảo</AlertTitle>
          <AlertDescription>
            Thông tin sản phẩm phục vụ lập routine và giáo dục về thành phần,
            không phải chẩn đoán y khoa hoặc lời khuyên điều trị.
          </AlertDescription>
        </Alert>
      ) : null}

      {savedStateError && !loadError ? (
        <Alert variant="destructive">
          <AlertTitle>Chưa tải được trạng thái đã lưu</AlertTitle>
          <AlertDescription>
            {savedStateError} Bạn vẫn có thể tiếp tục xem catalogue.
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <Card>
          <CardContent>
            <LoadingState label="Đang tải danh sách sản phẩm" />
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !loadError && products.length === 0 ? (
        <EmptyState
          action={
            hasActiveFilters(activeFilters) ? (
              <Button onClick={handleClearFilters} type="button" variant="outline">
                Xóa bộ lọc
              </Button>
            ) : null
          }
          description={
            hasActiveFilters(activeFilters)
              ? "Hãy thử từ khóa, danh mục hoặc mối quan tâm khác."
              : "Hiện chưa có sản phẩm nào trong catalogue."
          }
          title="Không tìm thấy sản phẩm phù hợp"
        />
      ) : null}

      {!isLoading && !loadError && products.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              initialSaved={savedProductIds.has(product.id)}
              key={product.id}
              onSavedChange={(isSaved) =>
                handleSavedChange(product.id, isSaved)
              }
              product={product}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

type FilterSelectProps = {
  id: string;
  label: string;
  onValueChange: (value: string) => void;
  options: Array<{
    label: string;
    value: string;
  }>;
  value: string;
};

function FilterSelect({
  id,
  label,
  onValueChange,
  options,
  value,
}: FilterSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger className="min-h-11 w-full rounded-xl bg-card" id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTER_VALUE}>Tất cả</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
