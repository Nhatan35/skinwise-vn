import type {
  RoutineStepCategory,
  RoutineStepFrequency,
  RoutineTimeOfDay,
} from "@/modules/routines/routine.types";

export type RoutineStepDto = {
  stepId: string;
  productId?: string;
  customProductName?: string;
  category: RoutineStepCategory;
  order: number;
  frequency: RoutineStepFrequency;
  instructions?: string;
  productNameSnapshot?: string;
  brandSnapshot?: string;
  keyActivesSnapshot?: string[];
  ingredientTextSnapshot?: string;
};

export type RoutineDto = {
  id: string;
  name: string;
  timeOfDay: RoutineTimeOfDay;
  steps: RoutineStepDto[];
  createdAt: string;
  updatedAt: string;
};
