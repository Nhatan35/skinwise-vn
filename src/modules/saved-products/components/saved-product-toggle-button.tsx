"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";

import {
  removeSavedProduct,
  saveProduct,
  SavedProductClientError,
} from "@/modules/saved-products/saved-product.client";
import { Button } from "@/shared/components/ui/button";

type SavedProductToggleButtonProps = {
  initialSaved: boolean;
  mode?: "compact" | "full";
  onChange?: (isSaved: boolean) => void;
  onSuccess?: (isSaved: boolean) => void;
  productId: string;
};

function getErrorMessage(error: unknown, nextSaved: boolean) {
  if (error instanceof SavedProductClientError) {
    return error.message;
  }

  return nextSaved
    ? "Chưa thể lưu sản phẩm."
    : "Chưa thể bỏ lưu sản phẩm.";
}

export function SavedProductToggleButton({
  initialSaved,
  mode = "compact",
  onChange,
  onSuccess,
  productId,
}: SavedProductToggleButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleToggle() {
    const nextSaved = !isSaved;

    setIsPending(true);
    setErrorMessage(null);
    setIsSaved(nextSaved);

    try {
      if (nextSaved) {
        await saveProduct(productId);
      } else {
        await removeSavedProduct(productId);
      }
      onChange?.(nextSaved);
      onSuccess?.(nextSaved);
    } catch (error) {
      setIsSaved(!nextSaved);
      setErrorMessage(getErrorMessage(error, nextSaved));
    } finally {
      setIsPending(false);
    }
  }

  const label = isPending
    ? isSaved
      ? "Đang lưu"
      : "Đang bỏ lưu"
    : mode === "full"
      ? isSaved
        ? "Bỏ lưu sản phẩm"
        : "Lưu sản phẩm"
      : isSaved
        ? "Đã lưu"
        : "Lưu";
  const Icon = isSaved ? BookmarkCheck : Bookmark;

  return (
    <div className="space-y-2">
      <Button
        data-testid={
          isSaved ? "remove-saved-product-button" : "save-product-button"
        }
        disabled={isPending}
        onClick={handleToggle}
        type="button"
        variant={isSaved ? "secondary" : "outline"}
      >
        <Icon aria-hidden="true" />
        {label}
      </Button>
      {errorMessage ? (
        <p className="text-xs text-red-700" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
