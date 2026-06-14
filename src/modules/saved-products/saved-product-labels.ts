import type {
  SavedProductDecisionStatus,
  SavedProductPlannedRoutineSlot,
} from "@/modules/saved-products/saved-product.types";

type SavedProductOption<TValue extends string> = {
  label: string;
  value: TValue;
};

export const savedProductDecisionStatusLabels = {
  considering: "Đang cân nhắc",
  testing: "Đang dùng thử",
  paused: "Tạm dừng",
  kept: "Muốn giữ lại",
} satisfies Record<SavedProductDecisionStatus, string>;

export const savedProductPlannedRoutineSlotLabels = {
  morning: "Buổi sáng",
  evening: "Buổi tối",
  either: "Sáng hoặc tối",
  not_sure: "Chưa chắc",
} satisfies Record<SavedProductPlannedRoutineSlot, string>;

export const savedProductDecisionStatusOptions: ReadonlyArray<
  SavedProductOption<SavedProductDecisionStatus>
> = Object.entries(savedProductDecisionStatusLabels).map(([value, label]) => ({
  label,
  value: value as SavedProductDecisionStatus,
}));

export const savedProductPlannedRoutineSlotOptions: ReadonlyArray<
  SavedProductOption<SavedProductPlannedRoutineSlot>
> = Object.entries(savedProductPlannedRoutineSlotLabels).map(
  ([value, label]) => ({
    label,
    value: value as SavedProductPlannedRoutineSlot,
  }),
);
