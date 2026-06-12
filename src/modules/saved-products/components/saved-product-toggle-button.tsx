"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useId, useState } from "react";

import {
  removeSavedProduct,
  saveProduct,
  SavedProductClientError,
} from "@/modules/saved-products/saved-product.client";
import { Button } from "@/shared/components/ui/button";

type SavedProductToggleButtonProps = {
  disabled?: boolean;
  initialSaved: boolean;
  mode?: "compact" | "full";
  onChange?: (isSaved: boolean) => void;
  onPendingChange?: (isPending: boolean) => void;
  onSuccess?: (isSaved: boolean) => void;
  productId: string;
  productName?: string;
};

type PendingAction = "remove" | "save" | null;

function getErrorMessage(error: unknown, nextSaved: boolean) {
  if (error instanceof SavedProductClientError) {
    if (error.code === "UNAUTHORIZED" || error.status === 401) {
      return "Bạn cần đăng nhập để thay đổi trạng thái lưu sản phẩm.";
    }
  }

  return nextSaved
    ? "Chưa thể lưu sản phẩm lúc này. Vui lòng thử lại."
    : "Chưa thể bỏ lưu sản phẩm lúc này. Vui lòng thử lại.";
}

function getProductActionLabel(action: "pending-remove" | "pending-save" | "remove" | "save", productName?: string) {
  const target = productName ? ` ${productName}` : "";

  if (action === "pending-save") {
    return `Đang lưu sản phẩm${target}`;
  }

  if (action === "pending-remove") {
    return `Đang bỏ lưu sản phẩm${target}`;
  }

  return action === "save"
    ? `Lưu sản phẩm${target}`
    : `Bỏ lưu sản phẩm${target}`;
}

export function SavedProductToggleButton({
  disabled = false,
  initialSaved,
  mode = "compact",
  onChange,
  onPendingChange,
  onSuccess,
  productId,
  productName,
}: SavedProductToggleButtonProps) {
  const messageId = useId();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isPending = pendingAction !== null;
  const isSaved = initialSaved;
  const errorId = `${messageId}-saved-product-error`;
  const statusId = `${messageId}-saved-product-status`;

  async function handleToggle() {
    if (disabled || pendingAction !== null) {
      return;
    }

    const nextSaved = !isSaved;
    const nextPendingAction = nextSaved ? "save" : "remove";

    setPendingAction(nextPendingAction);
    onPendingChange?.(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (nextSaved) {
        await saveProduct(productId);
      } else {
        await removeSavedProduct(productId);
      }
      setSuccessMessage(
        nextSaved ? "Đã lưu sản phẩm." : "Đã bỏ lưu sản phẩm.",
      );
      onChange?.(nextSaved);
      onSuccess?.(nextSaved);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, nextSaved));
    } finally {
      setPendingAction(null);
      onPendingChange?.(false);
    }
  }

  const label = isPending
    ? pendingAction === "save"
      ? "Đang lưu..."
      : "Đang bỏ lưu..."
    : mode === "full"
      ? isSaved
        ? "Bỏ lưu sản phẩm"
        : "Lưu sản phẩm"
      : isSaved
        ? "Đã lưu"
        : "Lưu";
  const Icon = isSaved ? BookmarkCheck : Bookmark;
  const accessibleLabel = isPending
    ? getProductActionLabel(
        pendingAction === "save" ? "pending-save" : "pending-remove",
        productName,
      )
    : getProductActionLabel(isSaved ? "remove" : "save", productName);
  const describedBy = errorMessage
    ? errorId
    : successMessage
      ? statusId
      : undefined;

  return (
    <div className="space-y-2">
      <Button
        data-testid={
          isSaved ? "remove-saved-product-button" : "save-product-button"
        }
        aria-describedby={describedBy}
        aria-busy={isPending}
        aria-label={accessibleLabel}
        aria-pressed={isSaved}
        disabled={disabled || isPending}
        onClick={handleToggle}
        type="button"
        variant={isSaved ? "secondary" : "outline"}
      >
        <Icon aria-hidden="true" />
        {label}
      </Button>
      {errorMessage ? (
        <p className="text-xs text-red-700" id={errorId} role="alert">
          {errorMessage}
        </p>
      ) : null}
      {successMessage ? (
        <p className="text-xs text-muted-foreground" id={statusId} role="status">
          {successMessage}
        </p>
      ) : null}
    </div>
  );
}
