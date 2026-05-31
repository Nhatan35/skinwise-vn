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
  SkinType,
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
const skinTypeLabels: Record<SkinType, string> = {
  oily: "da dầu",
  dry: "da khô",
  combination: "da hỗn hợp",
  normal: "da thường",
  sensitive: "da nhạy cảm",
  unknown: "loại da chưa rõ",
};
const concernLabels: Record<ProductConcern, string> = {
  acne: "mụn",
  oiliness: "dầu thừa",
  dryness: "khô căng",
  redness: "đỏ da",
  dark_spots: "thâm hoặc đốm tối màu",
  texture: "bề mặt da chưa đều",
  barrier_support: "hàng rào da",
  unknown: "mối quan tâm chưa rõ",
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
    "Nên xem kỹ bảng thành phần và thử trên một vùng da nhỏ trước khi sử dụng rộng rãi.",
    "Đây là thông tin tham khảo, không phải tư vấn y tế.",
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
    reasons.push(`Phù hợp với ${skinTypeLabels[skinProfile.skinType]} của bạn.`);
  }

  if (matchedConcerns.length > 0) {
    score += Math.min(matchedConcerns.length * 10, 30);
    for (const concern of matchedConcerns) {
      reasons.push(
        `Liên quan đến mối quan tâm về ${concernLabels[concern]} của bạn.`,
      );
    }
  }

  if (alignsBudget(skinProfile.budgetRange, product.priceRange)) {
    score += 10;
    reasons.push("Phù hợp với ngân sách bạn đã chọn.");
  }

  if (product.verificationStatus === "verified") {
    score += 5;
    reasons.push("Thông tin sản phẩm đã được xác minh.");
  }

  if (isBeginnerFriendlyCoreCategory(product.category)) {
    score += 5;
    reasons.push("Nhóm sản phẩm phù hợp cho người mới bắt đầu.");
  }

  if (notRecommendedForProfile) {
    score -= 20;
    cautions.push(
      "Cần xem kỹ vì ghi chú sản phẩm có thể chưa phù hợp với hồ sơ da của bạn.",
    );
  }

  if (skinProfile.sensitivityLevel === "high" && strongWarnings) {
    score -= 25;
    cautions.push(
      "Hãy xem kỹ bảng thành phần nếu da bạn dễ nhạy cảm.",
    );
  }

  if (avoidedIngredients.length > 0) {
    score -= 40;
    cautions.push(
      `Sản phẩm này có thể chứa thành phần bạn muốn tránh: ${avoidedIngredients.join(", ")}.`,
    );
  }

  if (skinProfile.experienceLevel === "beginner" && treatmentOrActiveHeavy) {
    score -= 10;
    cautions.push(
      "Nên thêm sản phẩm treatment từ từ, đặc biệt khi bạn mới bắt đầu.",
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
