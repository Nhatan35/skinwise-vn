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
    inciName: "Peptide Complex",
    aliases: ["Peptides", "Signal Peptides"],
    functions: ["skin_support", "humectant"],
    commonUses: ["moisturizer support", "skin-conditioning support"],
    suitableFor: ["normal", "dry", "combination"],
    cautionFor: ["known sensitivity to the product formula"],
    avoidWith: [],
    evidenceLevel: "basic",
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
    inciName: "Tea Tree Oil",
    aliases: ["Melaleuca Alternifolia Leaf Oil"],
    functions: ["essential_oil", "fragrance_component"],
    commonUses: ["scent", "blemish-prone product positioning"],
    suitableFor: ["oily"],
    cautionFor: ["sensitive skin", "redness-prone skin", "fragrance sensitivity"],
    avoidWith: ["irritated skin", "overly complex active routines"],
    evidenceLevel: "uncertain",
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
    tags: ["gentle", "low-ph", "basic-routine"],
    warnings: [],
    skinTypes: ["normal", "combination", "sensitive"],
    concerns: ["dryness", "barrier_support"],
    suitableFor: ["basic morning cleanse", "basic evening cleanse"],
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
    tags: ["barrier-support", "fragrance-free"],
    warnings: [],
    skinTypes: ["dry", "normal", "sensitive"],
    concerns: ["dryness", "redness", "barrier_support"],
    suitableFor: ["basic routine support", "skin that feels tight"],
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
    concerns: ["oiliness", "barrier_support", "texture"],
    suitableFor: ["simple oiliness support", "beginner serum step"],
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
    concerns: ["redness", "dark_spots", "texture"],
    suitableFor: ["single-active evening routine"],
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
    keyActives: ["Salicylic Acid"],
    tags: ["bha", "exfoliant", "weekly-use"],
    warnings: ["Avoid overuse and avoid combining with retinoids in one routine."],
    skinTypes: ["oily", "combination"],
    concerns: ["acne", "oiliness", "texture"],
    suitableFor: ["occasional exfoliation step"],
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
    tags: ["hydrating", "optional-step"],
    warnings: [],
    skinTypes: ["dry", "normal", "combination", "sensitive"],
    concerns: ["dryness", "barrier_support"],
    suitableFor: ["optional hydration layer"],
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
  return {
    ingredients: z.array(ingredientSeedSchema).parse(ingredientSeeds),
    products: z.array(productSeedSchema).parse(productSeeds),
  };
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
