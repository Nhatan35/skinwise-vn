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
    ? "Could not save this product."
    : "Could not remove this saved product.";
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
      ? "Saving"
      : "Removing"
    : mode === "full"
      ? isSaved
        ? "Remove from saved"
        : "Save product"
      : isSaved
        ? "Saved"
        : "Save";
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
