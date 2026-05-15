export const ACTIVE_SIGNALS = [
  "AHA",
  "BHA",
  "PHA",
  "RETINOID",
  "BENZOYL_PEROXIDE",
  "VITAMIN_C_STRONG",
  "FRAGRANCE",
] as const;

export const ROUTINE_SAFETY_RULE_CODES = [
  "MISSING_SUNSCREEN_AM",
  "TOO_MANY_ACTIVES",
  "RETINOID_PLUS_EXFOLIANT",
  "TOO_MANY_STEPS_BEGINNER",
  "FRAGRANCE_SENSITIVE_CAUTION",
  "MISSING_MOISTURIZER",
  "TOO_MANY_CUSTOM_PRODUCTS",
] as const;

export const ROUTINE_SAFETY_SEVERITIES = ["low", "medium", "high"] as const;
export const ROUTINE_SAFETY_RISK_LEVELS = ["low", "medium", "high"] as const;

export type ActiveSignal = (typeof ACTIVE_SIGNALS)[number];
export type RoutineSafetyRuleCode = (typeof ROUTINE_SAFETY_RULE_CODES)[number];
export type RoutineSafetySeverity = (typeof ROUTINE_SAFETY_SEVERITIES)[number];
export type RoutineSafetyRiskLevel =
  (typeof ROUTINE_SAFETY_RISK_LEVELS)[number];

export type RoutineSafetyTimeOfDay = "morning" | "evening";
export type RoutineSafetyStepCategory =
  | "cleanser"
  | "moisturizer"
  | "sunscreen"
  | "treatment"
  | "toner"
  | "serum"
  | "mask"
  | "other";

export type RoutineSafetyStep = {
  stepId?: string;
  productId?: string;
  customProductName?: string;
  category?: RoutineSafetyStepCategory;
  order?: number;
  frequency?: string;
  instructions?: string;
  productNameSnapshot?: string;
  brandSnapshot?: string;
  keyActivesSnapshot?: string[];
  ingredientTextSnapshot?: string;
};

export type RoutineSafetyRoutine = {
  name?: string;
  timeOfDay: RoutineSafetyTimeOfDay;
  steps: RoutineSafetyStep[];
};

export type RoutineSafetySkinProfile = {
  skinType?: "oily" | "dry" | "combination" | "normal" | "sensitive" | "unknown";
  sensitivityLevel?: "low" | "medium" | "high" | "unknown";
  experienceLevel?: "beginner" | "intermediate" | "advanced";
};

export type RoutineSafetyInput = {
  routine: RoutineSafetyRoutine;
  skinProfile?: RoutineSafetySkinProfile | null;
};

export type RoutineSafetyRuleResult = {
  code: RoutineSafetyRuleCode;
  severity: RoutineSafetySeverity;
  message: string;
  triggered: boolean;
  metadata?: Record<string, unknown>;
};

export type NormalizedRoutineStepSignals = {
  stepIndex: number;
  stepId?: string;
  signals: ActiveSignal[];
  matchedAliases: Partial<Record<ActiveSignal, string[]>>;
};

export type NormalizedRoutineSignals = {
  steps: NormalizedRoutineStepSignals[];
  routineSignals: ActiveSignal[];
  matchedAliases: Partial<Record<ActiveSignal, string[]>>;
};

export type RoutineSafetyEngineResult = {
  riskLevel: RoutineSafetyRiskLevel;
  triggeredRules: RoutineSafetyRuleResult[];
  allRuleResults: RoutineSafetyRuleResult[];
  normalizedSignals: NormalizedRoutineSignals;
};
