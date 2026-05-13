import { describe, expect, it } from "vitest";

import { appConfig } from "@/config/app";
import { featureFlags } from "@/config/features";
import { routes } from "@/shared/constants/routes";

describe("foundation configuration", () => {
  it("defines SkinWise VN app metadata", () => {
    expect(appConfig.name).toBe("SkinWise VN");
    expect(appConfig.locale).toBe("vi-VN");
    expect(appConfig.isMedicalDiagnosisApp).toBe(false);
  });

  it("keeps incomplete product capabilities disabled", () => {
    expect(featureFlags).toEqual({
      routineAnalysisEnabled: false,
      ingredientExplanationEnabled: false,
      imageUploadEnabled: false,
      marketplaceEnabled: false,
      notificationsEnabled: false,
    });
  });

  it("defines foundation route constants", () => {
    expect(routes.HOME).toBe("/");
    expect(routes.DASHBOARD).toBe("/dashboard");
    expect(routes.ROUTINES).toBe("/routines");
    expect(routes.JOURNAL).toBe("/journal");
    expect(routes.PRODUCTS).toBe("/products");
    expect(routes.INGREDIENTS).toBe("/ingredients");
    expect(routes.SKIN_PROFILE).toBe("/skin-profile");
  });
});
