import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  AUTH_COLLECTION_NAMES,
  COLLECTION_NAMES,
} from "@/infrastructure/database/collections";

describe("database collection names", () => {
  it("defines the required SkinWise application collections", () => {
    expect(Object.values(COLLECTION_NAMES)).toEqual(
      expect.arrayContaining([
        "app_user_profiles",
        "skin_profiles",
        "products",
        "ingredients",
        "saved_products",
        "routines",
        "routine_logs",
        "routine_analyses",
        "rate_limits",
        "skin_journals",
      ]),
    );
  });

  it("defines Auth.js-owned collection name references", () => {
    expect(Object.values(AUTH_COLLECTION_NAMES)).toEqual(
      expect.arrayContaining([
        "users",
        "accounts",
        "sessions",
        "verification_tokens",
      ]),
    );
  });

  it("does not define out-of-scope collections", () => {
    const collectionNames = [
      ...Object.values(COLLECTION_NAMES),
      ...Object.values(AUTH_COLLECTION_NAMES),
    ];

    expect(collectionNames).not.toContain("notifications");
    expect(collectionNames).not.toContain("image_uploads");
    expect(collectionNames).not.toContain("images");
    expect(collectionNames).not.toContain("marketplace");
    expect(collectionNames).not.toContain("skin_scores");
  });

  it("does not duplicate collection names", () => {
    const collectionNames = [
      ...Object.values(COLLECTION_NAMES),
      ...Object.values(AUTH_COLLECTION_NAMES),
    ];

    expect(new Set(collectionNames).size).toBe(collectionNames.length);
  });

  it("uses snake_case collection values consistently", () => {
    const snakeCasePattern = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;
    const collectionNames = [
      ...Object.values(COLLECTION_NAMES),
      ...Object.values(AUTH_COLLECTION_NAMES),
    ];

    expect(
      collectionNames.every((collectionName) =>
        snakeCasePattern.test(collectionName),
      ),
    ).toBe(true);
  });
});
