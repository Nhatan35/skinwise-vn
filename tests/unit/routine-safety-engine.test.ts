import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  analyzeRoutineSafety,
  normalizeRoutineActiveSignals,
  type RoutineSafetyInput,
  type RoutineSafetyRuleCode,
} from "@/domain/routine-safety";

const projectRoot = process.cwd();
const routineSafetyEnginePath = join(
  projectRoot,
  "src/domain/routine-safety/routine-safety-engine.ts",
);
const activeSignalNormalizerPath = join(
  projectRoot,
  "src/domain/routine-safety/active-signal-normalizer.ts",
);

function getRule(
  input: RoutineSafetyInput,
  code: RoutineSafetyRuleCode,
) {
  const result = analyzeRoutineSafety(input);
  const rule = result.allRuleResults.find((item) => item.code === code);

  expect(rule).toBeDefined();

  return rule;
}

function createMorningInput(
  overrides: Partial<RoutineSafetyInput["routine"]> = {},
): RoutineSafetyInput {
  return {
    routine: {
      timeOfDay: "morning",
      steps: [
        {
          category: "cleanser",
          customProductName: "Gentle cleanser",
        },
        {
          category: "moisturizer",
          customProductName: "Basic moisturizer",
        },
        {
          category: "sunscreen",
          customProductName: "Daily sunscreen",
        },
      ],
      ...overrides,
    },
  };
}

function createEveningInput(
  overrides: Partial<RoutineSafetyInput["routine"]> = {},
): RoutineSafetyInput {
  return {
    routine: {
      timeOfDay: "evening",
      steps: [
        {
          category: "cleanser",
          customProductName: "Gentle cleanser",
        },
        {
          category: "moisturizer",
          customProductName: "Basic moisturizer",
        },
      ],
      ...overrides,
    },
  };
}

describe("Routine Safety active signal normalizer", () => {
  it("normalizes aliases from key actives, ingredient text, and custom text", () => {
    const result = normalizeRoutineActiveSignals([
      {
        stepId: "step-1",
        keyActivesSnapshot: ["Glycolic Acid", "glycolic acid"],
        ingredientTextSnapshot: "Water, Salicylic Acid, Parfum",
      },
      {
        stepId: "step-2",
        customProductName: "Retinol night cream",
      },
    ]);

    expect(result.steps[0]).toMatchObject({
      stepId: "step-1",
      signals: ["AHA", "BHA", "FRAGRANCE"],
    });
    expect(result.steps[1]).toMatchObject({
      stepId: "step-2",
      signals: ["RETINOID"],
    });
    expect(result.routineSignals).toEqual([
      "AHA",
      "BHA",
      "FRAGRANCE",
      "RETINOID",
    ]);
    expect(result.matchedAliases.AHA).toEqual(["glycolic acid"]);
  });

  it("uses custom product text only when snapshot ingredient fields are missing", () => {
    const result = normalizeRoutineActiveSignals([
      {
        customProductName: "Retinol serum",
        keyActivesSnapshot: ["Niacinamide"],
        ingredientTextSnapshot: "Water, Glycerin",
      },
      {
        customProductName: "PHA toner",
      },
    ]);

    expect(result.steps[0]?.signals).toEqual([]);
    expect(result.steps[1]?.signals).toEqual(["PHA"]);
  });

  it("detects benzoyl peroxide aliases", () => {
    const result = normalizeRoutineActiveSignals([
      {
        ingredientTextSnapshot: "Water, BPO, Glycerin",
      },
      {
        keyActivesSnapshot: ["Benzoyl Peroxide"],
      },
    ]);

    expect(result.routineSignals).toEqual(["BENZOYL_PEROXIDE"]);
    expect(result.matchedAliases.BENZOYL_PEROXIDE).toEqual([
      "bpo",
      "benzoyl peroxide",
    ]);
  });

  it("detects strong vitamin C aliases", () => {
    const result = normalizeRoutineActiveSignals([
      {
        ingredientTextSnapshot: "Water, L-Ascorbic Acid",
      },
      {
        keyActivesSnapshot: ["Pure Vitamin C"],
      },
    ]);

    expect(result.routineSignals).toEqual(["VITAMIN_C_STRONG"]);
    expect(result.matchedAliases.VITAMIN_C_STRONG).toEqual([
      "ascorbic acid",
      "l ascorbic acid",
      "pure vitamin c",
    ]);
  });

  it("detects aliases case-insensitively", () => {
    const result = normalizeRoutineActiveSignals([
      {
        keyActivesSnapshot: ["GLYCOLIC ACID"],
      },
    ]);

    expect(result.routineSignals).toEqual(["AHA"]);
    expect(result.matchedAliases.AHA).toEqual(["glycolic acid"]);
  });
});

describe("Routine Safety Engine MVP rules", () => {
  it("returns all rule results and only triggered rules in triggeredRules", () => {
    const result = analyzeRoutineSafety(
      createMorningInput({
        steps: [
          {
            category: "cleanser",
            customProductName: "Gentle cleanser",
          },
        ],
      }),
    );

    expect(result.allRuleResults.map((rule) => rule.code)).toEqual([
      "MISSING_SUNSCREEN_AM",
      "TOO_MANY_ACTIVES",
      "RETINOID_PLUS_EXFOLIANT",
      "TOO_MANY_STEPS_BEGINNER",
      "FRAGRANCE_SENSITIVE_CAUTION",
      "MISSING_MOISTURIZER",
      "TOO_MANY_CUSTOM_PRODUCTS",
    ]);
    expect(result.triggeredRules).toEqual(
      result.allRuleResults.filter((rule) => rule.triggered),
    );
    expect(result.triggeredRules.map((rule) => rule.code)).toEqual([
      "MISSING_SUNSCREEN_AM",
    ]);
  });

  it("triggers MISSING_SUNSCREEN_AM for morning routines without sunscreen", () => {
    const rule = getRule(
      createMorningInput({
        steps: [
          {
            category: "cleanser",
            customProductName: "Gentle cleanser",
          },
        ],
      }),
      "MISSING_SUNSCREEN_AM",
    );

    expect(rule).toMatchObject({
      severity: "medium",
      triggered: true,
    });
  });

  it("does not trigger MISSING_SUNSCREEN_AM for morning routines with sunscreen", () => {
    const rule = getRule(createMorningInput(), "MISSING_SUNSCREEN_AM");

    expect(rule?.triggered).toBe(false);
  });

  it("does not trigger MISSING_SUNSCREEN_AM for evening routines", () => {
    const rule = getRule(
      createEveningInput({
        steps: [
          {
            category: "cleanser",
            customProductName: "Gentle cleanser",
          },
        ],
      }),
      "MISSING_SUNSCREEN_AM",
    );

    expect(rule?.triggered).toBe(false);
  });

  it("triggers TOO_MANY_ACTIVES with three unique strong active signals including PHA", () => {
    const result = analyzeRoutineSafety(
      createEveningInput({
        steps: [
          {
            category: "serum",
            keyActivesSnapshot: ["Retinol", "Gluconolactone"],
          },
          {
            category: "treatment",
            ingredientTextSnapshot: "Water, Benzoyl Peroxide",
          },
          {
            category: "serum",
            ingredientTextSnapshot: "Parfum",
          },
        ],
      }),
    );
    const rule = result.allRuleResults.find(
      (item) => item.code === "TOO_MANY_ACTIVES",
    );

    expect(rule).toMatchObject({
      severity: "high",
      triggered: true,
      metadata: {
        activeSignals: ["PHA", "RETINOID", "BENZOYL_PEROXIDE"],
        count: 3,
      },
    });
    expect(result.normalizedSignals.routineSignals).toContain("FRAGRANCE");
    expect((rule?.metadata?.activeSignals as string[] | undefined)).not.toContain(
      "FRAGRANCE",
    );
  });

  it("triggers RETINOID_PLUS_EXFOLIANT for evening retinoid plus PHA", () => {
    const rule = getRule(
      createEveningInput({
        steps: [
          {
            category: "serum",
            keyActivesSnapshot: ["Retinal"],
          },
          {
            category: "serum",
            keyActivesSnapshot: ["Lactobionic Acid"],
          },
          {
            category: "moisturizer",
            customProductName: "Basic moisturizer",
          },
        ],
      }),
      "RETINOID_PLUS_EXFOLIANT",
    );

    expect(rule).toMatchObject({
      severity: "high",
      triggered: true,
      metadata: {
        exfoliantSignals: ["PHA"],
        hasRetinoid: true,
      },
    });
  });

  it("does not trigger RETINOID_PLUS_EXFOLIANT for morning retinoid plus AHA, BHA, and PHA", () => {
    const rule = getRule(
      createMorningInput({
        steps: [
          {
            category: "serum",
            keyActivesSnapshot: ["Retinol", "Glycolic Acid"],
          },
          {
            category: "serum",
            keyActivesSnapshot: ["Salicylic Acid", "Gluconolactone"],
          },
          {
            category: "moisturizer",
            customProductName: "Basic moisturizer",
          },
          {
            category: "sunscreen",
            customProductName: "Daily sunscreen",
          },
        ],
      }),
      "RETINOID_PLUS_EXFOLIANT",
    );

    expect(rule).toMatchObject({
      triggered: false,
      metadata: {
        exfoliantSignals: ["AHA", "BHA", "PHA"],
        hasRetinoid: true,
        timeOfDay: "morning",
      },
    });
  });

  it("triggers TOO_MANY_STEPS_BEGINNER only for beginner profiles above seven steps", () => {
    const rule = getRule(
      {
        ...createMorningInput({
          steps: Array.from({ length: 8 }, (_, index) => ({
            category: index === 7 ? "sunscreen" : "serum",
            customProductName: `Step ${index + 1}`,
          })),
        }),
        skinProfile: {
          experienceLevel: "beginner",
        },
      },
      "TOO_MANY_STEPS_BEGINNER",
    );

    expect(rule).toMatchObject({
      severity: "medium",
      triggered: true,
      metadata: {
        experienceLevel: "beginner",
        stepCount: 8,
      },
    });
  });

  it("does not trigger TOO_MANY_STEPS_BEGINNER for non-beginners above seven steps", () => {
    const rule = getRule(
      {
        ...createMorningInput({
          steps: Array.from({ length: 8 }, (_, index) => ({
            category: index === 7 ? "sunscreen" : "serum",
            customProductName: `Step ${index + 1}`,
          })),
        }),
        skinProfile: {
          experienceLevel: "intermediate",
        },
      },
      "TOO_MANY_STEPS_BEGINNER",
    );

    expect(rule).toMatchObject({
      triggered: false,
      metadata: {
        experienceLevel: "intermediate",
        stepCount: 8,
      },
    });
  });

  it("triggers FRAGRANCE_SENSITIVE_CAUTION for sensitive context with two fragrance products", () => {
    const rule = getRule(
      {
        ...createEveningInput({
          steps: [
            {
              category: "cleanser",
              ingredientTextSnapshot: "Water, Fragrance",
            },
            {
              category: "serum",
              ingredientTextSnapshot: "Water, Parfum",
            },
            {
              category: "moisturizer",
              customProductName: "Basic moisturizer",
            },
          ],
        }),
        skinProfile: {
          skinType: "sensitive",
          sensitivityLevel: "high",
        },
      },
      "FRAGRANCE_SENSITIVE_CAUTION",
    );

    expect(rule).toMatchObject({
      severity: "medium",
      triggered: true,
      metadata: {
        fragranceStepCount: 2,
      },
    });
  });

  it("triggers FRAGRANCE_SENSITIVE_CAUTION for sensitive skin type alone with two fragrance products", () => {
    const rule = getRule(
      {
        ...createEveningInput({
          steps: [
            {
              category: "cleanser",
              ingredientTextSnapshot: "Water, Fragrance",
            },
            {
              category: "serum",
              ingredientTextSnapshot: "Water, Parfum",
            },
            {
              category: "moisturizer",
              customProductName: "Basic moisturizer",
            },
          ],
        }),
        skinProfile: {
          skinType: "sensitive",
        },
      },
      "FRAGRANCE_SENSITIVE_CAUTION",
    );

    expect(rule?.triggered).toBe(true);
  });

  it("triggers FRAGRANCE_SENSITIVE_CAUTION for high sensitivity level alone with two fragrance products", () => {
    const rule = getRule(
      {
        ...createEveningInput({
          steps: [
            {
              category: "cleanser",
              ingredientTextSnapshot: "Water, Fragrance",
            },
            {
              category: "serum",
              ingredientTextSnapshot: "Water, Parfum",
            },
            {
              category: "moisturizer",
              customProductName: "Basic moisturizer",
            },
          ],
        }),
        skinProfile: {
          sensitivityLevel: "high",
        },
      },
      "FRAGRANCE_SENSITIVE_CAUTION",
    );

    expect(rule?.triggered).toBe(true);
  });

  it("does not trigger FRAGRANCE_SENSITIVE_CAUTION for one fragrance product", () => {
    const rule = getRule(
      {
        ...createEveningInput({
          steps: [
            {
              category: "cleanser",
              ingredientTextSnapshot: "Water, Fragrance",
            },
            {
              category: "moisturizer",
              customProductName: "Basic moisturizer",
            },
          ],
        }),
        skinProfile: {
          skinType: "sensitive",
          sensitivityLevel: "high",
        },
      },
      "FRAGRANCE_SENSITIVE_CAUTION",
    );

    expect(rule).toMatchObject({
      triggered: false,
      metadata: {
        fragranceStepCount: 1,
      },
    });
  });

  it("triggers MISSING_MOISTURIZER through normalized PHA exfoliant behavior", () => {
    const rule = getRule(
      createEveningInput({
        steps: [
          {
            category: "serum",
            keyActivesSnapshot: ["Polyhydroxy Acid"],
          },
        ],
      }),
      "MISSING_MOISTURIZER",
    );

    expect(rule).toMatchObject({
      severity: "low",
      triggered: true,
      metadata: {
        hasExfoliantSignal: true,
        hasMoisturizer: false,
        hasTreatment: false,
      },
    });
  });

  it("triggers MISSING_MOISTURIZER for treatment category without moisturizer", () => {
    const rule = getRule(
      createEveningInput({
        steps: [
          {
            category: "treatment",
            customProductName: "Spot treatment",
          },
        ],
      }),
      "MISSING_MOISTURIZER",
    );

    expect(rule?.triggered).toBe(true);
  });

  it("does not trigger MISSING_MOISTURIZER for treatment with moisturizer", () => {
    const rule = getRule(
      createEveningInput({
        steps: [
          {
            category: "treatment",
            customProductName: "Spot treatment",
          },
          {
            category: "moisturizer",
            customProductName: "Basic moisturizer",
          },
        ],
      }),
      "MISSING_MOISTURIZER",
    );

    expect(rule).toMatchObject({
      triggered: false,
      metadata: {
        hasMoisturizer: true,
        hasTreatment: true,
      },
    });
  });

  it("triggers TOO_MANY_CUSTOM_PRODUCTS for more than five custom products without ingredient data", () => {
    const rule = getRule(
      createEveningInput({
        steps: Array.from({ length: 6 }, (_, index) => ({
          category: "serum",
          customProductName: `Custom product ${index + 1}`,
        })),
      }),
      "TOO_MANY_CUSTOM_PRODUCTS",
    );

    expect(rule).toMatchObject({
      severity: "low",
      triggered: true,
      metadata: {
        customProductsWithoutSnapshotDataCount: 6,
      },
    });
  });

  it("does not count custom products with snapshot data for TOO_MANY_CUSTOM_PRODUCTS", () => {
    const rule = getRule(
      createEveningInput({
        steps: [
          {
            category: "serum",
            customProductName: "Custom product 1",
            productNameSnapshot: "Product snapshot",
          },
          {
            category: "serum",
            customProductName: "Custom product 2",
            brandSnapshot: "Brand snapshot",
          },
          {
            category: "serum",
            customProductName: "Custom product 3",
            keyActivesSnapshot: ["Niacinamide"],
          },
          {
            category: "serum",
            customProductName: "Custom product 4",
            ingredientTextSnapshot: "Water, Glycerin",
          },
          {
            category: "serum",
            customProductName: "Custom product 5",
            productNameSnapshot: "Product snapshot",
          },
          {
            category: "serum",
            customProductName: "Custom product 6",
            brandSnapshot: "Brand snapshot",
          },
        ],
      }),
      "TOO_MANY_CUSTOM_PRODUCTS",
    );

    expect(rule).toMatchObject({
      triggered: false,
      metadata: {
        customProductsWithoutSnapshotDataCount: 0,
      },
    });
  });

  it("derives riskLevel from triggered rule severity", () => {
    expect(
      analyzeRoutineSafety(
        createMorningInput({
          steps: [
            {
              category: "cleanser",
              customProductName: "Gentle cleanser",
            },
          ],
        }),
      ).riskLevel,
    ).toBe("medium");

    expect(
      analyzeRoutineSafety(
        createEveningInput({
          steps: [
            {
              category: "serum",
              keyActivesSnapshot: ["Retinol", "PHA", "Benzoyl Peroxide"],
            },
            {
              category: "moisturizer",
              customProductName: "Basic moisturizer",
            },
          ],
        }),
      ).riskLevel,
    ).toBe("high");

    expect(analyzeRoutineSafety(createEveningInput()).riskLevel).toBe("low");
  });

  it("keeps riskLevel low when only low rules are triggered", () => {
    const result = analyzeRoutineSafety(
      createEveningInput({
        steps: Array.from({ length: 6 }, (_, index) => ({
          category: "serum",
          customProductName: `Custom product ${index + 1}`,
        })),
      }),
    );

    expect(result.riskLevel).toBe("low");
    expect(result.triggeredRules.map((rule) => rule.code)).toEqual([
      "TOO_MANY_CUSTOM_PRODUCTS",
    ]);
  });

  it("handles missing optional fields without querying product data", () => {
    const result = analyzeRoutineSafety({
      routine: {
        timeOfDay: "evening",
        steps: [
          {
            productId: "665000000000000000000140",
          },
          {
            category: "moisturizer",
          },
        ],
      },
    });

    expect(result.riskLevel).toBe("low");
    expect(result.normalizedSignals.routineSignals).toEqual([]);
    expect(result.allRuleResults).toHaveLength(7);
  });
});

describe("Routine Safety Engine import guard", () => {
  it("adds only the task-scoped domain routine safety files", () => {
    for (const filePath of [
      routineSafetyEnginePath,
      activeSignalNormalizerPath,
      join(projectRoot, "src/domain/routine-safety/routine-safety.types.ts"),
      join(projectRoot, "src/domain/routine-safety/index.ts"),
    ]) {
      expect(existsSync(filePath)).toBe(true);
    }
  });

  it("keeps engine and normalizer imports independent from app and infrastructure layers", () => {
    const forbiddenImportParts = [
      "next",
      "next-auth",
      "mongodb",
      "@/infrastructure/database",
      "repository",
      "use-case",
      "route",
      "components",
      "ai",
      "openai",
      "env",
      "config",
    ];
    const importPattern = /^\s*import\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["']([^"']+)["'];/gm;

    for (const filePath of [routineSafetyEnginePath, activeSignalNormalizerPath]) {
      const source = readFileSync(filePath, "utf8");
      const importSources = [...source.matchAll(importPattern)].map(
        (match) => match[1]?.toLowerCase() ?? "",
      );

      for (const importSource of importSources) {
        for (const forbiddenPart of forbiddenImportParts) {
          expect(importSource).not.toContain(forbiddenPart);
        }
      }
    }
  });
});
