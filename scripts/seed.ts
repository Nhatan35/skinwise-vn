import { pathToFileURL } from "node:url";

import type { BulkWriteResult, Collection } from "mongodb";
import { z } from "zod";

import type { IngredientDocument } from "@/modules/ingredients/ingredient.types";
import { INGREDIENT_EVIDENCE_LEVELS } from "@/modules/ingredients/ingredient.types";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONCERNS,
  PRODUCT_PRICE_RANGES,
  PRODUCT_SOURCES,
  PRODUCT_SKIN_TYPES,
  VISIBLE_PRODUCT_VERIFICATION_STATUSES,
  type ProductDocument,
} from "@/modules/products/product.types";

type IngredientSeed = Omit<IngredientDocument, "createdAt" | "updatedAt">;
type ProductSeed = Omit<
  ProductDocument,
  "createdAt" | "createdByUserId" | "updatedAt"
> & {
  source: "manual";
  verificationStatus: (typeof VISIBLE_PRODUCT_VERIFICATION_STATUSES)[number];
};

type SeedWriteSummary = {
  matchedCount: number;
  modifiedCount: number;
  upsertedCount: number;
};

const MANUAL_PRODUCT_SOURCE = PRODUCT_SOURCES[0];
const stringListSchema = z.array(z.string().trim().min(1));

const ingredientSeedSchema = z
  .object({
    inciName: z.string().trim().min(1).max(160),
    aliases: stringListSchema,
    functions: stringListSchema,
    commonUses: stringListSchema,
    suitableFor: stringListSchema,
    cautionFor: stringListSchema,
    avoidWith: stringListSchema,
    evidenceLevel: z.enum(INGREDIENT_EVIDENCE_LEVELS),
    sourceRefs: stringListSchema,
  })
  .strict();

const productSeedSchema = z
  .object({
    name: z.string().trim().min(1).max(160),
    brand: z.string().trim().min(1).max(100),
    category: z.enum(PRODUCT_CATEGORIES),
    priceRange: z.enum(PRODUCT_PRICE_RANGES),
    ingredientsText: z.string().trim().min(1).max(5000),
    keyActives: stringListSchema,
    tags: stringListSchema,
    warnings: z.array(z.string().trim().min(1)),
    skinTypes: z.array(z.enum(PRODUCT_SKIN_TYPES)).min(1),
    concerns: z.array(z.enum(PRODUCT_CONCERNS)).min(1),
    suitableFor: stringListSchema,
    notRecommendedFor: stringListSchema,
    source: z.literal(MANUAL_PRODUCT_SOURCE),
    verificationStatus: z.enum(VISIBLE_PRODUCT_VERIFICATION_STATUSES),
  })
  .strict();

const requiredProductCategories = [
  "cleanser",
  "moisturizer",
  "sunscreen",
  "treatment",
  "toner",
  "serum",
  "mask",
  "other",
] as const;
const requiredProductSkinTypes = [
  "oily",
  "dry",
  "combination",
  "normal",
  "sensitive",
  "unknown",
] as const;
const requiredProductConcerns = [
  "acne",
  "oiliness",
  "dryness",
  "redness",
  "dark_spots",
  "texture",
  "barrier_support",
  "unknown",
] as const;

function assertSeedCondition(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function normalizeSeedText(value: string) {
  return value.toLowerCase();
}

function productSearchText(product: ProductSeed) {
  return normalizeSeedText(
    [
      product.name,
      product.brand,
      product.ingredientsText,
      ...product.keyActives,
      ...product.tags,
      ...product.warnings,
      ...product.suitableFor,
      ...product.notRecommendedFor,
    ].join(" "),
  );
}

function assertUniqueValues(values: string[], message: string) {
  const seen = new Set<string>();

  for (const value of values) {
    const normalizedValue = normalizeSeedText(value.trim());

    assertSeedCondition(!seen.has(normalizedValue), `${message}: ${value}`);
    seen.add(normalizedValue);
  }
}

function assertEveryRequiredValue<TValue extends string>(
  actualValues: readonly TValue[],
  requiredValues: readonly TValue[],
  label: string,
) {
  const actual = new Set(actualValues);

  for (const requiredValue of requiredValues) {
    assertSeedCondition(
      actual.has(requiredValue),
      `Seed data must cover ${label}: ${requiredValue}`,
    );
  }
}

function assertProductTextIncludes(
  products: ProductSeed[],
  aliases: string[],
  message: string,
) {
  const productTexts = products.map(productSearchText);

  for (const alias of aliases) {
    const normalizedAlias = normalizeSeedText(alias);

    assertSeedCondition(
      productTexts.some((text) => text.includes(normalizedAlias)),
      `${message}: ${alias}`,
    );
  }
}

function assertSeedQuality(input: {
  ingredients: IngredientSeed[];
  products: ProductSeed[];
}) {
  const { ingredients, products } = input;

  assertSeedCondition(
    ingredients.length >= 30,
    "Seed data must include at least 30 ingredients.",
  );
  assertSeedCondition(
    products.length >= 35,
    "Seed data must include at least 35 products.",
  );
  assertUniqueValues(
    ingredients.map((ingredient) => ingredient.inciName),
    "Duplicate ingredient inciName",
  );
  assertUniqueValues(
    products.map((product) => `${product.brand}::${product.name}`),
    "Duplicate product brand/name pair",
  );
  assertEveryRequiredValue(
    products.map((product) => product.category),
    requiredProductCategories,
    "product category",
  );
  assertEveryRequiredValue(
    products.flatMap((product) => product.skinTypes),
    requiredProductSkinTypes,
    "skin type",
  );
  assertEveryRequiredValue(
    products.flatMap((product) => product.concerns),
    requiredProductConcerns,
    "skin concern",
  );
  assertProductTextIncludes(
    products,
    ["sunscreen"],
    "Seed data must support missing-sunscreen demos",
  );
  assertProductTextIncludes(
    products,
    ["mandelic acid", "salicylic acid", "retinol", "benzoyl peroxide"],
    "Seed data must support active-conflict demos",
  );
  assertProductTextIncludes(
    products,
    ["fragrance", "parfum", "essential oil blend"],
    "Seed data must support sensitive-skin fragrance caution demos",
  );
  assertProductTextIncludes(
    products,
    ["ceramide", "panthenol", "glycerin", "cholesterol", "fatty acids", "squalane"],
    "Seed data must support barrier-recovery demos",
  );
  assertProductTextIncludes(
    products,
    ["azelaic acid", "vitamin c", "tranexamic acid", "alpha arbutin", "niacinamide"],
    "Seed data must support uneven-tone demo coverage",
  );
}

const ingredientSeeds = [
  {
    inciName: "Niacinamide",
    aliases: ["Vitamin B3", "Nicotinamide"],
    functions: ["barrier_support", "oil_balance", "active"],
    commonUses: ["oiliness support", "barrier support", "tone support"],
    suitableFor: ["oily", "combination", "normal", "barrier_support"],
    cautionFor: ["very sensitive skin", "recently irritated skin"],
    avoidWith: [],
    evidenceLevel: "moderate",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Salicylic Acid",
    aliases: ["BHA", "Beta Hydroxy Acid"],
    functions: ["exfoliant", "oil_balance", "active"],
    commonUses: ["clogged-pore support", "surface exfoliation"],
    suitableFor: ["oily", "combination", "acne"],
    cautionFor: ["sensitive skin", "dry skin", "over-exfoliated skin"],
    avoidWith: ["retinoids in the same routine", "other strong exfoliants"],
    evidenceLevel: "strong",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Azelaic Acid",
    aliases: ["Azelaic Acid"],
    functions: ["active", "texture_support", "redness_support"],
    commonUses: ["tone support", "redness-prone skin support"],
    suitableFor: ["oily", "combination", "redness", "dark_spots"],
    cautionFor: ["very sensitive skin", "recently irritated skin"],
    avoidWith: ["too many strong actives in one routine"],
    evidenceLevel: "moderate",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Retinol",
    aliases: ["Vitamin A", "Retinoid"],
    functions: ["retinoid", "active", "texture_support"],
    commonUses: ["texture support", "signs-of-aging support"],
    suitableFor: ["normal", "combination", "texture"],
    cautionFor: ["beginners", "sensitive skin", "pregnancy or breastfeeding"],
    avoidWith: ["AHA/BHA in the same routine", "benzoyl peroxide"],
    evidenceLevel: "strong",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Hyaluronic Acid",
    aliases: ["Sodium Hyaluronate", "HA"],
    functions: ["humectant", "hydration_support"],
    commonUses: ["hydration support", "layering under moisturizer"],
    suitableFor: ["dry", "normal", "combination", "barrier_support"],
    cautionFor: ["very dry climates without moisturizer"],
    avoidWith: [],
    evidenceLevel: "moderate",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Glycerin",
    aliases: ["Glycerol"],
    functions: ["humectant", "hydration_support"],
    commonUses: ["hydration support", "cleanser and moisturizer support"],
    suitableFor: ["oily", "combination", "dry", "sensitive"],
    cautionFor: ["known sensitivity to the product formula"],
    avoidWith: [],
    evidenceLevel: "strong",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Ceramide NP",
    aliases: ["Ceramide 3", "Ceramide"],
    functions: ["barrier_support", "emollient"],
    commonUses: ["barrier support", "moisturizer support"],
    suitableFor: ["dry", "sensitive", "barrier_support"],
    cautionFor: ["known sensitivity to the product formula"],
    avoidWith: [],
    evidenceLevel: "moderate",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Panthenol",
    aliases: ["Pro-Vitamin B5", "Dexpanthenol"],
    functions: ["soothing_support", "humectant", "barrier_support"],
    commonUses: ["comfort support", "hydration support"],
    suitableFor: ["dry", "sensitive", "barrier_support", "redness"],
    cautionFor: ["known sensitivity to the product formula"],
    avoidWith: [],
    evidenceLevel: "moderate",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Benzoyl Peroxide",
    aliases: ["BPO"],
    functions: ["active", "blemish_support"],
    commonUses: ["spot-care support", "blemish-prone routine support"],
    suitableFor: ["oily", "acne"],
    cautionFor: ["dry skin", "sensitive skin", "recently irritated skin"],
    avoidWith: ["retinoids in the same routine", "strong exfoliants"],
    evidenceLevel: "strong",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Vitamin C",
    aliases: ["Ascorbic Acid", "Ascorbyl Glucoside"],
    functions: ["antioxidant", "tone_support", "active"],
    commonUses: ["antioxidant support", "dullness support"],
    suitableFor: ["normal", "combination", "dark_spots"],
    cautionFor: ["sensitive skin", "recently irritated skin"],
    avoidWith: ["too many strong actives in one routine"],
    evidenceLevel: "moderate",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Centella Asiatica",
    aliases: ["Cica", "Gotu Kola"],
    functions: ["soothing_support", "barrier_support"],
    commonUses: ["comfort support", "redness-prone skin support"],
    suitableFor: ["sensitive", "redness", "barrier_support"],
    cautionFor: ["known sensitivity to botanical extracts"],
    avoidWith: [],
    evidenceLevel: "basic",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Green Tea Extract",
    aliases: ["Camellia Sinensis Leaf Extract"],
    functions: ["antioxidant", "soothing_support", "skin_conditioning"],
    commonUses: ["comfort support", "oiliness-prone routine support"],
    suitableFor: ["oily", "combination", "redness"],
    cautionFor: ["known sensitivity to botanical extracts"],
    avoidWith: [],
    evidenceLevel: "basic",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Glycolic Acid",
    aliases: ["AHA", "Alpha Hydroxy Acid"],
    functions: ["exfoliant", "texture_support", "active"],
    commonUses: ["surface exfoliation", "texture support"],
    suitableFor: ["normal", "combination", "texture"],
    cautionFor: ["sensitive skin", "dry skin", "sun-sensitive routines"],
    avoidWith: ["retinoids in the same routine", "other strong exfoliants"],
    evidenceLevel: "strong",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Lactic Acid",
    aliases: ["AHA", "Alpha Hydroxy Acid"],
    functions: ["exfoliant", "humectant", "active"],
    commonUses: ["gentler exfoliation support", "texture support"],
    suitableFor: ["normal", "dry", "texture"],
    cautionFor: ["sensitive skin", "over-exfoliated skin"],
    avoidWith: ["retinoids in the same routine", "other strong exfoliants"],
    evidenceLevel: "moderate",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Zinc PCA",
    aliases: ["Zinc Pyrrolidone Carboxylic Acid"],
    functions: ["oil_balance", "skin_conditioning"],
    commonUses: ["oiliness support", "lightweight serum support"],
    suitableFor: ["oily", "combination", "oiliness"],
    cautionFor: ["very dry skin"],
    avoidWith: [],
    evidenceLevel: "basic",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Cholesterol",
    aliases: ["Skin-identical lipid"],
    functions: ["barrier_support", "emollient"],
    commonUses: ["barrier support", "comfort support"],
    suitableFor: ["dry", "sensitive", "barrier_support"],
    cautionFor: ["known sensitivity to the product formula"],
    avoidWith: [],
    evidenceLevel: "moderate",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Fatty Acids",
    aliases: ["Linoleic Acid", "Stearic Acid"],
    functions: ["barrier_support", "emollient"],
    commonUses: ["barrier support", "dryness support"],
    suitableFor: ["dry", "normal", "barrier_support"],
    cautionFor: ["known sensitivity to richer textures"],
    avoidWith: [],
    evidenceLevel: "basic",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Squalane",
    aliases: ["Hydrogenated Squalene"],
    functions: ["emollient", "texture_support"],
    commonUses: ["lightweight emollient support", "moisturizer support"],
    suitableFor: ["dry", "normal", "combination", "barrier_support"],
    cautionFor: ["users who dislike oil-like textures"],
    avoidWith: [],
    evidenceLevel: "basic",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Betaine",
    aliases: ["Trimethylglycine"],
    functions: ["humectant", "hydration_support"],
    commonUses: ["hydration support", "comfort support"],
    suitableFor: ["dry", "normal", "combination", "sensitive"],
    cautionFor: ["known sensitivity to the product formula"],
    avoidWith: [],
    evidenceLevel: "basic",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Urea",
    aliases: ["Carbamide"],
    functions: ["humectant", "texture_support"],
    commonUses: ["dryness support", "rough texture support"],
    suitableFor: ["dry", "texture"],
    cautionFor: ["stinging on cracked or recently irritated skin"],
    avoidWith: ["too many exfoliating products in one routine"],
    evidenceLevel: "moderate",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Sodium PCA",
    aliases: ["PCA Sodium"],
    functions: ["humectant", "hydration_support"],
    commonUses: ["hydration support", "lightweight serum support"],
    suitableFor: ["oily", "combination", "dry", "normal"],
    cautionFor: ["known sensitivity to the product formula"],
    avoidWith: [],
    evidenceLevel: "basic",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Sulfur",
    aliases: ["Sulphur"],
    functions: ["active", "oil_balance"],
    commonUses: ["oiliness support", "blemish-prone routine support"],
    suitableFor: ["oily", "acne"],
    cautionFor: ["dry skin", "sensitive skin", "recently irritated skin"],
    avoidWith: ["other drying spot-care products in the same routine"],
    evidenceLevel: "moderate",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Mandelic Acid",
    aliases: ["AHA", "Alpha Hydroxy Acid"],
    functions: ["exfoliant", "texture_support", "active"],
    commonUses: ["gentle exfoliation support", "uneven texture support"],
    suitableFor: ["normal", "combination", "texture"],
    cautionFor: ["sensitive skin", "recently irritated skin", "over-exfoliated skin"],
    avoidWith: ["retinoids in the same routine", "other strong exfoliants"],
    evidenceLevel: "moderate",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Gluconolactone",
    aliases: ["PHA", "Polyhydroxy Acid"],
    functions: ["exfoliant", "humectant", "texture_support"],
    commonUses: ["mild exfoliation support", "hydration-supporting exfoliant"],
    suitableFor: ["dry", "sensitive", "texture"],
    cautionFor: ["recently irritated skin", "over-exfoliated skin"],
    avoidWith: ["too many exfoliants in one routine"],
    evidenceLevel: "basic",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Retinal",
    aliases: ["Retinaldehyde", "Retinoid"],
    functions: ["retinoid", "active", "texture_support"],
    commonUses: ["texture support", "advanced evening routine support"],
    suitableFor: ["normal", "combination", "texture"],
    cautionFor: ["beginners", "sensitive skin", "pregnancy or breastfeeding"],
    avoidWith: ["AHA/BHA in the same routine", "benzoyl peroxide"],
    evidenceLevel: "moderate",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Adapalene",
    aliases: ["Retinoid"],
    functions: ["retinoid", "active"],
    commonUses: ["blemish-prone routine support", "texture support"],
    suitableFor: ["oily", "acne", "texture"],
    cautionFor: ["beginners", "dry skin", "sensitive skin", "pregnancy or breastfeeding"],
    avoidWith: ["AHA/BHA in the same routine", "benzoyl peroxide without guidance"],
    evidenceLevel: "strong",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Tranexamic Acid",
    aliases: ["TXA"],
    functions: ["tone_support", "active"],
    commonUses: ["uneven tone support", "dark-spot routine support"],
    suitableFor: ["normal", "combination", "dark_spots"],
    cautionFor: ["very sensitive skin", "recently irritated skin"],
    avoidWith: ["too many strong actives in one routine"],
    evidenceLevel: "moderate",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Alpha Arbutin",
    aliases: ["Arbutin"],
    functions: ["tone_support", "active"],
    commonUses: ["uneven tone support", "dark-spot routine support"],
    suitableFor: ["normal", "combination", "dark_spots"],
    cautionFor: ["very sensitive skin", "recently irritated skin"],
    avoidWith: [],
    evidenceLevel: "basic",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Licorice Root Extract",
    aliases: ["Glycyrrhiza Glabra Root Extract"],
    functions: ["soothing_support", "tone_support", "botanical_extract"],
    commonUses: ["comfort support", "uneven tone support"],
    suitableFor: ["sensitive", "redness", "dark_spots"],
    cautionFor: ["known sensitivity to botanical extracts"],
    avoidWith: [],
    evidenceLevel: "basic",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Madecassoside",
    aliases: ["Centella component"],
    functions: ["soothing_support", "barrier_support"],
    commonUses: ["comfort support", "redness-prone skin support"],
    suitableFor: ["sensitive", "redness", "barrier_support"],
    cautionFor: ["known sensitivity to the product formula"],
    avoidWith: [],
    evidenceLevel: "basic",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Allantoin",
    aliases: ["Aluminum Di-Hydroxy Allantoinate"],
    functions: ["soothing_support", "skin_conditioning"],
    commonUses: ["comfort support", "barrier routine support"],
    suitableFor: ["dry", "sensitive", "redness"],
    cautionFor: ["known sensitivity to the product formula"],
    avoidWith: [],
    evidenceLevel: "basic",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Zinc Oxide",
    aliases: ["Mineral UV Filter"],
    functions: ["uv_filter", "skin_protective"],
    commonUses: ["mineral sunscreen filter", "daytime routine support"],
    suitableFor: ["sensitive", "redness", "dark_spots"],
    cautionFor: ["users who dislike white cast or heavier texture"],
    avoidWith: [],
    evidenceLevel: "strong",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Avobenzone",
    aliases: ["Butyl Methoxydibenzoylmethane"],
    functions: ["uv_filter"],
    commonUses: ["UVA sunscreen filter", "daytime routine support"],
    suitableFor: ["normal", "combination", "dark_spots"],
    cautionFor: ["known sensitivity to chemical UV filters"],
    avoidWith: [],
    evidenceLevel: "strong",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine",
    aliases: ["Tinosorb S", "BEMT"],
    functions: ["uv_filter"],
    commonUses: ["broad-spectrum sunscreen filter", "daytime routine support"],
    suitableFor: ["normal", "combination", "dark_spots"],
    cautionFor: ["known sensitivity to sunscreen formulas"],
    avoidWith: [],
    evidenceLevel: "strong",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Fragrance",
    aliases: ["Parfum", "Perfume"],
    functions: ["fragrance_component"],
    commonUses: ["scent"],
    suitableFor: ["users who tolerate fragranced products"],
    cautionFor: ["sensitive skin", "redness-prone skin", "fragrance sensitivity"],
    avoidWith: ["recently irritated skin"],
    evidenceLevel: "uncertain",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Alcohol Denat.",
    aliases: ["Denatured Alcohol"],
    functions: ["solvent", "texture_support"],
    commonUses: ["quick-dry texture", "lightweight finish"],
    suitableFor: ["oily skin that tolerates drying formulas"],
    cautionFor: ["dry skin", "sensitive skin", "recently irritated skin"],
    avoidWith: ["over-exfoliated skin"],
    evidenceLevel: "uncertain",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Menthol",
    aliases: ["Mentha component"],
    functions: ["fragrance_component", "sensory_agent"],
    commonUses: ["cooling feel", "scent"],
    suitableFor: ["users who tolerate cooling fragranced products"],
    cautionFor: ["sensitive skin", "redness-prone skin", "recently irritated skin"],
    avoidWith: ["strong exfoliant routines", "retinoid routines"],
    evidenceLevel: "uncertain",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Dimethicone",
    aliases: ["Silicone"],
    functions: ["emollient", "occlusive", "texture_support"],
    commonUses: ["smooth texture", "barrier-supporting moisturizer feel"],
    suitableFor: ["dry", "normal", "sensitive", "barrier_support"],
    cautionFor: ["users who dislike silicone texture"],
    avoidWith: [],
    evidenceLevel: "basic",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Shea Butter",
    aliases: ["Butyrospermum Parkii Butter"],
    functions: ["emollient", "occlusive"],
    commonUses: ["rich moisturizer support", "dryness support"],
    suitableFor: ["dry", "normal", "barrier_support"],
    cautionFor: ["very oily skin", "users who dislike rich textures"],
    avoidWith: [],
    evidenceLevel: "basic",
    sourceRefs: ["manual-curation"],
  },
  {
    inciName: "Petrolatum",
    aliases: ["Petroleum Jelly"],
    functions: ["occlusive", "barrier_support"],
    commonUses: ["small-area dryness support", "last-step occlusive support"],
    suitableFor: ["dry", "sensitive", "barrier_support"],
    cautionFor: ["very oily skin", "users who dislike heavy textures"],
    avoidWith: [],
    evidenceLevel: "strong",
    sourceRefs: ["manual-curation"],
  },
] satisfies IngredientSeed[];

const productSeeds = [
  {
    name: "Gentle Low pH Cleanser",
    brand: "SkinWise Demo",
    category: "cleanser",
    priceRange: "budget",
    ingredientsText: "Water, Cocamidopropyl Betaine, Glycerin, Panthenol",
    keyActives: ["Panthenol"],
    tags: ["gentle", "low-ph", "basic-routine", "oily-skin-friendly"],
    warnings: [],
    skinTypes: ["oily", "normal", "combination", "sensitive"],
    concerns: ["acne", "oiliness", "dryness", "barrier_support"],
    suitableFor: [
      "basic morning cleanse",
      "basic evening cleanse",
      "beginner oily or combination routine",
    ],
    notRecommendedFor: ["known sensitivity to listed surfactants"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "Creamy Non-Stripping Cleanser",
    brand: "SkinWise Demo",
    category: "cleanser",
    priceRange: "mid",
    ingredientsText: "Water, Glycerin, Mild Surfactant Blend, Ceramide NP",
    keyActives: ["Ceramide NP", "Glycerin"],
    tags: ["cream-cleanser", "barrier-support"],
    warnings: [],
    skinTypes: ["dry", "normal", "sensitive"],
    concerns: ["dryness", "barrier_support", "redness"],
    suitableFor: ["dry-feeling skin", "minimal evening routine"],
    notRecommendedFor: ["users who prefer foaming cleansers"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "Barrier Repair Moisturizer",
    brand: "SkinWise Demo",
    category: "moisturizer",
    priceRange: "mid",
    ingredientsText: "Water, Glycerin, Ceramide NP, Panthenol, Squalane",
    keyActives: ["Ceramide NP", "Panthenol"],
    tags: ["barrier-support", "fragrance-free", "lightweight-gel-cream"],
    warnings: [],
    skinTypes: ["oily", "dry", "normal", "combination", "sensitive"],
    concerns: ["dryness", "redness", "barrier_support", "oiliness"],
    suitableFor: [
      "basic routine support",
      "skin that feels tight",
      "lightweight moisturizer step for oily or combination routines",
    ],
    notRecommendedFor: ["known sensitivity to listed emollients"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "Centella Recovery Cream",
    brand: "SkinWise Demo",
    category: "moisturizer",
    priceRange: "mid",
    ingredientsText: "Water, Centella Asiatica Extract, Glycerin, Panthenol",
    keyActives: ["Centella Asiatica", "Panthenol"],
    tags: ["cica", "soothing-support"],
    warnings: ["Botanical extracts can still bother some sensitive skin."],
    skinTypes: ["normal", "combination", "sensitive"],
    concerns: ["redness", "barrier_support"],
    suitableFor: ["comfort-focused routine", "simple recovery routine"],
    notRecommendedFor: ["known sensitivity to botanical extracts"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "Daily Lightweight Sunscreen SPF50",
    brand: "SkinWise Demo",
    category: "sunscreen",
    priceRange: "mid",
    ingredientsText: "Water, UV Filters, Glycerin, Niacinamide",
    keyActives: ["UV Filters", "Niacinamide"],
    tags: ["sunscreen", "morning-routine", "lightweight"],
    warnings: ["Reapply according to product label, especially with sun exposure."],
    skinTypes: ["oily", "combination", "normal"],
    concerns: ["dark_spots", "oiliness"],
    suitableFor: ["morning routine", "daytime routine planning"],
    notRecommendedFor: ["known sensitivity to listed UV filters"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "Mineral Comfort Sunscreen SPF50",
    brand: "SkinWise Demo",
    category: "sunscreen",
    priceRange: "premium",
    ingredientsText: "Water, Zinc Oxide, Glycerin, Panthenol",
    keyActives: ["Zinc Oxide", "Panthenol"],
    tags: ["sunscreen", "mineral", "sensitive-skin"],
    warnings: ["May leave a visible cast depending on skin tone and amount used."],
    skinTypes: ["dry", "normal", "sensitive"],
    concerns: ["redness", "barrier_support", "dark_spots"],
    suitableFor: ["sensitive morning routine", "daily sun protection step"],
    notRecommendedFor: ["users avoiding mineral sunscreen texture"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "Niacinamide 5% Serum",
    brand: "SkinWise Demo",
    category: "serum",
    priceRange: "budget",
    ingredientsText: "Water, Niacinamide, Zinc PCA, Panthenol",
    keyActives: ["Niacinamide", "Zinc PCA", "Panthenol"],
    tags: ["oiliness-support", "barrier-support", "beginner-active"],
    warnings: ["Introduce gradually if your skin is easily irritated."],
    skinTypes: ["oily", "combination", "normal"],
    concerns: ["acne", "oiliness", "dark_spots", "barrier_support", "texture"],
    suitableFor: [
      "simple oiliness support",
      "beginner serum step",
      "post-acne tone support in a simple routine",
    ],
    notRecommendedFor: ["currently irritated skin"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "Hydrating Hyaluronic Acid Serum",
    brand: "SkinWise Demo",
    category: "serum",
    priceRange: "budget",
    ingredientsText: "Water, Glycerin, Hyaluronic Acid, Panthenol",
    keyActives: ["Hyaluronic Acid", "Panthenol"],
    tags: ["hydrating", "humectant", "basic-routine"],
    warnings: [],
    skinTypes: ["dry", "normal", "combination", "sensitive"],
    concerns: ["dryness", "barrier_support"],
    suitableFor: ["hydration support under moisturizer"],
    notRecommendedFor: ["users who prefer moisturizer-only routines"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "Vitamin C Antioxidant Serum",
    brand: "SkinWise Demo",
    category: "serum",
    priceRange: "premium",
    ingredientsText: "Water, Vitamin C, Ferulic Acid, Glycerin",
    keyActives: ["Vitamin C", "Ferulic Acid"],
    tags: ["antioxidant", "morning-routine"],
    warnings: ["Can tingle or irritate sensitive skin; patch test first."],
    skinTypes: ["normal", "combination", "oily"],
    concerns: ["dark_spots", "texture"],
    suitableFor: ["experienced users adding one morning active"],
    notRecommendedFor: ["very sensitive or currently irritated skin"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "Azelaic Acid 10% Cream",
    brand: "SkinWise Demo",
    category: "treatment",
    priceRange: "mid",
    ingredientsText: "Water, Azelaic Acid, Glycerin, Dimethicone",
    keyActives: ["Azelaic Acid"],
    tags: ["tone-support", "redness-support"],
    warnings: ["May sting at first; avoid layering with too many actives."],
    skinTypes: ["oily", "combination", "normal"],
    concerns: ["acne", "redness", "dark_spots", "texture"],
    suitableFor: [
      "single-active evening routine",
      "post-acne mark support without adding multiple strong actives",
    ],
    notRecommendedFor: ["freshly irritated or compromised skin"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "BHA 2% Exfoliant",
    brand: "SkinWise Demo",
    category: "treatment",
    priceRange: "mid",
    ingredientsText: "Water, Salicylic Acid, Glycerin, Green Tea Extract",
    keyActives: ["Salicylic Acid", "Green Tea Extract"],
    tags: ["bha", "exfoliant", "weekly-use", "pore-support"],
    warnings: ["Avoid overuse and avoid combining with retinoids in one routine."],
    skinTypes: ["oily", "combination"],
    concerns: ["acne", "oiliness", "dark_spots", "texture"],
    suitableFor: [
      "occasional exfoliation step",
      "clogged-pore support for non-irritated oily skin",
    ],
    notRecommendedFor: ["sensitive, dry, or over-exfoliated skin"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "Retinol 0.2% Night Serum",
    brand: "SkinWise Demo",
    category: "treatment",
    priceRange: "mid",
    ingredientsText: "Water, Retinol, Glycerin, Peptide Complex",
    keyActives: ["Retinol", "Peptide Complex"],
    tags: ["retinoid", "night-routine", "advanced-active"],
    warnings: ["Introduce slowly; avoid same-routine AHA/BHA combinations."],
    skinTypes: ["normal", "combination"],
    concerns: ["texture"],
    suitableFor: ["experienced evening routine users"],
    notRecommendedFor: ["pregnancy or breastfeeding without professional guidance"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "Benzoyl Peroxide Spot Treatment",
    brand: "SkinWise Demo",
    category: "treatment",
    priceRange: "budget",
    ingredientsText: "Water, Benzoyl Peroxide, Glycerin",
    keyActives: ["Benzoyl Peroxide"],
    tags: ["spot-care", "blemish-support"],
    warnings: ["Can feel drying; avoid layering with retinoids in one routine."],
    skinTypes: ["oily", "combination"],
    concerns: ["acne", "oiliness"],
    suitableFor: ["limited spot-care use as directed by product label"],
    notRecommendedFor: ["sensitive or very dry skin"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "Gentle Hydrating Toner",
    brand: "SkinWise Demo",
    category: "toner",
    priceRange: "budget",
    ingredientsText: "Water, Glycerin, Panthenol, Hyaluronic Acid",
    keyActives: ["Panthenol", "Hyaluronic Acid"],
    tags: ["hydrating", "optional-step", "soothing-support"],
    warnings: [],
    skinTypes: ["dry", "normal", "combination", "sensitive"],
    concerns: ["dryness", "redness", "barrier_support"],
    suitableFor: ["optional hydration layer", "soothing toner step"],
    notRecommendedFor: ["users keeping routines very minimal"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "Basic Occlusive Balm",
    brand: "SkinWise Demo",
    category: "other",
    priceRange: "budget",
    ingredientsText: "Petrolatum, Mineral Oil, Panthenol",
    keyActives: ["Panthenol"],
    tags: ["occlusive", "dryness-support", "minimal-routine"],
    warnings: ["Can feel heavy or occlusive for oily skin."],
    skinTypes: ["dry", "normal", "sensitive"],
    concerns: ["dryness", "barrier_support"],
    suitableFor: ["small-area dryness support", "last step over moisturizer"],
    notRecommendedFor: ["very oily skin or dislike of heavy textures"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "ClearLeaf Gentle Low pH Cleanser",
    brand: "ClearLeaf Lab",
    category: "cleanser",
    priceRange: "budget",
    ingredientsText: "Water, Cocamidopropyl Betaine, Glycerin, Panthenol, Allantoin",
    keyActives: ["Glycerin", "Panthenol", "Allantoin"],
    tags: ["gentle", "low-ph", "fragrance-free", "basic-routine"],
    warnings: ["Patch test if your skin is currently reactive or recently irritated."],
    skinTypes: ["normal", "combination", "sensitive"],
    concerns: ["dryness", "redness", "barrier_support"],
    suitableFor: ["basic morning cleanse", "basic evening cleanse", "sensitive routine foundation"],
    notRecommendedFor: ["known sensitivity to listed surfactants"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "FreshPlain Oil Balance Gel Cleanser",
    brand: "FreshPlain",
    category: "cleanser",
    priceRange: "mid",
    ingredientsText: "Water, Sodium Cocoyl Glutamate, Glycerin, Zinc PCA, Green Tea Extract",
    keyActives: ["Zinc PCA", "Green Tea Extract"],
    tags: ["gel-cleanser", "oiliness-support", "fragrance-free"],
    warnings: ["Avoid over-cleansing even when skin feels oily."],
    skinTypes: ["oily", "combination", "normal"],
    concerns: ["oiliness", "acne", "texture"],
    suitableFor: ["oily morning routine", "lightweight evening cleanse"],
    notRecommendedFor: ["very dry or recently irritated skin"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "AquaMild Betaine Hydration Toner",
    brand: "AquaMild",
    category: "toner",
    priceRange: "budget",
    ingredientsText: "Water, Glycerin, Betaine, Sodium PCA, Panthenol",
    keyActives: ["Betaine", "Sodium PCA", "Panthenol"],
    tags: ["hydrating", "fragrance-free", "optional-step"],
    warnings: ["Optional step; moisturizer is still useful for sealing hydration."],
    skinTypes: ["dry", "normal", "combination", "sensitive"],
    concerns: ["dryness", "barrier_support", "redness"],
    suitableFor: ["hydration layer under moisturizer", "simple recovery routine"],
    notRecommendedFor: ["users who prefer very minimal routines"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "FreshPlain Cooling Botanical Toner",
    brand: "FreshPlain",
    category: "toner",
    priceRange: "mid",
    ingredientsText: "Water, Glycerin, Green Tea Extract, Fragrance, Menthol",
    keyActives: ["Green Tea Extract", "Fragrance", "Menthol"],
    tags: ["botanical", "fragranced", "cooling-feel"],
    warnings: ["Contains Fragrance and Menthol; use with caution if skin is sensitive or recently irritated."],
    skinTypes: ["oily", "combination"],
    concerns: ["oiliness", "redness"],
    suitableFor: ["users who tolerate fragranced lightweight toners"],
    notRecommendedFor: ["sensitive skin", "redness-prone skin", "recently irritated skin"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "AquaMild Hyaluronic Hydration Serum",
    brand: "AquaMild",
    category: "serum",
    priceRange: "budget",
    ingredientsText: "Water, Glycerin, Hyaluronic Acid, Sodium PCA, Panthenol",
    keyActives: ["Hyaluronic Acid", "Sodium PCA", "Panthenol"],
    tags: ["hydrating", "humectant", "fragrance-free"],
    warnings: ["Use with moisturizer if your skin feels dry after humectant layers."],
    skinTypes: ["dry", "normal", "combination", "sensitive"],
    concerns: ["dryness", "barrier_support"],
    suitableFor: ["hydration support under moisturizer", "beginner serum step"],
    notRecommendedFor: ["users who prefer moisturizer-only routines"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "GlowBase Azelaic Tone Support Serum",
    brand: "GlowBase",
    category: "serum",
    priceRange: "mid",
    ingredientsText: "Water, Azelaic Acid, Niacinamide, Glycerin, Dimethicone",
    keyActives: ["Azelaic Acid", "Niacinamide"],
    tags: ["tone-support", "redness-support", "single-active"],
    warnings: ["May sting on recently irritated skin; introduce slowly."],
    skinTypes: ["oily", "combination", "normal"],
    concerns: ["dark_spots", "redness", "texture", "acne"],
    suitableFor: ["single-active evening routine", "uneven tone support"],
    notRecommendedFor: ["freshly irritated or over-exfoliated skin"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "GlowBase Tranexamic Bright Tone Serum",
    brand: "GlowBase",
    category: "serum",
    priceRange: "premium",
    ingredientsText: "Water, Tranexamic Acid, Alpha Arbutin, Licorice Root Extract, Glycerin",
    keyActives: ["Tranexamic Acid", "Alpha Arbutin", "Licorice Root Extract"],
    tags: ["tone-support", "dark-spot-support", "fragrance-free"],
    warnings: ["Use sunscreen in the morning when working on uneven tone concerns."],
    skinTypes: ["normal", "combination", "dry"],
    concerns: ["dark_spots", "texture", "barrier_support"],
    suitableFor: ["uneven tone support", "routine with consistent sunscreen"],
    notRecommendedFor: ["currently irritated skin"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "SkinKind L-Ascorbic Antioxidant Serum",
    brand: "SkinKind Lab",
    category: "serum",
    priceRange: "premium",
    ingredientsText: "Water, L Ascorbic Acid, Ferulic Acid, Glycerin",
    keyActives: ["L Ascorbic Acid", "Vitamin C"],
    tags: ["antioxidant", "morning-routine", "strong-active"],
    warnings: ["Can tingle; avoid stacking with too many strong actives if skin is sensitive."],
    skinTypes: ["normal", "combination", "oily"],
    concerns: ["dark_spots", "texture"],
    suitableFor: ["experienced users adding one morning antioxidant active"],
    notRecommendedFor: ["very sensitive or recently irritated skin"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "ClearBalance Zinc PCA Oil Serum",
    brand: "ClearBalance",
    category: "serum",
    priceRange: "budget",
    ingredientsText: "Water, Niacinamide, Zinc PCA, Green Tea Extract, Panthenol",
    keyActives: ["Niacinamide", "Zinc PCA", "Green Tea Extract"],
    tags: ["oiliness-support", "lightweight", "fragrance-free"],
    warnings: ["Introduce gradually if your skin reacts easily to active serums."],
    skinTypes: ["oily", "combination"],
    concerns: ["oiliness", "acne", "barrier_support"],
    suitableFor: ["lightweight oiliness support", "beginner-friendly serum routine"],
    notRecommendedFor: ["currently irritated skin"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "CicaTheory Madecassoside Comfort Serum",
    brand: "CicaTheory",
    category: "serum",
    priceRange: "mid",
    ingredientsText: "Water, Centella Asiatica Extract, Madecassoside, Allantoin, Glycerin",
    keyActives: ["Centella Asiatica", "Madecassoside", "Allantoin"],
    tags: ["cica", "soothing-support", "fragrance-free"],
    warnings: ["Botanical extracts can still bother some users; patch test first."],
    skinTypes: ["sensitive", "dry", "normal", "combination"],
    concerns: ["redness", "dryness", "barrier_support"],
    suitableFor: ["comfort-focused routine", "barrier recovery routine"],
    notRecommendedFor: ["known sensitivity to botanical extracts"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "CalmBarrier Ceramide Recovery Cream",
    brand: "CalmBarrier",
    category: "moisturizer",
    priceRange: "mid",
    ingredientsText: "Water, Glycerin, Ceramide NP, Cholesterol, Fatty Acids, Panthenol",
    keyActives: ["Ceramide NP", "Cholesterol", "Fatty Acids", "Panthenol"],
    tags: ["barrier-support", "fragrance-free", "recovery-cream"],
    warnings: ["Rich textures may feel heavy for very oily skin."],
    skinTypes: ["dry", "normal", "sensitive"],
    concerns: ["dryness", "redness", "barrier_support"],
    suitableFor: ["barrier recovery routine", "dry or tight-feeling skin"],
    notRecommendedFor: ["very oily skin that dislikes rich creams"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "DermaPlain Fragrance-Free Barrier Lotion",
    brand: "DermaPlain",
    category: "moisturizer",
    priceRange: "budget",
    ingredientsText: "Water, Glycerin, Squalane, Dimethicone, Allantoin",
    keyActives: ["Squalane", "Dimethicone", "Allantoin"],
    tags: ["fragrance-free", "barrier-support", "lotion"],
    warnings: ["Patch test if you are sensitive to silicone textures."],
    skinTypes: ["normal", "combination", "sensitive"],
    concerns: ["dryness", "redness", "barrier_support"],
    suitableFor: ["daily moisturizer step", "simple sensitive-skin routine"],
    notRecommendedFor: ["known sensitivity to silicone textures"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "BarrierNest Panthenol Repair Balm",
    brand: "BarrierNest",
    category: "moisturizer",
    priceRange: "premium",
    ingredientsText: "Water, Petrolatum, Shea Butter, Panthenol, Ceramide NP",
    keyActives: ["Panthenol", "Ceramide NP", "Petrolatum"],
    tags: ["rich-balm", "dryness-support", "barrier-support"],
    warnings: ["Can feel heavy; use a thin layer or small-area application if preferred."],
    skinTypes: ["dry", "sensitive"],
    concerns: ["dryness", "barrier_support", "redness"],
    suitableFor: ["night routine for dry-feeling skin", "small-area dryness support"],
    notRecommendedFor: ["very oily skin or dislike of occlusive textures"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "SunNest Mineral Comfort Sunscreen SPF50",
    brand: "SunNest",
    category: "sunscreen",
    priceRange: "mid",
    ingredientsText: "Water, Zinc Oxide, Titanium Dioxide, Glycerin, Panthenol",
    keyActives: ["Zinc Oxide", "Titanium Dioxide", "Panthenol"],
    tags: ["sunscreen", "mineral", "fragrance-free", "morning-routine"],
    warnings: ["May leave a visible cast depending on amount used and skin tone."],
    skinTypes: ["sensitive", "dry", "normal"],
    concerns: ["dark_spots", "redness", "barrier_support"],
    suitableFor: ["morning routine", "sensitive daytime routine"],
    notRecommendedFor: ["users avoiding mineral sunscreen texture"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "DailyKind Lightweight Sunscreen SPF50",
    brand: "DailyKind",
    category: "sunscreen",
    priceRange: "budget",
    ingredientsText: "Water, Avobenzone, Tinosorb S, Glycerin, Niacinamide",
    keyActives: ["Avobenzone", "Tinosorb S", "Niacinamide"],
    tags: ["sunscreen", "lightweight", "morning-routine"],
    warnings: ["Reapply according to the product label, especially with sun exposure."],
    skinTypes: ["oily", "combination", "normal"],
    concerns: ["dark_spots", "oiliness"],
    suitableFor: ["daily morning routine", "lightweight sunscreen step"],
    notRecommendedFor: ["known sensitivity to listed UV filters"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "SoftRoutine Dew Sunscreen SPF50",
    brand: "SoftRoutine",
    category: "sunscreen",
    priceRange: "mid",
    ingredientsText: "Water, Tinosorb S, Glycerin, Squalane, Hyaluronic Acid",
    keyActives: ["Tinosorb S", "Hyaluronic Acid", "Squalane"],
    tags: ["sunscreen", "dewy-finish", "dryness-support"],
    warnings: ["Dewy finish may feel shiny for very oily skin."],
    skinTypes: ["dry", "normal", "combination"],
    concerns: ["dark_spots", "dryness", "barrier_support"],
    suitableFor: ["morning routine for dry-feeling skin"],
    notRecommendedFor: ["very oily skin that dislikes dewy finishes"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "BalanceLab Matte Day Sunscreen SPF50",
    brand: "BalanceLab",
    category: "sunscreen",
    priceRange: "premium",
    ingredientsText: "Water, Avobenzone, Tinosorb S, Alcohol Denat., Zinc PCA",
    keyActives: ["Avobenzone", "Tinosorb S", "Zinc PCA", "Alcohol Denat."],
    tags: ["sunscreen", "matte-finish", "oiliness-support"],
    warnings: ["Contains Alcohol Denat.; use with caution if skin is dry, sensitive, or recently irritated."],
    skinTypes: ["oily", "combination"],
    concerns: ["oiliness", "dark_spots"],
    suitableFor: ["matte morning routine for oilier skin"],
    notRecommendedFor: ["dry skin", "sensitive skin", "recently irritated skin"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "MildTheory Mandelic PHA Resurfacing Liquid",
    brand: "MildTheory",
    category: "treatment",
    priceRange: "mid",
    ingredientsText: "Water, Mandelic Acid, Gluconolactone, Glycerin, Panthenol",
    keyActives: ["Mandelic Acid", "PHA", "Gluconolactone"],
    tags: ["aha", "pha", "exfoliant", "weekly-use"],
    warnings: ["Avoid overuse and avoid combining with retinoids or other exfoliants in the same routine."],
    skinTypes: ["normal", "combination", "dry"],
    concerns: ["texture", "dark_spots", "dryness"],
    suitableFor: ["occasional exfoliation support", "experienced users using sunscreen consistently"],
    notRecommendedFor: ["sensitive, over-exfoliated, or recently irritated skin"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "ClearBalance BHA Pore Support Liquid",
    brand: "ClearBalance",
    category: "treatment",
    priceRange: "budget",
    ingredientsText: "Water, Salicylic Acid, BHA, Green Tea Extract, Glycerin",
    keyActives: ["Salicylic Acid", "BHA"],
    tags: ["bha", "exfoliant", "pore-support", "weekly-use"],
    warnings: ["Avoid same-routine retinoids and avoid overuse, especially if skin is sensitive."],
    skinTypes: ["oily", "combination"],
    concerns: ["acne", "oiliness", "texture"],
    suitableFor: ["occasional clogged-pore support", "simple routine with moisturizer"],
    notRecommendedFor: ["dry, sensitive, or over-exfoliated skin"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "RoutineBase Retinal Night Support",
    brand: "RoutineBase",
    category: "treatment",
    priceRange: "premium",
    ingredientsText: "Water, Retinal, Retinoid, Glycerin, Peptide Complex",
    keyActives: ["Retinal", "Retinoid", "Peptide Complex"],
    tags: ["retinoid", "night-routine", "advanced-active"],
    warnings: ["Introduce slowly; avoid same-routine AHA/BHA products and use daytime sunscreen."],
    skinTypes: ["normal", "combination"],
    concerns: ["texture", "dark_spots"],
    suitableFor: ["experienced evening routine users"],
    notRecommendedFor: ["beginners", "sensitive skin", "pregnancy or breastfeeding without professional guidance"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "DewKind Urea Squalane Comfort Lotion",
    brand: "DewKind",
    category: "moisturizer",
    priceRange: "mid",
    ingredientsText: "Water, Glycerin, Urea, Squalane, Dimethicone, Panthenol",
    keyActives: ["Urea", "Squalane", "Panthenol"],
    tags: ["comfort-lotion", "dryness-support", "barrier-support"],
    warnings: ["Urea can sting on cracked or recently irritated skin; patch test first."],
    skinTypes: ["dry", "normal", "combination"],
    concerns: ["dryness", "texture", "barrier_support"],
    suitableFor: ["dryness support", "rough-feeling texture support", "simple evening moisturizer"],
    notRecommendedFor: ["currently cracked, stinging, or recently irritated skin"],
    source: "manual",
    verificationStatus: "reviewed",
  },
  {
    name: "PureCica Recovery Gel Mask",
    brand: "PureCica",
    category: "mask",
    priceRange: "mid",
    ingredientsText: "Water, Centella Asiatica Extract, Madecassoside, Panthenol, Allantoin",
    keyActives: ["Centella Asiatica", "Madecassoside", "Panthenol"],
    tags: ["mask", "cica", "soothing-support", "fragrance-free"],
    warnings: ["Use as an optional support step; do not replace moisturizer if skin feels dry."],
    skinTypes: ["sensitive", "dry", "normal", "combination"],
    concerns: ["redness", "dryness", "barrier_support"],
    suitableFor: ["comfort-focused weekly routine", "post-active rest night"],
    notRecommendedFor: ["known sensitivity to botanical extracts"],
    source: "manual",
    verificationStatus: "verified",
  },
  {
    name: "CicaNest Aromatic Clay Mask",
    brand: "CicaNest",
    category: "mask",
    priceRange: "mid",
    ingredientsText: "Water, Kaolin, Green Tea Extract, Parfum, Essential Oil Blend",
    keyActives: ["Green Tea Extract", "Parfum", "Essential Oil Blend"],
    tags: ["mask", "clay", "fragranced"],
    warnings: ["Contains Parfum and Essential Oil Blend; use with caution if skin is sensitive or redness-prone."],
    skinTypes: ["oily", "combination", "unknown"],
    concerns: ["oiliness", "unknown"],
    suitableFor: ["users who tolerate fragranced clay masks"],
    notRecommendedFor: ["sensitive skin", "redness-prone skin", "recently irritated skin"],
    source: "manual",
    verificationStatus: "reviewed",
  },
] satisfies ProductSeed[];

function requireMongoUriFromProcess() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is required before running db:seed.");
  }

  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    throw new Error("MONGODB_URI must start with mongodb:// or mongodb+srv://.");
  }
}

function validateSeedData() {
  const seedData = {
    ingredients: z.array(ingredientSeedSchema).parse(ingredientSeeds),
    products: z.array(productSeedSchema).parse(productSeeds),
  };

  assertSeedQuality(seedData);

  return seedData;
}

function summarizeWriteResult(result: BulkWriteResult): SeedWriteSummary {
  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
    upsertedCount: result.upsertedCount,
  };
}

async function seedIngredients(
  collection: Collection<IngredientDocument>,
  ingredients: IngredientSeed[],
) {
  const now = new Date();
  const result = await collection.bulkWrite(
    ingredients.map((ingredient) => ({
      updateOne: {
        filter: {
          inciName: ingredient.inciName,
        },
        update: {
          $set: {
            ...ingredient,
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt: now,
          },
        },
        upsert: true,
      },
    })),
    { ordered: true },
  );

  return summarizeWriteResult(result);
}

async function seedProducts(
  collection: Collection<ProductDocument>,
  products: ProductSeed[],
) {
  const now = new Date();
  const result = await collection.bulkWrite(
    products.map((product) => ({
      updateOne: {
        filter: {
          brand: product.brand,
          name: product.name,
          source: MANUAL_PRODUCT_SOURCE,
        },
        update: {
          $set: {
            ...product,
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt: now,
          },
        },
        upsert: true,
      },
    })),
    { ordered: true },
  );

  return summarizeWriteResult(result);
}

function printSummary(
  databaseName: string,
  ingredients: SeedWriteSummary,
  products: SeedWriteSummary,
) {
  console.info(`db:seed connected database: ${databaseName}`);
  console.info(`ingredients matched: ${ingredients.matchedCount}`);
  console.info(`ingredients inserted/upserted: ${ingredients.upsertedCount}`);
  console.info(`ingredients modified: ${ingredients.modifiedCount}`);
  console.info(`products matched: ${products.matchedCount}`);
  console.info(`products inserted/upserted: ${products.upsertedCount}`);
  console.info(`products modified: ${products.modifiedCount}`);
}

export async function main() {
  const seedData = validateSeedData();

  requireMongoUriFromProcess();

  const [{ getMongoClient, getMongoDb }, collections] = await Promise.all([
    import("@/infrastructure/database/mongodb"),
    import("@/infrastructure/database/collections"),
  ]);
  const client = await getMongoClient();

  try {
    const db = await getMongoDb();
    const [ingredientsCollection, productsCollection] = await Promise.all([
      collections.getIngredientsCollection<IngredientDocument>(),
      collections.getProductsCollection<ProductDocument>(),
    ]);
    const [ingredientSummary, productSummary] = await Promise.all([
      seedIngredients(ingredientsCollection, seedData.ingredients),
      seedProducts(productsCollection, seedData.products),
    ]);

    printSummary(db.databaseName, ingredientSummary, productSummary);
  } finally {
    await client.close();
  }
}

function isDirectInvocation() {
  const invokedPath = process.argv[1];

  return Boolean(
    invokedPath && import.meta.url === pathToFileURL(invokedPath).href,
  );
}

if (isDirectInvocation()) {
  main().catch((error: unknown) => {
    console.error("db:seed failed");

    if (error instanceof z.ZodError) {
      for (const issue of error.issues) {
        console.error(`${issue.path.join(".")}: ${issue.message}`);
      }
    } else {
      console.error(error instanceof Error ? error.message : "Unknown error");
    }

    process.exitCode = 1;
  });
}
