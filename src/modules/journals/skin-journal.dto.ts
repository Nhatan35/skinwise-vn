import type {
  SkinJournalStressLevel,
  SkinJournalSymptom,
} from "@/modules/journals/skin-journal.types";

export type SkinJournalDto = {
  id: string;
  localDate: string;
  timezone: string;
  productsUsed: string[];
  observations: string[];
  symptoms: SkinJournalSymptom[];
  sleepHours?: number;
  stressLevel?: SkinJournalStressLevel;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
