import type {
  RoutineStepCategory,
  RoutineTimeOfDay,
} from "@/modules/routines/routine.types";

type RoutinePositiveFindingStep = {
  category?: RoutineStepCategory;
};

export type BuildRoutinePositiveFindingsInput = {
  timeOfDay: RoutineTimeOfDay;
  steps: readonly RoutinePositiveFindingStep[];
};

function addFinding(findings: Set<string>, finding: string) {
  findings.add(finding);
}

export function buildRoutinePositiveFindings(
  input: BuildRoutinePositiveFindingsInput,
): string[] {
  if (input.steps.length === 0) {
    return [];
  }

  const findings = new Set<string>();
  const hasCleanser = input.steps.some((step) => step.category === "cleanser");
  const hasMoisturizer = input.steps.some(
    (step) => step.category === "moisturizer",
  );
  const hasSunscreen = input.steps.some(
    (step) => step.category === "sunscreen",
  );
  const hasTrackableStepCount =
    input.steps.length >= 2 && input.steps.length <= 5;

  if (hasCleanser) {
    addFinding(findings, "Có bước làm sạch.");
  }

  if (hasMoisturizer) {
    addFinding(findings, "Có bước dưỡng ẩm.");
  }

  if (input.timeOfDay === "morning" && hasSunscreen) {
    addFinding(findings, "Có chống nắng cho routine buổi sáng.");
  }

  if (hasCleanser && hasMoisturizer) {
    addFinding(
      findings,
      "Routine có nền tảng cơ bản với làm sạch và dưỡng ẩm.",
    );
  }

  if (hasTrackableStepCount) {
    addFinding(findings, "Routine có số bước tương đối dễ theo dõi.");
  }

  if (
    input.timeOfDay === "morning" &&
    hasCleanser &&
    hasMoisturizer &&
    hasSunscreen
  ) {
    addFinding(
      findings,
      "Routine buổi sáng có cấu trúc cơ bản khá đầy đủ.",
    );
  }

  if (input.timeOfDay === "evening" && hasCleanser && hasMoisturizer) {
    addFinding(
      findings,
      "Routine buổi tối có nền tảng cơ bản để theo dõi đều đặn.",
    );
  }

  return [...findings];
}
