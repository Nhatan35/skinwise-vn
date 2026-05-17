import type { ObjectId, WithId } from "mongodb";

export const PRODUCT_CATEGORIES = [
  "cleanser",
  "moisturizer",
  "sunscreen",
  "treatment",
  "toner",
  "serum",
  "mask",
  "other",
] as const;

export const PRODUCT_PRICE_RANGES = [
  "budget",
  "mid",
  "premium",
  "unknown",
] as const;

export const PRODUCT_SKIN_TYPES = [
  "oily",
  "dry",
  "combination",
  "normal",
  "sensitive",
  "unknown",
] as const;

export const PRODUCT_CONCERNS = [
  "acne",
  "oiliness",
  "dryness",
  "redness",
  "dark_spots",
  "texture",
  "barrier_support",
  "unknown",
] as const;

export const PRODUCT_SOURCES = ["manual", "admin", "user_submitted"] as const;

export const PRODUCT_VERIFICATION_STATUSES = [
  "unverified",
  "reviewed",
  "verified",
] as const;

export const VISIBLE_PRODUCT_VERIFICATION_STATUSES = [
  "reviewed",
  "verified",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type ProductPriceRange = (typeof PRODUCT_PRICE_RANGES)[number];
export type ProductSkinType = (typeof PRODUCT_SKIN_TYPES)[number];
export type ProductConcern = (typeof PRODUCT_CONCERNS)[number];
export type ProductSource = (typeof PRODUCT_SOURCES)[number];
export type ProductVerificationStatus =
  (typeof PRODUCT_VERIFICATION_STATUSES)[number];

export type ProductDocument = {
  name: string;
  brand: string;
  category: ProductCategory;
  priceRange: ProductPriceRange;
  ingredientsText: string;
  keyActives: string[];
  tags: string[];
  warnings: string[];
  skinTypes: ProductSkinType[];
  concerns: ProductConcern[];
  suitableFor: string[];
  notRecommendedFor: string[];
  source: ProductSource;
  verificationStatus: ProductVerificationStatus;
  createdByUserId?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type Product = WithId<ProductDocument>;
