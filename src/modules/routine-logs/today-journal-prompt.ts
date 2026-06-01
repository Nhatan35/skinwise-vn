export type TodayJournalPromptState =
  | "hidden"
  | "write_journal"
  | "journal_done"
  | "journal_unknown";

export function getTodayJournalPromptState(input: {
  hasRoutineLogToday: boolean;
  hasJournalToday?: boolean;
  isJournalStatusKnown: boolean;
}): TodayJournalPromptState {
  if (!input.hasRoutineLogToday) {
    return "hidden";
  }

  if (!input.isJournalStatusKnown) {
    return "journal_unknown";
  }

  if (input.hasJournalToday) {
    return "journal_done";
  }

  return "write_journal";
}
