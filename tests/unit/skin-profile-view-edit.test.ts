import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { routes } from "@/shared/constants/routes";

const pagePath = resolve(process.cwd(), "src/app/(dashboard)/skin-profile/page.tsx");
const onboardingPagePath = resolve(
  process.cwd(),
  "src/app/(dashboard)/onboarding/skin-profile/page.tsx",
);
const componentPath = resolve(
  process.cwd(),
  "src/modules/skin-profile/components/skin-profile-view-edit.tsx",
);
const onboardingFormPath = resolve(
  process.cwd(),
  "src/modules/skin-profile/components/skin-profile-onboarding-form.tsx",
);

const pageSource = readFileSync(pagePath, "utf8");
const componentSource = readFileSync(componentPath, "utf8");
const onboardingPageSource = readFileSync(onboardingPagePath, "utf8");
const onboardingFormSource = readFileSync(onboardingFormPath, "utf8");

function getPayloadSource() {
  const match = componentSource.match(/const profilePayload = \{[\s\S]*?\n    \};/);

  return match?.[0] ?? "";
}

describe("Skin Profile view/edit UI", () => {
  it("adds the protected Skin Profile page at the expected route path", () => {
    expect(existsSync(pagePath)).toBe(true);
    expect(pageSource).toContain("SkinProfileViewEdit");
    expect(pageSource).toContain("routes.SKIN_PROFILE");
    expect(routes.SKIN_PROFILE).toBe("/skin-profile");
  });

  it("keeps the first-time onboarding route available", () => {
    expect(existsSync(onboardingPagePath)).toBe(true);
    expect(onboardingPageSource).toContain("SkinProfileOnboardingForm");
    expect(onboardingPageSource).toContain("routes.ONBOARDING_SKIN_PROFILE");
    expect(onboardingFormSource).toContain("SkinProfileOnboardingForm");
    expect(routes.ONBOARDING_SKIN_PROFILE).toBe("/onboarding/skin-profile");
  });

  it("uses the Skin Profile API with read and patch-only edit behavior", () => {
    expect(componentSource).toContain(
      'const SKIN_PROFILE_API_PATH = "/api/skin-profile"',
    );
    expect(componentSource).toContain('method: "GET"');
    expect(componentSource).toContain('method: "PATCH"');
    expect(componentSource).not.toContain('method: "POST"');
    expect(componentSource).not.toContain('"PATCH" : "POST"');
  });

  it("links the empty state to the onboarding route", () => {
    expect(componentSource).toContain("routes.ONBOARDING_SKIN_PROFILE");
    expect(componentSource).toContain("Chưa có hồ sơ da");
  });

  it("stays on the Skin Profile route after a successful edit", () => {
    expect(componentSource).toContain("Đã cập nhật hồ sơ da của bạn.");
    expect(componentSource).not.toContain("useRouter");
    expect(componentSource).not.toContain("router.replace");
    expect(componentSource).not.toContain("routes.DASHBOARD");
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
    expect(payloadSource).not.toMatch(/\bonboardingCompleted\b/);
    expect(payloadSource).not.toMatch(/\b_id\b/);
    expect(payloadSource).not.toMatch(/\bid\b/);
    expect(payloadSource).not.toMatch(/\bcreatedAt\b/);
    expect(payloadSource).not.toMatch(/\bupdatedAt\b/);
  });

  it("keeps server-only Skin Profile layers out of the client component", () => {
    expect(componentSource).not.toContain("skin-profile.repository");
    expect(componentSource).not.toContain("skin-profile.use-case");
    expect(componentSource).not.toContain("infrastructure/database");
    expect(componentSource).not.toContain("server-only");
  });

  it("does not add forbidden feature scope to the view/edit source", () => {
    const sourceWithoutRequiredContractField = componentSource.replaceAll(
      "avoidIngredients",
      "",
    );
    const combinedSource = `${pageSource}\n${sourceWithoutRequiredContractField}`;

    expect(combinedSource).not.toMatch(/\bAI\b/);
    expect(combinedSource).not.toMatch(/Routine Builder/i);
    expect(combinedSource).not.toMatch(/Product recommendation/i);
    expect(combinedSource).not.toMatch(/Ingredient module/i);
    expect(combinedSource).not.toMatch(/\bJournal\b/);
    expect(combinedSource).not.toMatch(/skin score/i);
    expect(combinedSource).not.toMatch(/medical diagnosis/i);
    expect(combinedSource).not.toMatch(/dashboard data integration/i);
    expect(combinedSource).not.toMatch(/image upload/i);
  });
});
