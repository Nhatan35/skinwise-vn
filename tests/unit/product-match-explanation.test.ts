import { describe, expect, it } from "vitest";

import {
  buildProductMatchExplanationViewModel,
  PRODUCT_MATCH_FALLBACK_CAUTION,
  PRODUCT_MATCH_FALLBACK_REASON,
} from "@/modules/product-match/product-match-explanation";

describe("Product Match explanation view model", () => {
  it("limits visible reasons to 3 and counts hidden reasons", () => {
    const viewModel = buildProductMatchExplanationViewModel({
      reasons: ["reason 1", "reason 2", "reason 3", "reason 4", "reason 5"],
      cautions: ["caution 1"],
    });

    expect(viewModel.visibleReasons).toHaveLength(3);
    expect(viewModel.visibleReasons).toEqual([
      "reason 1",
      "reason 2",
      "reason 3",
    ]);
    expect(viewModel.hiddenReasonsCount).toBe(2);
  });

  it("limits visible cautions to 2 and counts hidden cautions", () => {
    const viewModel = buildProductMatchExplanationViewModel({
      reasons: ["reason 1"],
      cautions: ["caution 1", "caution 2", "caution 3", "caution 4"],
    });

    expect(viewModel.visibleCautions).toHaveLength(2);
    expect(viewModel.visibleCautions).toEqual(["caution 1", "caution 2"]);
    expect(viewModel.hiddenCautionsCount).toBe(2);
  });

  it("uses a safe fallback when reasons are empty", () => {
    const viewModel = buildProductMatchExplanationViewModel({
      reasons: [],
      cautions: ["caution 1"],
    });

    expect(viewModel.visibleReasons).toEqual([PRODUCT_MATCH_FALLBACK_REASON]);
  });

  it("uses a safe fallback when cautions are empty", () => {
    const viewModel = buildProductMatchExplanationViewModel({
      reasons: ["reason 1"],
      cautions: [],
    });

    expect(viewModel.visibleCautions).toEqual([PRODUCT_MATCH_FALLBACK_CAUTION]);
  });

  it("does not mutate input arrays", () => {
    const reasons = ["reason 1", "reason 2", "reason 3", "reason 4"];
    const cautions = ["caution 1", "caution 2", "caution 3"];
    const originalReasons = [...reasons];
    const originalCautions = [...cautions];

    buildProductMatchExplanationViewModel({ reasons, cautions });

    expect(reasons).toEqual(originalReasons);
    expect(cautions).toEqual(originalCautions);
  });

  it("never returns negative hidden counts", () => {
    const viewModel = buildProductMatchExplanationViewModel({
      reasons: [],
      cautions: [],
    });

    expect(viewModel.hiddenReasonsCount).toBeGreaterThanOrEqual(0);
    expect(viewModel.hiddenCautionsCount).toBeGreaterThanOrEqual(0);
  });
});
