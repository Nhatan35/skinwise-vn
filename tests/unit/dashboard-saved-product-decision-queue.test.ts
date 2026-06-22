import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";

import { mapSavedProductDecisionQueueSummary } from "@/modules/dashboard/dashboard.mapper";
import type { SavedProduct } from "@/modules/saved-products/saved-product.types";
import { routes } from "@/shared/constants/routes";

const userId = "auth-user-id";
const fixedDate = new Date("2026-06-17T00:00:00.000Z");

function createSavedProduct(
  index: number,
  overrides: Partial<SavedProduct> = {},
): SavedProduct {
  return {
    _id: new ObjectId(`665000000000000000001${String(index).padStart(3, "0")}`),
    userId,
    productId: new ObjectId(
      `665000000000000000002${String(index).padStart(3, "0")}`,
    ),
    decisionStatus: "kept",
    plannedRoutineSlot: "morning",
    personalNote: "Theo dõi cá nhân trước khi đưa vào routine.",
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

const emptyNextAction = {
  label: "Xem lại sản phẩm đã lưu",
  description: "Lưu sản phẩm để bắt đầu xây dựng hàng chờ xem lại.",
  href: routes.SAVED_PRODUCTS,
};

describe("mapSavedProductDecisionQueueSummary", () => {
  it("returns an empty decision queue summary when there are no saved products", () => {
    expect(mapSavedProductDecisionQueueSummary([])).toEqual({
      totalSavedProducts: 0,
      consideringCount: 0,
      testingCount: 0,
      pausedCount: 0,
      keptCount: 0,
      unsetDecisionStatusCount: 0,
      withoutPlannedRoutineSlotCount: 0,
      withoutPersonalNoteCount: 0,
      reviewNeededCount: 0,
      nextAction: emptyNextAction,
    });
  });

  it.each([
    ["considering", "consideringCount", 1, 1],
    ["testing", "testingCount", 1, 1],
    ["paused", "pausedCount", 1, 0],
    ["kept", "keptCount", 1, 0],
  ] as const)(
    "counts supported decisionStatus %s",
    (decisionStatus, countField, expectedCount, expectedReviewNeededCount) => {
      const summary = mapSavedProductDecisionQueueSummary([
        createSavedProduct(1, { decisionStatus }),
      ]);

      expect(summary[countField]).toBe(expectedCount);
      expect(summary.reviewNeededCount).toBe(expectedReviewNeededCount);
    },
  );

  it.each([
    ["missing", undefined],
    ["null", null as never],
    ["empty", "" as never],
    ["whitespace-only", "   " as never],
  ])("counts %s decisionStatus as unset and review-needed", (_, decisionStatus) => {
    const summary = mapSavedProductDecisionQueueSummary([
      createSavedProduct(1, { decisionStatus }),
    ]);

    expect(summary.unsetDecisionStatusCount).toBe(1);
    expect(summary.reviewNeededCount).toBe(1);
    expect(summary.consideringCount).toBe(0);
    expect(summary.testingCount).toBe(0);
    expect(summary.pausedCount).toBe(0);
    expect(summary.keptCount).toBe(0);
  });

  it("treats an unknown non-blank decisionStatus as review-needed without crashing", () => {
    const summary = mapSavedProductDecisionQueueSummary([
      createSavedProduct(1, { decisionStatus: "recommended" as never }),
    ]);

    expect(summary).toMatchObject({
      consideringCount: 0,
      testingCount: 0,
      pausedCount: 0,
      keptCount: 0,
      unsetDecisionStatusCount: 0,
      reviewNeededCount: 1,
    });
  });

  it.each([
    ["missing", undefined],
    ["null", null as never],
    ["empty", "" as never],
    ["whitespace-only", "   " as never],
  ])(
    "counts %s plannedRoutineSlot as missing and review-needed",
    (_, plannedRoutineSlot) => {
      const summary = mapSavedProductDecisionQueueSummary([
        createSavedProduct(1, { plannedRoutineSlot }),
      ]);

      expect(summary.withoutPlannedRoutineSlotCount).toBe(1);
      expect(summary.reviewNeededCount).toBe(1);
    },
  );

  it.each([
    ["missing", undefined],
    ["null", null as never],
    ["empty", ""],
    ["whitespace-only", "   "],
  ])("counts %s personalNote as missing and review-needed", (_, personalNote) => {
    const summary = mapSavedProductDecisionQueueSummary([
      createSavedProduct(1, { personalNote }),
    ]);

    expect(summary.withoutPersonalNoteCount).toBe(1);
    expect(summary.reviewNeededCount).toBe(1);
  });

  it("summarizes mixed saved product states deterministically", () => {
    const summary = mapSavedProductDecisionQueueSummary([
      createSavedProduct(1, { decisionStatus: "considering" }),
      createSavedProduct(2, { decisionStatus: "testing" }),
      createSavedProduct(3, { decisionStatus: "paused" }),
      createSavedProduct(4, { decisionStatus: "kept" }),
      createSavedProduct(5, {
        decisionStatus: undefined,
        plannedRoutineSlot: "" as never,
      }),
      createSavedProduct(6, {
        decisionStatus: "legacy-status" as never,
        personalNote: "   ",
      }),
    ]);

    expect(summary).toMatchObject({
      totalSavedProducts: 6,
      consideringCount: 1,
      testingCount: 1,
      pausedCount: 1,
      keptCount: 1,
      unsetDecisionStatusCount: 1,
      withoutPlannedRoutineSlotCount: 1,
      withoutPersonalNoteCount: 1,
      reviewNeededCount: 4,
    });
    expect(summary.nextAction).toEqual({
      label: "Xem lại sản phẩm đã lưu",
      description:
        "Xem các sản phẩm còn thiếu trạng thái, kế hoạch routine hoặc ghi chú cá nhân.",
      href: routes.SAVED_PRODUCTS,
    });
  });

  it("does not double-count a saved product in reviewNeededCount", () => {
    const summary = mapSavedProductDecisionQueueSummary([
      createSavedProduct(1, {
        decisionStatus: "considering",
        plannedRoutineSlot: "   " as never,
        personalNote: "",
      }),
    ]);

    expect(summary.consideringCount).toBe(1);
    expect(summary.withoutPlannedRoutineSlotCount).toBe(1);
    expect(summary.withoutPersonalNoteCount).toBe(1);
    expect(summary.reviewNeededCount).toBe(1);
  });

  it("returns a complete state when saved products have enough organization metadata", () => {
    const summary = mapSavedProductDecisionQueueSummary([
      createSavedProduct(1, { decisionStatus: "kept" }),
      createSavedProduct(2, { decisionStatus: "paused" }),
    ]);

    expect(summary).toMatchObject({
      totalSavedProducts: 2,
      pausedCount: 1,
      keptCount: 1,
      unsetDecisionStatusCount: 0,
      withoutPlannedRoutineSlotCount: 0,
      withoutPersonalNoteCount: 0,
      reviewNeededCount: 0,
    });
    expect(summary.nextAction).toEqual({
      label: "Xem lại sản phẩm đã lưu",
      description:
        "Tất cả sản phẩm đã lưu hiện có đủ thông tin tổ chức cá nhân.",
      href: routes.SAVED_PRODUCTS,
    });
  });
});
