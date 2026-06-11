import type { ProductDto } from "@/modules/products/product.dto";
import { detectProductSafetySignals } from "@/modules/products/product-safety-signals";
import type {
  ProductCategory,
  ProductConcern,
  ProductPriceRange,
  ProductSkinType,
} from "@/modules/products/product.types";

export type ProductDetailDecisionSupport = {
  overview: string;
  suitableFor: string[];
  ingredientHighlights: string[];
  cautions: string[];
  routineUsageTips: string[];
  dataQualityNotes: string[];
};

const MAX_SUITABLE_FOR = 6;
const MAX_INGREDIENT_HIGHLIGHTS = 8;
const MAX_CAUTIONS = 6;
const MAX_ROUTINE_USAGE_TIPS = 3;
const MEDICAL_DISCLAIMER =
  "Thông tin này chỉ mang tính tham khảo và không thay thế tư vấn chuyên môn.";
const INGREDIENTS_MISSING_NOTE =
  "Dữ liệu thành phần chưa đầy đủ. Bạn nên kiểm tra bảng thành phần trên bao bì hoặc website chính thức của sản phẩm.";
const FIT_DATA_MISSING_NOTE =
  "Dữ liệu về loại da hoặc mối quan tâm của sản phẩm chưa đầy đủ.";

const categoryLabels: Record<ProductCategory, string> = {
  cleanser: "sữa rửa mặt",
  moisturizer: "dưỡng ẩm",
  sunscreen: "chống nắng",
  treatment: "sản phẩm hoạt chất",
  toner: "toner",
  serum: "serum",
  mask: "mặt nạ",
  other: "sản phẩm khác",
};

const skinTypeLabels: Record<ProductSkinType, string> = {
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

const priceRangeLabels: Record<ProductPriceRange, string> = {
  budget: "tiết kiệm",
  mid: "tầm trung",
  premium: "cao cấp",
  unknown: "chưa rõ giá",
};

function normalizeItem(value: string) {
  return value.trim();
}

function normalizeList(values: string[]) {
  return values.map(normalizeItem).filter(Boolean);
}

function uniqueItems(values: string[]) {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values) {
    const normalizedKey = value.toLocaleLowerCase("vi-VN");

    if (!seen.has(normalizedKey)) {
      seen.add(normalizedKey);
      output.push(value);
    }
  }

  return output;
}

function uniqueLimited(values: string[], limit: number) {
  return uniqueItems(normalizeList(values)).slice(0, limit);
}

function buildOverview(product: ProductDto) {
  const category = categoryLabels[product.category];
  const brand = normalizeItem(product.brand);
  const brandText = brand ? ` từ ${brand}` : "";
  const concernLabelsText = product.concerns
    .filter((concern) => concern !== "unknown")
    .map((concern) => concernLabels[concern])
    .join(" và ");

  if (concernLabelsText) {
    return `Đây là sản phẩm thuộc nhóm ${category}${brandText}, có thể hỗ trợ bạn cân nhắc routine liên quan đến ${concernLabelsText} dựa trên dữ liệu sản phẩm hiện có.`;
  }

  return `Đây là sản phẩm thuộc nhóm ${category}${brandText}, có thể được cân nhắc trong routine dựa trên dữ liệu sản phẩm hiện có.`;
}

function buildSuitableFor(product: ProductDto) {
  return uniqueLimited(
    [
      ...product.skinTypes
        .filter((skinType) => skinType !== "unknown")
        .map(
          (skinType) =>
            `Có thể phù hợp nếu hồ sơ da của bạn là ${skinTypeLabels[skinType]}`,
        ),
      ...product.concerns
        .filter((concern) => concern !== "unknown")
        .map(
          (concern) =>
            `Có thể hữu ích khi bạn muốn hỗ trợ mối quan tâm: ${concernLabels[concern]}`,
        ),
      ...product.suitableFor,
      product.priceRange === "unknown"
        ? ""
        : `Mức giá ${priceRangeLabels[product.priceRange]}`,
      ...product.tags.map((tag) => `Tag: ${tag}`),
    ],
    MAX_SUITABLE_FOR,
  );
}

function parseIngredientsText(ingredientsText: string) {
  return uniqueLimited(
    ingredientsText.split(",").map((ingredient) => ingredient.trim()),
    MAX_INGREDIENT_HIGHLIGHTS,
  );
}

function buildIngredientHighlights(product: ProductDto) {
  const keyActives = uniqueLimited(product.keyActives, MAX_INGREDIENT_HIGHLIGHTS);

  if (keyActives.length > 0) {
    return keyActives;
  }

  return parseIngredientsText(product.ingredientsText);
}

function hasKeyActives(product: ProductDto) {
  return normalizeList(product.keyActives).length > 0;
}

function hasIngredientsText(product: ProductDto) {
  return normalizeItem(product.ingredientsText).length > 0;
}

function buildCautions(product: ProductDto) {
  const safetySignals = detectProductSafetySignals(product);
  const cautions = [
    ...product.warnings,
    ...product.notRecommendedFor.map(
      (item) => `Nên cân nhắc kỹ nếu bạn thuộc nhóm: ${item}.`,
    ),
  ];

  if (product.category === "treatment") {
    cautions.push(
      "Nếu đây là sản phẩm hoạt chất, nên bắt đầu với tần suất thấp và theo dõi cảm nhận của da.",
    );
  }

  if (safetySignals.hasExfoliatingAcidSignal) {
    cautions.push(
      "Có chứa thành phần tẩy da chết; nên bắt đầu chậm nếu da bạn nhạy cảm hoặc chưa quen hoạt chất.",
    );
  }

  if (safetySignals.hasMultipleExfoliatingAcidSignals) {
    cautions.push(
      "Không nên kết hợp nhiều hoạt chất tẩy da chết trong cùng routine nếu bạn chưa biết da mình dung nạp tốt hay không.",
    );
  }

  if (
    safetySignals.hasRetinoidSignal ||
    safetySignals.hasBenzoylPeroxideSignal
  ) {
    cautions.push(
      "Có hoạt chất mạnh; nên tránh dùng cùng nhiều active mạnh khác trong một routine khi chưa chắc da dung nạp tốt.",
    );
  }

  if (safetySignals.hasFragranceOrEssentialOilSignal) {
    cautions.push(
      "Có hương liệu hoặc tinh dầu; nên thử trên một vùng da nhỏ nếu da bạn nhạy cảm, dễ đỏ hoặc đang kích ứng.",
    );
  }

  if (safetySignals.hasDryingActiveSignal) {
    cautions.push(
      "Có thể không lý tưởng nếu da đang khô căng hoặc hàng rào da đang yếu.",
    );
  }

  if (
    ["mask", "serum", "treatment"].includes(product.category) &&
    hasKeyActives(product)
  ) {
    cautions.push(
      "Nên thử trên một vùng da nhỏ trước khi dùng toàn mặt, đặc biệt khi sản phẩm có hoạt chất nổi bật.",
    );
  }

  if (!hasIngredientsText(product)) {
    cautions.push(
      "Nên kiểm tra nhãn sản phẩm thực tế vì dữ liệu thành phần chưa đầy đủ.",
    );
  }

  const dedupedCautions = uniqueItems(normalizeList(cautions));
  const cautionsWithDisclaimer = dedupedCautions.includes(MEDICAL_DISCLAIMER)
    ? dedupedCautions
    : [...dedupedCautions, MEDICAL_DISCLAIMER];

  if (cautionsWithDisclaimer.length <= MAX_CAUTIONS) {
    return cautionsWithDisclaimer;
  }

  return [
    ...cautionsWithDisclaimer
      .filter((caution) => caution !== MEDICAL_DISCLAIMER)
      .slice(0, MAX_CAUTIONS - 1),
    MEDICAL_DISCLAIMER,
  ];
}

function buildRoutineUsageTips(product: ProductDto) {
  const categoryTip: Record<ProductCategory, string> = {
    cleanser: "Có thể dùng ở bước làm sạch.",
    toner: "Có thể cân nhắc dùng sau bước làm sạch.",
    serum: "Có thể cân nhắc dùng sau toner và trước kem dưỡng.",
    treatment:
      "Có thể cân nhắc dùng ở bước sản phẩm hoạt chất, nên bắt đầu với tần suất thấp.",
    moisturizer: "Có thể dùng ở bước dưỡng ẩm.",
    sunscreen: "Thường dùng buổi sáng, ở bước cuối routine ban ngày.",
    mask: "Có thể dùng như bước bổ sung, không nhất thiết dùng hằng ngày.",
    other:
      "Nên kiểm tra hướng dẫn sử dụng của sản phẩm và theo dõi cảm nhận của da.",
  };

  return uniqueLimited(
    [
      categoryTip[product.category],
      "Nên kiểm tra hướng dẫn sử dụng trên bao bì trước khi dùng.",
      "Nên thêm sản phẩm mới từ từ và theo dõi cảm nhận của da.",
    ],
    MAX_ROUTINE_USAGE_TIPS,
  );
}

function buildDataQualityNotes(product: ProductDto) {
  const notes: string[] = [];

  notes.push(
    "Các gợi ý này dựa trên metadata sản phẩm hiện có; hãy đối chiếu nhãn sản phẩm thực tế nếu bạn không chắc chắn.",
  );

  if (!hasIngredientsText(product)) {
    notes.push(INGREDIENTS_MISSING_NOTE);
  }

  if (!hasKeyActives(product)) {
    notes.push(
      "Dữ liệu hoạt chất nổi bật chưa đầy đủ; SkinWise có thể hiển thị một số thành phần đầu nếu bảng thành phần có sẵn.",
    );
  }

  if (product.skinTypes.length === 0 && product.concerns.length === 0) {
    notes.push(FIT_DATA_MISSING_NOTE);
  }

  if (product.verificationStatus === "unverified") {
    notes.push(
      "Sản phẩm chưa được xác minh đầy đủ trong catalogue; nên đối chiếu thông tin trước khi dùng.",
    );
  }

  return uniqueItems(notes);
}

export function buildProductDetailDecisionSupport(
  product: ProductDto,
): ProductDetailDecisionSupport {
  return {
    overview: buildOverview(product),
    suitableFor: buildSuitableFor(product),
    ingredientHighlights: buildIngredientHighlights(product),
    cautions: buildCautions(product),
    routineUsageTips: buildRoutineUsageTips(product),
    dataQualityNotes: buildDataQualityNotes(product),
  };
}
