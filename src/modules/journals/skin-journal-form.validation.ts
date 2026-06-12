import { z, type ZodIssue } from "zod";

import {
  SKIN_JOURNAL_STRESS_LEVELS,
  SKIN_JOURNAL_SYMPTOMS,
  type SkinJournalStressLevel,
  type SkinJournalSymptom,
} from "@/modules/journals/skin-journal.types";

const localDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function isValidTimezone(value: string) {
  try {
    Intl.DateTimeFormat("en-US", { timeZone: value });

    return true;
  } catch {
    return false;
  }
}

const localDateSchema = z.string().regex(localDatePattern);
const timezoneSchema = z.string().trim().min(1).refine(isValidTimezone);
const productsUsedSchema = z.array(z.string().trim().min(1)).max(30);
const observationsSchema = z.array(z.string().trim().min(1)).max(20);
const symptomsSchema = z.array(z.enum(SKIN_JOURNAL_SYMPTOMS));
const notesSchema = z.string().trim().max(3000);

export const skinJournalCreateClientSchema = z
  .object({
    localDate: localDateSchema,
    timezone: timezoneSchema,
    productsUsed: productsUsedSchema,
    observations: observationsSchema,
    symptoms: symptomsSchema,
    sleepHours: z.number().min(0).max(24).optional(),
    stressLevel: z.enum(SKIN_JOURNAL_STRESS_LEVELS).optional(),
    notes: notesSchema.optional(),
  })
  .strict();

export const skinJournalUpdateClientSchema = z
  .object({
    timezone: timezoneSchema.optional(),
    productsUsed: productsUsedSchema.optional(),
    observations: observationsSchema.optional(),
    symptoms: symptomsSchema.optional(),
    sleepHours: z.number().min(0).max(24).optional(),
    stressLevel: z.enum(SKIN_JOURNAL_STRESS_LEVELS).optional(),
    notes: notesSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0);

export type CreateSkinJournalClientInput = z.infer<
  typeof skinJournalCreateClientSchema
>;
export type UpdateSkinJournalClientInput = z.infer<
  typeof skinJournalUpdateClientSchema
>;

export type SkinJournalFormState = {
  localDate: string;
  timezone: string;
  productsUsed: string[];
  observationsText: string;
  symptoms: SkinJournalSymptom[];
  sleepHours: string;
  stressLevel: SkinJournalStressLevel | "";
  notes: string;
};

export type SkinJournalFormField =
  | "localDate"
  | "timezone"
  | "productsUsed"
  | "observationsText"
  | "symptoms"
  | "sleepHours"
  | "stressLevel"
  | "notes"
  | "form";

export type SkinJournalFieldErrors = Partial<
  Record<SkinJournalFormField, string>
>;

export type SkinJournalValidationResult<TData> =
  | {
      data: TData;
      errors: SkinJournalFieldErrors;
      success: true;
    }
  | {
      data: null;
      errors: SkinJournalFieldErrors;
      success: false;
    };

const fieldMessages: Record<SkinJournalFormField, string> = {
  localDate: "Vui lòng chọn ngày ghi nhận hợp lệ.",
  timezone: "Vui lòng giữ múi giờ hợp lệ.",
  productsUsed: "Danh sách sản phẩm đã dùng tối đa 30 mục.",
  observationsText: "Quan sát tối đa 20 mục.",
  symptoms: "Vui lòng chỉ chọn các dấu hiệu được hỗ trợ.",
  sleepHours: "Số giờ ngủ phải nằm trong khoảng 0 đến 24.",
  stressLevel: "Mức căng thẳng phải là thấp, vừa hoặc cao.",
  notes: "Ghi chú tối đa 3000 ký tự.",
  form: "Một vài thông tin nhật ký chưa hợp lệ.",
};

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

export function getDefaultSkinJournalLocalDate(date = new Date()) {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join("-");
}

export function getDefaultSkinJournalTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

export function parseListInput(text: string) {
  return text
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function createBlankSkinJournalFormState(): SkinJournalFormState {
  return {
    localDate: getDefaultSkinJournalLocalDate(),
    timezone: getDefaultSkinJournalTimezone(),
    productsUsed: [],
    observationsText: "",
    symptoms: [],
    sleepHours: "",
    stressLevel: "",
    notes: "",
  };
}

function parseSleepHours(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return undefined;
  }

  return Number(normalizedValue);
}

function normalizeProductsUsed(productsUsed: string[]) {
  return productsUsed.map((productId) => productId.trim()).filter(Boolean);
}

export function buildCreateSkinJournalPayload(formState: SkinJournalFormState) {
  const sleepHours = parseSleepHours(formState.sleepHours);
  const notes = formState.notes.trim();

  return {
    localDate: formState.localDate,
    timezone: formState.timezone,
    productsUsed: normalizeProductsUsed(formState.productsUsed),
    observations: parseListInput(formState.observationsText),
    symptoms: [...formState.symptoms],
    ...(sleepHours !== undefined ? { sleepHours } : {}),
    ...(formState.stressLevel ? { stressLevel: formState.stressLevel } : {}),
    ...(notes ? { notes } : {}),
  };
}

export function buildUpdateSkinJournalPayload(formState: SkinJournalFormState) {
  const sleepHours = parseSleepHours(formState.sleepHours);

  return {
    timezone: formState.timezone,
    productsUsed: normalizeProductsUsed(formState.productsUsed),
    observations: parseListInput(formState.observationsText),
    symptoms: [...formState.symptoms],
    ...(sleepHours !== undefined ? { sleepHours } : {}),
    ...(formState.stressLevel ? { stressLevel: formState.stressLevel } : {}),
    notes: formState.notes.trim(),
  };
}

function getFieldKey(issue: ZodIssue): SkinJournalFormField {
  const field = issue.path[0];

  if (field === "productsUsed") {
    return "productsUsed";
  }

  if (field === "observations") {
    return "observationsText";
  }

  if (
    field === "localDate" ||
    field === "timezone" ||
    field === "symptoms" ||
    field === "sleepHours" ||
    field === "stressLevel" ||
    field === "notes"
  ) {
    return field;
  }

  return "form";
}

function mapValidationIssues(issues: ZodIssue[]): SkinJournalFieldErrors {
  return issues.reduce<SkinJournalFieldErrors>((errors, issue) => {
    const field = getFieldKey(issue);

    return {
      ...errors,
      [field]: fieldMessages[field],
    };
  }, {});
}

export function validateCreateSkinJournalForm(
  formState: SkinJournalFormState,
): SkinJournalValidationResult<CreateSkinJournalClientInput> {
  const result = skinJournalCreateClientSchema.safeParse(
    buildCreateSkinJournalPayload(formState),
  );

  if (!result.success) {
    return {
      data: null,
      errors: mapValidationIssues(result.error.issues),
      success: false,
    };
  }

  return {
    data: result.data,
    errors: {},
    success: true,
  };
}

export function validateUpdateSkinJournalForm(
  formState: SkinJournalFormState,
): SkinJournalValidationResult<UpdateSkinJournalClientInput> {
  const result = skinJournalUpdateClientSchema.safeParse(
    buildUpdateSkinJournalPayload(formState),
  );

  if (!result.success) {
    return {
      data: null,
      errors: mapValidationIssues(result.error.issues),
      success: false,
    };
  }

  return {
    data: result.data,
    errors: {},
    success: true,
  };
}
