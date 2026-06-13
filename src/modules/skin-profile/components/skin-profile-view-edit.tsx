"use client";

import Link from "next/link";
import { Check, Pencil, RotateCcw, Save, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type { ZodIssue } from "zod";

import type { SkinProfileDto } from "@/modules/skin-profile/skin-profile.dto";
import { updateSkinProfileSchema } from "@/modules/skin-profile/skin-profile.schema";
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
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
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
const EDIT_PROFILE_REQUIRED_GUIDANCE_ID =
  "edit-skin-profile-required-guidance";
const profileFieldOrder: FieldKey[] = [
  "skinType",
  "concerns",
  "sensitivityLevel",
  "budgetRange",
  "experienceLevel",
  "avoidIngredients",
];

function focusFirstProfileError(errors: FieldErrors) {
  const firstErrorField = profileFieldOrder.find((field) => errors[field]);

  if (!firstErrorField) {
    return;
  }

  const target =
    firstErrorField === "concerns"
      ? document.querySelector<HTMLElement>('[data-testid^="edit-concern-"]')
      : document.getElementById(
          firstErrorField === "skinType"
            ? "edit-skin-type"
            : firstErrorField === "sensitivityLevel"
              ? "edit-sensitivity-level"
              : firstErrorField === "budgetRange"
                ? "edit-budget-range"
                : firstErrorField === "experienceLevel"
                  ? "edit-experience-level"
                  : "edit-avoid-ingredients",
        );

  window.setTimeout(() => target?.focus(), 0);
}

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

  return "Không thể tải hồ sơ da. Vui lòng thử lại hoặc làm mới trang.";
}

function getSaveErrorMessage(error?: ApiError | null) {
  if (error?.code === "VALIDATION_ERROR") {
    return "Một vài thông tin chưa hợp lệ. Vui lòng kiểm tra lại các trường được đánh dấu.";
  }

  if (error?.code === "NOT_FOUND") {
    return "Chưa tìm thấy hồ sơ da để cập nhật. Bạn có thể tạo hồ sơ từ bước onboarding.";
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

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function SkinProfileViewEdit() {
  const [profile, setProfile] = useState<SkinProfileDto | null>(null);
  const [formState, setFormState] = useState<ProfileFormState>(
    createBlankFormState,
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      setLoadError(null);
      setSaveError(null);
      setSuccessMessage(null);

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
          setProfile(null);
          setFormState(createBlankFormState());
          setIsEditing(false);
          return;
        }

        if (!response.ok || body.error) {
          setLoadError(getLoadErrorMessage(body.error));
          return;
        }

        setProfile(body.data.profile);
        setFormState(profileToFormState(body.data.profile));
        setIsEditing(false);
      } catch {
        if (isMounted) {
          setLoadError(
            "Không thể tải hồ sơ da. Vui lòng thử lại hoặc làm mới trang.",
          );
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
    };
  }, [reloadKey]);

  function startEditing() {
    if (!profile) {
      return;
    }

    setFormState(profileToFormState(profile));
    setFieldErrors({});
    setSaveError(null);
    setSuccessMessage(null);
    setIsEditing(true);
  }

  function cancelEditing() {
    if (profile) {
      setFormState(profileToFormState(profile));
    }

    setFieldErrors({});
    setSaveError(null);
    setIsEditing(false);
  }

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

    if (isSaving || !profile) {
      return;
    }

    setSaveError(null);
    setSuccessMessage(null);
    setFieldErrors({});

    const profilePayload = {
      skinType: formState.skinType,
      concerns: formState.concerns,
      sensitivityLevel: formState.sensitivityLevel,
      budgetRange: formState.budgetRange,
      experienceLevel: formState.experienceLevel,
      avoidIngredients: parseAvoidIngredients(formState.avoidIngredientsText),
    };

    const validation = updateSkinProfileSchema.safeParse(profilePayload);

    if (!validation.success) {
      const validationErrors = mapValidationIssues(validation.error.issues);

      setFieldErrors(validationErrors);
      focusFirstProfileError(validationErrors);
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
        method: "PATCH",
      });
      const body = await readSkinProfileResponse(response);

      if (!response.ok || body.error) {
        setSaveError(getSaveErrorMessage(body.error));
        return;
      }

      setProfile(body.data.profile);
      setFormState(profileToFormState(body.data.profile));
      setIsEditing(false);
      setSuccessMessage("Đã cập nhật hồ sơ da của bạn.");
    } catch {
      setSaveError("Hiện chưa thể lưu hồ sơ da. Vui lòng thử lại sau.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardContent>
          <LoadingState label="Đang tải hồ sơ da..." />
        </CardContent>
      </Card>
    );
  }

  if (loadError) {
    return (
      <ErrorState
        action={
          <Button
            onClick={() => setReloadKey((current) => current + 1)}
            type="button"
          >
            <RotateCcw aria-hidden="true" />
            Thử lại
          </Button>
        }
        description={loadError}
        title="Không thể tải hồ sơ da"
      />
    );
  }

  if (!profile) {
    return (
      <div data-testid="skin-profile-empty-state">
        <EmptyState
          action={
            <Button asChild>
              <Link
                data-testid="skin-profile-setup-link"
                href={routes.ONBOARDING_SKIN_PROFILE}
              >
                Tạo hồ sơ da
              </Link>
            </Button>
          }
          description="Hãy hoàn thiện hồ sơ da để SkinWise cá nhân hóa trải nghiệm theo loại da và mối quan tâm của bạn."
          title="Chưa có hồ sơ da"
        />
      </div>
    );
  }

  if (isEditing) {
    return (
      <Card
        className="border-border bg-card"
        data-testid="skin-profile-edit-card"
      >
        <CardHeader>
          <CardTitle>Chỉnh sửa hồ sơ da</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            aria-busy={isSaving}
            aria-describedby={EDIT_PROFILE_REQUIRED_GUIDANCE_ID}
            className="space-y-6"
            data-testid="skin-profile-edit-form"
            onSubmit={handleSubmit}
          >
            {saveError ? (
              <Alert
                data-testid="skin-profile-save-error"
                role="alert"
                variant="destructive"
              >
                <AlertTitle>Chưa lưu được hồ sơ da</AlertTitle>
                <AlertDescription>{saveError}</AlertDescription>
              </Alert>
            ) : null}

            <p
              className="text-sm leading-6 text-muted-foreground"
              id={EDIT_PROFILE_REQUIRED_GUIDANCE_ID}
            >
              Các mục có nhãn “Bắt buộc” cần được hoàn thành trước khi lưu.
              Thành phần muốn tránh là thông tin tùy chọn.
            </p>

            <div className="grid gap-5 lg:grid-cols-2">
              <SelectField
                error={fieldErrors.skinType}
                id="edit-skin-type"
                label="Loại da"
                onValueChange={(value) =>
                  updateSelectField("skinType", value as SkinType)
                }
                options={SKIN_TYPES.map((value) => ({
                  label: skinTypeLabels[value],
                  value,
                }))}
                placeholder="Chọn loại da"
                required
                value={formState.skinType}
              />

              <SelectField
                error={fieldErrors.sensitivityLevel}
                id="edit-sensitivity-level"
                label="Mức độ nhạy cảm"
                onValueChange={(value) =>
                  updateSelectField(
                    "sensitivityLevel",
                    value as SensitivityLevel,
                  )
                }
                options={SENSITIVITY_LEVELS.map((value) => ({
                  label: sensitivityLabels[value],
                  value,
                }))}
                placeholder="Chọn mức độ"
                required
                value={formState.sensitivityLevel}
              />

              <SelectField
                error={fieldErrors.budgetRange}
                id="edit-budget-range"
                label="Ngân sách mỗi sản phẩm"
                onValueChange={(value) =>
                  updateSelectField("budgetRange", value as BudgetRange)
                }
                options={BUDGET_RANGES.map((value) => ({
                  label: budgetLabels[value],
                  value,
                }))}
                placeholder="Chọn khoảng ngân sách"
                required
                value={formState.budgetRange}
              />

              <SelectField
                error={fieldErrors.experienceLevel}
                id="edit-experience-level"
                label="Kinh nghiệm chăm sóc da"
                onValueChange={(value) =>
                  updateSelectField("experienceLevel", value as ExperienceLevel)
                }
                options={EXPERIENCE_LEVELS.map((value) => ({
                  label: experienceLabels[value],
                  value,
                }))}
                placeholder="Chọn mức kinh nghiệm"
                required
                value={formState.experienceLevel}
              />
            </div>

            <fieldset
              aria-describedby={
                fieldErrors.concerns ? "edit-concerns-error" : undefined
              }
              aria-invalid={fieldErrors.concerns ? true : undefined}
              aria-required="true"
              className="space-y-3"
            >
              <legend className="text-sm font-medium text-foreground">
                Mối quan tâm chính (Bắt buộc)
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {SKIN_CONCERNS.map((concern) => {
                  const inputId = `edit-concern-${concern}`;
                  const checked = formState.concerns.includes(concern);

                  return (
                    <div
                      className="flex items-start gap-3 border border-border bg-secondary/50 px-3 py-3"
                      key={concern}
                    >
                      <input
                        checked={checked}
                        className="mt-1 size-4 accent-emerald-700"
                        data-testid={`edit-concern-${concern}`}
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
                <p className="text-sm text-red-700" id="edit-concerns-error">
                  {fieldErrors.concerns}
                </p>
              ) : null}
            </fieldset>

            <div className="space-y-2">
              <Label htmlFor="edit-avoid-ingredients">
                Thành phần muốn tránh
              </Label>
              <Textarea
                aria-describedby={
                  fieldErrors.avoidIngredients
                    ? "edit-avoid-ingredients-error"
                    : undefined
                }
                aria-invalid={fieldErrors.avoidIngredients ? true : undefined}
                id="edit-avoid-ingredients"
                data-testid="edit-avoid-ingredients-input"
                onChange={(event) => updateAvoidIngredients(event.target.value)}
                placeholder="Ví dụ: fragrance, alcohol denat"
                rows={4}
                value={formState.avoidIngredientsText}
              />
              <p className="text-sm text-muted-foreground">
                Nhập mỗi dòng một thành phần, tối đa 30 mục.
              </p>
              {fieldErrors.avoidIngredients ? (
                <p
                  className="text-sm text-red-700"
                  id="edit-avoid-ingredients-error"
                >
                  {fieldErrors.avoidIngredients}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-muted-foreground">
                Thông tin này chỉ mang tính giáo dục và không thay thế tư vấn từ
                bác sĩ da liễu.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  data-testid="skin-profile-cancel-button"
                  disabled={isSaving}
                  onClick={cancelEditing}
                  type="button"
                  variant="outline"
                >
                  <X aria-hidden="true" />
                  Hủy
                </Button>
                <Button
                  data-testid="skin-profile-save-button"
                  disabled={isSaving}
                  type="submit"
                >
                  <Save aria-hidden="true" />
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="border-border bg-card"
      data-testid="skin-profile-current-card"
    >
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Hồ sơ da hiện tại</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Cập nhật lần cuối: {formatUpdatedAt(profile.updatedAt)}
            </p>
          </div>
          <Button
            data-testid="skin-profile-edit-button"
            onClick={startEditing}
            type="button"
          >
            <Pencil aria-hidden="true" />
            Chỉnh sửa
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {successMessage ? (
          <Alert data-testid="skin-profile-save-success" role="status">
            <Check aria-hidden="true" />
            <AlertTitle>Đã lưu</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <ProfileDetail
            label="Loại da"
            testId="skin-profile-detail-skin-type"
            value={skinTypeLabels[profile.skinType]}
          />
          <ProfileDetail
            label="Mức độ nhạy cảm"
            testId="skin-profile-detail-sensitivity"
            value={sensitivityLabels[profile.sensitivityLevel]}
          />
          <ProfileDetail
            label="Ngân sách mỗi sản phẩm"
            testId="skin-profile-detail-budget"
            value={budgetLabels[profile.budgetRange]}
          />
          <ProfileDetail
            label="Kinh nghiệm chăm sóc da"
            testId="skin-profile-detail-experience"
            value={experienceLabels[profile.experienceLevel]}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">
            Mối quan tâm chính
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.concerns.map((concern) => (
              <Badge key={concern} variant="secondary">
                {concernLabels[concern]}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">
            Thành phần muốn tránh
          </h3>
          {profile.avoidIngredients.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.avoidIngredients.map((ingredient) => (
                <Badge key={ingredient} variant="outline">
                  {ingredient}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Chưa ghi nhận thành phần cần tránh.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type ProfileDetailProps = {
  label: string;
  testId?: string;
  value: string;
};

function ProfileDetail({ label, testId, value }: ProfileDetailProps) {
  return (
    <div
      className="border border-border bg-secondary/50 p-4"
      data-testid={testId}
    >
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-2 text-base font-semibold text-foreground">{value}</dd>
    </div>
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
        {required ? " (Bắt buộc)" : ""}
      </Label>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          aria-required={required}
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
