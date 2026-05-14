import type { WithId } from "mongodb";

export const ROUTINE_TIME_OF_DAY = ["morning", "evening"] as const;

export const ROUTINE_STEP_CATEGORIES = [
  "cleanser",
  "moisturizer",
  "sunscreen",
  "treatment",
  "toner",
  "serum",
  "mask",
  "other",
] as const;

export const ROUTINE_STEP_FREQUENCIES = [
  "daily",
  "weekly_1_2",
  "weekly_3_4",
  "as_needed",
] as const;

export type RoutineTimeOfDay = (typeof ROUTINE_TIME_OF_DAY)[number];
export type RoutineStepCategory = (typeof ROUTINE_STEP_CATEGORIES)[number];
export type RoutineStepFrequency = (typeof ROUTINE_STEP_FREQUENCIES)[number];

export type RoutineStep = {
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

export type RoutineDocument = {
  userId: string;
  name: string;
  timeOfDay: RoutineTimeOfDay;
  steps: RoutineStep[];
  createdAt: Date;
  updatedAt: Date;
};

export type Routine = WithId<RoutineDocument>;

export type RoutinePersistenceInput = {
  name: string;
  timeOfDay: RoutineTimeOfDay;
  steps: RoutineStep[];
};

export type RoutinePersistenceUpdateInput = Partial<RoutinePersistenceInput>;
