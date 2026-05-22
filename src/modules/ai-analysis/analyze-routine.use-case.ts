import {
  getAIProvider,
  type AIProviderRoutineAnalysisInput,
  type AIProviderRoutineStepInput,
} from "@/infrastructure/ai";
import { analyzeRoutineSafety } from "@/domain/routine-safety";
import type {
  RoutineSafetyRiskLevel,
  RoutineSafetyRuleCode,
  RoutineSafetyRuleResult,
} from "@/domain/routine-safety";
import { mapAIProviderRoutineAnalysisToRoutineAnalysisResult } from "@/modules/ai-analysis/ai-provider-routine-analysis.mapper";
import { ROUTINE_ANALYSIS_EDUCATIONAL_DISCLAIMER } from "@/modules/ai-analysis/routine-analysis.constants";
import {
  createRoutineAnalysisForUser,
  listRoutineAnalysesByRoutineIdAndUserId,
} from "@/modules/ai-analysis/routine-analysis.repository";
import {
  ROUTINE_ANALYSIS_FALLBACK_MODEL_NAME,
  ROUTINE_ANALYSIS_FALLBACK_MODEL_PROVIDER,
  ROUTINE_ANALYSIS_FALLBACK_PROMPT_VERSION,
  ROUTINE_ANALYSIS_PROVIDER_PROMPT_VERSION,
  type CreateRoutineAnalysisInput,
  type RoutineAnalysisResult,
  type RoutineAnalysisSuggestion,
  type RoutineAnalysisWarning,
} from "@/modules/ai-analysis/routine-analysis.types";
import {
  toRoutineAnalysisDto,
  toRoutineAnalysisHistoryDto,
} from "@/modules/ai-analysis/routine-analysis.mapper";
import type {
  RoutineAnalysisDto,
  RoutineAnalysisHistoryDto,
} from "@/modules/ai-analysis/routine-analysis.dto";
import { findRoutineByIdAndUserId } from "@/modules/routines/routine.repository";
import type { Routine } from "@/modules/routines/routine.types";
import { findSkinProfileByUserId } from "@/modules/skin-profile/skin-profile.repository";
import type { SkinProfile } from "@/modules/skin-profile/skin-profile.types";

type AnalyzeRoutineForCurrentUserInput = {
  routineId: string;
  currentUserId: string;
};

type RoutineAnalysisExecutionResult = Pick<
  CreateRoutineAnalysisInput,
  | "riskLevel"
  | "aiResult"
  | "aiStatus"
  | "modelProvider"
  | "modelName"
  | "promptVersion"
>;

const RISK_LEVEL_RANK = {
  low: 0,
  medium: 1,
  high: 2,
} as const satisfies Record<RoutineSafetyRiskLevel, number>;

const RULE_REASONS = {
  MISSING_SUNSCREEN_AM:
    "Chong nang la buoc quan trong trong routine ban ngay.",
  TOO_MANY_ACTIVES:
    "Qua nhieu hoat chat manh trong cung routine co the lam routine kho theo doi va de gay kho chiu.",
  RETINOID_PLUS_EXFOLIANT:
    "Retinoid va acid tay da chet trong cung buoi co the qua manh, dac biet voi nguoi moi.",
  TOO_MANY_STEPS_BEGINNER:
    "Routine dai co the kho duy tri va kho xac dinh san pham nao gay kich ung.",
  FRAGRANCE_SENSITIVE_CAUTION:
    "Nhieu san pham co huong lieu co the khong phu hop voi da nhay cam.",
  MISSING_MOISTURIZER:
    "Duong am giup routine co treatment hoac exfoliant can bang hon.",
  TOO_MANY_CUSTOM_PRODUCTS:
    "Nhieu san pham tuy chinh thieu snapshot thanh phan nen ket qua chi la uoc tinh.",
} as const satisfies Record<RoutineSafetyRuleCode, string>;

const RULE_SUGGESTIONS = {
  MISSING_SUNSCREEN_AM: {
    title: "Them buoc chong nang",
    description: "Uu tien chong nang trong routine buoi sang truoc khi them treatment moi.",
  },
  TOO_MANY_ACTIVES: {
    title: "Don gian hoa hoat chat",
    description: "Giam bot so hoat chat manh de routine de theo doi hon.",
  },
  RETINOID_PLUS_EXFOLIANT: {
    title: "Tach retinoid va exfoliant",
    description: "Can nhac dung retinoid va acid tay da chet o cac buoi khac nhau.",
  },
  TOO_MANY_STEPS_BEGINNER: {
    title: "Rut gon routine",
    description: "Nguoi moi nen bat dau voi routine it buoc va de duy tri.",
  },
  FRAGRANCE_SENSITIVE_CAUTION: {
    title: "Theo doi huong lieu",
    description: "Neu da nhay cam, hay can nhac giam so san pham co huong lieu.",
  },
  MISSING_MOISTURIZER: {
    title: "Them duong am ho tro",
    description: "Dung duong am co the giup routine co treatment de chiu hon.",
  },
  TOO_MANY_CUSTOM_PRODUCTS: {
    title: "Bo sung snapshot san pham",
    description: "Them thong tin thanh phan hoac key actives de ket qua phan tich day du hon.",
  },
} as const satisfies Record<
  RoutineSafetyRuleCode,
  {
    title: string;
    description: string;
  }
>;

function toWarning(rule: RoutineSafetyRuleResult): RoutineAnalysisWarning {
  return {
    code: rule.code,
    severity: rule.severity,
    message: rule.message,
    reason: RULE_REASONS[rule.code],
  };
}

function toSuggestion(rule: RoutineSafetyRuleResult): RoutineAnalysisSuggestion {
  const suggestion = RULE_SUGGESTIONS[rule.code];

  return {
    title: suggestion.title,
    description: suggestion.description,
    priority: rule.severity === "high" ? "must_fix" : rule.severity === "medium" ? "should_fix" : "optional",
  };
}

function createFallbackSummary(
  riskLevel: RoutineAnalysisResult["riskLevel"],
  triggeredRules: RoutineSafetyRuleResult[],
) {
  if (triggeredRules.length === 0) {
    return "Routine hien khong co canh bao an toan co ban nao duoc kich hoat.";
  }

  if (riskLevel === "high") {
    return "Routine co mot so diem can don gian hoa truoc khi tiep tuc.";
  }

  if (riskLevel === "medium") {
    return "Routine co mot so diem nen xem lai de an toan va de duy tri hon.";
  }

  return "Routine co mot vai ghi chu nhe de ban theo doi them.";
}

function buildDeterministicFallbackResult(
  riskLevel: RoutineAnalysisResult["riskLevel"],
  triggeredRules: RoutineSafetyRuleResult[],
): RoutineAnalysisResult {
  return {
    riskLevel,
    summary: createFallbackSummary(riskLevel, triggeredRules),
    warnings: triggeredRules.map(toWarning),
    suggestions: triggeredRules.map(toSuggestion),
    shouldSeeProfessional: false,
    disclaimer: ROUTINE_ANALYSIS_EDUCATIONAL_DISCLAIMER,
  };
}

function buildFallbackExecutionResult(
  riskLevel: RoutineAnalysisResult["riskLevel"],
  triggeredRules: RoutineSafetyRuleResult[],
): RoutineAnalysisExecutionResult {
  const aiResult = buildDeterministicFallbackResult(riskLevel, triggeredRules);

  return {
    riskLevel: aiResult.riskLevel,
    aiResult,
    aiStatus: "fallback_used",
    modelProvider: ROUTINE_ANALYSIS_FALLBACK_MODEL_PROVIDER,
    modelName: ROUTINE_ANALYSIS_FALLBACK_MODEL_NAME,
    promptVersion: ROUTINE_ANALYSIS_FALLBACK_PROMPT_VERSION,
  };
}

function buildRoutineSnapshot(routine: Routine) {
  return {
    name: routine.name,
    timeOfDay: routine.timeOfDay,
    steps: routine.steps.map((step) => ({ ...step })),
  };
}

function buildAIProviderStepInput(
  step: Routine["steps"][number],
): AIProviderRoutineStepInput {
  const productName = step.productNameSnapshot ?? step.customProductName;
  const ingredients = [
    ...(step.keyActivesSnapshot ?? []),
    ...(step.ingredientTextSnapshot ? [step.ingredientTextSnapshot] : []),
  ].filter((ingredient) => ingredient.trim().length > 0);

  return {
    stepOrder: step.order,
    ...(productName ? { productName } : {}),
    productCategory: step.category,
    ...(ingredients.length > 0 ? { ingredients } : {}),
    ...(step.instructions ? { instructions: step.instructions } : {}),
  };
}

function buildSkinProfileContext(profile: SkinProfile | null) {
  if (!profile) {
    return null;
  }

  return {
    skinType: profile.skinType,
    sensitivityLevel: profile.sensitivityLevel,
    experienceLevel: profile.experienceLevel,
  };
}

function buildAIProviderSkinProfileContext(profile: SkinProfile | null) {
  if (!profile) {
    return undefined;
  }

  return {
    skinType: profile.skinType,
    sensitivityLevel: profile.sensitivityLevel,
    concerns: [...profile.concerns],
    experienceLevel: profile.experienceLevel,
  };
}

function buildAIProviderRoutineInput(
  routine: Routine,
  skinProfile: SkinProfile | null,
): AIProviderRoutineAnalysisInput {
  const providerSkinProfile = buildAIProviderSkinProfileContext(skinProfile);

  return {
    routineId: routine._id.toString(),
    routineName: routine.name,
    timeOfDay: routine.timeOfDay,
    steps: routine.steps.map(buildAIProviderStepInput),
    ...(providerSkinProfile ? { skinProfile: providerSkinProfile } : {}),
    locale: "vi-VN",
  };
}

function maxRiskLevel(
  firstRiskLevel: RoutineSafetyRiskLevel,
  secondRiskLevel: RoutineSafetyRiskLevel,
): RoutineSafetyRiskLevel {
  return RISK_LEVEL_RANK[firstRiskLevel] >= RISK_LEVEL_RANK[secondRiskLevel]
    ? firstRiskLevel
    : secondRiskLevel;
}

function mergeWarnings(
  deterministicWarnings: RoutineAnalysisWarning[],
  providerWarnings: RoutineAnalysisWarning[],
) {
  const seenMessages = new Set<string>();
  const mergedWarnings: RoutineAnalysisWarning[] = [];

  for (const warning of [...deterministicWarnings, ...providerWarnings]) {
    if (seenMessages.has(warning.message)) {
      continue;
    }

    seenMessages.add(warning.message);
    mergedWarnings.push({ ...warning });
  }

  return mergedWarnings;
}

function mergeSuggestions(
  deterministicSuggestions: RoutineAnalysisSuggestion[],
  providerSuggestions: RoutineAnalysisSuggestion[],
) {
  const seenDescriptions = new Set<string>();
  const mergedSuggestions: RoutineAnalysisSuggestion[] = [];

  for (const suggestion of [
    ...deterministicSuggestions,
    ...providerSuggestions,
  ]) {
    if (seenDescriptions.has(suggestion.description)) {
      continue;
    }

    seenDescriptions.add(suggestion.description);
    mergedSuggestions.push({ ...suggestion });
  }

  return mergedSuggestions;
}

function applyDeterministicSafetyGuard(
  deterministicResult: RoutineAnalysisResult,
  providerResult: RoutineAnalysisResult,
): RoutineAnalysisResult {
  const guardedRiskLevel = maxRiskLevel(
    deterministicResult.riskLevel,
    providerResult.riskLevel,
  );

  return {
    ...providerResult,
    riskLevel: guardedRiskLevel,
    warnings: mergeWarnings(
      deterministicResult.warnings,
      providerResult.warnings,
    ),
    suggestions: mergeSuggestions(
      deterministicResult.suggestions,
      providerResult.suggestions,
    ),
    shouldSeeProfessional: guardedRiskLevel === "high",
  };
}

async function buildProviderExecutionResult(
  routine: Routine,
  skinProfile: SkinProfile | null,
  deterministicResult: RoutineAnalysisResult,
): Promise<RoutineAnalysisExecutionResult> {
  const provider = getAIProvider();
  const providerResult = await provider.analyzeRoutine(
    buildAIProviderRoutineInput(routine, skinProfile),
  );
  const mappedProviderResult =
    mapAIProviderRoutineAnalysisToRoutineAnalysisResult(providerResult);
  const aiResult = applyDeterministicSafetyGuard(
    deterministicResult,
    mappedProviderResult,
  );

  return {
    riskLevel: aiResult.riskLevel,
    aiResult,
    aiStatus: "provider_used",
    modelProvider: providerResult.providerMetadata.provider,
    modelName: providerResult.providerMetadata.model,
    promptVersion: ROUTINE_ANALYSIS_PROVIDER_PROMPT_VERSION,
  };
}

export async function analyzeRoutineForCurrentUser(
  input: AnalyzeRoutineForCurrentUserInput,
): Promise<RoutineAnalysisDto | null> {
  const routine = await findRoutineByIdAndUserId(
    input.routineId,
    input.currentUserId,
  );

  if (!routine) {
    return null;
  }

  const skinProfile = await findSkinProfileByUserId(input.currentUserId);
  const safetyResult = analyzeRoutineSafety({
    routine: {
      name: routine.name,
      timeOfDay: routine.timeOfDay,
      steps: routine.steps,
    },
    skinProfile: buildSkinProfileContext(skinProfile),
  });
  const fallbackExecutionResult = buildFallbackExecutionResult(
    safetyResult.riskLevel,
    safetyResult.triggeredRules,
  );
  let executionResult = fallbackExecutionResult;

  try {
    executionResult = await buildProviderExecutionResult(
      routine,
      skinProfile,
      fallbackExecutionResult.aiResult,
    );
  } catch {
    executionResult = fallbackExecutionResult;
  }

  const analysis = await createRoutineAnalysisForUser(input.currentUserId, {
    routineId: routine._id,
    routineSnapshot: buildRoutineSnapshot(routine),
    riskLevel: executionResult.riskLevel,
    ruleResults: safetyResult.allRuleResults,
    aiResult: executionResult.aiResult,
    aiStatus: executionResult.aiStatus,
    modelProvider: executionResult.modelProvider,
    modelName: executionResult.modelName,
    promptVersion: executionResult.promptVersion,
  });

  return toRoutineAnalysisDto(analysis);
}

export async function listRoutineAnalysesForCurrentUser(
  input: AnalyzeRoutineForCurrentUserInput,
): Promise<RoutineAnalysisHistoryDto | null> {
  const routine = await findRoutineByIdAndUserId(
    input.routineId,
    input.currentUserId,
  );

  if (!routine) {
    return null;
  }

  const analyses = await listRoutineAnalysesByRoutineIdAndUserId(
    input.routineId,
    input.currentUserId,
  );

  return toRoutineAnalysisHistoryDto(analyses);
}
