import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { dashboardNavItems } from "@/modules/dashboard/dashboard-shell.config";
import { routes } from "@/shared/constants/routes";

const projectRoot = process.cwd();
const routinesPagePath = join(
  projectRoot,
  "src/app/(dashboard)/routines/page.tsx",
);
const routineBuilderPath = join(
  projectRoot,
  "src/modules/routines/components/routine-builder.tsx",
);
const routineProductOptionsPath = join(
  projectRoot,
  "src/modules/routines/routine-product-options.ts",
);
const proxyPath = join(projectRoot, "src/proxy.ts");

const routinesPageSource = readFileSync(routinesPagePath, "utf8");
const routineBuilderSource = readFileSync(routineBuilderPath, "utf8");
const routineProductOptionsSource = readFileSync(
  routineProductOptionsPath,
  "utf8",
);
const proxySource = readFileSync(proxyPath, "utf8");

function getPayloadSource() {
  const normalizedRoutineBuilderSource = routineBuilderSource.replace(
    /\r\n?/g,
    "\n",
  );

  const match = normalizedRoutineBuilderSource.match(
    /function buildRoutinePayload\([\s\S]*?\n}\n\nasync function readApiResponse/,
  );

  return match?.[0] ?? "";
}

describe("Routine Builder UI foundation", () => {
  it("adds the protected /routines page and renders the module client component", () => {
    expect(existsSync(routinesPagePath)).toBe(true);
    expect(routes.ROUTINES).toBe("/routines");
    expect(routinesPageSource).toContain(
      "@/modules/routines/components/routine-builder",
    );
    expect(routinesPageSource).toContain("<RoutineBuilder />");
    expect(routinesPageSource).toContain("routes.ROUTINES");
  });

  it("keeps the Routine Builder as a client component without server-only imports", () => {
    expect(routineBuilderSource.startsWith('"use client";')).toBe(true);

    for (const forbiddenImport of [
      "routine.repository",
      "routine.use-case",
      "@/infrastructure/database",
      "mongodb",
      "server-only",
      "getCurrentUser",
      "@/modules/auth",
    ]) {
      expect(routineBuilderSource).not.toContain(forbiddenImport);
    }
  });

  it("adds a pure saved/catalogue product option helper", () => {
    expect(existsSync(routineProductOptionsPath)).toBe(true);

    for (const requiredSource of [
      "RoutineProductOption",
      "source: RoutineProductOptionSource",
      '"saved" | "catalogue"',
      "buildRoutineProductOptions",
      "findRoutineProductOption",
      "applyRoutineProductSelection",
      "savedProductOptions",
      "catalogueProductOptions",
      "combinedProductOptions",
      "savedProduct.product",
      "savedProduct.decisionStatus",
      "savedProduct.plannedRoutineSlot",
      "savedProduct.personalNote",
    ]) {
      expect(routineProductOptionsSource).toContain(requiredSource);
    }

    for (const forbiddenImport of [
      "server-only",
      "mongodb",
      "repository",
      "use-case",
      "@/infrastructure/database",
      "@/modules/auth",
      "fetch(",
      "process.env",
    ]) {
      expect(routineProductOptionsSource).not.toContain(forbiddenImport);
    }
  });

  it("calls the existing Routine API with GET, POST, PATCH, and DELETE", () => {
    expect(routineBuilderSource).toContain(
      'const ROUTINES_API_PATH = "/api/routines"',
    );
    expect(routineBuilderSource).toContain("fetch(ROUTINES_API_PATH");
    expect(routineBuilderSource).toContain('method: "GET"');
    expect(routineBuilderSource).toContain('"POST"');
    expect(routineBuilderSource).toContain('"PATCH"');
    expect(routineBuilderSource).toContain("fetch(endpoint");
    expect(routineBuilderSource).toContain(
      "fetch(`${ROUTINES_API_PATH}/${routine.id}`",
    );
    expect(routineBuilderSource).toContain('method: "DELETE"');
  });

  it("includes loading, empty, list, create, edit, error, saving, deleting, and success states", () => {
    for (const stateCopy of [
      "Đang chuẩn bị routine builder",
      "Chưa có routine nào",
      "Không thể tải routine của bạn",
      "Danh sách routines",
      "Tạo routine",
      "Chỉnh sửa routine",
      "Xem sản phẩm đã lưu",
      "Thử lại",
      "Một vài thông tin chưa hợp lệ",
      "Hiện chưa thể xử lý routine",
      "Đang lưu...",
      "Đang xóa...",
      "Đã tạo routine.",
      "Đã lưu routine.",
      "Đã xóa routine.",
    ]) {
      expect(routineBuilderSource).toContain(stateCopy);
    }
  });

  it("guards routine form submission and keeps retry feedback truthful", () => {
    expect(routineBuilderSource).toContain("submitLockRef");
    expect(routineBuilderSource).toContain("aria-busy={isSaving}");
    expect(routineBuilderSource).toContain(
      "disabled={isSaving || formState.steps.length >= ROUTINE_STEP_LIMIT}",
    );
    expect(routineBuilderSource).toContain(
      "disabled={isSaving || formState.steps.length <= 1}",
    );
    expect(routineBuilderSource).toContain("getRoutineSaveErrorMessage");
    expect(routineBuilderSource).toContain(
      "Nội dung bạn đã nhập vẫn được giữ lại",
    );
    expect(routineBuilderSource).toContain("Chưa thể lưu routine");
    expect(routineBuilderSource).toContain(
      '<Link href={routes.TODAY_LOG}>Ghi nhận routine</Link>',
    );
    expect(routineBuilderSource).toContain(
      '<Link href={routes.JOURNAL}>Xem nhật ký</Link>',
    );
  });

  it("focuses routine validation feedback without changing submit guards", () => {
    expect(routineBuilderSource).toContain("getRoutineErrorFieldId");
    expect(routineBuilderSource).toContain("focusFirstRoutineError");
    expect(routineBuilderSource).toContain("document.getElementById(elementId)?.focus()");
    expect(routineBuilderSource).toContain("focusFirstRoutineError(validationErrors)");
    expect(routineBuilderSource).toContain('const ROUTINE_SAVE_ERROR_ID = "routine-save-error"');
    expect(routineBuilderSource).toContain("id={ROUTINE_SAVE_ERROR_ID}");
    expect(routineBuilderSource).toContain("tabIndex={-1}");
    expect(routineBuilderSource).toContain('<Alert role="status">');
    expect(routineBuilderSource).not.toContain("tabIndex={1");
  });

  it("builds a safe payload with productId or custom product fields only", () => {
    const payloadSource = getPayloadSource();

    for (const allowedField of [
      "name",
      "timeOfDay",
      "steps",
      "productId",
      "customProductName",
      "category",
      "order",
      "frequency",
      "instructions",
    ]) {
      expect(payloadSource).toContain(allowedField);
    }

    for (const forbiddenField of [
      /\bstepId\b/,
      /\bid:\s/,
      /\b_id\b/,
      /\buserId\b/,
      /\bcreatedAt\b/,
      /\bupdatedAt\b/,
      /\bproductNameSnapshot\b/,
      /\bbrandSnapshot\b/,
      /\bkeyActivesSnapshot\b/,
      /\bingredientTextSnapshot\b/,
      /\bdecisionStatus\b/,
      /\bplannedRoutineSlot\b/,
      /\bpersonalNote\b/,
    ]) {
      expect(payloadSource).not.toMatch(forbiddenField);
    }
  });

  it("integrates the Product Picker while preserving manual product fallback", () => {
    expect(routineBuilderSource).toContain("Product Picker");
    expect(routineBuilderSource).toContain('const PRODUCTS_API_PATH = "/api/products?limit=50"');
    expect(routineBuilderSource).toContain("fetch(PRODUCTS_API_PATH");
    expect(routineBuilderSource).toContain("body.data.items");
    expect(routineBuilderSource).toContain("Tên sản phẩm thủ công");
    expect(routineBuilderSource).toContain("Tự nhập tên sản phẩm");
    expect(routineBuilderSource).toContain("customProductName");
    expect(routineBuilderSource).toContain("productLoadError");
  });

  it("prioritizes saved products in the Routine Builder product selector", () => {
    for (const requiredSource of [
      "@/modules/saved-products/saved-product.client",
      "listSavedProducts",
      "buildRoutineProductOptions",
      "productOptions.savedProductOptions",
      "productOptions.catalogueProductOptions",
      "productOptions.combinedProductOptions",
      "SelectGroup",
      "SelectLabel",
      "SelectSeparator",
      "Sản phẩm đã lưu",
      "Tất cả sản phẩm",
      "Nhập thủ công",
      "[Đã lưu]",
      "Nguồn: {getProductOptionSourceLabel(option)}",
      "Sản phẩm đã chọn",
      "Hoạt chất chính",
      "Nhu cầu liên quan",
      "Chưa tải được sản phẩm đã lưu",
      "Bạn chưa lưu sản phẩm nào",
      "Xem gợi ý sản phẩm",
      "routes.PRODUCT_MATCH",
    ]) {
      expect(routineBuilderSource).toContain(requiredSource);
    }

    expect(routineBuilderSource).toContain(
      "<Link href={routes.PRODUCT_MATCH}>Xem gợi ý sản phẩm</Link>",
    );
  });

  it("shows saved decision context only for selected saved products", () => {
    for (const requiredSource of [
      "@/modules/saved-products/saved-product-labels",
      "savedProductDecisionStatusLabels",
      "savedProductPlannedRoutineSlotLabels",
      'option.source === "saved"',
      'data-testid="routine-saved-product-decision-context"',
      "Thông tin cân nhắc đã lưu",
      "Thông tin này giúp bạn nhớ lý do đã lưu sản phẩm trước khi thêm",
      "Trạng thái cân nhắc",
      "Chưa chọn trạng thái cân nhắc",
      "Dự định dùng trong routine",
      "Chưa chọn thời điểm dự định dùng",
      "Ghi chú cá nhân",
      "option.personalNote?.trim()",
      "Chưa có ghi chú cá nhân",
    ]) {
      expect(routineBuilderSource).toContain(requiredSource);
    }

    expect(routineBuilderSource).toContain(
      "savedProductDecisionStatusLabels[option.decisionStatus]",
    );
    expect(routineBuilderSource).toContain(
      "savedProductPlannedRoutineSlotLabels[",
    );
  });

  it("keeps saved decision metadata display-only", () => {
    const payloadSource = getPayloadSource();
    const selectionSource =
      routineProductOptionsSource.match(
        /export function applyRoutineProductSelection[\s\S]*$/,
      )?.[0] ?? "";

    for (const metadataField of [
      "decisionStatus",
      "plannedRoutineSlot",
      "personalNote",
    ]) {
      expect(payloadSource).not.toContain(metadataField);
      expect(selectionSource).not.toContain(`input.selectedOption.${metadataField}`);
    }
  });

  it("guides saved products into routine decisions with safe reference copy", () => {
    for (const requiredSource of [
      "CardDescription",
      "Xem sản phẩm đã lưu",
      "routes.SAVED_PRODUCTS",
      'data-testid="routine-saved-products-guidance"',
      "Thông tin tham khảo trước khi thêm vào routine",
      "Không nên thêm quá nhiều sản phẩm mới cùng lúc",
      "cần đưa tất cả vào routine",
      "đã đọc kỹ chi tiết",
      "Lưu ý sản phẩm",
      "option.warnings.slice(0, 2).join",
      'actionClassName="flex justify-center"',
    ]) {
      expect(routineBuilderSource).toContain(requiredSource);
    }
  });

  it("uses combined saved/catalogue options when selecting a routine product", () => {
    expect(routineBuilderSource).toContain("findRoutineProductOption");
    expect(routineBuilderSource).toContain("applyRoutineProductSelection");
    expect(routineBuilderSource).toContain(
      "productOptions.combinedProductOptions",
    );
    expect(routineBuilderSource).not.toContain(
      "const selectedProduct = products.find",
    );
  });

  it("links Routine Builder to the existing Today Checklist route", () => {
    expect(routes.TODAY_LOG).toBe("/routine-logs/today");
    expect(routes.JOURNAL).toBe("/journal");
    expect(routineBuilderSource).toContain("routes.TODAY_LOG");
    expect(routineBuilderSource).toContain("routes.JOURNAL");
    expect(routineBuilderSource).toContain("routine-today-log-link");
    expect(routineBuilderSource).toContain("Ghi nhận routine hôm nay");
    expect(routineBuilderSource).toContain("Xem nhật ký");
    expect(routineBuilderSource).not.toContain('href="/today"');
  });

  it("guides Routine users toward log and journal decision support", () => {
    for (const requiredCopy of [
      'data-testid="routine-log-journal-guidance"',
      "Bước tiếp theo sau routine",
      "Ghi nhận routine để theo dõi độ đều đặn",
      "nhật ký chăm sóc",
      "Không cần kết luận quá sớm sau một vài lần dùng",
      "tìm tư vấn chuyên môn",
    ]) {
      expect(routineBuilderSource).toContain(requiredCopy);
    }
  });

  it("keeps Product imports client-safe", () => {
    expect(routineBuilderSource).toContain(
      'import type { ProductDto } from "@/modules/products/product.dto";',
    );

    for (const forbiddenImport of [
      "product.repository",
      "product.use-case",
      "@/infrastructure/database",
      "mongodb",
      "server-only",
      "getCurrentUser",
    ]) {
      expect(routineBuilderSource).not.toContain(forbiddenImport);
    }
  });

  it("keeps the dashboard Routines navigation item enabled", () => {
    const routinesItem = dashboardNavItems.find(
      (item) => item.label === "Routines",
    );
    const journalItem = dashboardNavItems.find(
      (item) => item.label === "Journal",
    );
    const productsItem = dashboardNavItems.find(
      (item) => item.label === "Products",
    );
    const ingredientsItem = dashboardNavItems.find(
      (item) => item.label === "Ingredients",
    );

    expect(routinesItem).toEqual({
      disabled: false,
      href: routes.ROUTINES,
      label: "Routines",
      status: "Active",
    });
    expect(journalItem).toEqual({
      disabled: false,
      href: routes.JOURNAL,
      label: "Journal",
      status: "Active",
    });
    expect(productsItem).toEqual({
      disabled: false,
      href: routes.PRODUCTS,
      label: "Products",
      status: "Active",
    });
    expect(ingredientsItem).toEqual({
      disabled: false,
      href: routes.INGREDIENTS,
      label: "Ingredients",
      status: "Active",
    });

    expect(
      dashboardNavItems.find((item) => item.label === "Today Log"),
    ).toEqual({
      disabled: false,
      href: routes.TODAY_LOG,
      label: "Today Log",
      status: "Active",
    });
  });

  it("protects /routines while preserving existing protected route matchers", () => {
    expect(proxySource).toContain('"/dashboard/:path*"');
    expect(proxySource).toContain('"/onboarding/:path*"');
    expect(proxySource).toContain('"/skin-profile/:path*"');
    expect(proxySource).toContain('"/routines/:path*"');
    expect(proxySource).toContain('"/journal/:path*"');
    expect(proxySource).toContain('"/products/:path*"');
    expect(proxySource).toContain('"/saved-products/:path*"');
    expect(proxySource).toContain('"/ingredients/:path*"');
  });

  it("does not add out-of-scope routine UI routes", () => {
    expect(
      existsSync(join(projectRoot, "src/app/(dashboard)/routines/new")),
    ).toBe(false);
    expect(
      existsSync(join(projectRoot, "src/app/(dashboard)/routines/[id]")),
    ).toBe(false);
    expect(
      existsSync(
        join(projectRoot, "src/app/(dashboard)/routines/[id]/analysis"),
      ),
    ).toBe(false);
    expect(existsSync(join(projectRoot, "src/app/routines"))).toBe(false);
  });

  it("does not introduce forbidden feature scope", () => {
    const combinedSource = `${routinesPageSource}\n${routineBuilderSource}\n${routineProductOptionsSource}`;

    for (const forbiddenScope of [
      "AIProvider",
      "Product module",
      "Ingredient module",
      "Product recommendations",
      "Journal",
      "Routine Logs",
      "skin score",
      "medical diagnosis",
      "dashboard data integration",
      "image upload",
      "chữa khỏi",
      "đảm bảo hiệu quả",
      "an toàn tuyệt đối",
      "trị mụn chắc chắn",
      "phù hợp 100%",
      "hiệu quả 100%",
      "cure",
      "guaranteed",
      "100% effective",
      "perfectly safe",
      "will treat acne",
    ]) {
      expect(combinedSource).not.toContain(forbiddenScope);
    }
  });
});
