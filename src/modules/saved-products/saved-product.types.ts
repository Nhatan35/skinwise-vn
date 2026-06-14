import type { ObjectId, WithId } from "mongodb";

export const SAVED_PRODUCT_DECISION_STATUSES = [
  "considering",
  "testing",
  "paused",
  "kept",
] as const;

export const SAVED_PRODUCT_PLANNED_ROUTINE_SLOTS = [
  "morning",
  "evening",
  "either",
  "not_sure",
] as const;

export type SavedProductDecisionStatus =
  (typeof SAVED_PRODUCT_DECISION_STATUSES)[number];

export type SavedProductPlannedRoutineSlot =
  (typeof SAVED_PRODUCT_PLANNED_ROUTINE_SLOTS)[number];

export type SavedProductMetadataUpdate = {
  decisionStatus?: SavedProductDecisionStatus;
  plannedRoutineSlot?: SavedProductPlannedRoutineSlot;
  personalNote?: string;
};

export type SavedProductDocument = {
  userId: string;
  productId: ObjectId;
  decisionStatus?: SavedProductDecisionStatus;
  plannedRoutineSlot?: SavedProductPlannedRoutineSlot;
  personalNote?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SavedProduct = WithId<SavedProductDocument>;
