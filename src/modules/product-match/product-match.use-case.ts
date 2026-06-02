import type {
  ProductDetailMatchResponseDto,
  ProductMatchResponseDto,
} from "@/modules/product-match/product-match.dto";
import {
  toProductMatchDto,
  toProductMatchSkinProfileSummary,
} from "@/modules/product-match/product-match.mapper";
import { buildUnavailableProductMatchExplanation } from "@/modules/product-match/product-match-explanation";
import type { ProductMatchQueryInput } from "@/modules/product-match/product-match.schema";
import { scoreProductMatch } from "@/modules/product-match/product-match.scoring";
import {
  findVisibleProductById,
  listVisibleProductsForMatching,
} from "@/modules/products/product.repository";
import {
  isProductSavedByUser,
  listSavedProductsByUser,
} from "@/modules/saved-products/saved-product.repository";
import { getSkinProfileForUser } from "@/modules/skin-profile/skin-profile.use-case";

function hasProductIngredientMetadata(input: {
  ingredientsText: string;
  keyActives: string[];
}) {
  return (
    input.ingredientsText.trim().length > 0 ||
    input.keyActives.some((ingredient) => ingredient.trim().length > 0)
  );
}

export async function getProductMatchesForUser(
  userId: string,
  input: ProductMatchQueryInput,
): Promise<ProductMatchResponseDto> {
  const generatedAt = new Date().toISOString();
  const skinProfile = await getSkinProfileForUser(userId);

  if (!skinProfile) {
    return {
      skinProfileExists: false,
      generatedAt,
      items: [],
    };
  }

  const [products, savedProducts] = await Promise.all([
    listVisibleProductsForMatching(),
    listSavedProductsByUser(userId),
  ]);
  const savedProductIds = new Set(
    savedProducts.map((savedProduct) => savedProduct.productId.toString()),
  );
  const items = products
    .map((product) =>
      toProductMatchDto({
        product,
        scoring: scoreProductMatch({
          product,
          skinProfile,
        }),
        isSaved: savedProductIds.has(product._id.toString()),
      }),
    )
    .sort((left, right) => {
      if (right.matchScore !== left.matchScore) {
        return right.matchScore - left.matchScore;
      }

      return `${left.product.brand} ${left.product.name}`.localeCompare(
        `${right.product.brand} ${right.product.name}`,
      );
    })
    .slice(0, input.limit);

  return {
    skinProfileExists: true,
    generatedAt,
    skinProfileSummary: toProductMatchSkinProfileSummary(skinProfile),
    items,
  };
}

export async function getProductMatchForUserAndProduct(
  userId: string,
  productId: string,
): Promise<ProductDetailMatchResponseDto | null> {
  const product = await findVisibleProductById(productId);

  if (!product) {
    return null;
  }

  const skinProfile = await getSkinProfileForUser(userId);

  if (!skinProfile) {
    return {
      productId,
      matchAvailable: false,
      skinProfileExists: false,
      matchUnavailableReason: "NO_SKIN_PROFILE",
      matchExplanation:
        buildUnavailableProductMatchExplanation("NO_SKIN_PROFILE"),
    };
  }

  if (!hasProductIngredientMetadata(product)) {
    return {
      productId,
      matchAvailable: false,
      skinProfileExists: true,
      matchUnavailableReason: "NO_INGREDIENT_DATA",
      matchExplanation:
        buildUnavailableProductMatchExplanation("NO_INGREDIENT_DATA"),
    };
  }

  const isSaved = await isProductSavedByUser(userId, productId);

  return {
    productId,
    matchAvailable: true,
    skinProfileExists: true,
    match: toProductMatchDto({
      product,
      scoring: scoreProductMatch({
        product,
        skinProfile,
      }),
      isSaved,
    }),
  };
}
