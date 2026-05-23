import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import type { SkinJournal } from "@/modules/journals/skin-journal.types";

export function toSkinJournalDto(skinJournal: SkinJournal): SkinJournalDto {
  return {
    id: skinJournal._id.toString(),
    localDate: skinJournal.localDate,
    timezone: skinJournal.timezone,
    productsUsed: [...skinJournal.productsUsed],
    observations: [...skinJournal.observations],
    symptoms: [...skinJournal.symptoms],
    ...(skinJournal.sleepHours !== undefined
      ? { sleepHours: skinJournal.sleepHours }
      : {}),
    ...(skinJournal.stressLevel
      ? { stressLevel: skinJournal.stressLevel }
      : {}),
    ...(skinJournal.notes ? { notes: skinJournal.notes } : {}),
    createdAt: skinJournal.createdAt.toISOString(),
    updatedAt: skinJournal.updatedAt.toISOString(),
  };
}
