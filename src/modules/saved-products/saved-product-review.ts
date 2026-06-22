import {
  SAVED_PRODUCT_DECISION_STATUSES,
  type SavedProductDecisionStatus,
} from "@/modules/saved-products/saved-product.types";

export type SavedProductReviewFilter =
  | "all"
  | "needs-review"
  | "considering"
  | "testing"
  | "paused"
  | "kept"
  | "missing-decision-status"
  | "missing-routine-slot"
  | "missing-personal-note";

export type SavedProductReviewReason =
  | "missing-decision-status"
  | "missing-routine-slot"
  | "missing-personal-note"
  | "unknown-decision-status"
  | "considering"
  | "testing";

export type SavedProductReviewReasonDefinition = {
  key: SavedProductReviewReason;
  label: string;
  description: string;
};

export type SavedProductReviewMetadata = {
  decisionStatus?: unknown;
  plannedRoutineSlot?: unknown;
  personalNote?: unknown;
};

export const savedProductReviewReasonDefinitions = [
  {
    key: "missing-decision-status",
    label: "Chưa chọn trạng thái",
    description: "Sản phẩm này chưa có trạng thái quyết định cá nhân.",
  },
  {
    key: "missing-routine-slot",
    label: "Chưa có kế hoạch routine",
    description: "Sản phẩm này chưa có kế hoạch đưa vào routine.",
  },
  {
    key: "missing-personal-note",
    label: "Chưa có ghi chú",
    description: "Sản phẩm này chưa có ghi chú cá nhân.",
  },
  {
    key: "unknown-decision-status",
    label: "Trạng thái cần kiểm tra lại",
    description:
      "Trạng thái hiện tại không thuộc nhóm được hỗ trợ nên cần kiểm tra lại.",
  },
  {
    key: "considering",
    label: "Đang cân nhắc",
    description: "Sản phẩm này vẫn đang trong giai đoạn cân nhắc.",
  },
  {
    key: "testing",
    label: "Đang dùng thử",
    description: "Sản phẩm này đang được theo dõi trong giai đoạn dùng thử.",
  },
] as const satisfies readonly SavedProductReviewReasonDefinition[];

const savedProductReviewReasonDefinitionsByKey = new Map(
  savedProductReviewReasonDefinitions.map((definition) => [
    definition.key,
    definition,
  ]),
);

const supportedDecisionStatuses = new Set<string>(
  SAVED_PRODUCT_DECISION_STATUSES,
);

export function isBlankSavedProductReviewValue(value: unknown) {
  return (
    value == null ||
    (typeof value === "string" && value.trim().length === 0)
  );
}

export function isSupportedSavedProductDecisionStatus(
  value: unknown,
): value is SavedProductDecisionStatus {
  return typeof value === "string" && supportedDecisionStatuses.has(value);
}

export function hasUnknownSavedProductDecisionStatus(value: unknown) {
  return (
    !isBlankSavedProductReviewValue(value) &&
    !isSupportedSavedProductDecisionStatus(value)
  );
}

export function getSavedProductReviewReasons(
  item: SavedProductReviewMetadata,
): SavedProductReviewReason[] {
  const decisionStatus = item.decisionStatus;
  const reasons: SavedProductReviewReason[] = [];

  if (isBlankSavedProductReviewValue(decisionStatus)) {
    reasons.push("missing-decision-status");
  }

  if (isBlankSavedProductReviewValue(item.plannedRoutineSlot)) {
    reasons.push("missing-routine-slot");
  }

  if (isBlankSavedProductReviewValue(item.personalNote)) {
    reasons.push("missing-personal-note");
  }

  if (hasUnknownSavedProductDecisionStatus(decisionStatus)) {
    reasons.push("unknown-decision-status");
  }

  if (decisionStatus === "considering") {
    reasons.push("considering");
  }

  if (decisionStatus === "testing") {
    reasons.push("testing");
  }

  return reasons;
}

export function getSavedProductReviewReasonDefinition(
  reason: SavedProductReviewReason,
) {
  const definition = savedProductReviewReasonDefinitionsByKey.get(reason);

  if (!definition) {
    throw new Error(`Unknown saved product review reason: ${reason}`);
  }

  return definition;
}

export function needsSavedProductReview(item: SavedProductReviewMetadata) {
  return getSavedProductReviewReasons(item).length > 0;
}

export function matchesSavedProductReviewFilter(
  item: SavedProductReviewMetadata,
  filter: SavedProductReviewFilter,
) {
  switch (filter) {
    case "all":
      return true;
    case "needs-review":
      return needsSavedProductReview(item);
    case "considering":
    case "testing":
    case "paused":
    case "kept":
      return item.decisionStatus === filter;
    case "missing-decision-status":
      return isBlankSavedProductReviewValue(item.decisionStatus);
    case "missing-routine-slot":
      return isBlankSavedProductReviewValue(item.plannedRoutineSlot);
    case "missing-personal-note":
      return isBlankSavedProductReviewValue(item.personalNote);
  }

  const exhaustiveFilter: never = filter;

  return exhaustiveFilter;
}

export function filterSavedProductsByReviewFilter<
  TSavedProduct extends SavedProductReviewMetadata,
>(
  items: readonly TSavedProduct[],
  filter: SavedProductReviewFilter,
) {
  return items.filter((item) => matchesSavedProductReviewFilter(item, filter));
}
