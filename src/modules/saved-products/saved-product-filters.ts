import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import {
  isBlankSavedProductReviewValue,
  matchesSavedProductReviewFilter,
  type SavedProductReviewFilter,
} from "@/modules/saved-products/saved-product-review";
import { getSavedProductTagKey } from "@/modules/saved-products/saved-product-tags";

export type SavedProductsFilterState = {
  query: string;
  tag: string;
  reviewFilter: SavedProductReviewFilter;
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
  tag: "",
  reviewFilter: "all",
  decisionStatus: "all",
  plannedRoutineSlot: "all",
  noteStatus: "all",
};

function isUnsetValue(value: unknown) {
  return isBlankSavedProductReviewValue(value);
}

function hasPersonalNote(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function getItemTags(item: SavedProductDto) {
  return Array.isArray(item.tags) ? item.tags : [];
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
  const normalizedTag = getSavedProductTagKey(filters.tag);

  return items.filter((item) => {
    if (!matchesSavedProductReviewFilter(item, filters.reviewFilter)) {
      return false;
    }

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

    if (
      normalizedTag &&
      !getItemTags(item).some(
        (tag) => getSavedProductTagKey(tag) === normalizedTag,
      )
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
      ...getItemTags(item),
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
    filters.tag.trim().length > 0 ||
    filters.reviewFilter !== "all" ||
    filters.decisionStatus !== "all" ||
    filters.plannedRoutineSlot !== "all" ||
    filters.noteStatus !== "all"
  );
}

export function getAvailableSavedProductTags(
  items: readonly SavedProductDto[],
) {
  const tagsByKey = new Map<string, string>();

  for (const item of items) {
    for (const tag of getItemTags(item)) {
      const tagKey = getSavedProductTagKey(tag);

      if (tagKey && !tagsByKey.has(tagKey)) {
        tagsByKey.set(tagKey, tag.trim());
      }
    }
  }

  return [...tagsByKey.values()].sort((first, second) =>
    first.localeCompare(second, "vi-VN", {
      sensitivity: "base",
    }),
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
