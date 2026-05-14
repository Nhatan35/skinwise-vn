import type { RoutineDto, RoutineStepDto } from "@/modules/routines/routine.dto";
import type { Routine, RoutineStep } from "@/modules/routines/routine.types";

function toRoutineStepDto(step: RoutineStep): RoutineStepDto {
  return {
    stepId: step.stepId,
    ...(step.productId ? { productId: step.productId } : {}),
    ...(step.customProductName
      ? { customProductName: step.customProductName }
      : {}),
    category: step.category,
    order: step.order,
    frequency: step.frequency,
    ...(step.instructions ? { instructions: step.instructions } : {}),
    ...(step.productNameSnapshot
      ? { productNameSnapshot: step.productNameSnapshot }
      : {}),
    ...(step.brandSnapshot ? { brandSnapshot: step.brandSnapshot } : {}),
    ...(step.keyActivesSnapshot
      ? { keyActivesSnapshot: [...step.keyActivesSnapshot] }
      : {}),
    ...(step.ingredientTextSnapshot
      ? { ingredientTextSnapshot: step.ingredientTextSnapshot }
      : {}),
  };
}

export function toRoutineDto(routine: Routine): RoutineDto {
  return {
    id: routine._id.toString(),
    name: routine.name,
    timeOfDay: routine.timeOfDay,
    steps: routine.steps.map(toRoutineStepDto),
    createdAt: routine.createdAt.toISOString(),
    updatedAt: routine.updatedAt.toISOString(),
  };
}
