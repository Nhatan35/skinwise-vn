import { countIngredientsForAdmin } from "@/modules/ingredients/ingredient.use-case";
import { listProductsForAdmin } from "@/modules/products/product.use-case";
import type { ProductVerificationStatus } from "@/modules/products/product.types";
import type { AdminContentSummaryDto } from "@/modules/admin/admin-content-summary.dto";
import { routes } from "@/shared/constants/routes";

export const ADMIN_CONTENT_DASHBOARD_BOUNDARY_NOTE =
  "Admin content tools are for catalogue maintenance only. Production-ready is not claimed while deployed smoke v1.48 remains incomplete.";

type ProductStatusInput = {
  verificationStatus?: ProductVerificationStatus | string | null;
};

export function summarizeAdminProductStatuses(
  products: readonly ProductStatusInput[],
): Omit<AdminContentSummaryDto["products"], "manageHref"> {
  const summary = {
    total: products.length,
    unverified: 0,
    reviewed: 0,
    verified: 0,
  };

  for (const product of products) {
    if (product.verificationStatus === "unverified") {
      summary.unverified += 1;
    }

    if (product.verificationStatus === "reviewed") {
      summary.reviewed += 1;
    }

    if (product.verificationStatus === "verified") {
      summary.verified += 1;
    }
  }

  return summary;
}

export async function getAdminContentSummary(): Promise<AdminContentSummaryDto> {
  const [products, ingredientTotal] = await Promise.all([
    listProductsForAdmin({}),
    countIngredientsForAdmin(),
  ]);
  const productSummary = summarizeAdminProductStatuses(products);

  return {
    products: {
      ...productSummary,
      manageHref: routes.ADMIN_PRODUCTS,
    },
    ingredients: {
      total: ingredientTotal,
      manageHref: routes.ADMIN_INGREDIENTS,
    },
    boundaryNote: ADMIN_CONTENT_DASHBOARD_BOUNDARY_NOTE,
  };
}
