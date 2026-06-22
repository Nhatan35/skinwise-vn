import { describe, expect, it } from "vitest";

import {
  filterSavedProductsByReviewFilter,
  getSavedProductReviewReasonDefinition,
  getSavedProductReviewReasons,
  isBlankSavedProductReviewValue,
  needsSavedProductReview,
  savedProductReviewReasonDefinitions,
  type SavedProductReviewReason,
  type SavedProductReviewFilter,
  type SavedProductReviewMetadata,
} from "@/modules/saved-products/saved-product-review";

type ReviewItem = SavedProductReviewMetadata & {
  id: string;
};

function createReviewItem(
  id: string,
  overrides: SavedProductReviewMetadata = {},
): ReviewItem {
  return {
    id,
    decisionStatus: "kept",
    plannedRoutineSlot: "morning",
    personalNote: "Personal organization note.",
    ...overrides,
  };
}

function ids(items: readonly ReviewItem[]) {
  return items.map((item) => item.id);
}

function reasons(item: SavedProductReviewMetadata) {
  return getSavedProductReviewReasons(createReviewItem("item", item));
}

const reviewItems: ReviewItem[] = [
  createReviewItem("considering", { decisionStatus: "considering" }),
  createReviewItem("testing", { decisionStatus: "testing" }),
  createReviewItem("paused-complete", { decisionStatus: "paused" }),
  createReviewItem("kept-complete", { decisionStatus: "kept" }),
  createReviewItem("missing-decision", { decisionStatus: undefined }),
  createReviewItem("empty-decision", { decisionStatus: "" }),
  createReviewItem("whitespace-decision", { decisionStatus: "   " }),
  createReviewItem("unknown-decision", { decisionStatus: "legacy-status" }),
  createReviewItem("missing-slot", { plannedRoutineSlot: undefined }),
  createReviewItem("empty-slot", { plannedRoutineSlot: "" }),
  createReviewItem("whitespace-slot", { plannedRoutineSlot: "   " }),
  createReviewItem("missing-note", { personalNote: undefined }),
  createReviewItem("empty-note", { personalNote: "" }),
  createReviewItem("whitespace-note", { personalNote: "   " }),
  createReviewItem("paused-missing-note", {
    decisionStatus: "paused",
    personalNote: "",
  }),
  createReviewItem("kept-missing-slot", {
    decisionStatus: "kept",
    plannedRoutineSlot: "",
  }),
];

describe("saved product review queue filtering", () => {
  it("returns all saved products and preserves ordering for the all filter", () => {
    expect(ids(filterSavedProductsByReviewFilter(reviewItems, "all"))).toEqual(
      ids(reviewItems),
    );
  });

  it("returns review-needed products without duplicating a product with multiple review reasons", () => {
    const productWithMultipleReasons = createReviewItem("multi-reason", {
      decisionStatus: "considering",
      plannedRoutineSlot: "   ",
      personalNote: "",
    });

    expect(
      ids(
        filterSavedProductsByReviewFilter(
          [productWithMultipleReasons],
          "needs-review",
        ),
      ),
    ).toEqual(["multi-reason"]);
  });

  it("keeps paused and kept products out of needs-review when they are complete", () => {
    expect(
      ids(
        filterSavedProductsByReviewFilter(
          [
            createReviewItem("paused", { decisionStatus: "paused" }),
            createReviewItem("kept", { decisionStatus: "kept" }),
          ],
          "needs-review",
        ),
      ),
    ).toEqual([]);
  });

  it("includes paused and kept products in needs-review when organization metadata is missing", () => {
    expect(
      ids(
        filterSavedProductsByReviewFilter(
          [
            createReviewItem("paused-missing-note", {
              decisionStatus: "paused",
              personalNote: "",
            }),
            createReviewItem("kept-missing-slot", {
              decisionStatus: "kept",
              plannedRoutineSlot: "   ",
            }),
          ],
          "needs-review",
        ),
      ),
    ).toEqual(["paused-missing-note", "kept-missing-slot"]);
  });

  it.each([
    ["missing decision status", { decisionStatus: undefined }],
    ["empty decision status", { decisionStatus: "" }],
    ["whitespace-only decision status", { decisionStatus: "   " }],
    ["unknown non-blank decision status", { decisionStatus: "legacy-status" }],
    ["missing planned routine slot", { plannedRoutineSlot: undefined }],
    ["empty planned routine slot", { plannedRoutineSlot: "" }],
    ["whitespace-only planned routine slot", { plannedRoutineSlot: "   " }],
    ["missing personal note", { personalNote: undefined }],
    ["empty personal note", { personalNote: "" }],
    ["whitespace-only personal note", { personalNote: "   " }],
    ["considering status", { decisionStatus: "considering" }],
    ["testing status", { decisionStatus: "testing" }],
  ] as const)("marks %s as review-needed", (_, overrides) => {
    expect(needsSavedProductReview(createReviewItem("item", overrides))).toBe(
      true,
    );
  });

  it.each([
    ["considering", "considering", ["considering"]],
    ["testing", "testing", ["testing"]],
    ["paused", "paused", ["paused-complete", "paused-missing-note"]],
    [
      "kept",
      "kept",
      [
        "kept-complete",
        "missing-slot",
        "empty-slot",
        "whitespace-slot",
        "missing-note",
        "empty-note",
        "whitespace-note",
        "kept-missing-slot",
      ],
    ],
    [
      "missing-decision-status",
      "missing-decision-status",
      ["missing-decision", "empty-decision", "whitespace-decision"],
    ],
    [
      "missing-routine-slot",
      "missing-routine-slot",
      ["missing-slot", "empty-slot", "whitespace-slot", "kept-missing-slot"],
    ],
    [
      "missing-personal-note",
      "missing-personal-note",
      [
        "missing-note",
        "empty-note",
        "whitespace-note",
        "paused-missing-note",
      ],
    ],
  ] as const)(
    "filters by %s without including unknown supported-status categories",
    (_, filter, expectedIds) => {
      expect(
        ids(
          filterSavedProductsByReviewFilter(
            reviewItems,
            filter as SavedProductReviewFilter,
          ),
        ),
      ).toEqual(expectedIds);
    },
  );

  it("treats unknown non-blank decision status as review-needed without crashing", () => {
    expect(() =>
      filterSavedProductsByReviewFilter(
        [createReviewItem("unknown", { decisionStatus: "archived" })],
        "needs-review",
      ),
    ).not.toThrow();
    expect(
      ids(
        filterSavedProductsByReviewFilter(
          [createReviewItem("unknown", { decisionStatus: "archived" })],
          "needs-review",
        ),
      ),
    ).toEqual(["unknown"]);
  });

  it("does not treat every non-string value as blank", () => {
    expect(isBlankSavedProductReviewValue(0)).toBe(false);
    expect(isBlankSavedProductReviewValue(false)).toBe(false);
  });

  it("keeps the v1.53 review-needed rule deterministic for complete saved products", () => {
    expect(
      needsSavedProductReview(
        createReviewItem("complete-kept", { decisionStatus: "kept" }),
      ),
    ).toBe(false);
    expect(
      needsSavedProductReview(
        createReviewItem("complete-paused", { decisionStatus: "paused" }),
      ),
    ).toBe(false);
  });
});

describe("saved product review reason indicators", () => {
  it.each([
    ["missing decisionStatus", { decisionStatus: undefined }],
    ["empty decisionStatus", { decisionStatus: "" }],
    ["whitespace-only decisionStatus", { decisionStatus: "   " }],
  ] as const)("returns missing-decision-status for %s", (_, item) => {
    expect(reasons(item)).toEqual(["missing-decision-status"]);
  });

  it("returns unknown-decision-status for unknown non-blank decisionStatus", () => {
    expect(reasons({ decisionStatus: "legacy-status" })).toEqual([
      "unknown-decision-status",
    ]);
  });

  it.each([
    ["missing plannedRoutineSlot", { plannedRoutineSlot: undefined }],
    ["empty plannedRoutineSlot", { plannedRoutineSlot: "" }],
    ["whitespace-only plannedRoutineSlot", { plannedRoutineSlot: "   " }],
  ] as const)("returns missing-routine-slot for %s", (_, item) => {
    expect(reasons(item)).toEqual(["missing-routine-slot"]);
  });

  it.each([
    ["missing personalNote", { personalNote: undefined }],
    ["empty personalNote", { personalNote: "" }],
    ["whitespace-only personalNote", { personalNote: "   " }],
  ] as const)("returns missing-personal-note for %s", (_, item) => {
    expect(reasons(item)).toEqual(["missing-personal-note"]);
  });

  it("returns considering for decisionStatus considering", () => {
    expect(reasons({ decisionStatus: "considering" })).toEqual([
      "considering",
    ]);
  });

  it("returns testing for decisionStatus testing", () => {
    expect(reasons({ decisionStatus: "testing" })).toEqual(["testing"]);
  });

  it("returns no review reasons for complete paused and kept products", () => {
    expect(reasons({ decisionStatus: "paused" })).toEqual([]);
    expect(reasons({ decisionStatus: "kept" })).toEqual([]);
  });

  it("returns only missing metadata reasons for paused and kept products when needed", () => {
    expect(
      reasons({
        decisionStatus: "paused",
        personalNote: "",
      }),
    ).toEqual(["missing-personal-note"]);
    expect(
      reasons({
        decisionStatus: "kept",
        plannedRoutineSlot: "   ",
      }),
    ).toEqual(["missing-routine-slot"]);
  });

  it("returns multiple reasons in deterministic order without duplicates", () => {
    const reviewReasons = reasons({
      decisionStatus: "considering",
      plannedRoutineSlot: "",
      personalNote: "   ",
    });

    expect(reviewReasons).toEqual([
      "missing-routine-slot",
      "missing-personal-note",
      "considering",
    ]);
    expect(new Set(reviewReasons).size).toBe(reviewReasons.length);
  });

  it("orders unknown decision status after missing metadata reasons", () => {
    expect(
      reasons({
        decisionStatus: "legacy-status",
        plannedRoutineSlot: "",
        personalNote: "",
      }),
    ).toEqual([
      "missing-routine-slot",
      "missing-personal-note",
      "unknown-decision-status",
    ]);
  });

  it("uses missing-decision-status instead of unknown-decision-status for blank decisionStatus", () => {
    expect(
      reasons({
        decisionStatus: "   ",
        plannedRoutineSlot: "",
        personalNote: "",
      }),
    ).toEqual([
      "missing-decision-status",
      "missing-routine-slot",
      "missing-personal-note",
    ]);
  });

  it("does not define paused or kept as review reason types", () => {
    const reasonKeys = savedProductReviewReasonDefinitions.map(
      (definition) => definition.key,
    );

    expect(reasonKeys).not.toContain("paused");
    expect(reasonKeys).not.toContain("kept");
  });

  it("provides Vietnamese labels and descriptions for each review reason", () => {
    const expectedDefinitions: Record<
      SavedProductReviewReason,
      { label: string; description: string }
    > = {
      "missing-decision-status": {
        label: "Chưa chọn trạng thái",
        description: "Sản phẩm này chưa có trạng thái quyết định cá nhân.",
      },
      "missing-routine-slot": {
        label: "Chưa có kế hoạch routine",
        description: "Sản phẩm này chưa có kế hoạch đưa vào routine.",
      },
      "missing-personal-note": {
        label: "Chưa có ghi chú",
        description: "Sản phẩm này chưa có ghi chú cá nhân.",
      },
      "unknown-decision-status": {
        label: "Trạng thái cần kiểm tra lại",
        description:
          "Trạng thái hiện tại không thuộc nhóm được hỗ trợ nên cần kiểm tra lại.",
      },
      considering: {
        label: "Đang cân nhắc",
        description: "Sản phẩm này vẫn đang trong giai đoạn cân nhắc.",
      },
      testing: {
        label: "Đang dùng thử",
        description:
          "Sản phẩm này đang được theo dõi trong giai đoạn dùng thử.",
      },
    };

    for (const [reason, definition] of Object.entries(expectedDefinitions)) {
      expect(
        getSavedProductReviewReasonDefinition(
          reason as SavedProductReviewReason,
        ),
      ).toEqual({
        key: reason,
        ...definition,
      });
    }
  });

  it("keeps review reason logic consistent with needs-review logic", () => {
    for (const item of reviewItems) {
      expect(getSavedProductReviewReasons(item).length > 0).toBe(
        needsSavedProductReview(item),
      );
    }

    const completeItem = createReviewItem("complete", {
      decisionStatus: "paused",
    });

    expect(getSavedProductReviewReasons(completeItem)).toEqual([]);
    expect(needsSavedProductReview(completeItem)).toBe(false);
  });
});
