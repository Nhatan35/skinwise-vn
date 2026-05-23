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
  productsUsedText: string;
  observationsText: string;
  symptoms: SkinJournalSymptom[];
  sleepHours: string;
  stressLevel: SkinJournalStressLevel | "";
  notes: string;
};

export type SkinJournalFormField =
  | "localDate"
  | "timezone"
  | "productsUsedText"
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
  localDate: "Choose a date using YYYY-MM-DD.",
  timezone: "Timezone is required.",
  productsUsedText: "Products used can include at most 30 items.",
  observationsText: "Observations can include at most 20 items.",
  symptoms: "Choose only supported symptom values.",
  sleepHours: "Sleep hours must be between 0 and 24.",
  stressLevel: "Stress level must be low, medium, or high.",
  notes: "Notes can include at most 3000 characters.",
  form: "Some journal details are invalid.",
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
    productsUsedText: "",
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

export function buildCreateSkinJournalPayload(formState: SkinJournalFormState) {
  const sleepHours = parseSleepHours(formState.sleepHours);
  const notes = formState.notes.trim();

  return {
    localDate: formState.localDate,
    timezone: formState.timezone,
    productsUsed: parseListInput(formState.productsUsedText),
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
    productsUsed: parseListInput(formState.productsUsedText),
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
    return "productsUsedText";
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
