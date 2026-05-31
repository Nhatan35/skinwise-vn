import type { ProductMatchResponseDto } from "@/modules/product-match/product-match.dto";
import {
  toProductMatchDto,
  toProductMatchSkinProfileSummary,
} from "@/modules/product-match/product-match.mapper";
import type { ProductMatchQueryInput } from "@/modules/product-match/product-match.schema";
import { scoreProductMatch } from "@/modules/product-match/product-match.scoring";
import { listVisibleProductsForMatching } from "@/modules/products/product.repository";
import { listSavedProductsByUser } from "@/modules/saved-products/saved-product.repository";
import { getSkinProfileForUser } from "@/modules/skin-profile/skin-profile.use-case";

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
