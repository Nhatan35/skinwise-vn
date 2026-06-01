import { describe, expect, it } from "vitest";

import {
  buildRoutinePositiveFindings,
  type BuildRoutinePositiveFindingsInput,
} from "@/modules/ai-analysis/routine-analysis-positive-findings";

function buildInput(
  overrides: Partial<BuildRoutinePositiveFindingsInput> = {},
): BuildRoutinePositiveFindingsInput {
  return {
    timeOfDay: "morning",
    steps: [],
    ...overrides,
  };
}

describe("buildRoutinePositiveFindings", () => {
  it("detects a cleanser step", () => {
    expect(
      buildRoutinePositiveFindings(
        buildInput({
          steps: [{ category: "cleanser" }],
        }),
      ),
    ).toContain("Có bước làm sạch.");
  });

  it("detects a moisturizer step", () => {
    expect(
      buildRoutinePositiveFindings(
        buildInput({
          steps: [{ category: "moisturizer" }],
        }),
      ),
    ).toContain("Có bước dưỡng ẩm.");
  });

  it("detects sunscreen in a morning routine", () => {
    expect(
      buildRoutinePositiveFindings(
        buildInput({
          steps: [{ category: "sunscreen" }],
        }),
      ),
    ).toContain("Có chống nắng cho routine buổi sáng.");
  });

  it("detects a basic cleanser and moisturizer foundation", () => {
    expect(
      buildRoutinePositiveFindings(
        buildInput({
          steps: [{ category: "cleanser" }, { category: "moisturizer" }],
        }),
      ),
    ).toContain("Routine có nền tảng cơ bản với làm sạch và dưỡng ẩm.");
  });

  it("detects a trackable step count from two to five steps", () => {
    expect(
      buildRoutinePositiveFindings(
        buildInput({
          steps: [
            { category: "cleanser" },
            { category: "moisturizer" },
            { category: "sunscreen" },
          ],
        }),
      ),
    ).toContain("Routine có số bước tương đối dễ theo dõi.");
  });

  it("detects a basic morning routine structure", () => {
    expect(
      buildRoutinePositiveFindings(
        buildInput({
          timeOfDay: "morning",
          steps: [
            { category: "cleanser" },
            { category: "moisturizer" },
            { category: "sunscreen" },
          ],
        }),
      ),
    ).toContain("Routine buổi sáng có cấu trúc cơ bản khá đầy đủ.");
  });

  it("detects a basic evening routine structure", () => {
    expect(
      buildRoutinePositiveFindings(
        buildInput({
          timeOfDay: "evening",
          steps: [{ category: "cleanser" }, { category: "moisturizer" }],
        }),
      ),
    ).toContain(
      "Routine buổi tối có nền tảng cơ bản để theo dõi đều đặn.",
    );
  });

  it("does not return duplicate positive findings", () => {
    const findings = buildRoutinePositiveFindings(
      buildInput({
        steps: [
          { category: "cleanser" },
          { category: "cleanser" },
          { category: "moisturizer" },
          { category: "moisturizer" },
        ],
      }),
    );

    expect(findings).toHaveLength(new Set(findings).size);
  });

  it("returns an empty list for an empty routine", () => {
    expect(buildRoutinePositiveFindings(buildInput())).toEqual([]);
  });

  it("does not mutate the input object", () => {
    const input = buildInput({
      steps: [{ category: "cleanser" }, { category: "moisturizer" }],
    });
    const serializedInput = JSON.stringify(input);

    buildRoutinePositiveFindings(input);

    expect(JSON.stringify(input)).toBe(serializedInput);
  });
});
