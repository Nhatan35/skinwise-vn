"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ZodIssue } from "zod";

import type { SkinProfileDto } from "@/modules/skin-profile/skin-profile.dto";
import {
  createSkinProfileSchema,
  updateSkinProfileSchema,
} from "@/modules/skin-profile/skin-profile.schema";
import {
  BUDGET_RANGES,
  EXPERIENCE_LEVELS,
  SENSITIVITY_LEVELS,
  SKIN_CONCERNS,
  SKIN_TYPES,
  type BudgetRange,
  type ExperienceLevel,
  type SensitivityLevel,
  type SkinConcern,
  type SkinType,
} from "@/modules/skin-profile/skin-profile.types";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { routes } from "@/shared/constants/routes";
import { cn } from "@/shared/utils";

const SKIN_PROFILE_API_PATH = "/api/skin-profile";

type ApiError = {
  code: string;
  details?: unknown;
  message: string;
};

type SkinProfileApiResponse =
  | {
      data: {
        profile: SkinProfileDto;
      };
      error: null;
    }
  | {
      data: null;
      error: ApiError;
    };

type FieldKey =
  | "skinType"
  | "concerns"
  | "sensitivityLevel"
  | "budgetRange"
  | "experienceLevel"
  | "avoidIngredients";

type FieldErrors = Partial<Record<FieldKey, string>>;

type ProfileFormState = {
  avoidIngredientsText: string;
  budgetRange: BudgetRange | "";
  concerns: SkinConcern[];
  experienceLevel: ExperienceLevel | "";
  sensitivityLevel: SensitivityLevel | "";
  skinType: SkinType | "";
};

const skinTypeLabels: Record<SkinType, string> = {
  oily: "Da dầu",
  dry: "Da khô",
  combination: "Da hỗn hợp",
  normal: "Da thường",
  sensitive: "Da nhạy cảm",
  unknown: "Chưa chắc chắn",
};

const concernLabels: Record<SkinConcern, string> = {
  acne: "Mụn",
  oiliness: "Dầu thừa",
  dryness: "Khô căng",
  redness: "Đỏ da",
  dark_spots: "Thâm hoặc đốm tối màu",
  texture: "Bề mặt da chưa đều",
  barrier_support: "Hàng rào da cần được hỗ trợ",
  unknown: "Chưa chắc chắn",
};

const sensitivityLabels: Record<SensitivityLevel, string> = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
  unknown: "Chưa chắc chắn",
};

const budgetLabels: Record<BudgetRange, string> = {
  under_300k: "Dưới 300k",
  "300k_700k": "300k - 700k",
  "700k_1500k": "700k - 1.500k",
  above_1500k: "Trên 1.500k",
};

const experienceLabels: Record<ExperienceLevel, string> = {
  beginner: "Mới bắt đầu",
  intermediate: "Đã có routine cơ bản",
  advanced: "Có kinh nghiệm với hoạt chất",
};

const fieldMessages: Record<FieldKey, string> = {
  skinType: "Vui lòng chọn loại da gần đúng nhất.",
  concerns: "Vui lòng chọn ít nhất một mối quan tâm.",
  sensitivityLevel: "Vui lòng chọn mức độ nhạy cảm.",
  budgetRange: "Vui lòng chọn khoảng ngân sách.",
  experienceLevel: "Vui lòng chọn mức kinh nghiệm.",
  avoidIngredients: "Danh sách thành phần muốn tránh tối đa 30 mục.",
};

function createBlankFormState(): ProfileFormState {
  return {
    avoidIngredientsText: "",
    budgetRange: "",
    concerns: [],
    experienceLevel: "",
    sensitivityLevel: "",
    skinType: "",
  };
}

function profileToFormState(profile: SkinProfileDto): ProfileFormState {
  return {
    avoidIngredientsText: profile.avoidIngredients.join("\n"),
    budgetRange: profile.budgetRange,
    concerns: [...profile.concerns],
    experienceLevel: profile.experienceLevel,
    sensitivityLevel: profile.sensitivityLevel,
    skinType: profile.skinType,
  };
}

function parseAvoidIngredients(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function readSkinProfileResponse(
  response: Response,
): Promise<SkinProfileApiResponse> {
  try {
    return (await response.json()) as SkinProfileApiResponse;
  } catch {
    return {
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "Invalid response body.",
      },
    };
  }
}

function getLoadErrorMessage(error?: ApiError | null) {
  if (error?.code === "UNAUTHORIZED") {
    return "Bạn cần đăng nhập để tiếp tục.";
  }

  return "Hiện chưa thể tải hồ sơ da. Vui lòng thử lại sau.";
}

function getSaveErrorMessage(error?: ApiError | null) {
  if (error?.code === "VALIDATION_ERROR") {
    return "Một vài thông tin chưa hợp lệ. Vui lòng kiểm tra lại các trường được đánh dấu.";
  }

  if (error?.code === "UNAUTHORIZED") {
    return "Bạn cần đăng nhập để tiếp tục.";
  }

  return "Hiện chưa thể lưu hồ sơ da. Vui lòng thử lại sau.";
}

function mapValidationIssues(issues: ZodIssue[]): FieldErrors {
  return issues.reduce<FieldErrors>((errors, issue) => {
    const field = issue.path[0];

    if (
      field === "skinType" ||
      field === "concerns" ||
      field === "sensitivityLevel" ||
      field === "budgetRange" ||
      field === "experienceLevel" ||
      field === "avoidIngredients"
    ) {
      return {
        ...errors,
        [field]: fieldMessages[field],
      };
    }

    return errors;
  }, {});
}

export function SkinProfileOnboardingForm() {
  const router = useRouter();
  const redirectTimerRef = useRef<number | null>(null);
  const [formState, setFormState] = useState<ProfileFormState>(
    createBlankFormState,
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      setApiError(null);

      try {
        const response = await fetch(SKIN_PROFILE_API_PATH, {
          headers: {
            Accept: "application/json",
          },
          method: "GET",
        });
        const body = await readSkinProfileResponse(response);

        if (!isMounted) {
          return;
        }

        if (response.status === 404 || body.error?.code === "NOT_FOUND") {
          setFormState(createBlankFormState());
          setHasExistingProfile(false);
          return;
        }

        if (!response.ok || body.error) {
          setApiError(getLoadErrorMessage(body.error));
          return;
        }

        setFormState(profileToFormState(body.data.profile));
        setHasExistingProfile(true);
      } catch {
        if (isMounted) {
          setApiError("Hiện chưa thể tải hồ sơ da. Vui lòng thử lại sau.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;

      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  function clearFieldError(field: FieldKey) {
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function updateSelectField<Field extends keyof Omit<
    ProfileFormState,
    "avoidIngredientsText" | "concerns"
  >>(field: Field, value: ProfileFormState[Field]) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
    clearFieldError(field);
  }

  function updateAvoidIngredients(value: string) {
    setFormState((current) => ({
      ...current,
      avoidIngredientsText: value,
    }));
    clearFieldError("avoidIngredients");
  }

  function toggleConcern(concern: SkinConcern, checked: boolean) {
    setFormState((current) => ({
      ...current,
      concerns: checked
        ? Array.from(new Set([...current.concerns, concern]))
        : current.concerns.filter((item) => item !== concern),
    }));
    clearFieldError("concerns");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving || successMessage !== null) {
      return;
    }

    setApiError(null);
    setFieldErrors({});

    const profilePayload = {
      skinType: formState.skinType,
      concerns: formState.concerns,
      sensitivityLevel: formState.sensitivityLevel,
      budgetRange: formState.budgetRange,
      experienceLevel: formState.experienceLevel,
      avoidIngredients: parseAvoidIngredients(formState.avoidIngredientsText),
    };

    const validation = hasExistingProfile
      ? updateSkinProfileSchema.safeParse(profilePayload)
      : createSkinProfileSchema.safeParse(profilePayload);

    if (!validation.success) {
      setFieldErrors(mapValidationIssues(validation.error.issues));
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(SKIN_PROFILE_API_PATH, {
        body: JSON.stringify(validation.data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: hasExistingProfile ? "PATCH" : "POST",
      });
      const body = await readSkinProfileResponse(response);

      if (!response.ok || body.error) {
        setApiError(getSaveErrorMessage(body.error));
        return;
      }

      setHasExistingProfile(true);
      setSuccessMessage("Đã lưu hồ sơ da của bạn.");
      redirectTimerRef.current = window.setTimeout(() => {
        router.replace(routes.DASHBOARD);
      }, 600);
    } catch {
      setApiError("Hiện chưa thể lưu hồ sơ da. Vui lòng thử lại sau.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardContent>
          <LoadingState label="Đang tải hồ sơ da" />
        </CardContent>
      </Card>
    );
  }

  if (apiError && !hasExistingProfile && formState.skinType === "") {
    return (
      <ErrorState
        action={
          <Button onClick={() => window.location.reload()} type="button">
            Thử lại
          </Button>
        }
        description={apiError}
        title="Chưa tải được hồ sơ da"
      />
    );
  }

  return (
    <Card className="border-border bg-card" data-testid="skin-profile-form">
      <CardHeader>
        <CardTitle>
          {hasExistingProfile ? "Cập nhật hồ sơ da" : "Tạo hồ sơ da"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          data-testid="skin-profile-onboarding-form"
          onSubmit={handleSubmit}
        >
          {!hasExistingProfile ? (
            <Alert data-testid="skin-profile-empty-create-notice">
              <AlertTitle>Chưa có hồ sơ da</AlertTitle>
              <AlertDescription>
                Bạn có thể bắt đầu bằng các thông tin cơ bản và chỉnh sửa lại
                sau.
              </AlertDescription>
            </Alert>
          ) : null}

          {apiError ? (
            <Alert data-testid="skin-profile-save-error" variant="destructive">
              <AlertTitle>Chưa lưu được hồ sơ da</AlertTitle>
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          ) : null}

          {successMessage ? (
            <Alert data-testid="skin-profile-save-success">
              <AlertTitle>Đã lưu</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-5 lg:grid-cols-2">
            <SelectField
              error={fieldErrors.skinType}
              id="skin-type"
              label="Loại da"
              onValueChange={(value) =>
                updateSelectField("skinType", value as SkinType)
              }
              options={SKIN_TYPES.map((value) => ({
                label: skinTypeLabels[value],
                value,
              }))}
              placeholder="Chọn loại da"
              value={formState.skinType}
            />

            <SelectField
              error={fieldErrors.sensitivityLevel}
              id="sensitivity-level"
              label="Mức độ nhạy cảm"
              onValueChange={(value) =>
                updateSelectField("sensitivityLevel", value as SensitivityLevel)
              }
              options={SENSITIVITY_LEVELS.map((value) => ({
                label: sensitivityLabels[value],
                value,
              }))}
              placeholder="Chọn mức độ"
              value={formState.sensitivityLevel}
            />

            <SelectField
              error={fieldErrors.budgetRange}
              id="budget-range"
              label="Ngân sách mỗi sản phẩm"
              onValueChange={(value) =>
                updateSelectField("budgetRange", value as BudgetRange)
              }
              options={BUDGET_RANGES.map((value) => ({
                label: budgetLabels[value],
                value,
              }))}
              placeholder="Chọn khoảng ngân sách"
              value={formState.budgetRange}
            />

            <SelectField
              error={fieldErrors.experienceLevel}
              id="experience-level"
              label="Kinh nghiệm chăm sóc da"
              onValueChange={(value) =>
                updateSelectField("experienceLevel", value as ExperienceLevel)
              }
              options={EXPERIENCE_LEVELS.map((value) => ({
                label: experienceLabels[value],
                value,
              }))}
              placeholder="Chọn mức kinh nghiệm"
              value={formState.experienceLevel}
            />
          </div>

          <fieldset
            aria-describedby={fieldErrors.concerns ? "concerns-error" : undefined}
            className="space-y-3"
          >
            <legend className="text-sm font-medium text-foreground">
              Mối quan tâm chính
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {SKIN_CONCERNS.map((concern) => {
                const inputId = `concern-${concern}`;
                const checked = formState.concerns.includes(concern);

                return (
                  <div
                    className="flex items-start gap-3 border border-border bg-secondary/50 px-3 py-3"
                    key={concern}
                  >
                    <input
                      checked={checked}
                      className="mt-1 size-4 accent-emerald-700"
                      data-testid={`concern-${concern}`}
                      id={inputId}
                      onChange={(event) =>
                        toggleConcern(concern, event.target.checked)
                      }
                      type="checkbox"
                    />
                    <Label className="leading-5" htmlFor={inputId}>
                      {concernLabels[concern]}
                    </Label>
                  </div>
                );
              })}
            </div>
            {fieldErrors.concerns ? (
              <p className="text-sm text-red-700" id="concerns-error">
                {fieldErrors.concerns}
              </p>
            ) : null}
          </fieldset>

          <div className="space-y-2">
            <Label htmlFor="avoid-ingredients">Thành phần muốn tránh</Label>
            <Textarea
              aria-describedby={
                fieldErrors.avoidIngredients ? "avoid-ingredients-error" : undefined
              }
              aria-invalid={fieldErrors.avoidIngredients ? true : undefined}
              id="avoid-ingredients"
              data-testid="avoid-ingredients-input"
              onChange={(event) => updateAvoidIngredients(event.target.value)}
              placeholder="Ví dụ: fragrance, alcohol denat"
              rows={4}
              value={formState.avoidIngredientsText}
            />
            <p className="text-sm text-muted-foreground">
              Nhập mỗi dòng một thành phần, tối đa 30 mục.
            </p>
            {fieldErrors.avoidIngredients ? (
              <p className="text-sm text-red-700" id="avoid-ingredients-error">
                {fieldErrors.avoidIngredients}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-muted-foreground">
              Thông tin này chỉ mang tính giáo dục và không thay thế tư vấn từ
              bác sĩ da liễu.
            </p>
            <Button
              className="w-full sm:w-auto"
              data-testid="skin-profile-save-button"
              disabled={isSaving || successMessage !== null}
              type="submit"
            >
              {isSaving ? "Đang lưu..." : "Lưu hồ sơ da"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

type SelectFieldProps = {
  error?: string;
  id: string;
  label: string;
  onValueChange: (value: string) => void;
  options: Array<{
    label: string;
    value: string;
  }>;
  placeholder: string;
  value: string;
};

function SelectField({
  error,
  id,
  label,
  onValueChange,
  options,
  placeholder,
  value,
}: SelectFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          className={cn("w-full", error ? "border-red-400" : "")}
          data-testid={`${id}-select`}
          id={id}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              data-testid={`${id}-option-${option.value}`}
              key={option.value}
              value={option.value}
            >
              {option.label}
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
