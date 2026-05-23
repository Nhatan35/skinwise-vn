import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import { toSkinJournalDto } from "@/modules/journals/skin-journal.mapper";
import { findSkinJournalEntriesByUserId } from "@/modules/journals/skin-journal.repository";
import type { SkinJournalListQueryInput } from "@/modules/journals/skin-journal.schema";

export async function listSkinJournalsForUser(
  userId: string,
  input: SkinJournalListQueryInput,
): Promise<SkinJournalDto[]> {
  const skinJournals = await findSkinJournalEntriesByUserId(userId, input);

  return skinJournals.map(toSkinJournalDto);
}
