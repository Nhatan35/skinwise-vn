"use client";

import { Save, X } from "lucide-react";
import { useState, type FormEvent } from "react";

import type { IngredientDto } from "@/modules/ingredients/ingredient.dto";
import type {
  AdminCreateIngredientBodyInput,
  AdminUpdateIngredientBodyInput,
} from "@/modules/ingredients/ingredient.schema";
import {
  INGREDIENT_EVIDENCE_LEVELS,
  type IngredientEvidenceLevel,
} from "@/modules/ingredients/ingredient.types";
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

export type AdminIngredientFormMode = "create" | "edit";
export type AdminIngredientFormPayload =
  | AdminCreateIngredientBodyInput
  | AdminUpdateIngredientBodyInput;

type AdminIngredientFormProps = {
  ingredient?: IngredientDto;
  isSaving: boolean;
  mode: AdminIngredientFormMode;
  onCancel: () => void;
  onSubmit: (payload: AdminIngredientFormPayload) => void;
  saveError?: string | null;
};

type IngredientFormState = {
  aliasesText: string;
  avoidWithText: string;
  cautionForText: string;
  commonUsesText: string;
  evidenceLevel: IngredientEvidenceLevel;
  functionsText: string;
  inciName: string;
  sourceRefsText: string;
  suitableForText: string;
};

type IngredientFormField = "evidenceLevel" | "inciName";
type FieldErrors = Partial<Record<IngredientFormField, string>>;

const evidenceLevelLabels: Record<IngredientEvidenceLevel, string> = {
  basic: "Cơ bản",
  moderate: "Trung bình",
  strong: "Mạnh",
  uncertain: "Chưa chắc chắn",
};

const requiredFieldMessages: Record<IngredientFormField, string> = {
  evidenceLevel: "Vui lòng chọn mức độ bằng chứng.",
  inciName: "Vui lòng nhập tên INCI.",
};

function createBlankFormState(): IngredientFormState {
  return {
    aliasesText: "",
    avoidWithText: "",
    cautionForText: "",
    commonUsesText: "",
    evidenceLevel: "basic",
    functionsText: "",
    inciName: "",
    sourceRefsText: "",
    suitableForText: "",
  };
}

function ingredientToFormState(ingredient: IngredientDto): IngredientFormState {
  return {
    aliasesText: ingredient.aliases.join("\n"),
    avoidWithText: ingredient.avoidWith.join("\n"),
    cautionForText: ingredient.cautionFor.join("\n"),
    commonUsesText: ingredient.commonUses.join("\n"),
    evidenceLevel: ingredient.evidenceLevel,
    functionsText: ingredient.functions.join("\n"),
    inciName: ingredient.inciName,
    sourceRefsText: ingredient.sourceRefs.join("\n"),
    suitableForText: ingredient.suitableFor.join("\n"),
  };
}

function parseLineItems(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function validateFormState(formState: IngredientFormState): FieldErrors {
  const errors: FieldErrors = {};

  if (!formState.inciName.trim()) {
    errors.inciName = requiredFieldMessages.inciName;
  }

  if (!formState.evidenceLevel) {
    errors.evidenceLevel = requiredFieldMessages.evidenceLevel;
  }

  return errors;
}

function buildPayload(
  formState: IngredientFormState,
): AdminCreateIngredientBodyInput {
  return {
    aliases: parseLineItems(formState.aliasesText),
    avoidWith: parseLineItems(formState.avoidWithText),
    cautionFor: parseLineItems(formState.cautionForText),
    commonUses: parseLineItems(formState.commonUsesText),
    evidenceLevel: formState.evidenceLevel,
    functions: parseLineItems(formState.functionsText),
    inciName: formState.inciName.trim(),
    sourceRefs: parseLineItems(formState.sourceRefsText),
    suitableFor: parseLineItems(formState.suitableForText),
  };
}

export function AdminIngredientForm({
  ingredient,
  isSaving,
  mode,
  onCancel,
  onSubmit,
  saveError,
}: AdminIngredientFormProps) {
  const [formState, setFormState] = useState<IngredientFormState>(() =>
    ingredient ? ingredientToFormState(ingredient) : createBlankFormState(),
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function updateField<Field extends keyof IngredientFormState>(
    field: Field,
    value: IngredientFormState[Field],
  ) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));

    if (field === "inciName" || field === "evidenceLevel") {
      setFieldErrors((current) => {
        const next = { ...current };
        const requiredField = field as IngredientFormField;

        delete next[requiredField];
        return next;
      });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const errors = validateFormState(formState);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    onSubmit(buildPayload(formState));
  }

  const title =
    mode === "create" ? "Tạo thành phần" : "Chỉnh sửa thành phần";

  return (
    <Card data-testid="admin-ingredient-form-panel">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          aria-busy={isSaving}
          className="space-y-6"
          data-testid="admin-ingredient-form"
          onSubmit={handleSubmit}
        >
          {saveError ? (
            <Alert role="alert" variant="destructive">
              <AlertTitle>Không thể lưu thành phần</AlertTitle>
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              error={fieldErrors.inciName}
              id="admin-ingredient-inci-name"
              label="Tên INCI"
              onChange={(value) => updateField("inciName", value)}
              required
              value={formState.inciName}
            />
            <SelectField
              error={fieldErrors.evidenceLevel}
              id="admin-ingredient-evidence-level"
              label="Mức độ bằng chứng"
              onValueChange={(value) =>
                updateField("evidenceLevel", value as IngredientEvidenceLevel)
              }
              options={INGREDIENT_EVIDENCE_LEVELS}
              required
              value={formState.evidenceLevel}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextareaField
              id="admin-ingredient-aliases"
              label="Tên khác / alias"
              onChange={(value) => updateField("aliasesText", value)}
              value={formState.aliasesText}
            />
            <TextareaField
              id="admin-ingredient-functions"
              label="Công dụng"
              onChange={(value) => updateField("functionsText", value)}
              value={formState.functionsText}
            />
            <TextareaField
              id="admin-ingredient-common-uses"
              label="Cách dùng phổ biến"
              onChange={(value) => updateField("commonUsesText", value)}
              value={formState.commonUsesText}
            />
            <TextareaField
              id="admin-ingredient-suitable-for"
              label="Phù hợp với"
              onChange={(value) => updateField("suitableForText", value)}
              value={formState.suitableForText}
            />
            <TextareaField
              id="admin-ingredient-caution-for"
              label="Cần thận trọng với"
              onChange={(value) => updateField("cautionForText", value)}
              value={formState.cautionForText}
            />
            <TextareaField
              id="admin-ingredient-avoid-with"
              label="Tránh kết hợp với"
              onChange={(value) => updateField("avoidWithText", value)}
              value={formState.avoidWithText}
            />
          </div>

          <TextareaField
            id="admin-ingredient-source-refs"
            label="Nguồn tham khảo"
            onChange={(value) => updateField("sourceRefsText", value)}
            rows={4}
            value={formState.sourceRefsText}
          />

          <div className="flex flex-col gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <Button
              disabled={isSaving}
              onClick={onCancel}
              type="button"
              variant="outline"
            >
              <X aria-hidden="true" />
              Hủy
            </Button>
            <Button disabled={isSaving} type="submit">
              <Save aria-hidden="true" />
              {isSaving ? "Đang lưu..." : "Lưu thành phần"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

type TextFieldProps = {
  error?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
};

function TextField({
  error,
  id,
  label,
  onChange,
  required = false,
  value,
}: TextFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? " (bắt buộc)" : ""}
      </Label>
      <Input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        id={id}
        onChange={(event) => onChange(event.target.value)}
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

type TextareaFieldProps = TextFieldProps & {
  rows?: number;
};

function TextareaField({
  error,
  id,
  label,
  onChange,
  required = false,
  rows = 3,
  value,
}: TextareaFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? " (bắt buộc)" : ""}
      </Label>
      <Textarea
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        value={value}
      />
      <p className="text-sm text-muted-foreground">
        Nhập mỗi dòng một mục; hệ thống sẽ bỏ dòng trống.
      </p>
      {error ? (
        <p className="text-sm text-red-700" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

type SelectFieldProps = {
  error?: string;
  id: string;
  label: string;
  onValueChange: (value: string) => void;
  options: readonly IngredientEvidenceLevel[];
  required?: boolean;
  value: string;
};

function SelectField({
  error,
  id,
  label,
  onValueChange,
  options,
  required = false,
  value,
}: SelectFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? " (bắt buộc)" : ""}
      </Label>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          aria-required={required}
          className={cn(
            "min-h-11 w-full rounded-xl bg-card",
            error ? "border-red-400" : "",
          )}
          data-testid={`${id}-select`}
          id={id}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              data-testid={`${id}-option-${option}`}
              key={option}
              value={option}
            >
              {evidenceLevelLabels[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? (
        <p className="text-sm text-red-700" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
