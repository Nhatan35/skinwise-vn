import {
  getAIProvider,
  type AIProviderRoutineAnalysisResult,
  type AIProviderRoutineAnalysisInput,
  type AIProviderRoutineStepInput,
} from "@/infrastructure/ai";
import { analyzeRoutineSafety } from "@/domain/routine-safety";
import type {
  ActiveSignal,
  NormalizedRoutineSignals,
  RoutineSafetyRiskLevel,
  RoutineSafetyRuleCode,
  RoutineSafetyRuleResult,
} from "@/domain/routine-safety";
import { mapAIProviderRoutineAnalysisToRoutineAnalysisResult } from "@/modules/ai-analysis/ai-provider-routine-analysis.mapper";
import {
  classifyRoutineAnalysisProviderFailure,
  RoutineAnalysisProviderMappingError,
} from "@/modules/ai-analysis/ai-provider-failure-observability";
import { ROUTINE_ANALYSIS_EDUCATIONAL_DISCLAIMER } from "@/modules/ai-analysis/routine-analysis.constants";
import {
  createRoutineAnalysisForUser,
  listRoutineAnalysesByRoutineIdAndUserId,
} from "@/modules/ai-analysis/routine-analysis.repository";
import { buildRoutinePositiveFindings } from "@/modules/ai-analysis/routine-analysis-positive-findings";
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
  | "providerFailureReason"
>;

const RISK_LEVEL_RANK = {
  low: 0,
  medium: 1,
  high: 2,
} as const satisfies Record<RoutineSafetyRiskLevel, number>;

const RULE_REASONS = {
  MISSING_SUNSCREEN_AM:
    "Routine buổi sáng chưa có bước chống nắng. Dựa trên dữ liệu hiện có, đây là bước nên cân nhắc trước khi thêm treatment mới.",
  TOO_MANY_ACTIVES:
    "Routine có nhiều active ingredient mạnh trong cùng một buổi, nên có thể khó theo dõi phản ứng da.",
  RETINOID_PLUS_EXFOLIANT:
    "Retinoid và nhóm tẩy da chết hóa học trong cùng buổi có thể quá mạnh nếu da chưa quen.",
  TOO_MANY_STEPS_BEGINNER:
    "Routine dài có thể khó duy trì và khó xác định sản phẩm nào làm da khó chịu.",
  FRAGRANCE_SENSITIVE_CAUTION:
    "Với da nhạy cảm, nhiều sản phẩm có hương liệu có thể cần được theo dõi kỹ hơn.",
  MISSING_MOISTURIZER:
    "Routine có treatment hoặc active nhưng chưa có bước dưỡng ẩm hỗ trợ.",
  TOO_MANY_CUSTOM_PRODUCTS:
    "Nhiều sản phẩm nhập thủ công chưa có dữ liệu thành phần, nên kết quả phân tích chỉ dựa trên dữ liệu hiện có.",
} as const satisfies Record<RoutineSafetyRuleCode, string>;

const RULE_SUGGESTIONS = {
  MISSING_SUNSCREEN_AM: {
    title: "Cân nhắc thêm chống nắng cho routine buổi sáng",
    description:
      "Nếu routine này dùng ban ngày, nên có bước chống nắng ở cuối routine.",
  },
  TOO_MANY_ACTIVES: {
    title: "Giảm số active dùng cùng lúc",
    description:
      "Nên tránh thêm quá nhiều treatment trong cùng một routine, đặc biệt khi da nhạy cảm hoặc mới bắt đầu.",
  },
  RETINOID_PLUS_EXFOLIANT: {
    title: "Tách retinoid và exfoliant sang các buổi khác nhau",
    description:
      "Nếu da chưa quen, nên cân nhắc dùng retinoid và sản phẩm tẩy da chết hóa học ở các buổi khác nhau.",
  },
  TOO_MANY_STEPS_BEGINNER: {
    title: "Đơn giản hóa routine",
    description:
      "Routine ngắn hơn thường dễ duy trì và dễ theo dõi phản ứng da hơn.",
  },
  FRAGRANCE_SENSITIVE_CAUTION: {
    title: "Theo dõi sản phẩm có hương liệu",
    description:
      "Nếu da nhạy cảm, nên theo dõi kỹ phản ứng da khi dùng nhiều sản phẩm có hương liệu.",
  },
  MISSING_MOISTURIZER: {
    title: "Cân nhắc thêm bước dưỡng ẩm",
    description:
      "Dưỡng ẩm có thể giúp routine cân bằng hơn, đặc biệt khi routine có treatment hoặc sản phẩm làm sạch.",
  },
  TOO_MANY_CUSTOM_PRODUCTS: {
    title: "Bổ sung dữ liệu sản phẩm khi có thể",
    description:
      "Thêm thông tin thành phần hoặc key actives sẽ giúp lần phân tích sau rõ hơn.",
  },
} as const satisfies Record<
  RoutineSafetyRuleCode,
  {
    title: string;
    description: string;
  }
>;

const RULE_SUGGESTION_PRIORITIES = {
  MISSING_SUNSCREEN_AM: "must_fix",
  TOO_MANY_ACTIVES: "must_fix",
  RETINOID_PLUS_EXFOLIANT: "must_fix",
  TOO_MANY_STEPS_BEGINNER: "should_fix",
  FRAGRANCE_SENSITIVE_CAUTION: "should_fix",
  MISSING_MOISTURIZER: "should_fix",
  TOO_MANY_CUSTOM_PRODUCTS: "optional",
} as const satisfies Record<
  RoutineSafetyRuleCode,
  RoutineAnalysisSuggestion["priority"]
>;

const JOURNAL_TRACKING_SUGGESTION = {
  title: "Theo dõi phản ứng da trong Journal",
  description:
    "Sau khi chỉnh routine, hãy ghi lại cảm giác da, kích ứng hoặc thay đổi nổi bật trong Journal để theo dõi theo thời gian.",
  priority: "optional",
} as const satisfies RoutineAnalysisSuggestion;

const TREATMENT_FREQUENCY_SUGGESTION = {
  title: "Bắt đầu treatment với tần suất thấp",
  description:
    "Nếu bạn mới dùng treatment hoặc active ingredient, có thể bắt đầu 1–2 lần/tuần và theo dõi phản ứng da.",
  priority: "should_fix",
} as const satisfies RoutineAnalysisSuggestion;

const TREATMENT_ACTIVE_SIGNALS = [
  "AHA",
  "BHA",
  "PHA",
  "RETINOID",
  "BENZOYL_PEROXIDE",
  "VITAMIN_C_STRONG",
] as const satisfies readonly ActiveSignal[];

const TREATMENT_ACTIVE_SIGNAL_SET: ReadonlySet<ActiveSignal> = new Set(
  TREATMENT_ACTIVE_SIGNALS,
);

const TREATMENT_KEYWORDS = [
  "retinol",
  "retinoid",
  "tretinoin",
  "adapalene",
  "aha",
  "bha",
  "pha",
  "exfoliant",
  "peel",
  "benzoyl peroxide",
  "salicylic acid",
  "glycolic acid",
  "lactic acid",
] as const;

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
    priority: RULE_SUGGESTION_PRIORITIES[rule.code],
  };
}

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsKeyword(normalizedText: string, keyword: string) {
  const normalizedKeyword = normalizeSearchText(keyword);

  return ` ${normalizedText} `.includes(` ${normalizedKeyword} `);
}

function getTreatmentSearchTexts(step: Routine["steps"][number]) {
  return [
    step.productNameSnapshot,
    step.customProductName,
    ...(step.keyActivesSnapshot ?? []),
    step.ingredientTextSnapshot,
  ].filter((value): value is string => Boolean(value?.trim()));
}

function hasTreatmentKeyword(step: Routine["steps"][number]) {
  return getTreatmentSearchTexts(step).some((text) => {
    const normalizedText = normalizeSearchText(text);

    return TREATMENT_KEYWORDS.some((keyword) =>
      containsKeyword(normalizedText, keyword),
    );
  });
}

function hasTreatmentOrActive(
  routine: Routine,
  normalizedSignals: NormalizedRoutineSignals,
) {
  return (
    routine.steps.some((step) => step.category === "treatment") ||
    normalizedSignals.routineSignals.some((signal) =>
      TREATMENT_ACTIVE_SIGNAL_SET.has(signal),
    ) ||
    routine.steps.some(hasTreatmentKeyword)
  );
}

function normalizeSuggestionKey(value: string) {
  return normalizeSearchText(value);
}

function dedupeSuggestions(
  suggestions: RoutineAnalysisSuggestion[],
): RoutineAnalysisSuggestion[] {
  const seenKeys = new Set<string>();
  const dedupedSuggestions: RoutineAnalysisSuggestion[] = [];

  for (const suggestion of suggestions) {
    const titleKey = normalizeSuggestionKey(suggestion.title);
    const descriptionKey = normalizeSuggestionKey(suggestion.description);
    const dedupeKey = `${titleKey}:${descriptionKey}`;

    if (
      seenKeys.has(titleKey) ||
      seenKeys.has(descriptionKey) ||
      seenKeys.has(dedupeKey)
    ) {
      continue;
    }

    seenKeys.add(titleKey);
    seenKeys.add(descriptionKey);
    seenKeys.add(dedupeKey);
    dedupedSuggestions.push({ ...suggestion });
  }

  return dedupedSuggestions;
}

function buildFallbackSuggestions(
  triggeredRules: RoutineSafetyRuleResult[],
  routine: Routine,
  normalizedSignals: NormalizedRoutineSignals,
): RoutineAnalysisSuggestion[] {
  const suggestions = [
    ...triggeredRules.map(toSuggestion),
    ...(hasTreatmentOrActive(routine, normalizedSignals)
      ? [{ ...TREATMENT_FREQUENCY_SUGGESTION }]
      : []),
    { ...JOURNAL_TRACKING_SUGGESTION },
  ];

  return dedupeSuggestions(suggestions);
}

function createFallbackSummary(
  riskLevel: RoutineAnalysisResult["riskLevel"],
  triggeredRules: RoutineSafetyRuleResult[],
) {
  if (triggeredRules.length === 0) {
    return "Routine hiện chưa có cảnh báo lớn dựa trên dữ liệu routine hiện có. Bạn vẫn nên bắt đầu từ từ khi thêm sản phẩm mới và theo dõi phản ứng da.";
  }

  if (riskLevel === "high") {
    return "Routine có một số điểm nên ưu tiên chỉnh trước khi tiếp tục, đặc biệt nếu có nhiều active hoặc treatment trong cùng buổi.";
  }

  if (riskLevel === "medium") {
    return "Routine nhìn chung có thể tiếp tục được, nhưng có một vài điểm nên cân nhắc để dễ duy trì và dễ theo dõi phản ứng da hơn.";
  }

  return "Routine có một vài ghi chú nhẹ dựa trên dữ liệu hiện có; bạn có thể tiếp tục theo dõi bằng Today Log và Journal.";
}

function buildDeterministicFallbackResult(
  riskLevel: RoutineAnalysisResult["riskLevel"],
  triggeredRules: RoutineSafetyRuleResult[],
  routine: Routine,
  normalizedSignals: NormalizedRoutineSignals,
): RoutineAnalysisResult {
  return {
    riskLevel,
    summary: createFallbackSummary(riskLevel, triggeredRules),
    positiveFindings: buildRoutinePositiveFindings({
      timeOfDay: routine.timeOfDay,
      steps: routine.steps,
    }),
    warnings: triggeredRules.map(toWarning),
    suggestions: buildFallbackSuggestions(
      triggeredRules,
      routine,
      normalizedSignals,
    ),
    shouldSeeProfessional: false,
    disclaimer: ROUTINE_ANALYSIS_EDUCATIONAL_DISCLAIMER,
  };
}

function buildFallbackExecutionResult(
  riskLevel: RoutineAnalysisResult["riskLevel"],
  triggeredRules: RoutineSafetyRuleResult[],
  routine: Routine,
  normalizedSignals: NormalizedRoutineSignals,
): RoutineAnalysisExecutionResult {
  const aiResult = buildDeterministicFallbackResult(
    riskLevel,
    triggeredRules,
    routine,
    normalizedSignals,
  );

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

function mergePositiveFindings(
  providerPositiveFindings: readonly string[] | undefined,
  deterministicPositiveFindings: readonly string[] | undefined,
) {
  return [
    ...new Set([
      ...(providerPositiveFindings ?? []),
      ...(deterministicPositiveFindings ?? []),
    ]),
  ];
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
    positiveFindings: mergePositiveFindings(
      providerResult.positiveFindings,
      deterministicResult.positiveFindings,
    ),
    suggestions: mergeSuggestions(
      deterministicResult.suggestions,
      providerResult.suggestions,
    ),
    shouldSeeProfessional: guardedRiskLevel === "high",
  };
}

function mapProviderRoutineAnalysisResult(
  providerResult: AIProviderRoutineAnalysisResult,
): RoutineAnalysisResult {
  try {
    return mapAIProviderRoutineAnalysisToRoutineAnalysisResult(providerResult);
  } catch {
    throw new RoutineAnalysisProviderMappingError();
  }
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
  const mappedProviderResult = mapProviderRoutineAnalysisResult(providerResult);
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
    routine,
    safetyResult.normalizedSignals,
  );
  let executionResult = fallbackExecutionResult;

  try {
    executionResult = await buildProviderExecutionResult(
      routine,
      skinProfile,
      fallbackExecutionResult.aiResult,
    );
  } catch (error) {
    executionResult = {
      ...fallbackExecutionResult,
      providerFailureReason: classifyRoutineAnalysisProviderFailure(error),
    };
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
    ...(executionResult.providerFailureReason
      ? { providerFailureReason: executionResult.providerFailureReason }
      : {}),
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
