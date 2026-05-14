import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { routes } from "@/shared/constants/routes";

const pagePath = resolve(
  process.cwd(),
  "src/app/(dashboard)/onboarding/skin-profile/page.tsx",
);
const formPath = resolve(
  process.cwd(),
  "src/modules/skin-profile/components/skin-profile-onboarding-form.tsx",
);

const pageSource = readFileSync(pagePath, "utf8");
const formSource = readFileSync(formPath, "utf8");

function getPayloadSource() {
  const match = formSource.match(/const profilePayload = \{[\s\S]*?\n    \};/);

  return match?.[0] ?? "";
}

describe("Skin Profile onboarding UI", () => {
  it("adds the protected onboarding page at the expected route path", () => {
    expect(existsSync(pagePath)).toBe(true);
    expect(pageSource).toContain("SkinProfileOnboardingForm");
    expect(pageSource).toContain("routes.ONBOARDING_SKIN_PROFILE");
  });

  it("defines the onboarding route constant", () => {
    expect(routes.ONBOARDING_SKIN_PROFILE).toBe("/onboarding/skin-profile");
  });

  it("uses the Skin Profile API with read, create, and update behavior", () => {
    expect(formSource).toContain('const SKIN_PROFILE_API_PATH = "/api/skin-profile"');
    expect(formSource).toContain('method: "GET"');
    expect(formSource).toContain('"PATCH" : "POST"');
  });

  it("keeps server-only Skin Profile layers out of the client component", () => {
    expect(formSource).not.toContain("skin-profile.repository");
    expect(formSource).not.toContain("skin-profile.use-case");
    expect(formSource).not.toContain("infrastructure/database");
    expect(formSource).not.toContain("server-only");
  });

  it("builds the submitted payload from allowed SkinProfile fields only", () => {
    const payloadSource = getPayloadSource();

    expect(payloadSource).toContain("skinType");
    expect(payloadSource).toContain("concerns");
    expect(payloadSource).toContain("sensitivityLevel");
    expect(payloadSource).toContain("budgetRange");
    expect(payloadSource).toContain("experienceLevel");
    expect(payloadSource).toContain("avoidIngredients");
    expect(payloadSource).not.toMatch(/\buserId\b/);
    expect(payloadSource).not.toMatch(/\b_id\b/);
    expect(payloadSource).not.toMatch(/\bid\b/);
    expect(payloadSource).not.toMatch(/\bcreatedAt\b/);
    expect(payloadSource).not.toMatch(/\bupdatedAt\b/);
  });

  it("does not add forbidden feature scope to the onboarding source", () => {
    const sourceWithoutRequiredContractField = formSource.replaceAll(
      "avoidIngredients",
      "",
    );

    expect(sourceWithoutRequiredContractField).not.toMatch(/AI advice/i);
    expect(sourceWithoutRequiredContractField).not.toMatch(/diagnosis/i);
    expect(sourceWithoutRequiredContractField).not.toMatch(/skin score/i);
    expect(sourceWithoutRequiredContractField).not.toMatch(
      /product recommendation/i,
    );
    expect(sourceWithoutRequiredContractField).not.toMatch(/Routine Builder/i);
    expect(sourceWithoutRequiredContractField).not.toMatch(/\bJournal\b/);
    expect(sourceWithoutRequiredContractField).not.toMatch(/\bProduct\b/);
    expect(sourceWithoutRequiredContractField).not.toMatch(/\bIngredient\b/);
    expect(sourceWithoutRequiredContractField).not.toMatch(/image upload/i);
  });
});
