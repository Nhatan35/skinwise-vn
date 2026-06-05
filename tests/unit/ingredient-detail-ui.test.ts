import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const ingredientDetailPagePath = join(
  projectRoot,
  "src/app/(dashboard)/ingredients/[id]/page.tsx",
);
const ingredientDetailPath = join(
  projectRoot,
  "src/modules/ingredients/components/ingredient-detail.tsx",
);
const ingredientExplanationPanelPath = join(
  projectRoot,
  "src/modules/ingredients/components/ingredient-explanation-panel.tsx",
);
const ingredientClientPath = join(
  projectRoot,
  "src/modules/ingredients/ingredient.client.ts",
);

const ingredientDetailPageSource = readFileSync(
  ingredientDetailPagePath,
  "utf8",
);
const ingredientDetailSource = readFileSync(ingredientDetailPath, "utf8");
const ingredientExplanationPanelSource = readFileSync(
  ingredientExplanationPanelPath,
  "utf8",
);
const ingredientClientSource = readFileSync(ingredientClientPath, "utf8");
const combinedDetailSource = `${ingredientDetailSource}\n${ingredientExplanationPanelSource}\n${ingredientClientSource}`;

describe("Ingredient Detail UI", () => {
  it("adds the protected ingredient detail dashboard page and component files", () => {
    expect(existsSync(ingredientDetailPagePath)).toBe(true);
    expect(existsSync(ingredientDetailPath)).toBe(true);
    expect(existsSync(ingredientExplanationPanelPath)).toBe(true);
    expect(ingredientDetailPageSource).toContain(
      "@/modules/ingredients/components/ingredient-detail",
    );
    expect(ingredientDetailPageSource).toContain("params: Promise");
    expect(ingredientDetailPageSource).toContain("const { id } = await params");
    expect(ingredientDetailPageSource).toContain(
      "<IngredientDetail ingredientId={id} />",
    );
  });

  it("keeps detail and explanation components client-safe", () => {
    expect(ingredientDetailSource.startsWith('"use client";')).toBe(true);
    expect(ingredientExplanationPanelSource.startsWith('"use client";')).toBe(
      true,
    );
    expect(ingredientDetailSource).toContain(
      "@/modules/ingredients/ingredient.client",
    );
    expect(ingredientExplanationPanelSource).toContain(
      "@/modules/ingredients/ingredient.client",
    );
    expect(ingredientDetailSource).toContain("getIngredient(ingredientId)");
    expect(ingredientExplanationPanelSource).toContain(
      "explainIngredient({ ingredientName })",
    );
    expect(ingredientDetailSource).toContain(
      "<IngredientExplanationPanel ingredientName={ingredient.inciName} />",
    );
  });

  it("renders loading, error, not-found, retry, back, and explanation states", () => {
    for (const requiredCopy of [
      "Đang tải thông tin thành phần",
      "Không thể tải thông tin thành phần",
      "Không tìm thấy thành phần",
      "Vui lòng quay lại thư viện thành phần hoặc thử lại sau.",
      "Thử lại",
      "Quay lại thư viện",
      'href="/ingredients"',
      "Giải thích thành phần này",
      "data-testid=\"ingredient-explanation-panel\"",
      "Tạm thời có quá nhiều yêu cầu giải thích",
      "Đang dùng phản hồi dự phòng",
    ]) {
      expect(combinedDetailSource).toContain(requiredCopy);
    }
  });

  it("displays only safe public IngredientDto fields in IngredientDetail", () => {
    for (const publicField of [
      "ingredient.id",
      "ingredient.inciName",
      "ingredient.aliases",
      "ingredient.functions",
      "ingredient.commonUses",
      "ingredient.suitableFor",
      "ingredient.cautionFor",
      "ingredient.avoidWith",
      "ingredient.evidenceLevel",
      "ingredient.sourceRefs",
      "ingredient.createdAt",
      "ingredient.updatedAt",
    ]) {
      expect(ingredientDetailSource).toContain(publicField);
    }

    for (const internalField of ["_id", "userId", "ObjectId"]) {
      expect(ingredientDetailSource).not.toContain(internalField);
    }
  });

  it("keeps client-side ingredient detail files free of server-only imports", () => {
    for (const forbiddenImport of [
      "server-only",
      "mongodb",
      "getCurrentUser",
      "@/modules/auth",
      "@/infrastructure/database",
      "@/infrastructure/ai",
      "ingredient.repository",
      "ingredient.use-case",
      "explain-ingredient.use-case",
      "route.ts",
      "process.env",
    ]) {
      expect(combinedDetailSource).not.toContain(forbiddenImport);
    }
  });

  it("does not add out-of-scope ingredient behavior", () => {
    for (const forbiddenScope of [
      'method: "PATCH"',
      'method: "DELETE"',
      "updateIngredient",
      "deleteIngredient",
      "admin",
      "image upload",
      "skin score",
      "diagnose skin conditions for the user",
    ]) {
      expect(combinedDetailSource).not.toContain(forbiddenScope);
    }
  });
});
