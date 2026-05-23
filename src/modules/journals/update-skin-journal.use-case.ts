import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import { toSkinJournalDto } from "@/modules/journals/skin-journal.mapper";
import { updateSkinJournalEntryByIdForUser } from "@/modules/journals/skin-journal.repository";
import type { UpdateSkinJournalInput } from "@/modules/journals/skin-journal.schema";
import type { UpdateSkinJournalPersistenceInput } from "@/modules/journals/skin-journal.types";

function hasOwnField<TObject extends object>(
  value: TObject,
  field: keyof TObject,
) {
  return Object.prototype.hasOwnProperty.call(value, field);
}

function normalizeUpdateInput(
  input: UpdateSkinJournalInput,
): UpdateSkinJournalPersistenceInput {
  const updateInput: UpdateSkinJournalPersistenceInput = {
    ...(input.timezone !== undefined ? { timezone: input.timezone } : {}),
    ...(input.productsUsed !== undefined
      ? { productsUsed: [...input.productsUsed] }
      : {}),
    ...(input.observations !== undefined
      ? { observations: [...input.observations] }
      : {}),
    ...(input.symptoms !== undefined ? { symptoms: [...input.symptoms] } : {}),
    ...(input.sleepHours !== undefined ? { sleepHours: input.sleepHours } : {}),
    ...(input.stressLevel !== undefined ? { stressLevel: input.stressLevel } : {}),
  };

  if (hasOwnField(input, "notes")) {
    const trimmedNotes = input.notes?.trim();

    updateInput.notes = trimmedNotes ? trimmedNotes : undefined;
  }

  return updateInput;
}

export async function updateSkinJournalForUser(
  id: string,
  userId: string,
  input: UpdateSkinJournalInput,
): Promise<SkinJournalDto | null> {
  const skinJournal = await updateSkinJournalEntryByIdForUser(
    id,
    userId,
    normalizeUpdateInput(input),
  );

  return skinJournal ? toSkinJournalDto(skinJournal) : null;
}
