import { describe, expect, it } from "vitest";

import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import {
  filterSkinJournalEntries,
  getSkinJournalFilterOptions,
  hasActiveSkinJournalFilters,
  isEntryWithinJournalDateRange,
} from "@/modules/journals/skin-journal-filters";

function createJournal(overrides: Partial<SkinJournalDto> = {}): SkinJournalDto {
  return {
    id: "journal-1",
    localDate: "2026-05-22",
    timezone: "Asia/Ho_Chi_Minh",
    productsUsed: ["product-a"],
    observations: ["Dry cheeks"],
    symptoms: ["dryness"],
    sleepHours: 7,
    stressLevel: "medium",
    notes: "Self-tracked note.",
    createdAt: "2026-05-22T00:00:00.000Z",
    updatedAt: "2026-05-22T00:00:00.000Z",
    ...overrides,
  };
}

const entries = [
  createJournal({
    id: "journal-1",
    localDate: "2026-05-22",
    productsUsed: ["product-a"],
    symptoms: ["dryness", "redness"],
    stressLevel: "medium",
  }),
  createJournal({
    id: "journal-2",
    localDate: "2026-05-16",
    productsUsed: ["product-b"],
    symptoms: ["oiliness"],
    stressLevel: "high",
  }),
  createJournal({
    id: "journal-3",
    localDate: "2026-04-25",
    productsUsed: [],
    symptoms: [],
    stressLevel: undefined,
  }),
];

describe("SkinJournal filters", () => {
  it("returns all loaded entries when no filters are active", () => {
    expect(
      filterSkinJournalEntries(
        entries,
        { dateRange: "all" },
        { currentLocalDate: "2026-05-22" },
      ),
    ).toEqual(entries);
    expect(hasActiveSkinJournalFilters({ dateRange: "all" })).toBe(false);
  });

  it("filters by symptom", () => {
    expect(
      filterSkinJournalEntries(
        entries,
        { symptom: "dryness" },
        { currentLocalDate: "2026-05-22" },
      ).map((entry) => entry.id),
    ).toEqual(["journal-1"]);
  });

  it("filters by stress level", () => {
    expect(
      filterSkinJournalEntries(
        entries,
        { stressLevel: "high" },
        { currentLocalDate: "2026-05-22" },
      ).map((entry) => entry.id),
    ).toEqual(["journal-2"]);
  });

  it("filters by product used", () => {
    expect(
      filterSkinJournalEntries(
        entries,
        { productId: "product-b" },
        { currentLocalDate: "2026-05-22" },
      ).map((entry) => entry.id),
    ).toEqual(["journal-2"]);
  });

  it("filters by recent local-date ranges including the current local date", () => {
    expect(
      filterSkinJournalEntries(
        entries,
        { dateRange: "last7Days" },
        { currentLocalDate: "2026-05-22" },
      ).map((entry) => entry.id),
    ).toEqual(["journal-1", "journal-2"]);
    expect(
      filterSkinJournalEntries(
        entries,
        { dateRange: "last14Days" },
        { currentLocalDate: "2026-05-22" },
      ).map((entry) => entry.id),
    ).toEqual(["journal-1", "journal-2"]);
    expect(
      filterSkinJournalEntries(
        entries,
        { dateRange: "last30Days" },
        { currentLocalDate: "2026-05-22" },
      ).map((entry) => entry.id),
    ).toEqual(["journal-1", "journal-2", "journal-3"]);
  });

  it("combines filters using AND logic", () => {
    expect(
      filterSkinJournalEntries(
        entries,
        {
          dateRange: "last7Days",
          productId: "product-a",
          stressLevel: "medium",
          symptom: "redness",
        },
        { currentLocalDate: "2026-05-22" },
      ).map((entry) => entry.id),
    ).toEqual(["journal-1"]);

    expect(
      filterSkinJournalEntries(
        entries,
        {
          productId: "product-a",
          stressLevel: "high",
        },
        { currentLocalDate: "2026-05-22" },
      ),
    ).toEqual([]);
  });

  it("does not mutate input entries", () => {
    const sourceEntries = [createJournal()];
    const before = JSON.stringify(sourceEntries);

    filterSkinJournalEntries(
      sourceEntries,
      { symptom: "dryness" },
      { currentLocalDate: "2026-05-22" },
    );

    expect(JSON.stringify(sourceEntries)).toBe(before);
  });

  it("uses localDate for date filtering and not createdAt", () => {
    const journal = createJournal({
      createdAt: "2026-05-22T00:00:00.000Z",
      localDate: "2026-04-01",
    });

    expect(
      isEntryWithinJournalDateRange(journal, "last7Days", "2026-05-22"),
    ).toBe(false);
  });

  it("handles missing optional filter values safely", () => {
    const journal = createJournal({
      productsUsed: [],
      stressLevel: undefined,
      symptoms: [],
    });

    expect(
      filterSkinJournalEntries(
        [journal],
        { stressLevel: "medium" },
        { currentLocalDate: "2026-05-22" },
      ),
    ).toEqual([]);
    expect(
      filterSkinJournalEntries(
        [journal],
        { dateRange: "all" },
        { currentLocalDate: "2026-05-22" },
      ),
    ).toEqual([journal]);
  });

  it("builds filter options from loaded entries only", () => {
    expect(getSkinJournalFilterOptions(entries)).toEqual({
      productIds: ["product-a", "product-b"],
      stressLevels: ["medium", "high"],
      symptoms: ["dryness", "oiliness", "redness"],
    });
  });
});
