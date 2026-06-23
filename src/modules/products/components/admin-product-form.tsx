"use client";

import { Save, X } from "lucide-react";
import { useState, type FormEvent } from "react";

import type { ProductDto } from "@/modules/products/product.dto";
import type {
  AdminCreateProductBodyInput,
  AdminUpdateProductBodyInput,
} from "@/modules/products/product.schema";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONCERNS,
  PRODUCT_PRICE_RANGES,
  PRODUCT_SKIN_TYPES,
  PRODUCT_VERIFICATION_STATUSES,
  type ProductCategory,
  type ProductConcern,
  type ProductPriceRange,
  type ProductSkinType,
  type ProductVerificationStatus,
} from "@/modules/products/product.types";
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

export type AdminProductFormMode = "create" | "edit";
export type AdminProductFormPayload =
  | AdminCreateProductBodyInput
  | AdminUpdateProductBodyInput;

type AdminProductFormProps = {
  isSaving: boolean;
  mode: AdminProductFormMode;
  onCancel: () => void;
  onSubmit: (payload: AdminProductFormPayload) => void;
  product?: ProductDto;
  saveError?: string | null;
};

type ProductFormState = {
  brand: string;
  category: ProductCategory | "";
  concerns: ProductConcern[];
  ingredientsText: string;
  keyActivesText: string;
  name: string;
  notRecommendedForText: string;
  priceRange: ProductPriceRange | "";
  skinTypes: ProductSkinType[];
  suitableForText: string;
  tagsText: string;
  verificationStatus: ProductVerificationStatus;
  warningsText: string;
};

type ProductFormField =
  | "brand"
  | "category"
  | "ingredientsText"
  | "name"
  | "priceRange";

type FieldErrors = Partial<Record<ProductFormField, string>>;

const requiredFieldMessages: Record<ProductFormField, string> = {
  brand: "Vui lòng nhập thương hiệu.",
  category: "Vui lòng chọn danh mục.",
  ingredientsText: "Vui lòng nhập thành phần.",
  name: "Vui lòng nhập tên sản phẩm.",
  priceRange: "Vui lòng chọn khoảng giá.",
};

function createBlankFormState(): ProductFormState {
  return {
    brand: "",
    category: "",
    concerns: [],
    ingredientsText: "",
    keyActivesText: "",
    name: "",
    notRecommendedForText: "",
    priceRange: "",
    skinTypes: [],
    suitableForText: "",
    tagsText: "",
    verificationStatus: "unverified",
    warningsText: "",
  };
}

function productToFormState(product: ProductDto): ProductFormState {
  return {
    brand: product.brand,
    category: product.category,
    concerns: [...product.concerns],
    ingredientsText: product.ingredientsText,
    keyActivesText: product.keyActives.join("\n"),
    name: product.name,
    notRecommendedForText: product.notRecommendedFor.join("\n"),
    priceRange: product.priceRange,
    skinTypes: [...product.skinTypes],
    suitableForText: product.suitableFor.join("\n"),
    tagsText: product.tags.join("\n"),
    verificationStatus: product.verificationStatus,
    warningsText: product.warnings.join("\n"),
  };
}

function parseLineItems(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function validateFormState(formState: ProductFormState): FieldErrors {
  const errors: FieldErrors = {};

  if (!formState.name.trim()) {
    errors.name = requiredFieldMessages.name;
  }

  if (!formState.brand.trim()) {
    errors.brand = requiredFieldMessages.brand;
  }

  if (!formState.category) {
    errors.category = requiredFieldMessages.category;
  }

  if (!formState.priceRange) {
    errors.priceRange = requiredFieldMessages.priceRange;
  }

  if (!formState.ingredientsText.trim()) {
    errors.ingredientsText = requiredFieldMessages.ingredientsText;
  }

  return errors;
}

function buildPayload(
  formState: ProductFormState,
): AdminCreateProductBodyInput {
  return {
    brand: formState.brand.trim(),
    category: formState.category as ProductCategory,
    concerns: formState.concerns,
    ingredientsText: formState.ingredientsText.trim(),
    keyActives: parseLineItems(formState.keyActivesText),
    name: formState.name.trim(),
    notRecommendedFor: parseLineItems(formState.notRecommendedForText),
    priceRange: formState.priceRange as ProductPriceRange,
    skinTypes: formState.skinTypes,
    suitableFor: parseLineItems(formState.suitableForText),
    tags: parseLineItems(formState.tagsText),
    verificationStatus: formState.verificationStatus,
    warnings: parseLineItems(formState.warningsText),
  };
}

function toggleValue<TValue extends string>(
  values: TValue[],
  value: TValue,
  checked: boolean,
) {
  return checked
    ? Array.from(new Set([...values, value]))
    : values.filter((item) => item !== value);
}

export function AdminProductForm({
  isSaving,
  mode,
  onCancel,
  onSubmit,
  product,
  saveError,
}: AdminProductFormProps) {
  const [formState, setFormState] = useState<ProductFormState>(() =>
    product ? productToFormState(product) : createBlankFormState(),
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function updateField<Field extends keyof ProductFormState>(
    field: Field,
    value: ProductFormState[Field],
  ) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));

    if (field in requiredFieldMessages) {
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[field as ProductFormField];
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
    mode === "create" ? "Tạo sản phẩm" : "Chỉnh sửa sản phẩm";

  return (
    <Card data-testid="admin-product-form-panel">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          aria-busy={isSaving}
          className="space-y-6"
          data-testid="admin-product-form"
          onSubmit={handleSubmit}
        >
          {saveError ? (
            <Alert role="alert" variant="destructive">
              <AlertTitle>Không thể lưu sản phẩm</AlertTitle>
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              error={fieldErrors.name}
              id="admin-product-name"
              label="Tên sản phẩm"
              onChange={(value) => updateField("name", value)}
              required
              value={formState.name}
            />
            <TextField
              error={fieldErrors.brand}
              id="admin-product-brand"
              label="Thương hiệu"
              onChange={(value) => updateField("brand", value)}
              required
              value={formState.brand}
            />
            <SelectField
              error={fieldErrors.category}
              id="admin-product-category"
              label="Danh mục"
              onValueChange={(value) =>
                updateField("category", value as ProductCategory)
              }
              options={PRODUCT_CATEGORIES}
              placeholder="Chọn danh mục"
              required
              value={formState.category}
            />
            <SelectField
              error={fieldErrors.priceRange}
              id="admin-product-price-range"
              label="Khoảng giá"
              onValueChange={(value) =>
                updateField("priceRange", value as ProductPriceRange)
              }
              options={PRODUCT_PRICE_RANGES}
              placeholder="Chọn khoảng giá"
              required
              value={formState.priceRange}
            />
            <SelectField
              id="admin-product-verification-status"
              label="Trạng thái kiểm duyệt"
              onValueChange={(value) =>
                updateField(
                  "verificationStatus",
                  value as ProductVerificationStatus,
                )
              }
              options={PRODUCT_VERIFICATION_STATUSES}
              value={formState.verificationStatus}
            />
          </div>

          <TextareaField
            error={fieldErrors.ingredientsText}
            id="admin-product-ingredients-text"
            label="Thành phần"
            onChange={(value) => updateField("ingredientsText", value)}
            required
            rows={4}
            value={formState.ingredientsText}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <TextareaField
              id="admin-product-key-actives"
              label="Hoạt chất chính"
              onChange={(value) => updateField("keyActivesText", value)}
              value={formState.keyActivesText}
            />
            <TextareaField
              id="admin-product-tags"
              label="Thẻ"
              onChange={(value) => updateField("tagsText", value)}
              value={formState.tagsText}
            />
            <TextareaField
              id="admin-product-warnings"
              label="Cảnh báo"
              onChange={(value) => updateField("warningsText", value)}
              value={formState.warningsText}
            />
            <TextareaField
              id="admin-product-suitable-for"
              label="Phù hợp với"
              onChange={(value) => updateField("suitableForText", value)}
              value={formState.suitableForText}
            />
            <TextareaField
              id="admin-product-not-recommended-for"
              label="Không khuyến nghị cho"
              onChange={(value) =>
                updateField("notRecommendedForText", value)
              }
              value={formState.notRecommendedForText}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <CheckboxGroup
              label="Loại da phù hợp"
              onToggle={(value, checked) =>
                updateField(
                  "skinTypes",
                  toggleValue(formState.skinTypes, value, checked),
                )
              }
              options={PRODUCT_SKIN_TYPES}
              selectedValues={formState.skinTypes}
              testIdPrefix="admin-product-skin-type"
            />
            <CheckboxGroup
              label="Mối quan tâm da"
              onToggle={(value, checked) =>
                updateField(
                  "concerns",
                  toggleValue(formState.concerns, value, checked),
                )
              }
              options={PRODUCT_CONCERNS}
              selectedValues={formState.concerns}
              testIdPrefix="admin-product-concern"
            />
          </div>

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
              {isSaving ? "Đang lưu..." : "Lưu sản phẩm"}
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
  options: readonly string[];
  placeholder?: string;
  required?: boolean;
  value: string;
};

function SelectField({
  error,
  id,
  label,
  onValueChange,
  options,
  placeholder,
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
          className={cn("min-h-11 w-full rounded-xl bg-card", error ? "border-red-400" : "")}
          data-testid={`${id}-select`}
          id={id}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              data-testid={`${id}-option-${option}`}
              key={option}
              value={option}
            >
              {option}
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

type CheckboxGroupProps<TValue extends string> = {
  label: string;
  onToggle: (value: TValue, checked: boolean) => void;
  options: readonly TValue[];
  selectedValues: TValue[];
  testIdPrefix: string;
};

function CheckboxGroup<TValue extends string>({
  label,
  onToggle,
  options,
  selectedValues,
  testIdPrefix,
}: CheckboxGroupProps<TValue>) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-foreground">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const inputId = `${testIdPrefix}-${option}`;

          return (
            <div
              className="flex items-start gap-3 border border-border bg-secondary/50 px-3 py-3"
              key={option}
            >
              <input
                checked={selectedValues.includes(option)}
                className="mt-1 size-4 accent-emerald-700"
                data-testid={inputId}
                id={inputId}
                onChange={(event) => onToggle(option, event.target.checked)}
                type="checkbox"
              />
              <Label className="leading-5" htmlFor={inputId}>
                {option}
              </Label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
