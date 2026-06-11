import { describe, expect, it } from "vitest";

import { featureFlags } from "@/config/features";
import { cn } from "@/shared/utils";

describe("UI foundation", () => {
  it("merges Tailwind classes with cn", () => {
    expect(cn("px-2 text-sm", false && "hidden", "px-4")).toBe(
      "text-sm px-4",
    );
  });

  it("keeps incomplete capabilities disabled", () => {
    expect(Object.values(featureFlags).every((enabled) => enabled === false)).toBe(
      true,
    );
  });

  it(
    "imports shared UI foundation components",
    async () => {
      const [
        appShell,
        emptyState,
        errorState,
        loadingState,
        button,
        card,
      ] = await Promise.all([
        import("@/shared/components/app-shell"),
        import("@/shared/components/empty-state"),
        import("@/shared/components/error-state"),
        import("@/shared/components/loading-state"),
        import("@/shared/components/ui/button"),
        import("@/shared/components/ui/card"),
      ]);

      expect(appShell.AppShell).toBeTypeOf("function");
      expect(emptyState.EmptyState).toBeTypeOf("function");
      expect(errorState.ErrorState).toBeTypeOf("function");
      expect(loadingState.LoadingState).toBeTypeOf("function");
      expect(button.Button).toBeTypeOf("function");
      expect(card.Card).toBeTypeOf("function");
    },
    15_000,
  );
});
