import { z } from "zod";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONCERNS,
  PRODUCT_PRICE_RANGES,
  PRODUCT_SKIN_TYPES,
} from "@/modules/products/product.types";

export const productListQuerySchema = z
  .object({
    q: z.string().trim().max(160).optional(),
    category: z.enum(PRODUCT_CATEGORIES).optional(),
    priceRange: z.enum(PRODUCT_PRICE_RANGES).optional(),
    skinType: z.enum(PRODUCT_SKIN_TYPES).optional(),
    concern: z.enum(PRODUCT_CONCERNS).optional(),
    limit: z.coerce.number().int().positive().max(50).default(20),
  })
  .strict();

export type ProductListQueryInput = z.infer<typeof productListQuerySchema>;
