import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import { toSkinJournalDto } from "@/modules/journals/skin-journal.mapper";
import {
  createSkinJournalEntry,
  SkinJournalConflictError,
} from "@/modules/journals/skin-journal.repository";
import type { CreateSkinJournalInput } from "@/modules/journals/skin-journal.schema";

function normalizeNotes(notes: string | undefined) {
  const trimmedNotes = notes?.trim();

  return trimmedNotes ? trimmedNotes : undefined;
}

export async function createSkinJournalForUser(
  userId: string,
  input: CreateSkinJournalInput,
): Promise<SkinJournalDto> {
  const skinJournal = await createSkinJournalEntry(userId, {
    localDate: input.localDate,
    timezone: input.timezone,
    productsUsed: [...input.productsUsed],
    observations: [...input.observations],
    symptoms: [...input.symptoms],
    ...(input.sleepHours !== undefined ? { sleepHours: input.sleepHours } : {}),
    ...(input.stressLevel ? { stressLevel: input.stressLevel } : {}),
    ...(normalizeNotes(input.notes) ? { notes: normalizeNotes(input.notes) } : {}),
  });

  return toSkinJournalDto(skinJournal);
}

export { SkinJournalConflictError };
