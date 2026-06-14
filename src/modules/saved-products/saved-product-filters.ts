import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";

export type SavedProductsFilterState = {
  query: string;
  decisionStatus:
    | "all"
    | "considering"
    | "testing"
    | "paused"
    | "kept"
    | "unset";
  plannedRoutineSlot:
    | "all"
    | "morning"
    | "evening"
    | "either"
    | "not_sure"
    | "unset";
  noteStatus: "all" | "with_note" | "without_note";
};

export type SavedProductDecisionSummary = {
  total: number;
  considering: number;
  testing: number;
  paused: number;
  kept: number;
  unset: number;
};

export const DEFAULT_SAVED_PRODUCTS_FILTERS: SavedProductsFilterState = {
  query: "",
  decisionStatus: "all",
  plannedRoutineSlot: "all",
  noteStatus: "all",
};

function isUnsetValue(value: unknown) {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  );
}

function hasPersonalNote(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeSearchText(value: unknown) {
  return typeof value === "string"
    ? value.toLocaleLowerCase("vi-VN")
    : "";
}

function matchesOptionalValue(
  value: unknown,
  filterValue: string,
) {
  if (filterValue === "all") {
    return true;
  }

  if (filterValue === "unset") {
    return isUnsetValue(value);
  }

  return value === filterValue;
}

export function filterSavedProducts(
  items: readonly SavedProductDto[],
  filters: SavedProductsFilterState,
) {
  const normalizedQuery = normalizeSearchText(filters.query.trim());

  return items.filter((item) => {
    if (
      !matchesOptionalValue(item.decisionStatus, filters.decisionStatus) ||
      !matchesOptionalValue(
        item.plannedRoutineSlot,
        filters.plannedRoutineSlot,
      )
    ) {
      return false;
    }

    if (
      filters.noteStatus === "with_note" &&
      !hasPersonalNote(item.personalNote)
    ) {
      return false;
    }

    if (
      filters.noteStatus === "without_note" &&
      hasPersonalNote(item.personalNote)
    ) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableText = [
      item.product?.name,
      item.product?.brand,
      item.personalNote,
    ]
      .map(normalizeSearchText)
      .join("\n");

    return searchableText.includes(normalizedQuery);
  });
}

export function hasActiveSavedProductFilters(
  filters: SavedProductsFilterState,
) {
  return (
    filters.query.trim().length > 0 ||
    filters.decisionStatus !== "all" ||
    filters.plannedRoutineSlot !== "all" ||
    filters.noteStatus !== "all"
  );
}

export function getSavedProductDecisionSummary(
  items: readonly SavedProductDto[],
): SavedProductDecisionSummary {
  return items.reduce<SavedProductDecisionSummary>(
    (summary, item) => {
      summary.total += 1;

      if (isUnsetValue(item.decisionStatus)) {
        summary.unset += 1;
      } else if (item.decisionStatus === "considering") {
        summary.considering += 1;
      } else if (item.decisionStatus === "testing") {
        summary.testing += 1;
      } else if (item.decisionStatus === "paused") {
        summary.paused += 1;
      } else if (item.decisionStatus === "kept") {
        summary.kept += 1;
      }

      return summary;
    },
    {
      total: 0,
      considering: 0,
      testing: 0,
      paused: 0,
      kept: 0,
      unset: 0,
    },
  );
}
