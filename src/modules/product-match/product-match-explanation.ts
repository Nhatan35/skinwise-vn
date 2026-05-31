export const PRODUCT_MATCH_FALLBACK_REASON =
  "SkinWise chưa có đủ tín hiệu rõ ràng để giải thích chi tiết. Bạn có thể xem thành phần và cập nhật hồ sơ da để nhận gợi ý chính xác hơn.";

export const PRODUCT_MATCH_FALLBACK_CAUTION =
  "Nên xem kỹ bảng thành phần và thử trên một vùng da nhỏ trước khi sử dụng rộng rãi.";

const MAX_VISIBLE_REASONS = 3;
const MAX_VISIBLE_CAUTIONS = 2;

export type ProductMatchExplanationViewModel = {
  visibleReasons: string[];
  visibleCautions: string[];
  hiddenReasonsCount: number;
  hiddenCautionsCount: number;
};

function normalizeExplanationItems(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
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
