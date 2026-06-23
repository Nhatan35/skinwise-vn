import { z } from "zod";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONCERNS,
  PRODUCT_PRICE_RANGES,
  PRODUCT_SKIN_TYPES,
  PRODUCT_VERIFICATION_STATUSES,
} from "@/modules/products/product.types";

const mongoObjectIdPattern = /^[a-f\d]{24}$/i;

const textFieldSchema = z.string().trim().min(1);

const textArrayFieldSchema = z
  .array(z.string().trim())
  .default([])
  .transform((items) => items.filter(Boolean));

const productContentFieldsSchema = {
  brand: textFieldSchema,
  category: z.enum(PRODUCT_CATEGORIES),
  concerns: z.array(z.enum(PRODUCT_CONCERNS)).default([]),
  ingredientsText: textFieldSchema,
  keyActives: textArrayFieldSchema,
  name: textFieldSchema,
  notRecommendedFor: textArrayFieldSchema,
  priceRange: z.enum(PRODUCT_PRICE_RANGES),
  skinTypes: z.array(z.enum(PRODUCT_SKIN_TYPES)).default([]),
  suitableFor: textArrayFieldSchema,
  tags: textArrayFieldSchema,
  warnings: textArrayFieldSchema,
};

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

export const adminCreateProductBodySchema = z
  .object({
    ...productContentFieldsSchema,
    verificationStatus: z
      .enum(PRODUCT_VERIFICATION_STATUSES)
      .default("unverified"),
  })
  .strict();

export const adminUpdateProductBodySchema = z
  .object({
    brand: textFieldSchema.optional(),
    category: z.enum(PRODUCT_CATEGORIES).optional(),
    concerns: z.array(z.enum(PRODUCT_CONCERNS)).optional(),
    ingredientsText: textFieldSchema.optional(),
    keyActives: textArrayFieldSchema.optional(),
    name: textFieldSchema.optional(),
    notRecommendedFor: textArrayFieldSchema.optional(),
    priceRange: z.enum(PRODUCT_PRICE_RANGES).optional(),
    skinTypes: z.array(z.enum(PRODUCT_SKIN_TYPES)).optional(),
    suitableFor: textArrayFieldSchema.optional(),
    tags: textArrayFieldSchema.optional(),
    verificationStatus: z.enum(PRODUCT_VERIFICATION_STATUSES).optional(),
    warnings: textArrayFieldSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one product field is required.",
  });

export type ProductListQueryInput = z.infer<typeof productListQuerySchema>;
export type AdminProductListQueryInput = z.infer<
  typeof adminProductListQuerySchema
>;
export type ProductRouteParamsInput = z.infer<typeof productRouteParamsSchema>;
export type UpdateProductVerificationStatusBodyInput = z.infer<
  typeof updateProductVerificationStatusBodySchema
>;
export type AdminCreateProductBodyInput = z.infer<
  typeof adminCreateProductBodySchema
>;
export type AdminUpdateProductBodyInput = z.infer<
  typeof adminUpdateProductBodySchema
>;
