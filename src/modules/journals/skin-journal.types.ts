import type { WithId } from "mongodb";

export const SKIN_JOURNAL_SYMPTOMS = [
  "dryness",
  "oiliness",
  "redness",
  "stinging",
  "new_breakouts",
  "itchiness",
  "other",
] as const;

export const SKIN_JOURNAL_STRESS_LEVELS = ["low", "medium", "high"] as const;

export type SkinJournalSymptom = (typeof SKIN_JOURNAL_SYMPTOMS)[number];
export type SkinJournalStressLevel =
  (typeof SKIN_JOURNAL_STRESS_LEVELS)[number];

export type SkinJournalDocument = {
  userId: string;
  localDate: string;
  timezone: string;
  productsUsed: string[];
  observations: string[];
  symptoms: SkinJournalSymptom[];
  sleepHours?: number;
  stressLevel?: SkinJournalStressLevel;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SkinJournal = WithId<SkinJournalDocument>;

export type CreateSkinJournalPersistenceInput = {
  localDate: string;
  timezone: string;
  productsUsed: string[];
  observations: string[];
  symptoms: SkinJournalSymptom[];
  sleepHours?: number;
  stressLevel?: SkinJournalStressLevel;
  notes?: string;
};

export type ListSkinJournalPersistenceInput = {
  from?: string;
  to?: string;
  limit: number;
};

export type UpdateSkinJournalPersistenceInput = {
  timezone?: string;
  productsUsed?: string[];
  observations?: string[];
  symptoms?: SkinJournalSymptom[];
  sleepHours?: number;
  stressLevel?: SkinJournalStressLevel;
  notes?: string;
};
