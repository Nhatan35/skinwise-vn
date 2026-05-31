import { describe, expect, it } from "vitest";

import {
  getInclusiveLocalDateDiffInDays,
  INSIGHTS_MAX_RANGE_DAYS,
  insightsLocalDateSchema,
  insightsQuerySchema,
} from "@/modules/insights/insights.schema";

describe("Insights schema", () => {
  it("accepts omitted dates so the use case can apply the default range", () => {
    expect(insightsQuerySchema.parse({})).toEqual({});
  });

  it("accepts a valid explicit from/to date range", () => {
    expect(
      insightsQuerySchema.parse({
        from: "2026-05-01",
        to: "2026-05-30",
      }),
    ).toEqual({
      from: "2026-05-01",
      to: "2026-05-30",
    });
  });

  it("validates date format and real calendar dates", () => {
    expect(insightsLocalDateSchema.safeParse("2026-05-30").success).toBe(true);

    for (const invalidDate of ["2026-02-31", "2026-13-01", "30-05-2026"]) {
      expect(insightsLocalDateSchema.safeParse(invalidDate).success).toBe(false);
    }
  });

  it("requires from and to to be provided together", () => {
    expect(
      insightsQuerySchema.safeParse({
        from: "2026-05-01",
      }).success,
    ).toBe(false);
    expect(
      insightsQuerySchema.safeParse({
        to: "2026-05-30",
      }).success,
    ).toBe(false);
  });

  it("rejects reversed ranges and ranges over the maximum window", () => {
    expect(
      insightsQuerySchema.safeParse({
        from: "2026-05-31",
        to: "2026-05-01",
      }).success,
    ).toBe(false);
    expect(
      insightsQuerySchema.safeParse({
        from: "2026-01-01",
        to: "2026-04-01",
      }).success,
    ).toBe(false);
  });

  it("calculates inclusive date differences for range validation", () => {
    expect(getInclusiveLocalDateDiffInDays("2026-05-01", "2026-05-01")).toBe(1);
    expect(getInclusiveLocalDateDiffInDays("2026-05-01", "2026-05-30")).toBe(30);
    expect(INSIGHTS_MAX_RANGE_DAYS).toBe(90);
  });
});
