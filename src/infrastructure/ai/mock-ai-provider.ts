import "server-only";

import type {
  AIProvider,
  AIProviderIngredientExplanationInput,
  AIProviderIngredientExplanationResult,
  AIProviderMetadata,
  AIProviderRoutineAnalysisInput,
  AIProviderRoutineAnalysisResult,
  AIProviderRoutineStepInput,
  AIProviderSafetyClassifierInput,
  AIProviderSafetyClassifierResult,
  AIRiskLevel,
  AISafetySeverity,
} from "@/infrastructure/ai/ai-provider";

const MOCK_PROVIDER_METADATA = {
  provider: "mock",
  model: "mock-ai-provider",
  generatedAt: "2026-01-01T00:00:00.000Z",
  isMock: true,
} as const satisfies AIProviderMetadata;

const STRONG_ACTIVE_TERMS = [
  "retinoid",
  "retinol",
  "retinal",
  "tretinoin",
  "aha",
  "bha",
  "pha",
  "glycolic",
  "lactic",
  "salicylic",
  "benzoyl peroxide",
  "ascorbic acid",
] as const;

const EXFOLIANT_TERMS = [
  "aha",
  "bha",
  "pha",
  "glycolic",
  "lactic",
  "salicylic",
] as const;

const RETINOID_TERMS = ["retinoid", "retinol", "retinal", "tretinoin"] as const;

const HIGH_SEVERITY_BLOCKED_PHRASES = [
  "severe infection",
  "open wound",
  "skin cancer",
  "replace doctor",
  "replace dermatologist",
] as const;

const MEDIUM_SEVERITY_BLOCKED_PHRASES = [
  "diagnose",
  "cure",
  "treat disease",
  "prescription",
] as const;

function cloneMetadata(): AIProviderMetadata {
  return { ...MOCK_PROVIDER_METADATA };
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function stepText(step: AIProviderRoutineStepInput) {
  return [
    step.productName,
    step.productCategory,
    step.instructions,
    ...(step.ingredients ?? []),
  ]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(" ")
    .toLowerCase();
}

function countStrongActives(steps: AIProviderRoutineStepInput[]) {
  const matchedTerms = new Set<string>();
  const combinedStepText = steps.map(stepText).join(" ");

  for (const term of STRONG_ACTIVE_TERMS) {
    if (combinedStepText.includes(term)) {
      matchedTerms.add(term);
    }
  }

  return matchedTerms.size;
}

function hasTerm(steps: AIProviderRoutineStepInput[], terms: readonly string[]) {
  const combinedStepText = steps.map(stepText).join(" ");

  return terms.some((term) => combinedStepText.includes(term));
}

function hasSunscreenStep(input: AIProviderRoutineAnalysisInput) {
  return input.steps.some((step) => {
    const category = normalizeText(step.productCategory ?? "");
    const name = normalizeText(step.productName ?? "");

    return category === "sunscreen" || name.includes("sunscreen");
  });
}

function deriveRoutineRiskLevel(
  input: AIProviderRoutineAnalysisInput,
): AIRiskLevel {
  const strongActiveCount = countStrongActives(input.steps);
  const combinesRetinoidAndExfoliant =
    hasTerm(input.steps, RETINOID_TERMS) && hasTerm(input.steps, EXFOLIANT_TERMS);

  if (combinesRetinoidAndExfoliant) {
    return "high";
  }

  if (
    strongActiveCount >= 3 ||
    input.steps.length > 7 ||
    (input.timeOfDay === "morning" && !hasSunscreenStep(input))
  ) {
    return "medium";
  }

  return "low";
}

function buildRoutineWarnings(input: AIProviderRoutineAnalysisInput) {
  const warnings: string[] = [];
  const strongActiveCount = countStrongActives(input.steps);

  if (input.timeOfDay === "morning" && !hasSunscreenStep(input)) {
    warnings.push(
      "Morning routines usually need sun protection education before adding stronger active ingredients.",
    );
  }

  if (hasTerm(input.steps, RETINOID_TERMS) && hasTerm(input.steps, EXFOLIANT_TERMS)) {
    warnings.push(
      "The mock review detected retinoid and exfoliating acid terms in the same routine context.",
    );
  }

  if (strongActiveCount >= 3) {
    warnings.push(
      "Several strong active ingredient terms appear in the routine, which can make reactions harder to track.",
    );
  }

  if (input.steps.length > 7) {
    warnings.push(
      "Long routines can be difficult to maintain and can make product reactions harder to understand.",
    );
  }

  if (warnings.length === 0) {
    warnings.push(
      "No major mock warning was detected from the provided routine structure.",
    );
  }

  return warnings;
}

function blockedSeverity(text: string): AISafetySeverity | null {
  if (HIGH_SEVERITY_BLOCKED_PHRASES.some((phrase) => text.includes(phrase))) {
    return "high";
  }

  if (MEDIUM_SEVERITY_BLOCKED_PHRASES.some((phrase) => text.includes(phrase))) {
    return "medium";
  }

  return null;
}

export class MockAIProvider implements AIProvider {
  async analyzeRoutine(
    input: AIProviderRoutineAnalysisInput,
  ): Promise<AIProviderRoutineAnalysisResult> {
    const overallRiskLevel = deriveRoutineRiskLevel(input);

    return {
      summary: `Mock educational analysis reviewed "${input.routineName}" with ${input.steps.length} step(s).`,
      overallRiskLevel,
      warnings: buildRoutineWarnings(input),
      recommendations: [
        "Keep the routine simple and introduce new cosmetic products gradually.",
        "Track how the skin feels over time instead of changing many products at once.",
        "Seek professional help for severe, painful, spreading, infected-looking, or persistent symptoms.",
      ],
      educationalNotes: [
        "This mock result is deterministic and intended for development only.",
        "Information is educational skincare guidance, not medical diagnosis or treatment.",
      ],
      providerMetadata: cloneMetadata(),
    };
  }

  async explainIngredient(
    input: AIProviderIngredientExplanationInput,
  ): Promise<AIProviderIngredientExplanationResult> {
    const ingredientName = input.ingredientName.trim();

    return {
      ingredientName,
      shortExplanation: `${ingredientName} is explained here in a simple educational skincare context by the mock provider.`,
      benefits: [
        "Can be reviewed as part of a cosmetic ingredient list.",
        "May help users understand why an ingredient appears in skincare products.",
      ],
      cautions: [
        "Patch response and tolerance can vary by person.",
        "Avoid using ingredient information as a diagnosis or treatment plan.",
      ],
      suitableFor: [
        input.skinType
          ? `Users with ${input.skinType} skin who want educational context.`
          : "Users who want beginner-friendly ingredient education.",
      ],
      notSuitableFor: [
        "Users seeking diagnosis, prescription advice, or treatment for a disease.",
      ],
      educationalNotes: [
        "This mock explanation does not call an external AI service.",
        "For severe or persistent symptoms, consult a qualified professional.",
      ],
      providerMetadata: cloneMetadata(),
    };
  }

  async classifySafety(
    input: AIProviderSafetyClassifierInput,
  ): Promise<AIProviderSafetyClassifierResult> {
    const normalizedText = normalizeText(input.text);
    const severity = blockedSeverity(normalizedText);

    if (severity) {
      return {
        isAllowed: false,
        category: "medical_diagnosis_or_treatment",
        severity,
        reason:
          "SkinWise VN only supports educational skincare information and cannot help with diagnosis, disease treatment, prescriptions, or replacing professional care.",
        providerMetadata: cloneMetadata(),
      };
    }

    return {
      isAllowed: true,
      category: "skincare_education",
      severity: "low",
      reason:
        "Educational skincare content is allowed when it does not request diagnosis, treatment, prescriptions, or replacement of professional care.",
      providerMetadata: cloneMetadata(),
    };
  }
}
