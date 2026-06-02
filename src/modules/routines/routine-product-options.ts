import type { ProductDto } from "@/modules/products/product.dto";
import type {
  ProductConcern,
  ProductSkinType,
} from "@/modules/products/product.types";
import type { RoutineStepCategory } from "@/modules/routines/routine.types";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";

export type RoutineProductOptionSource = "saved" | "catalogue";

export type RoutineProductOption = {
  id: string;
  name: string;
  brand: string;
  category?: RoutineStepCategory;
  concerns: ProductConcern[];
  keyActives: string[];
  skinTypes: ProductSkinType[];
  source: RoutineProductOptionSource;
  tags: string[];
  warnings: string[];
};

export type RoutineProductOptions = {
  savedProductOptions: RoutineProductOption[];
  catalogueProductOptions: RoutineProductOption[];
  combinedProductOptions: RoutineProductOption[];
};

export type RoutineProductSelectionStep = {
  productId?: string;
  customProductName: string;
  category: RoutineStepCategory | "";
};

function toRoutineProductOption(
  product: ProductDto,
  source: RoutineProductOptionSource,
): RoutineProductOption {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    concerns: [...product.concerns],
    keyActives: [...product.keyActives],
    skinTypes: [...product.skinTypes],
    source,
    tags: [...product.tags],
    warnings: [...product.warnings],
  };
}

function appendUniqueOption(
  options: RoutineProductOption[],
  option: RoutineProductOption,
  seenProductIds: Set<string>,
) {
  if (seenProductIds.has(option.id)) {
    return;
  }

  seenProductIds.add(option.id);
  options.push(option);
}

export function buildRoutineProductOptions(input: {
  catalogueProducts: ProductDto[];
  savedProducts: SavedProductDto[];
}): RoutineProductOptions {
  const savedProductOptions: RoutineProductOption[] = [];
  const savedProductIds = new Set<string>();

  for (const savedProduct of input.savedProducts) {
    appendUniqueOption(
      savedProductOptions,
      toRoutineProductOption(savedProduct.product, "saved"),
      savedProductIds,
    );
  }

  const catalogueProductOptions: RoutineProductOption[] = [];
  const catalogueProductIds = new Set<string>(savedProductIds);

  for (const product of input.catalogueProducts) {
    appendUniqueOption(
      catalogueProductOptions,
      toRoutineProductOption(product, "catalogue"),
      catalogueProductIds,
    );
  }

  return {
    savedProductOptions,
    catalogueProductOptions,
    combinedProductOptions: [
      ...savedProductOptions,
      ...catalogueProductOptions,
    ],
  };
}

export function findRoutineProductOption(
  options: RoutineProductOption[],
  productId: string | undefined,
) {
  if (!productId) {
    return undefined;
  }

  return options.find((option) => option.id === productId);
}

export function applyRoutineProductSelection<
  Step extends RoutineProductSelectionStep,
>(input: {
  previousOption?: RoutineProductOption;
  selectedOption: RoutineProductOption;
  step: Step;
}): Step {
  const shouldAutoSetCategory =
    !input.step.category ||
    !input.step.productId ||
    (Boolean(input.previousOption?.category) &&
      input.step.category === input.previousOption?.category);

  return {
    ...input.step,
    productId: input.selectedOption.id,
    customProductName: "",
    category:
      shouldAutoSetCategory && input.selectedOption.category
        ? input.selectedOption.category
        : input.step.category,
  };
}
