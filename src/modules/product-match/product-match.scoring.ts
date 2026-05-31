import type {
  ProductCategory,
  ProductConcern,
  ProductPriceRange,
} from "@/modules/products/product.types";
import type { Product } from "@/modules/products/product.types";
import type { ProductMatchLevel } from "@/modules/product-match/product-match.dto";
import type {
  BudgetRange,
  SkinProfile,
} from "@/modules/skin-profile/skin-profile.types";

const beginnerFriendlyCoreCategories = new Set<ProductCategory>([
  "cleanser",
  "moisturizer",
  "sunscreen",
]);
const treatmentOrActiveHeavyCategories = new Set<ProductCategory>([
  "treatment",
]);
const strongWarningTerms = [
  "irritation",
  "irritate",
  "exfoliation",
  "exfoliant",
  "exfoliating",
  "retinoid",
  "retinol",
  "acid",
  "peeling",
  "stinging",
  "sting",
  "sensitive skin",
  "aha",
  "bha",
  "benzoyl peroxide",
  "salicylic acid",
  "glycolic acid",
  "lactic acid",
  "vitamin c",
  "ascorbic acid",
];
const budgetAlignment: Record<BudgetRange, ProductPriceRange[]> = {
  under_300k: ["budget"],
  "300k_700k": ["budget", "mid"],
  "700k_1500k": ["mid", "premium"],
  above_1500k: ["premium"],
};

export type ProductMatchScoringResult = {
  matchScore: number;
  matchLevel: ProductMatchLevel;
  reasons: string[];
  cautions: string[];
  matchedSignals: {
    skinType: boolean;
    concerns: ProductConcern[];
    budget: boolean;
    sensitivity: boolean;
    avoidedIngredients: string[];
  };
};

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function normalizeList(values: string[] | undefined) {
  return (values ?? []).map(normalizeText).filter(Boolean);
}

function includesAnyTerm(text: string, terms: string[]) {
  const normalizedText = normalizeText(text);

  return terms.some((term) => normalizedText.includes(term));
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, score));
}

export function alignsBudget(
  profileBudgetRange: BudgetRange,
  productPriceRange: ProductPriceRange,
) {
  if (productPriceRange === "unknown") {
    return false;
  }

  return budgetAlignment[profileBudgetRange]?.includes(productPriceRange) ?? false;
}

export function getMatchedConcerns(
  profileConcerns: ProductConcern[],
  product: Pick<Product, "concerns">,
) {
  const productConcerns = new Set(product.concerns ?? []);

  return profileConcerns.filter(
    (concern) => concern !== "unknown" && productConcerns.has(concern),
  );
}

export function detectAvoidedIngredients(
  profileAvoidIngredients: string[],
  product: Pick<Product, "ingredientsText" | "keyActives" | "tags">,
) {
  const avoidIngredients = normalizeList(profileAvoidIngredients);

  if (avoidIngredients.length === 0) {
    return [];
  }

  const searchableText = normalizeList([
    product.ingredientsText ?? "",
    ...(product.keyActives ?? []),
    ...(product.tags ?? []),
  ]).join(" ");

  return profileAvoidIngredients
    .map((ingredient) => ingredient.trim())
    .filter((ingredient) => ingredient.length > 0)
    .filter((ingredient, index, allIngredients) => {
      const normalizedIngredient = normalizeText(ingredient);

      return (
        allIngredients.findIndex(
          (item) => normalizeText(item) === normalizedIngredient,
        ) === index && searchableText.includes(normalizedIngredient)
      );
    });
}

export function hasStrongWarnings(
  product: Pick<Product, "warnings" | "keyActives">,
) {
  const warningText = normalizeList(product.warnings ?? []).join(" ");
  const activeText = normalizeList(product.keyActives ?? []).join(" ");

  return (
    includesAnyTerm(warningText, strongWarningTerms) ||
    includesAnyTerm(activeText, strongWarningTerms)
  );
}

export function isBeginnerFriendlyCoreCategory(category: ProductCategory) {
  return beginnerFriendlyCoreCategories.has(category);
}

export function isTreatmentOrActiveHeavy(product: Pick<Product, "category" | "keyActives">) {
  return (
    treatmentOrActiveHeavyCategories.has(product.category) ||
    includesAnyTerm(normalizeList(product.keyActives ?? []).join(" "), strongWarningTerms)
  );
}

export function getMatchLevel(
  score: number,
  context: {
    avoidedIngredients: string[];
    hasStrongWarnings: boolean;
    highSensitivity: boolean;
  },
): ProductMatchLevel {
  let matchLevel: ProductMatchLevel =
    score >= 80 ? "strong" : score >= 60 ? "good" : score >= 40 ? "cautious" : "low";

  if (context.avoidedIngredients.length > 0 && matchLevel === "strong") {
    matchLevel = "good";
  }

  if (
    context.avoidedIngredients.length > 0 &&
    context.hasStrongWarnings &&
    score >= 40
  ) {
    matchLevel = "cautious";
  }

  if (
    context.highSensitivity &&
    context.hasStrongWarnings &&
    matchLevel === "strong"
  ) {
    matchLevel = "good";
  }

  return matchLevel;
}

function isNotRecommendedForProfile(
  product: Pick<Product, "notRecommendedFor">,
  skinProfile: SkinProfile,
) {
  const notRecommendedText = normalizeList(product.notRecommendedFor ?? []).join(" ");
  const skinType = normalizeText(skinProfile.skinType);

  return (
    (skinType !== "unknown" && notRecommendedText.includes(skinType)) ||
    (skinProfile.sensitivityLevel === "high" &&
      (notRecommendedText.includes("sensitive") ||
        notRecommendedText.includes("irritated")))
  );
}

export function scoreProductMatch(input: {
  product: Product;
  skinProfile: SkinProfile;
}): ProductMatchScoringResult {
  const { product, skinProfile } = input;
  const reasons: string[] = [];
  const cautions = [
    "Review the ingredient list carefully and patch test before applying widely.",
    "This is educational guidance, not medical advice.",
  ];
  const matchedConcerns = getMatchedConcerns(skinProfile.concerns, product);
  const avoidedIngredients = detectAvoidedIngredients(
    skinProfile.avoidIngredients,
    product,
  );
  const strongWarnings = hasStrongWarnings(product);
  const notRecommendedForProfile = isNotRecommendedForProfile(
    product,
    skinProfile,
  );
  const treatmentOrActiveHeavy = isTreatmentOrActiveHeavy(product);
  let score = 40;

  if (
    skinProfile.skinType !== "unknown" &&
    (product.skinTypes ?? []).includes(skinProfile.skinType)
  ) {
    score += 25;
    reasons.push(`Matches your ${skinProfile.skinType} skin type.`);
  }

  if (matchedConcerns.length > 0) {
    score += Math.min(matchedConcerns.length * 10, 30);
    for (const concern of matchedConcerns) {
      reasons.push(`Matches your ${concern} concern.`);
    }
  }

  if (alignsBudget(skinProfile.budgetRange, product.priceRange)) {
    score += 10;
    reasons.push("Fits your selected budget range.");
  }

  if (product.verificationStatus === "verified") {
    score += 5;
    reasons.push("Verified product information.");
  }

  if (isBeginnerFriendlyCoreCategory(product.category)) {
    score += 5;
    reasons.push("Beginner-friendly product category.");
  }

  if (notRecommendedForProfile) {
    score -= 20;
    cautions.push(
      "Review this product carefully because its notes may not fit your skin profile.",
    );
  }

  if (skinProfile.sensitivityLevel === "high" && strongWarnings) {
    score -= 25;
    cautions.push(
      "Review the ingredient list carefully if your skin is highly sensitive.",
    );
  }

  if (avoidedIngredients.length > 0) {
    score -= 40;
    cautions.push(
      `This product may contain an ingredient you prefer to avoid: ${avoidedIngredients.join(", ")}.`,
    );
  }

  if (skinProfile.experienceLevel === "beginner" && treatmentOrActiveHeavy) {
    score -= 10;
    cautions.push(
      "Introduce treatment products slowly, especially if you are a beginner.",
    );
  }

  const matchScore = clampScore(score);

  return {
    matchScore,
    matchLevel: getMatchLevel(matchScore, {
      avoidedIngredients,
      hasStrongWarnings: strongWarnings,
      highSensitivity: skinProfile.sensitivityLevel === "high",
    }),
    reasons,
    cautions,
    matchedSignals: {
      skinType:
        skinProfile.skinType !== "unknown" &&
        (product.skinTypes ?? []).includes(skinProfile.skinType),
      concerns: matchedConcerns,
      budget: alignsBudget(skinProfile.budgetRange, product.priceRange),
      sensitivity: skinProfile.sensitivityLevel === "high" && strongWarnings,
      avoidedIngredients,
    },
  };
}
