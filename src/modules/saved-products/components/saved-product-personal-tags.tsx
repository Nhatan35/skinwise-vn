"use client";

import { Pencil, Save, Tags, X } from "lucide-react";
import { useId, useState } from "react";

import {
  updateSavedProductMetadata,
  SavedProductClientError,
} from "@/modules/saved-products/saved-product.client";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import { parseSavedProductTagsInput } from "@/modules/saved-products/saved-product-tags";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

type SavedProductPersonalTagsProps = {
  item: SavedProductDto;
  onUpdated: (item: SavedProductDto) => void;
};

function getSaveErrorMessage(error: unknown) {
  if (error instanceof SavedProductClientError && error.status === 400) {
    return "Tags are invalid. Check length, duplicates, and allowed characters.";
  }

  return "Could not save tags. Please try again.";
}

export function SavedProductPersonalTags({
  item,
  onUpdated,
}: SavedProductPersonalTagsProps) {
  const fieldId = useId();
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState(() => tags.join(", "));
  const [error, setError] = useState<string | null>(null);
  const inputId = `${fieldId}-tags`;
  const helpId = `${fieldId}-tags-help`;
  const errorId = `${fieldId}-tags-error`;

  function handleEdit() {
    setTagInput(tags.join(", "));
    setError(null);
    setIsEditing(true);
  }

  function handleCancel() {
    setTagInput(tags.join(", "));
    setError(null);
    setIsEditing(false);
  }

  async function handleSave() {
    const result = parseSavedProductTagsInput(tagInput);

    if (!result.ok) {
      setError(result.error);

      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updatedItem = await updateSavedProductMetadata(item.productId, {
        tags: result.tags,
      });

      onUpdated(updatedItem);
      setTagInput(updatedItem.tags.join(", "));
      setIsEditing(false);
    } catch (saveError) {
      setError(getSaveErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="space-y-3 rounded-lg border border-border bg-secondary/30 p-3"
      data-testid="saved-product-tags-section"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <Tags aria-hidden="true" className="size-4" />
          Tags
        </h3>
        {!isEditing ? (
          <Button
            data-testid="saved-product-edit-tags-button"
            onClick={handleEdit}
            size="sm"
            type="button"
            variant="outline"
          >
            <Pencil aria-hidden="true" />
            Edit tags
          </Button>
        ) : null}
      </div>

      {tags.length > 0 ? (
        <div
          className="flex flex-wrap gap-2"
          data-testid="saved-product-personal-tags-list"
        >
          {tags.map((tag) => (
            <Badge data-testid="saved-product-personal-tag" key={tag}>
              {tag}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No tags yet</p>
      )}

      {isEditing ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor={inputId}>Tags</Label>
            <Input
              aria-describedby={error ? `${helpId} ${errorId}` : helpId}
              aria-invalid={error ? true : undefined}
              data-testid="saved-product-tags-input"
              disabled={isSaving}
              id={inputId}
              onChange={(event) => setTagInput(event.target.value)}
              placeholder="To buy, Morning routine, Patch test"
              value={tagInput}
            />
            <p className="text-xs text-muted-foreground" id={helpId}>
              Examples: To buy, Morning routine, Patch test. Separate tags with
              commas.
            </p>
            {error ? (
              <p
                className="text-sm font-medium text-destructive"
                data-testid="saved-product-tags-error"
                id={errorId}
                role="alert"
              >
                {error}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              aria-busy={isSaving}
              data-testid="saved-product-save-tags-button"
              disabled={isSaving}
              onClick={handleSave}
              size="sm"
              type="button"
            >
              <Save aria-hidden="true" />
              {isSaving ? "Saving tags..." : "Save tags"}
            </Button>
            <Button
              data-testid="saved-product-cancel-tags-button"
              disabled={isSaving}
              onClick={handleCancel}
              size="sm"
              type="button"
              variant="outline"
            >
              <X aria-hidden="true" />
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
