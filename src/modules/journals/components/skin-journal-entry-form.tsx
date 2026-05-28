"use client";

import { Save, X } from "lucide-react";
import { useState, type FormEvent } from "react";

import {
  createSkinJournal,
  SkinJournalClientError,
  updateSkinJournal,
} from "@/modules/journals/skin-journal.client";
import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import {
  getProductDisplayName,
  UNKNOWN_PRODUCT_LABEL,
} from "@/modules/journals/skin-journal-product-display";
import {
  createBlankSkinJournalFormState,
  type SkinJournalFieldErrors,
  type SkinJournalFormField,
  type SkinJournalFormState,
  validateCreateSkinJournalForm,
  validateUpdateSkinJournalForm,
} from "@/modules/journals/skin-journal-form.validation";
import type {
  SkinJournalStressLevel,
  SkinJournalSymptom,
} from "@/modules/journals/skin-journal.types";
import {
  SKIN_JOURNAL_STRESS_LEVELS,
  SKIN_JOURNAL_SYMPTOMS,
} from "@/modules/journals/skin-journal.types";
import type { ProductDto } from "@/modules/products/product.dto";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/utils";

type SkinJournalEntryFormProps = {
  entry?: SkinJournalDto;
  isProductLoading: boolean;
  mode: "create" | "edit";
  onCancel: () => void;
  onSaved: (entry: SkinJournalDto) => void;
  productLoadError: string | null;
  products: ProductDto[];
};

const symptomLabels: Record<SkinJournalSymptom, string> = {
  dryness: "Dryness",
  oiliness: "Oiliness",
  redness: "Redness",
  stinging: "Stinging",
  new_breakouts: "New breakouts",
  itchiness: "Itchiness",
  other: "Other",
};

const stressLabels: Record<SkinJournalStressLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

function entryToFormState(entry?: SkinJournalDto): SkinJournalFormState {
  if (!entry) {
    return createBlankSkinJournalFormState();
  }

  return {
    localDate: entry.localDate,
    timezone: entry.timezone,
    productsUsed: [...entry.productsUsed],
    observationsText: entry.observations.join("\n"),
    symptoms: [...entry.symptoms],
    sleepHours:
      entry.sleepHours !== undefined ? String(entry.sleepHours) : "",
    stressLevel: entry.stressLevel ?? "",
    notes: entry.notes ?? "",
  };
}

function getFormErrorMessage(error: unknown) {
  if (error instanceof SkinJournalClientError) {
    return error.message;
  }

  return "Unable to save this journal entry. Please try again.";
}

export function SkinJournalEntryForm({
  entry,
  isProductLoading,
  mode,
  onCancel,
  onSaved,
  productLoadError,
  products,
}: SkinJournalEntryFormProps) {
  const [formState, setFormState] = useState<SkinJournalFormState>(() =>
    entryToFormState(entry),
  );
  const [fieldErrors, setFieldErrors] = useState<SkinJournalFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function clearFieldError(field: SkinJournalFormField) {
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function updateField<Field extends keyof SkinJournalFormState>(
    field: Field,
    value: SkinJournalFormState[Field],
  ) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
    clearFieldError(field);
  }

  function toggleSymptom(symptom: SkinJournalSymptom, checked: boolean) {
    setFormState((current) => ({
      ...current,
      symptoms: checked
        ? Array.from(new Set([...current.symptoms, symptom]))
        : current.symptoms.filter((item) => item !== symptom),
    }));
    clearFieldError("symptoms");
  }

  function toggleProduct(productId: string, checked: boolean) {
    setFormState((current) => ({
      ...current,
      productsUsed: checked
        ? Array.from(new Set([...current.productsUsed, productId]))
        : current.productsUsed.filter((item) => item !== productId),
    }));
    clearFieldError("productsUsed");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    setFieldErrors({});
    setFormError(null);

    setIsSaving(true);

    try {
      if (mode === "create") {
        const validation = validateCreateSkinJournalForm(formState);

        if (!validation.success) {
          setFieldErrors(validation.errors);
          return;
        }

        const savedEntry = await createSkinJournal(validation.data);

        onSaved(savedEntry);
        return;
      }

      const validation = validateUpdateSkinJournalForm(formState);

      if (!validation.success) {
        setFieldErrors(validation.errors);
        return;
      }

      const savedEntry = await updateSkinJournal(entry?.id ?? "", validation.data);

      onSaved(savedEntry);
    } catch (error) {
      setFormError(getFormErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create journal entry" : "Edit journal entry"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" data-testid="skin-journal-form" onSubmit={handleSubmit}>
          {formError ? (
            <Alert variant="destructive">
              <AlertTitle>Journal entry was not saved</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="skin-journal-local-date">Date</Label>
              {mode === "create" ? (
                <Input
                  aria-describedby={
                    fieldErrors.localDate
                      ? "skin-journal-local-date-error"
                      : undefined
                  }
                  aria-invalid={fieldErrors.localDate ? true : undefined}
                  data-testid="skin-journal-local-date-input"
                  id="skin-journal-local-date"
                  onChange={(event) =>
                    updateField("localDate", event.target.value)
                  }
                  type="date"
                  value={formState.localDate}
                />
              ) : (
                <p className="border border-border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground">
                  {formState.localDate}
                </p>
              )}
              {fieldErrors.localDate ? (
                <p
                  className="text-sm text-red-700"
                  id="skin-journal-local-date-error"
                >
                  {fieldErrors.localDate}
                </p>
              ) : null}
            </div>

            <TextField
              error={fieldErrors.timezone}
              id="skin-journal-timezone"
              label="Timezone"
              onChange={(value) => updateField("timezone", value)}
              value={formState.timezone}
            />
          </div>

          <ProductSelectionField
            error={fieldErrors.productsUsed}
            isLoading={isProductLoading}
            loadError={productLoadError}
            onToggle={toggleProduct}
            products={products}
            selectedProductIds={formState.productsUsed}
          />

          <TextareaField
            description="Use one observation per line or separate items with commas."
            error={fieldErrors.observationsText}
            dataTestId="skin-journal-observations-input"
            id="skin-journal-observations"
            label="Observations"
            onChange={(value) => updateField("observationsText", value)}
            rows={4}
            value={formState.observationsText}
          />

          <fieldset
            aria-describedby={
              fieldErrors.symptoms ? "skin-journal-symptoms-error" : undefined
            }
            className="space-y-3"
          >
            <legend className="text-sm font-medium text-foreground">
              Symptoms
            </legend>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SKIN_JOURNAL_SYMPTOMS.map((symptom) => {
                const inputId = `skin-journal-symptom-${symptom}`;
                const checked = formState.symptoms.includes(symptom);

                return (
                  <div
                    className="flex items-start gap-3 border border-border bg-secondary/50 px-3 py-3"
                    key={symptom}
                  >
                    <input
                      checked={checked}
                      className="mt-1 size-4 accent-emerald-700"
                      id={inputId}
                      onChange={(event) =>
                        toggleSymptom(symptom, event.target.checked)
                      }
                      type="checkbox"
                    />
                    <Label className="leading-5" htmlFor={inputId}>
                      {symptomLabels[symptom]}
                    </Label>
                  </div>
                );
              })}
            </div>
            {fieldErrors.symptoms ? (
              <p
                className="text-sm text-red-700"
                id="skin-journal-symptoms-error"
              >
                {fieldErrors.symptoms}
              </p>
            ) : null}
          </fieldset>

          <div className="grid gap-4 lg:grid-cols-2">
            <TextField
              error={fieldErrors.sleepHours}
              id="skin-journal-sleep-hours"
              inputMode="decimal"
              label="Sleep hours"
              max="24"
              min="0"
              onChange={(value) => updateField("sleepHours", value)}
              placeholder="7"
              step="0.25"
              type="number"
              value={formState.sleepHours}
            />

            <div className="space-y-2">
              <Label htmlFor="skin-journal-stress-level">Stress level</Label>
              <Select
                onValueChange={(value) =>
                  updateField(
                    "stressLevel",
                    value === "none"
                      ? ""
                      : (value as SkinJournalStressLevel),
                  )
                }
                value={formState.stressLevel || "none"}
              >
                <SelectTrigger
                  aria-describedby={
                    fieldErrors.stressLevel
                      ? "skin-journal-stress-level-error"
                      : undefined
                  }
                  aria-invalid={fieldErrors.stressLevel ? true : undefined}
                  className={cn(
                    "w-full",
                    fieldErrors.stressLevel ? "border-red-400" : "",
                  )}
                  id="skin-journal-stress-level"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not tracked</SelectItem>
                  {SKIN_JOURNAL_STRESS_LEVELS.map((stressLevel) => (
                    <SelectItem key={stressLevel} value={stressLevel}>
                      {stressLabels[stressLevel]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.stressLevel ? (
                <p
                  className="text-sm text-red-700"
                  id="skin-journal-stress-level-error"
                >
                  {fieldErrors.stressLevel}
                </p>
              ) : null}
            </div>
          </div>

          <TextareaField
            error={fieldErrors.notes}
            dataTestId="skin-journal-notes-input"
            id="skin-journal-notes"
            label="Notes"
            maxLength={3000}
            onChange={(value) => updateField("notes", value)}
            rows={5}
            value={formState.notes}
          />

          <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-muted-foreground">
              Skin Journal is for tracking observations, not diagnosis or
              treatment advice.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                disabled={isSaving}
                onClick={onCancel}
                type="button"
                variant="outline"
              >
                <X aria-hidden="true" />
                Cancel
              </Button>
              <Button data-testid="skin-journal-save-button" disabled={isSaving} type="submit">
                <Save aria-hidden="true" />
                {isSaving ? "Saving..." : "Save entry"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

type ProductSelectionFieldProps = {
  error?: string;
  isLoading: boolean;
  loadError: string | null;
  onToggle: (productId: string, checked: boolean) => void;
  products: ProductDto[];
  selectedProductIds: string[];
};

function ProductSelectionField({
  error,
  isLoading,
  loadError,
  onToggle,
  products,
  selectedProductIds,
}: ProductSelectionFieldProps) {
  const knownProductIds = new Set(products.map((product) => product.id));
  const unresolvedProductIds = Array.from(
    new Set(
      selectedProductIds.filter((productId) => !knownProductIds.has(productId)),
    ),
  );
  const hasUnresolvedSelection = unresolvedProductIds.length > 0;

  return (
    <fieldset
      aria-describedby={error ? "skin-journal-products-used-error" : undefined}
      className="space-y-3"
    >
      <legend className="text-sm font-medium text-foreground">
        Products used
      </legend>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading product catalogue...</p>
      ) : null}

      {loadError ? (
        <p className="text-sm text-amber-700">
          Could not load the product catalogue.
        </p>
      ) : null}

      {!isLoading && !loadError && products.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No catalogue products are available yet.
        </p>
      ) : null}

      {!isLoading &&
      !loadError &&
      (products.length > 0 || unresolvedProductIds.length > 0) ? (
        <div className="grid max-h-64 gap-3 overflow-y-auto border border-border bg-secondary/50 p-3 sm:grid-cols-2">
          {products.map((product) => {
            const inputId = `skin-journal-product-${product.id}`;
            const checked = selectedProductIds.includes(product.id);

            return (
              <div className="flex items-start gap-3" key={product.id}>
                <input
                  checked={checked}
                  className="mt-1 size-4 accent-emerald-700"
                  id={inputId}
                  onChange={(event) =>
                    onToggle(product.id, event.target.checked)
                  }
                  type="checkbox"
                />
                <Label className="leading-5" htmlFor={inputId}>
                  {getProductDisplayName(product)}
                </Label>
              </div>
            );
          })}
          {unresolvedProductIds.map((productId) => {
            const inputId = `skin-journal-product-${productId}`;

            return (
              <div className="flex items-start gap-3" key={productId}>
                <input
                  checked
                  className="mt-1 size-4 accent-emerald-700"
                  id={inputId}
                  onChange={(event) =>
                    onToggle(productId, event.target.checked)
                  }
                  type="checkbox"
                />
                <Label className="leading-5" htmlFor={inputId}>
                  {UNKNOWN_PRODUCT_LABEL}
                </Label>
              </div>
            );
          })}
        </div>
      ) : null}

      {loadError && selectedProductIds.length > 0 ? (
        <p className="text-sm text-muted-foreground">
          Existing product selections will be preserved when you save.
        </p>
      ) : null}

      {!loadError && hasUnresolvedSelection ? (
        <p className="text-sm text-muted-foreground">
          Unknown product selections will be preserved when you save.
        </p>
      ) : null}

      {error ? (
        <p
          className="text-sm text-red-700"
          id="skin-journal-products-used-error"
        >
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

type TextFieldProps = {
  error?: string;
  id: string;
  inputMode?: "decimal";
  label: string;
  max?: string;
  min?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  step?: string;
  type?: "number" | "text";
  value: string;
};

function TextField({
  error,
  id,
  inputMode,
  label,
  max,
  min,
  onChange,
  placeholder,
  step,
  type = "text",
  value,
}: TextFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(error ? "border-red-400" : "")}
        id={id}
        inputMode={inputMode}
        max={max}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        step={step}
        type={type}
        value={value}
      />
      {error ? (
        <p className="text-sm text-red-700" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextareaFieldProps = {
  dataTestId?: string;
  description?: string;
  error?: string;
  id: string;
  label: string;
  maxLength?: number;
  onChange: (value: string) => void;
  rows: number;
  value: string;
};

function TextareaField({
  dataTestId,
  description,
  error,
  id,
  label,
  maxLength,
  onChange,
  rows,
  value,
}: TextareaFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(error ? "border-red-400" : "")}
        data-testid={dataTestId}
        id={id}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        value={value}
      />
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
      {error ? (
        <p className="text-sm text-red-700" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
