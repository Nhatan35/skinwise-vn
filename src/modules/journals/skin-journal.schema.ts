import { z } from "zod";

import {
  SKIN_JOURNAL_STRESS_LEVELS,
  SKIN_JOURNAL_SYMPTOMS,
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

export const skinJournalLocalDateSchema = z.string().regex(localDatePattern, {
  message: "localDate must use YYYY-MM-DD format.",
});

const skinJournalTimezoneSchema = z
  .string()
  .trim()
  .min(1)
  .refine(isValidTimezone, {
    message: "timezone must be a valid IANA timezone.",
  });

const productsUsedSchema = z.array(z.string().trim().min(1)).max(30);
const observationsSchema = z.array(z.string().trim().min(1)).max(20);
const symptomsSchema = z.array(z.enum(SKIN_JOURNAL_SYMPTOMS));
const notesSchema = z.string().trim().max(3000);

export const createSkinJournalSchema = z
  .object({
    localDate: skinJournalLocalDateSchema,
    timezone: skinJournalTimezoneSchema,
    productsUsed: productsUsedSchema.default([]),
    observations: observationsSchema.default([]),
    symptoms: symptomsSchema.default([]),
    sleepHours: z.number().min(0).max(24).optional(),
    stressLevel: z.enum(SKIN_JOURNAL_STRESS_LEVELS).optional(),
    notes: notesSchema.optional(),
  })
  .strict();

export const skinJournalListQuerySchema = z
  .object({
    from: skinJournalLocalDateSchema.optional(),
    to: skinJournalLocalDateSchema.optional(),
    limit: z.coerce.number().int().positive().max(50).default(20),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.from && value.to && value.from > value.to) {
      context.addIssue({
        code: "custom",
        message: "from must be before or equal to to.",
        path: ["from"],
      });
    }
  });

export const updateSkinJournalSchema = z
  .object({
    timezone: skinJournalTimezoneSchema.optional(),
    productsUsed: productsUsedSchema.optional(),
    observations: observationsSchema.optional(),
    symptoms: symptomsSchema.optional(),
    sleepHours: z.number().min(0).max(24).optional(),
    stressLevel: z.enum(SKIN_JOURNAL_STRESS_LEVELS).optional(),
    notes: notesSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one SkinJournal field is required.",
  });

export type CreateSkinJournalInput = z.infer<typeof createSkinJournalSchema>;
export type SkinJournalListQueryInput = z.infer<
  typeof skinJournalListQuerySchema
>;
export type UpdateSkinJournalInput = z.infer<typeof updateSkinJournalSchema>;
