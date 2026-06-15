import { z } from "zod";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONCERNS,
  PRODUCT_PRICE_RANGES,
  PRODUCT_SKIN_TYPES,
  PRODUCT_VERIFICATION_STATUSES,
} from "@/modules/products/product.types";

const mongoObjectIdPattern = /^[a-f\d]{24}$/i;

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

export const adminProductListQuerySchema = z
  .object({
    q: z.string().trim().max(160).optional(),
    category: z.enum(PRODUCT_CATEGORIES).optional(),
    priceRange: z.enum(PRODUCT_PRICE_RANGES).optional(),
    skinType: z.enum(PRODUCT_SKIN_TYPES).optional(),
    concern: z.enum(PRODUCT_CONCERNS).optional(),
    verificationStatus: z.enum(PRODUCT_VERIFICATION_STATUSES).optional(),
  })
  .strict();

export const productRouteParamsSchema = z
  .object({
    id: z.string().trim().regex(mongoObjectIdPattern, {
      message: "id must be a valid MongoDB ObjectId.",
    }),
  })
  .strict();

export const updateProductVerificationStatusBodySchema = z
  .object({
    verificationStatus: z.enum(PRODUCT_VERIFICATION_STATUSES),
  })
  .strict();

export type ProductListQueryInput = z.infer<typeof productListQuerySchema>;
export type AdminProductListQueryInput = z.infer<
  typeof adminProductListQuerySchema
>;
export type ProductRouteParamsInput = z.infer<typeof productRouteParamsSchema>;
export type UpdateProductVerificationStatusBodyInput = z.infer<
  typeof updateProductVerificationStatusBodySchema
>;
