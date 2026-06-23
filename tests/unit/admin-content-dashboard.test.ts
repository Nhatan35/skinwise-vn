import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { routes } from "@/shared/constants/routes";

const projectRoot = process.cwd();
const adminPagePath = join(projectRoot, "src/app/admin/page.tsx");
const adminDashboardPath = join(
  projectRoot,
  "src/modules/admin/components/admin-content-dashboard.tsx",
);
const adminSummaryUseCasePath = join(
  projectRoot,
  "src/modules/admin/admin-content-summary.use-case.ts",
);
const proxyPath = join(projectRoot, "src/proxy.ts");

const adminPageSource = readFileSync(adminPagePath, "utf8");
const adminDashboardSource = readFileSync(adminDashboardPath, "utf8");
const adminSummaryUseCaseSource = readFileSync(adminSummaryUseCasePath, "utf8");
const proxySource = readFileSync(proxyPath, "utf8");
const combinedAdminDashboardSource = `${adminPageSource}\n${adminDashboardSource}\n${adminSummaryUseCaseSource}`;

describe("Admin Content Dashboard Lite", () => {
  it("adds the protected /admin route with the existing server-side admin guard", () => {
    expect(existsSync(adminPagePath)).toBe(true);
    expect(existsSync(adminDashboardPath)).toBe(true);
    expect(routes.ADMIN).toBe("/admin");
    expect(adminPageSource).toContain('export const dynamic = "force-dynamic"');
    expect(adminPageSource).toContain("requireAdminUser");
    expect(adminPageSource).toContain("AuthenticationRequiredError");
    expect(adminPageSource).toContain("AdminPermissionRequiredError");
    expect(adminPageSource).toContain(
      'redirect("/api/auth/signin?callbackUrl=/admin")',
    );
    expect(adminPageSource).toContain("Admin access required");
    expect(adminPageSource).toContain("<AdminContentDashboard summary={summary} />");
    expect(adminPageSource).toContain("data-route={routes.ADMIN}");
    expect(proxySource).toContain('"/admin/:path*"');
  });

  it("renders dashboard headings, summary cards, metrics, links, and boundary note", () => {
    for (const requiredSource of [
      'data-testid="admin-content-dashboard"',
      "Admin Content Dashboard",
      "Manage catalogue maintenance areas from one lightweight admin overview.",
      'data-testid="admin-product-summary-card"',
      "Products",
      "Total products",
      "Pending review",
      "Reviewed",
      "Verified",
      'data-testid="admin-ingredient-summary-card"',
      "Ingredients",
      "Total ingredients",
      "Manage products",
      "Manage ingredients",
      'data-testid="admin-content-boundary-note"',
      "Admin content tools are for catalogue maintenance only",
      "Production-ready is not claimed",
      "deployed smoke v1.48 remains incomplete",
    ]) {
      expect(combinedAdminDashboardSource).toContain(requiredSource);
    }

    expect(adminDashboardSource).toContain("summary.products.manageHref");
    expect(adminDashboardSource).toContain("summary.ingredients.manageHref");
  });

  it("keeps business logic out of the dashboard component", () => {
    for (const forbiddenImport of [
      "requireAdminUser",
      "product.repository",
      "ingredient.repository",
      "product.use-case",
      "ingredient.use-case",
      "@/infrastructure/database",
      "countDocuments",
    ]) {
      expect(adminDashboardSource).not.toContain(forbiddenImport);
    }
  });

  it("uses existing product status fields without adding out-of-scope admin behavior", () => {
    expect(adminSummaryUseCaseSource).toContain("verificationStatus");
    expect(adminSummaryUseCaseSource).toContain("unverified");
    expect(adminSummaryUseCaseSource).toContain("reviewed");
    expect(adminSummaryUseCaseSource).toContain("verified");

    for (const forbiddenScope of [
      "deleteProduct",
      "deleteIngredient",
      'method: "DELETE"',
      "bulk import",
      "bulk export",
      "image upload",
      "marketplace",
      "payment",
      "OpenAI",
      "Gemini",
      "autoLink",
      "parseProductIngredients",
      "schema migration",
    ]) {
      expect(combinedAdminDashboardSource).not.toContain(forbiddenScope);
    }
  });
});
