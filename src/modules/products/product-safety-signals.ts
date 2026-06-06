import type { ProductCategory } from "@/modules/products/product.types";

type ProductSafetySignalSource = {
  category?: ProductCategory;
  ingredientsText?: string;
  keyActives?: string[];
  notRecommendedFor?: string[];
  tags?: string[];
  warnings?: string[];
};

const exfoliatingAcidTerms = [
  "aha",
  "bha",
  "pha",
  "salicylic acid",
  "glycolic acid",
  "lactic acid",
  "mandelic acid",
  "gluconolactone",
  "polyhydroxy acid",
  "exfoliant",
  "exfoliating",
  "exfoliation",
];

const retinoidTerms = [
  "retinoid",
  "retinol",
  "retinal",
  "retinaldehyde",
  "tretinoin",
  "adapalene",
];

const benzoylPeroxideTerms = ["benzoyl peroxide"];
const sulfurTerms = ["sulfur", "sulphur"];
const teaTreeOilTerms = ["tea tree oil"];
const vitaminCTerms = [
  "strong vitamin c",
  "vitamin c",
  "ascorbic acid",
  "l-ascorbic acid",
  "sodium ascorbyl phosphate",
];
const fragranceTerms = [
  "fragrance",
  "fragranced",
  "parfum",
  "essential oil",
  "essential oils",
  "essential-oil",
  "essential oil blend",
];
const irritationWarningTerms = [
  "irritation",
  "irritate",
  "irritating",
  "sensitive skin",
  "stinging",
  "sting",
  "peeling",
  "over-exfoliated",
  "recently irritated",
];
const dryingSignalTerms = [
  "drying",
  "dry skin",
  "over-cleansing",
  "benzoyl peroxide",
  "salicylic acid",
  "sulfur",
  "kaolin",
  "clay",
];
const strongActiveTerms = [
  ...exfoliatingAcidTerms,
  ...retinoidTerms,
  ...benzoylPeroxideTerms,
  ...sulfurTerms,
  ...teaTreeOilTerms,
  ...vitaminCTerms,
  "kojic acid",
];

const exfoliatingSignalGroups = [
  ["aha", "glycolic acid", "lactic acid", "mandelic acid"],
  ["bha", "salicylic acid"],
  ["pha", "gluconolactone", "polyhydroxy acid"],
];

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function normalizeList(values: string[] | undefined) {
  return (values ?? []).map(normalizeText).filter(Boolean);
}

function buildSearchableText(input: ProductSafetySignalSource) {
  return normalizeList([
    input.ingredientsText ?? "",
    ...(input.keyActives ?? []),
    ...(input.tags ?? []),
    ...(input.warnings ?? []),
    ...(input.notRecommendedFor ?? []),
  ]).join(" ");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function includesTerm(text: string, term: string) {
  if (term === "fragrance") {
    return /(^|[^a-z0-9])fragrance(?![- ]free)([^a-z0-9]|$)/.test(text);
  }

  if (/^[a-z0-9]{2,3}$/.test(term)) {
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}([^a-z0-9]|$)`).test(
      text,
    );
  }

  return text.includes(term);
}

function includesAnyTerm(text: string, terms: string[]) {
  return terms.some((term) => includesTerm(text, term));
}

function countMatchedGroups(text: string, groups: string[][]) {
  return groups.filter((terms) => includesAnyTerm(text, terms)).length;
}

export function detectProductSafetySignals(input: ProductSafetySignalSource) {
  const searchableText = buildSearchableText(input);
  const hasExfoliatingAcidSignal = includesAnyTerm(
    searchableText,
    exfoliatingAcidTerms,
  );
  const hasRetinoidSignal = includesAnyTerm(searchableText, retinoidTerms);
  const hasBenzoylPeroxideSignal = includesAnyTerm(
    searchableText,
    benzoylPeroxideTerms,
  );
  const hasSulfurSignal = includesAnyTerm(searchableText, sulfurTerms);
  const hasTeaTreeOilSignal = includesAnyTerm(searchableText, teaTreeOilTerms);
  const hasVitaminCSignal = includesAnyTerm(searchableText, vitaminCTerms);
  const hasFragranceOrEssentialOilSignal = includesAnyTerm(
    searchableText,
    fragranceTerms,
  );
  const hasIrritationWarningSignal = includesAnyTerm(
    searchableText,
    irritationWarningTerms,
  );
  const hasDryingActiveSignal = includesAnyTerm(
    searchableText,
    dryingSignalTerms,
  );
  const hasStrongActiveSignal = includesAnyTerm(
    searchableText,
    strongActiveTerms,
  );
  const hasTreatmentCategory = input.category === "treatment";

  return {
    hasBenzoylPeroxideSignal,
    hasDryingActiveSignal,
    hasExfoliatingAcidSignal,
    hasFragranceOrEssentialOilSignal,
    hasIrritationWarningSignal,
    hasMultipleExfoliatingAcidSignals:
      countMatchedGroups(searchableText, exfoliatingSignalGroups) > 1,
    hasRetinoidSignal,
    hasStrongActiveSignal,
    hasStrongCautionSignal: hasStrongActiveSignal || hasIrritationWarningSignal,
    hasSensitiveSkinCautionSignal:
      hasStrongActiveSignal ||
      hasFragranceOrEssentialOilSignal ||
      hasIrritationWarningSignal ||
      hasTreatmentCategory,
    hasSulfurSignal,
    hasTeaTreeOilSignal,
    hasTreatmentCategory,
    hasVitaminCSignal,
  };
}
