import { deleteSkinJournalEntryByIdForUser } from "@/modules/journals/skin-journal.repository";

export async function deleteSkinJournalForUser(
  id: string,
  userId: string,
): Promise<boolean> {
  const deletedSkinJournal = await deleteSkinJournalEntryByIdForUser(id, userId);

  return Boolean(deletedSkinJournal);
}
