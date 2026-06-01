import { describe, expect, it } from "vitest";

import { getTodayJournalPromptState } from "@/modules/routine-logs/today-journal-prompt";

describe("getTodayJournalPromptState", () => {
  it("hides the prompt when there is no routine log today", () => {
    expect(
      getTodayJournalPromptState({
        hasRoutineLogToday: false,
        isJournalStatusKnown: false,
      }),
    ).toBe("hidden");
  });

  it("uses journal_unknown when routine log exists but journal status is unknown", () => {
    expect(
      getTodayJournalPromptState({
        hasRoutineLogToday: true,
        isJournalStatusKnown: false,
      }),
    ).toBe("journal_unknown");
  });

  it("uses write_journal when routine log exists and no journal exists today", () => {
    expect(
      getTodayJournalPromptState({
        hasJournalToday: false,
        hasRoutineLogToday: true,
        isJournalStatusKnown: true,
      }),
    ).toBe("write_journal");
  });

  it("uses journal_done when routine log and journal exist today", () => {
    expect(
      getTodayJournalPromptState({
        hasJournalToday: true,
        hasRoutineLogToday: true,
        isJournalStatusKnown: true,
      }),
    ).toBe("journal_done");
  });
});
