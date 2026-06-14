"use client";

import { useId, useState } from "react";

import {
  SavedProductClientError,
  updateSavedProductMetadata,
} from "@/modules/saved-products/saved-product.client";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import type { UpdateSavedProductMetadataInput } from "@/modules/saved-products/saved-product.schema";
import type {
  SavedProductDecisionStatus,
  SavedProductPlannedRoutineSlot,
} from "@/modules/saved-products/saved-product.types";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

type SavedProductDecisionSupportProps = {
  item: SavedProductDto;
  onUpdated: (item: SavedProductDto) => void;
};

type DecisionStatusValue = SavedProductDecisionStatus | "";
type PlannedRoutineSlotValue = SavedProductPlannedRoutineSlot | "";

const decisionStatusOptions: Array<{
  label: string;
  value: SavedProductDecisionStatus;
}> = [
  { label: "Đang cân nhắc", value: "considering" },
  { label: "Đang dùng thử", value: "testing" },
  { label: "Tạm dừng", value: "paused" },
  { label: "Muốn giữ lại", value: "kept" },
];

const plannedRoutineSlotOptions: Array<{
  label: string;
  value: SavedProductPlannedRoutineSlot;
}> = [
  { label: "Buổi sáng", value: "morning" },
  { label: "Buổi tối", value: "evening" },
  { label: "Sáng hoặc tối", value: "either" },
  { label: "Chưa chắc", value: "not_sure" },
];

function getUpdateErrorMessage(error: unknown) {
  if (error instanceof SavedProductClientError) {
    if (error.code === "UNAUTHORIZED" || error.status === 401) {
      return "Bạn cần đăng nhập để cập nhật thông tin cân nhắc.";
    }

    if (error.code === "NOT_FOUND" || error.status === 404) {
      return "Không tìm thấy sản phẩm đã lưu này. Hãy làm mới danh sách và thử lại.";
    }
  }

  return "Chưa thể lưu thông tin cân nhắc lúc này. Vui lòng thử lại.";
}

export function SavedProductDecisionSupport({
  item,
  onUpdated,
}: SavedProductDecisionSupportProps) {
  const fieldId = useId();
  const [decisionStatus, setDecisionStatus] = useState<DecisionStatusValue>(
    item.decisionStatus ?? "",
  );
  const [plannedRoutineSlot, setPlannedRoutineSlot] =
    useState<PlannedRoutineSlotValue>(item.plannedRoutineSlot ?? "");
  const [personalNote, setPersonalNote] = useState(item.personalNote ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const decisionStatusId = `${fieldId}-decision-status`;
  const plannedRoutineSlotId = `${fieldId}-planned-routine-slot`;
  const personalNoteId = `${fieldId}-personal-note`;
  const helperId = `${fieldId}-helper`;
  const feedbackId = `${fieldId}-feedback`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const input: UpdateSavedProductMetadataInput = {
      personalNote,
      ...(decisionStatus ? { decisionStatus } : {}),
      ...(plannedRoutineSlot ? { plannedRoutineSlot } : {}),
    };

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updatedItem = await updateSavedProductMetadata(
        item.productId,
        input,
      );

      setDecisionStatus(updatedItem.decisionStatus ?? "");
      setPlannedRoutineSlot(updatedItem.plannedRoutineSlot ?? "");
      setPersonalNote(updatedItem.personalNote ?? "");
      setSuccessMessage("Đã lưu thông tin cân nhắc cá nhân.");
      onUpdated(updatedItem);
    } catch (error) {
      setErrorMessage(getUpdateErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  const feedbackMessage = errorMessage ?? successMessage;

  return (
    <form
      className="space-y-4 rounded-lg border border-border bg-card p-4"
      data-testid="saved-product-decision-support"
      onSubmit={handleSubmit}
    >
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">
          Ghi nhớ quyết định của bạn
        </h3>
        <p className="text-sm leading-6 text-muted-foreground" id={helperId}>
          Ghi chú này chỉ giúp bạn nhớ lý do cân nhắc sản phẩm.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={decisionStatusId}>Trạng thái cân nhắc</Label>
          <select
            aria-describedby={helperId}
            aria-label={`Trạng thái cân nhắc cho ${item.product.name}`}
            className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSaving}
            id={decisionStatusId}
            onChange={(event) =>
              setDecisionStatus(event.target.value as DecisionStatusValue)
            }
            value={decisionStatus}
          >
            <option disabled value="">
              Chưa chọn
            </option>
            {decisionStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={plannedRoutineSlotId}>
            Dự định dùng trong routine
          </Label>
          <select
            aria-describedby={helperId}
            aria-label={`Dự định dùng ${item.product.name} trong routine`}
            className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSaving}
            id={plannedRoutineSlotId}
            onChange={(event) =>
              setPlannedRoutineSlot(
                event.target.value as PlannedRoutineSlotValue,
              )
            }
            value={plannedRoutineSlot}
          >
            <option disabled value="">
              Chưa chọn
            </option>
            {plannedRoutineSlotOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={personalNoteId}>Ghi chú cá nhân</Label>
        <Textarea
          aria-describedby={`${helperId} ${feedbackMessage ? feedbackId : ""}`}
          aria-label={`Ghi chú cá nhân cho ${item.product.name}`}
          disabled={isSaving}
          id={personalNoteId}
          maxLength={1000}
          onChange={(event) => setPersonalNote(event.target.value)}
          placeholder="Chưa ghi chú"
          rows={4}
          value={personalNote}
        />
        <p className="text-xs text-muted-foreground">
          {personalNote.length}/1000 ký tự
        </p>
      </div>

      <div className="space-y-1 text-sm leading-6 text-muted-foreground">
        <p>Không nên thêm nhiều sản phẩm mới cùng lúc.</p>
        <p>Theo dõi cảm nhận của da khi thay đổi routine.</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button
          aria-busy={isSaving}
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? "Đang lưu..." : "Lưu thông tin cân nhắc"}
        </Button>
        {feedbackMessage ? (
          <p
            className={
              errorMessage
                ? "text-sm text-red-700"
                : "text-sm text-muted-foreground"
            }
            id={feedbackId}
            role={errorMessage ? "alert" : "status"}
          >
            {feedbackMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}
