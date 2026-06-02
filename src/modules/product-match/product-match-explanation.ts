import type {
  ProductMatchDto,
  ProductMatchExplanationDto,
  ProductMatchExplanationReason,
  ProductMatchIngredientHighlight,
  ProductMatchUnavailableReason,
} from "@/modules/product-match/product-match.dto";
import type { SkinConcern } from "@/modules/skin-profile/skin-profile.types";

export const PRODUCT_MATCH_FALLBACK_REASON =
  "SkinWise chưa có đủ tín hiệu rõ ràng để giải thích chi tiết. Bạn có thể xem thành phần và cập nhật hồ sơ da để nhận gợi ý chính xác hơn.";

export const PRODUCT_MATCH_FALLBACK_CAUTION =
  "Nên xem kỹ bảng thành phần và thử trên một vùng da nhỏ trước khi sử dụng rộng rãi.";

const MAX_VISIBLE_REASONS = 3;
const MAX_VISIBLE_CAUTIONS = 2;
const MAX_EXPLANATION_REASONS = 4;
const MAX_INGREDIENT_HIGHLIGHTS = 6;
const LIMITED_DATA_NOTE =
  "Giải thích còn giới hạn vì dữ liệu thành phần hoặc metadata sản phẩm chưa đầy đủ.";
const INGREDIENTS_MISSING_NOTE =
  "Chưa đủ dữ liệu thành phần để giải thích chi tiết mức độ phù hợp của sản phẩm này.";
const DEFAULT_USAGE_NOTE =
  "Hãy patch test trước và đưa sản phẩm vào routine từ từ, đặc biệt nếu da bạn nhạy cảm, đang kích ứng hoặc đang phản ứng.";

const concernLabels: Record<SkinConcern, string> = {
  acne: "mụn",
  oiliness: "dầu thừa",
  dryness: "khô căng",
  redness: "đỏ da",
  dark_spots: "thâm hoặc đốm tối màu",
  texture: "bề mặt da chưa đều",
  barrier_support: "hàng rào da",
  unknown: "mối quan tâm chưa rõ",
};

export type ProductMatchExplanationViewModel = {
  visibleReasons: string[];
  visibleCautions: string[];
  hiddenReasonsCount: number;
  hiddenCautionsCount: number;
};

function normalizeExplanationItems(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
}

function uniqueItems(values: string[]) {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of normalizeExplanationItems(values)) {
    const normalized = value.toLocaleLowerCase("vi-VN");

    if (!seen.has(normalized)) {
      seen.add(normalized);
      output.push(value);
    }
  }

  return output;
}

function hasIngredientData(input: ProductMatchDto) {
  return (
    input.product.ingredientsText.trim().length > 0 ||
    input.product.keyActives.some((ingredient) => ingredient.trim().length > 0)
  );
}

function parseIngredientNames(input: ProductMatchDto) {
  return uniqueItems([
    ...input.product.keyActives,
    ...input.product.ingredientsText
      .split(",")
      .map((ingredient) => ingredient.trim())
      .filter(Boolean),
  ]).slice(0, MAX_INGREDIENT_HIGHLIGHTS);
}

function buildSummary(input: ProductMatchDto) {
  if (input.matchLevel === "strong" || input.matchLevel === "good") {
    return `Sản phẩm này có thể phù hợp với hồ sơ da của bạn dựa trên dữ liệu sản phẩm hiện có và điểm phù hợp ${input.matchScore}/100.`;
  }

  if (input.matchLevel === "cautious") {
    return `Sản phẩm này có một số tín hiệu phù hợp nhưng cần xem kỹ trước khi dùng, dựa trên điểm phù hợp ${input.matchScore}/100.`;
  }

  return `Sản phẩm này có ít tín hiệu khớp với hồ sơ da đã lưu của bạn, dựa trên điểm phù hợp ${input.matchScore}/100.`;
}

function toReason(
  type: string,
  message: string,
  options: {
    relatedIngredients?: string[];
    relatedConcerns?: SkinConcern[];
  } = {},
): ProductMatchExplanationReason {
  return {
    type,
    message,
    ...(options.relatedIngredients && options.relatedIngredients.length > 0
      ? { relatedIngredients: options.relatedIngredients }
      : {}),
    ...(options.relatedConcerns && options.relatedConcerns.length > 0
      ? { relatedConcerns: options.relatedConcerns }
      : {}),
  };
}

function buildPositiveReasons(input: ProductMatchDto) {
  const reasons: ProductMatchExplanationReason[] = [];
  const { matchedSignals } = input;
  const ingredientNames = parseIngredientNames(input);

  if (matchedSignals.skinType) {
    reasons.push(
      toReason(
        "skin_type_match",
        "Loại da trong hồ sơ của bạn có tín hiệu khớp với metadata sản phẩm.",
      ),
    );
  }

  if (matchedSignals.concerns.length > 0) {
    reasons.push(
      toReason(
        "skin_concern_support",
        `Sản phẩm có metadata liên quan đến ${matchedSignals.concerns
          .map((concern) => concernLabels[concern])
          .join(", ")} trong hồ sơ của bạn.`,
        {
          relatedConcerns: matchedSignals.concerns,
          relatedIngredients: ingredientNames.slice(0, 3),
        },
      ),
    );
  }

  if (matchedSignals.budget) {
    reasons.push(
      toReason(
        "budget_fit",
        "Khoảng giá của sản phẩm có tín hiệu phù hợp với ngân sách bạn đã lưu.",
      ),
    );
  }

  for (const reason of input.reasons) {
    reasons.push(toReason("match_reason", reason));
  }

  if (reasons.length === 0) {
    reasons.push(toReason("limited_positive_data", PRODUCT_MATCH_FALLBACK_REASON));
  }

  return reasons.slice(0, MAX_EXPLANATION_REASONS);
}

function buildCautionReasons(input: ProductMatchDto) {
  const cautions: ProductMatchExplanationReason[] = [];
  const { matchedSignals } = input;

  if (matchedSignals.sensitivity) {
    cautions.push(
      toReason(
        "sensitivity_caution",
        "Hồ sơ da của bạn có độ nhạy cảm cao và sản phẩm có tín hiệu cần xem kỹ trong dữ liệu cảnh báo hoặc hoạt chất.",
        { relatedIngredients: parseIngredientNames(input).slice(0, 3) },
      ),
    );
  }

  if (matchedSignals.avoidedIngredients.length > 0) {
    cautions.push(
      toReason(
        "avoided_ingredient_match",
        "Sản phẩm có thể chứa thành phần bạn đã lưu trong danh sách muốn tránh.",
        { relatedIngredients: matchedSignals.avoidedIngredients },
      ),
    );
  }

  for (const warning of input.product.warnings) {
    cautions.push(toReason("product_warning", warning));
  }

  for (const item of input.product.notRecommendedFor) {
    cautions.push(
      toReason(
        "not_recommended_for",
        `Dữ liệu sản phẩm ghi chú nên cân nhắc kỹ nếu bạn thuộc nhóm: ${item}.`,
      ),
    );
  }

  for (const caution of input.cautions) {
    cautions.push(toReason("match_caution", caution));
  }

  if (cautions.length === 0) {
    cautions.push(toReason("general_patch_test", PRODUCT_MATCH_FALLBACK_CAUTION));
  }

  return cautions.slice(0, MAX_EXPLANATION_REASONS);
}

function buildIngredientHighlights(
  input: ProductMatchDto,
): ProductMatchIngredientHighlight[] {
  const highlights: ProductMatchIngredientHighlight[] = [];
  const avoidedIngredients = new Set(
    input.matchedSignals.avoidedIngredients.map((ingredient) =>
      ingredient.toLocaleLowerCase("vi-VN"),
    ),
  );

  for (const ingredientName of uniqueItems(input.matchedSignals.avoidedIngredients)) {
    highlights.push({
      ingredientName,
      effect: "caution",
      reason:
        "Thành phần này khớp với danh sách thành phần bạn đã lưu là muốn tránh.",
    });
  }

  for (const ingredientName of parseIngredientNames(input)) {
    if (highlights.length >= MAX_INGREDIENT_HIGHLIGHTS) {
      break;
    }

    if (avoidedIngredients.has(ingredientName.toLocaleLowerCase("vi-VN"))) {
      continue;
    }

    const hasPersonalSignal =
      input.matchedSignals.concerns.length > 0 || input.matchedSignals.skinType;

    highlights.push({
      ingredientName,
      effect: hasPersonalSignal ? "positive" : "neutral",
      reason: hasPersonalSignal
        ? "Dữ liệu sản phẩm liệt kê thành phần này trong bảng thành phần hoặc hoạt chất nổi bật; SkinWise dùng metadata hiện có để hỗ trợ giải thích matching."
        : "Thành phần này được liệt kê trong dữ liệu sản phẩm, nhưng chưa có tín hiệu cá nhân hóa rõ ràng.",
    });
  }

  return highlights;
}

function buildDataQualityNotes(input: ProductMatchDto) {
  const notes: string[] = [];

  if (!hasIngredientData(input)) {
    notes.push(INGREDIENTS_MISSING_NOTE);
  }

  if (
    input.product.skinTypes.length === 0 ||
    input.product.concerns.length === 0 ||
    (input.reasons.length === 0 && input.cautions.length === 0)
  ) {
    notes.push(LIMITED_DATA_NOTE);
  }

  if (input.product.verificationStatus === "unverified") {
    notes.push(
      "Sản phẩm chưa được xác minh đầy đủ trong catalogue; nên đối chiếu thông tin trước khi dùng.",
    );
  }

  return uniqueItems(notes);
}

export function buildProductMatchExplanation(
  input: ProductMatchDto,
): ProductMatchExplanationDto {
  const dataQualityNotes = buildDataQualityNotes(input);

  return {
    summary: buildSummary(input),
    positiveReasons: buildPositiveReasons(input),
    cautionReasons: buildCautionReasons(input),
    ingredientHighlights: buildIngredientHighlights(input),
    usageNote: DEFAULT_USAGE_NOTE,
    ...(dataQualityNotes.length > 0 ? { dataQualityNotes } : {}),
  };
}

export function buildUnavailableProductMatchExplanation(
  reason: ProductMatchUnavailableReason,
): ProductMatchExplanationDto {
  if (reason === "NO_SKIN_PROFILE") {
    return {
      summary:
        "Hoàn thành hồ sơ da để xem giải thích mức độ phù hợp được cá nhân hóa.",
      positiveReasons: [],
      cautionReasons: [],
      ingredientHighlights: [],
      usageNote:
        "Hãy hoàn thành hồ sơ da trước khi sử dụng đánh giá phù hợp được cá nhân hóa.",
      dataQualityNotes: [
        "Chưa thể cá nhân hóa vì người dùng chưa có hồ sơ da hoàn chỉnh.",
      ],
    };
  }

  if (reason === "NO_INGREDIENT_DATA") {
    return {
      summary:
        "Chưa đủ dữ liệu thành phần để giải thích mức độ phù hợp của sản phẩm này.",
      positiveReasons: [],
      cautionReasons: [],
      ingredientHighlights: [],
      usageNote: "Hãy kiểm tra nhãn sản phẩm và patch test trước khi sử dụng.",
      dataQualityNotes: [
        "Dữ liệu thành phần hiện chưa đủ để tạo giải thích chi tiết.",
      ],
    };
  }

  return {
    summary:
      "Hiện chưa thể tạo giải thích mức độ phù hợp được cá nhân hóa cho sản phẩm này.",
    positiveReasons: [],
    cautionReasons: [],
    ingredientHighlights: [],
    usageNote: PRODUCT_MATCH_FALLBACK_CAUTION,
    dataQualityNotes: [
      "SkinWise chưa có đủ dữ liệu để tạo giải thích cá nhân hóa ổn định.",
    ],
  };
}

export function buildProductMatchExplanationViewModel(input: {
  reasons: string[];
  cautions: string[];
}): ProductMatchExplanationViewModel {
  const normalizedReasons = normalizeExplanationItems(input.reasons);
  const normalizedCautions = normalizeExplanationItems(input.cautions);
  const reasons =
    normalizedReasons.length > 0
      ? normalizedReasons
      : [PRODUCT_MATCH_FALLBACK_REASON];
  const cautions =
    normalizedCautions.length > 0
      ? normalizedCautions
      : [PRODUCT_MATCH_FALLBACK_CAUTION];

  return {
    visibleReasons: reasons.slice(0, MAX_VISIBLE_REASONS),
    visibleCautions: cautions.slice(0, MAX_VISIBLE_CAUTIONS),
    hiddenReasonsCount: Math.max(0, reasons.length - MAX_VISIBLE_REASONS),
    hiddenCautionsCount: Math.max(0, cautions.length - MAX_VISIBLE_CAUTIONS),
  };
}
