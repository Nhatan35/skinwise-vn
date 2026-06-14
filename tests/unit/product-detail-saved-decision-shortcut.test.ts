import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  savedProductDecisionStatusLabels,
  savedProductDecisionStatusOptions,
  savedProductPlannedRoutineSlotLabels,
  savedProductPlannedRoutineSlotOptions,
} from "@/modules/saved-products/saved-product-labels";

const projectRoot = process.cwd();
const productDetailPath = join(
  projectRoot,
  "src/modules/products/components/product-detail.tsx",
);
const shortcutPath = join(
  projectRoot,
  "src/modules/products/components/product-detail-saved-decision-shortcut.tsx",
);
const decisionSupportPath = join(
  projectRoot,
  "src/modules/saved-products/components/saved-product-decision-support.tsx",
);
const togglePath = join(
  projectRoot,
  "src/modules/saved-products/components/saved-product-toggle-button.tsx",
);
const labelsPath = join(
  projectRoot,
  "src/modules/saved-products/saved-product-labels.ts",
);

const productDetailSource = readFileSync(productDetailPath, "utf8");
const shortcutSource = readFileSync(shortcutPath, "utf8");
const decisionSupportSource = readFileSync(decisionSupportPath, "utf8");
const toggleSource = readFileSync(togglePath, "utf8");
const labelsSource = readFileSync(labelsPath, "utf8");
const combinedFeatureSource = `${productDetailSource}\n${shortcutSource}\n${decisionSupportSource}\n${toggleSource}\n${labelsSource}`;

describe("Product Detail saved decision shortcut", () => {
  it("adds a compact panel with safe loading, signed-out, error, and not-saved states", () => {
    expect(existsSync(shortcutPath)).toBe(true);

    for (const requiredSource of [
      "ProductDetailSavedDecisionShortcut",
      '"loading"',
      '"signed-out"',
      '"error"',
      '"ready"',
      "Thông tin cân nhắc cá nhân",
      "Lưu lại cách bạn đang cân nhắc sản phẩm này để dễ xem lại trong danh",
      "Đang tải thông tin cân nhắc đã lưu...",
      "Đăng nhập và lưu sản phẩm để thêm trạng thái cân nhắc và ghi chú cá",
      "Chưa tải được thông tin cân nhắc đã lưu.",
      "Lưu sản phẩm để thêm trạng thái cân nhắc và ghi chú cá nhân.",
      "không thay",
      "thế việc theo dõi phản ứng thực tế của da.",
      'role="status"',
    ]) {
      expect(shortcutSource).toContain(requiredSource);
    }
  });

  it("shows editable metadata only for a loaded saved product", () => {
    expect(shortcutSource).toContain('state === "ready" && !item');
    expect(shortcutSource).toContain('state === "ready" && item');
    expect(shortcutSource).toContain("SavedProductDecisionSupport");
    expect(shortcutSource).toContain('layout="compact"');

    for (const requiredSource of [
      "Trạng thái cân nhắc",
      "Dự định dùng trong routine",
      "Ghi chú cá nhân",
      "Ghi chú này chỉ giúp bạn nhớ lý do cân nhắc sản phẩm.",
      "Không nên thêm nhiều sản phẩm mới cùng lúc.",
      "Theo dõi cảm nhận của da khi thay đổi routine.",
    ]) {
      expect(decisionSupportSource).toContain(requiredSource);
    }
  });

  it("reuses shared labels for both decision fields", () => {
    expect(savedProductDecisionStatusLabels).toEqual({
      considering: "Đang cân nhắc",
      testing: "Đang dùng thử",
      paused: "Tạm dừng",
      kept: "Muốn giữ lại",
    });
    expect(savedProductPlannedRoutineSlotLabels).toEqual({
      morning: "Buổi sáng",
      evening: "Buổi tối",
      either: "Sáng hoặc tối",
      not_sure: "Chưa chắc",
    });
    expect(savedProductDecisionStatusOptions).toHaveLength(4);
    expect(savedProductPlannedRoutineSlotOptions).toHaveLength(4);
    expect(decisionSupportSource).toContain(
      "savedProductDecisionStatusOptions",
    );
    expect(decisionSupportSource).toContain(
      "savedProductPlannedRoutineSlotOptions",
    );
  });

  it("loads and retains the full saved product DTO on Product Detail", () => {
    for (const requiredSource of [
      "useState<SavedProductDto | null>",
      "savedProductsResult.value.find",
      "(item) => item.productId === productId",
      "setSavedProduct",
      "savedProduct !== null",
      "getSavedDecisionState",
      'error.code === "UNAUTHORIZED"',
      'return "signed-out"',
    ]) {
      expect(productDetailSource).toContain(requiredSource);
    }
  });

  it("updates Product Detail immediately after confirmed save or remove", () => {
    for (const requiredSource of [
      "onSavedProductChange?: (item: SavedProductDto | null) => void",
      "changedItem = await saveProduct(productId)",
      "await removeSavedProduct(productId)",
      "onSavedProductChange?.(changedItem)",
    ]) {
      expect(toggleSource).toContain(requiredSource);
    }

    expect(productDetailSource).toContain(
      "onSavedProductChange={(item) =>",
    );
    expect(productDetailSource).toContain("setSavedDecisionState(\"ready\")");
  });

  it("uses the existing metadata client helper with pending and feedback states", () => {
    for (const requiredSource of [
      "updateSavedProductMetadata",
      "item.productId",
      "decisionStatus",
      "plannedRoutineSlot",
      "personalNote",
      "Cập nhật thông tin cân nhắc",
      "Đang cập nhật...",
      "Đã cập nhật ghi chú sản phẩm đã lưu.",
      "Chưa thể cập nhật ghi chú lúc này. Vui lòng thử lại.",
      "aria-busy={isSaving}",
      'role={errorMessage ? "alert" : "status"}',
      "onUpdated(updatedItem)",
    ]) {
      expect(decisionSupportSource).toContain(requiredSource);
    }

    for (const forbiddenField of [
      "userId",
      "_id",
      "ObjectId",
      "owner",
      "ownership",
      "createdAt",
      "updatedAt",
    ]) {
      expect(decisionSupportSource).not.toContain(forbiddenField);
    }
  });

  it("keeps Product Match rendering and avoids direct request methods in Product Detail UI", () => {
    expect(productDetailSource).toContain("ProductMatchExplanationCard");
    expect(productDetailSource).toContain("getProductMatchForProduct");

    for (const directRequestSource of [
      'method: "PATCH"',
      'method: "POST"',
      'method: "DELETE"',
      "fetch(",
    ]) {
      expect(`${productDetailSource}\n${shortcutSource}`).not.toContain(
        directRequestSource,
      );
    }
  });

  it("keeps the new client-side source within the decision-support boundary", () => {
    const lowerSource = combinedFeatureSource.toLocaleLowerCase("vi-VN");

    for (const forbiddenImport of [
      "server-only",
      "@/infrastructure/database",
      "saved-product.repository",
      "saved-product.use-case",
      "@/modules/auth",
      "process.env",
    ]) {
      expect(lowerSource).not.toContain(forbiddenImport.toLowerCase());
    }

    for (const forbiddenCopy of [
      "chắc chắn phù hợp",
      "an toàn tuyệt đối",
      "chữa khỏi",
      "kết quả đảm bảo",
      "đảm bảo hiệu quả",
      "sản phẩm tốt nhất cho da bạn",
      "ai chọn sản phẩm tốt nhất",
      "bắt buộc phải dùng",
      "không gây kích ứng",
      "phù hợp 100%",
    ]) {
      expect(lowerSource).not.toContain(forbiddenCopy);
    }
  });
});
