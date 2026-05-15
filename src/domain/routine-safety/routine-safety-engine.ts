import { normalizeRoutineActiveSignals } from "./active-signal-normalizer";
import type {
  ActiveSignal,
  RoutineSafetyEngineResult,
  RoutineSafetyInput,
  RoutineSafetyRiskLevel,
  RoutineSafetyRuleCode,
  RoutineSafetyRuleResult,
  RoutineSafetySeverity,
} from "./routine-safety.types";

const RULE_MESSAGES = {
  MISSING_SUNSCREEN_AM: "Routine buổi sáng đang thiếu chống nắng.",
  TOO_MANY_ACTIVES:
    "Routine có nhiều hoạt chất mạnh, người mới bắt đầu nên đơn giản hóa.",
  RETINOID_PLUS_EXFOLIANT:
    "Không nên dùng retinoid cùng acid tẩy da chết cùng một buổi nếu chưa có kinh nghiệm.",
  TOO_MANY_STEPS_BEGINNER:
    "Routine có thể quá phức tạp cho người mới bắt đầu.",
  FRAGRANCE_SENSITIVE_CAUTION:
    "Da nhạy cảm nên cẩn thận với nhiều sản phẩm có hương liệu.",
  MISSING_MOISTURIZER:
    "Routine có treatment nhưng chưa có bước dưỡng ẩm hỗ trợ.",
  TOO_MANY_CUSTOM_PRODUCTS:
    "Nhiều sản phẩm chưa có dữ liệu thành phần nên phân tích có thể chưa đầy đủ.",
} as const satisfies Record<RoutineSafetyRuleCode, string>;

const RULE_SEVERITIES = {
  MISSING_SUNSCREEN_AM: "medium",
  TOO_MANY_ACTIVES: "high",
  RETINOID_PLUS_EXFOLIANT: "high",
  TOO_MANY_STEPS_BEGINNER: "medium",
  FRAGRANCE_SENSITIVE_CAUTION: "medium",
  MISSING_MOISTURIZER: "low",
  TOO_MANY_CUSTOM_PRODUCTS: "low",
} as const satisfies Record<RoutineSafetyRuleCode, RoutineSafetySeverity>;

const STRONG_ACTIVE_SIGNALS = [
  "AHA",
  "BHA",
  "PHA",
  "RETINOID",
  "BENZOYL_PEROXIDE",
  "VITAMIN_C_STRONG",
] as const satisfies readonly ActiveSignal[];

const EXFOLIANT_SIGNALS = ["AHA", "BHA", "PHA"] as const satisfies readonly ActiveSignal[];

function hasSignals(
  routineSignals: readonly ActiveSignal[],
  signalsToFind: readonly ActiveSignal[],
) {
  return signalsToFind.some((signal) => routineSignals.includes(signal));
}

function hasSnapshotData(step: RoutineSafetyInput["routine"]["steps"][number]) {
  return Boolean(
    step.productNameSnapshot?.trim() ||
      step.brandSnapshot?.trim() ||
      step.ingredientTextSnapshot?.trim() ||
      step.keyActivesSnapshot?.some((active) => active.trim().length > 0),
  );
}

function createRuleResult(
  code: RoutineSafetyRuleCode,
  triggered: boolean,
  metadata?: Record<string, unknown>,
): RoutineSafetyRuleResult {
  return {
    code,
    severity: RULE_SEVERITIES[code],
    message: RULE_MESSAGES[code],
    triggered,
    ...(metadata ? { metadata } : {}),
  };
}

function deriveRiskLevel(
  ruleResults: readonly RoutineSafetyRuleResult[],
): RoutineSafetyRiskLevel {
  const triggeredRules = ruleResults.filter((result) => result.triggered);

  if (triggeredRules.some((result) => result.severity === "high")) {
    return "high";
  }

  if (triggeredRules.some((result) => result.severity === "medium")) {
    return "medium";
  }

  return "low";
}

export function analyzeRoutineSafety(
  input: RoutineSafetyInput,
): RoutineSafetyEngineResult {
  const { routine, skinProfile } = input;
  const steps = routine.steps;
  const normalizedSignals = normalizeRoutineActiveSignals(steps);
  const routineSignals = normalizedSignals.routineSignals;
  const strongActiveSignals = STRONG_ACTIVE_SIGNALS.filter((signal) =>
    routineSignals.includes(signal),
  );
  const hasExfoliantSignal = hasSignals(routineSignals, EXFOLIANT_SIGNALS);
  const hasMoisturizer = steps.some((step) => step.category === "moisturizer");
  const hasTreatment = steps.some((step) => step.category === "treatment");
  const fragranceStepCount = normalizedSignals.steps.filter((step) =>
    step.signals.includes("FRAGRANCE"),
  ).length;
  const customProductsWithoutSnapshotDataCount = steps.filter(
    (step) => Boolean(step.customProductName?.trim()) && !hasSnapshotData(step),
  ).length;
  const isSensitiveContext =
    skinProfile?.sensitivityLevel === "high" ||
    skinProfile?.skinType === "sensitive";

  const allRuleResults: RoutineSafetyRuleResult[] = [
    createRuleResult(
      "MISSING_SUNSCREEN_AM",
      routine.timeOfDay === "morning" &&
        !steps.some((step) => step.category === "sunscreen"),
      {
        timeOfDay: routine.timeOfDay,
      },
    ),
    createRuleResult("TOO_MANY_ACTIVES", strongActiveSignals.length >= 3, {
      activeSignals: strongActiveSignals,
      count: strongActiveSignals.length,
    }),
    createRuleResult(
      "RETINOID_PLUS_EXFOLIANT",
      routine.timeOfDay === "evening" &&
        routineSignals.includes("RETINOID") &&
        hasExfoliantSignal,
      {
        exfoliantSignals: EXFOLIANT_SIGNALS.filter((signal) =>
          routineSignals.includes(signal),
        ),
        hasRetinoid: routineSignals.includes("RETINOID"),
        timeOfDay: routine.timeOfDay,
      },
    ),
    createRuleResult(
      "TOO_MANY_STEPS_BEGINNER",
      skinProfile?.experienceLevel === "beginner" && steps.length > 7,
      {
        experienceLevel: skinProfile?.experienceLevel ?? null,
        stepCount: steps.length,
      },
    ),
    createRuleResult(
      "FRAGRANCE_SENSITIVE_CAUTION",
      isSensitiveContext && fragranceStepCount >= 2,
      {
        fragranceStepCount,
        sensitivityLevel: skinProfile?.sensitivityLevel ?? null,
        skinType: skinProfile?.skinType ?? null,
      },
    ),
    createRuleResult(
      "MISSING_MOISTURIZER",
      (hasTreatment || hasExfoliantSignal) && !hasMoisturizer,
      {
        hasExfoliantSignal,
        hasMoisturizer,
        hasTreatment,
      },
    ),
    createRuleResult(
      "TOO_MANY_CUSTOM_PRODUCTS",
      customProductsWithoutSnapshotDataCount > 5,
      {
        customProductsWithoutSnapshotDataCount,
      },
    ),
  ];
  const triggeredRules = allRuleResults.filter((result) => result.triggered);

  return {
    riskLevel: deriveRiskLevel(allRuleResults),
    triggeredRules,
    allRuleResults,
    normalizedSignals,
  };
}
