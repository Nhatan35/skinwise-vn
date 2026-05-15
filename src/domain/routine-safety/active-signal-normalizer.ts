import type {
  ActiveSignal,
  NormalizedRoutineSignals,
  RoutineSafetyStep,
} from "./routine-safety.types";

type SignalAliasDefinition = {
  signal: ActiveSignal;
  aliases: readonly string[];
};

const SIGNAL_ALIAS_DEFINITIONS = [
  {
    signal: "AHA",
    aliases: [
      "aha",
      "glycolic acid",
      "lactic acid",
      "mandelic acid",
      "alpha hydroxy acid",
    ],
  },
  {
    signal: "BHA",
    aliases: ["bha", "salicylic acid", "beta hydroxy acid"],
  },
  {
    signal: "PHA",
    aliases: [
      "pha",
      "gluconolactone",
      "lactobionic acid",
      "polyhydroxy acid",
    ],
  },
  {
    signal: "RETINOID",
    aliases: ["retinol", "retinal", "retinaldehyde", "adapalene", "retinoid"],
  },
  {
    signal: "BENZOYL_PEROXIDE",
    aliases: ["benzoyl peroxide", "bpo"],
  },
  {
    signal: "VITAMIN_C_STRONG",
    aliases: ["ascorbic acid", "l ascorbic acid", "pure vitamin c"],
  },
  {
    signal: "FRAGRANCE",
    aliases: ["fragrance", "parfum", "perfume", "essential oil blend"],
  },
] as const satisfies readonly SignalAliasDefinition[];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsAlias(normalizedText: string, alias: string) {
  const normalizedAlias = normalizeText(alias);

  if (!normalizedAlias) {
    return false;
  }

  return ` ${normalizedText} `.includes(` ${normalizedAlias} `);
}

function hasKeyActiveData(step: RoutineSafetyStep) {
  return Boolean(
    step.keyActivesSnapshot?.some((active) => active.trim().length > 0),
  );
}

function hasIngredientTextData(step: RoutineSafetyStep) {
  return Boolean(step.ingredientTextSnapshot?.trim());
}

function getSignalTexts(step: RoutineSafetyStep) {
  const texts: string[] = [];

  if (hasKeyActiveData(step)) {
    texts.push(...(step.keyActivesSnapshot ?? []));
  }

  if (hasIngredientTextData(step)) {
    texts.push(step.ingredientTextSnapshot ?? "");
  }

  if (texts.length === 0 && step.customProductName?.trim()) {
    texts.push(step.customProductName);
  }

  return texts;
}

function addMatchedAlias(
  matchedAliases: Partial<Record<ActiveSignal, string[]>>,
  signal: ActiveSignal,
  alias: string,
) {
  const currentAliases = matchedAliases[signal] ?? [];

  if (!currentAliases.includes(alias)) {
    matchedAliases[signal] = [...currentAliases, alias];
  }
}

function normalizeStepSignals(step: RoutineSafetyStep, stepIndex: number) {
  const stepSignals = new Set<ActiveSignal>();
  const matchedAliases: Partial<Record<ActiveSignal, string[]>> = {};
  const signalTexts = getSignalTexts(step).map(normalizeText).filter(Boolean);

  for (const signalText of signalTexts) {
    for (const definition of SIGNAL_ALIAS_DEFINITIONS) {
      for (const alias of definition.aliases) {
        if (containsAlias(signalText, alias)) {
          stepSignals.add(definition.signal);
          addMatchedAlias(matchedAliases, definition.signal, alias);
        }
      }
    }
  }

  return {
    stepIndex,
    ...(step.stepId ? { stepId: step.stepId } : {}),
    signals: [...stepSignals],
    matchedAliases,
  };
}

export function normalizeRoutineActiveSignals(
  steps: RoutineSafetyStep[],
): NormalizedRoutineSignals {
  const normalizedSteps = steps.map(normalizeStepSignals);
  const routineSignals = new Set<ActiveSignal>();
  const matchedAliases: Partial<Record<ActiveSignal, string[]>> = {};

  for (const step of normalizedSteps) {
    for (const signal of step.signals) {
      routineSignals.add(signal);
    }

    for (const [signal, aliases] of Object.entries(step.matchedAliases) as Array<
      [ActiveSignal, string[]]
    >) {
      for (const alias of aliases) {
        addMatchedAlias(matchedAliases, signal, alias);
      }
    }
  }

  return {
    steps: normalizedSteps,
    routineSignals: [...routineSignals],
    matchedAliases,
  };
}
