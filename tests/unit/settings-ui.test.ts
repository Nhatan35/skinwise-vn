import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const settingsPagePath = join(
  projectRoot,
  "src/app/(dashboard)/settings/page.tsx",
);
const settingsComponentPath = join(
  projectRoot,
  "src/modules/settings/components/settings-data-control-center.tsx",
);
const accountDataSummaryCardPath = join(
  projectRoot,
  "src/modules/settings/components/account-data-summary-card.tsx",
);
const settingsClientPath = join(
  projectRoot,
  "src/modules/settings/settings.client.ts",
);

const settingsPageSource = readFileSync(settingsPagePath, "utf8");
const settingsComponentSource = readFileSync(settingsComponentPath, "utf8");
const accountDataSummaryCardSource = readFileSync(
  accountDataSummaryCardPath,
  "utf8",
);
const settingsClientSource = readFileSync(settingsClientPath, "utf8");
const combinedSource = `${settingsComponentSource}\n${accountDataSummaryCardSource}\n${settingsClientSource}`;

describe("Settings data control UI", () => {
  it("adds the protected Settings dashboard page and renders the data control center", () => {
    expect(existsSync(settingsPagePath)).toBe(true);
    expect(existsSync(accountDataSummaryCardPath)).toBe(true);
    expect(settingsPageSource).toContain("SettingsDataControlCenter");
    expect(settingsPageSource).toContain("routes.SETTINGS");
    expect(settingsPageSource).toContain("data-route={routes.SETTINGS}");
    expect(settingsPageSource).toContain("Cài đặt và quản lý dữ liệu");
    expect(settingsPageSource).toContain(
      "Quản lý thông tin tài khoản, dữ liệu skincare cá nhân",
    );
  });

  it("keeps Settings UI client-side and fetches safe account information through /api/me", () => {
    expect(settingsComponentSource.startsWith('"use client";')).toBe(true);
    expect(settingsComponentSource).toContain("fetchCurrentUser");
    expect(settingsClientSource).toContain('fetch("/api/me"');
    expect(settingsClientSource).toContain("body.data.user");
    expect(settingsComponentSource).toContain("Thông tin tài khoản");
    expect(settingsComponentSource).toContain("Vai trò trong app");
    expect(settingsComponentSource).toContain("Onboarding");
    expect(settingsComponentSource).toContain(
      "Trạng thái yêu cầu xóa tài khoản",
    );
    expect(settingsComponentSource).not.toContain("provider account");
  });

  it("adds export data controls that download the export payload only", () => {
    expect(settingsComponentSource).toContain("Xuất dữ liệu");
    expect(settingsComponentSource).toContain("Xuất dữ liệu skincare");
    expect(settingsComponentSource).toContain("settings-export-data-button");
    expect(settingsComponentSource).toContain("downloadJsonFile");
    expect(settingsComponentSource).toContain("skinwise-vn-data-export-");
    expect(settingsClientSource).toContain('fetch("/api/account/export"');
    expect(settingsClientSource).toContain('method: "GET"');
    expect(settingsClientSource).toContain("body.data.export");
    expect(settingsComponentSource).not.toContain("body.data");
    expect(settingsComponentSource).not.toContain("access_token");
    expect(settingsComponentSource).not.toContain("refresh_token");
  });

  it("adds a separate danger zone for deleting only skincare app data", () => {
    expect(settingsComponentSource).toContain("Khu vực cần thận trọng");
    expect(settingsComponentSource).toContain("Xóa dữ liệu app chỉ xóa");
    expect(settingsComponentSource).toContain("không thể hoàn tác");
    expect(settingsComponentSource).toContain("Google/OAuth");
    expect(settingsComponentSource).toContain("dữ liệu của người dùng khác");
    expect(settingsComponentSource).toContain(
      "Tôi hiểu thao tác này sẽ xóa vĩnh viễn dữ liệu SkinWise VN app của tôi và không thể hoàn tác.",
    );
    expect(settingsComponentSource).toContain("app-data-delete-confirm-checkbox");
    expect(settingsComponentSource).toContain("app-data-delete-button");
    expect(settingsComponentSource).toContain("Xóa dữ liệu app của tôi");
    expect(settingsComponentSource).toContain("Đang xóa dữ liệu app...");
    expect(settingsComponentSource).toContain("isAppDataDeleteConfirmed");
    expect(settingsComponentSource).toContain("window.confirm");
    expect(settingsComponentSource).toContain("useRouter");
    expect(settingsComponentSource).toContain("router.refresh()");
    expect(settingsComponentSource).toContain("loadAccountDataSummary");
    expect(settingsComponentSource).toContain("createEmptyAccountDataSummary");
    expect(settingsComponentSource).toContain("onboardingCompleted: false");
    expect(settingsClientSource).toContain('fetch("/api/account/app-data"');
    expect(settingsClientSource).toContain('method: "DELETE"');
    expect(settingsComponentSource).not.toContain("Delete my account permanently");
    expect(settingsClientSource).not.toContain("/api/auth");
  });

  it("adds a privacy-safe account app data summary card", () => {
    expect(settingsComponentSource).toContain("AccountDataSummaryCard");
    expect(settingsComponentSource).toContain("getAccountAppDataSummary");
    expect(settingsClientSource).toContain(
      "getAccountAppDataSummary",
    );
    expect(settingsClientSource).toContain('fetch("/api/account/app-data"');
    expect(settingsClientSource).toContain('method: "GET"');
    expect(settingsClientSource).toContain("body.data.summary");

    for (const copy of [
      "T\u00f3m t\u1eaft d\u1eef li\u1ec7u \u1ee9ng d\u1ee5ng c\u1ee7a b\u1ea1n",
      "Ph\u1ea7n n\u00e0y gi\u00fap b\u1ea1n hi\u1ec3u nh\u1eefng d\u1eef li\u1ec7u ch\u0103m s\u00f3c da c\u00e1 nh\u00e2n",
      "D\u1eef li\u1ec7u c\u00e1 nh\u00e2n trong \u1ee9ng d\u1ee5ng bao g\u1ed3m h\u1ed3 s\u01a1 da",
      "D\u1eef li\u1ec7u danh m\u1ee5c chung nh\u01b0 s\u1ea3n ph\u1ea9m v\u00e0 th\u00e0nh ph\u1ea7n \u0111\u01b0\u1ee3c gi\u1eef l\u1ea1i",
      "H\u1ed3 s\u01a1 da",
      "S\u1ea3n ph\u1ea9m \u0111\u00e3 l\u01b0u",
      "Routine",
      "L\u1ecbch s\u1eed routine",
      "Ph\u00e2n t\u00edch routine",
      "Nh\u1eadt k\u00fd da",
      "\u0110ang t\u1ea3i t\u00f3m t\u1eaft d\u1eef li\u1ec7u \u1ee9ng d\u1ee5ng",
      "Th\u1eed l\u1ea1i",
    ]) {
      expect(accountDataSummaryCardSource).toContain(copy);
    }

    for (const testId of [
      'data-testid="account-data-summary-card"',
      'data-testid="account-data-summary-loading"',
      'data-testid="account-data-summary-error"',
      "account-data-summary-count-skin-profiles",
      "account-data-summary-count-saved-products",
      "account-data-summary-count-routines",
      "account-data-summary-count-routine-logs",
      "account-data-summary-count-routine-analyses",
      "account-data-summary-count-skin-journals",
      'data-testid="account-data-summary-shared-catalogue-note"',
    ]) {
      expect(accountDataSummaryCardSource).toContain(testId);
    }

    for (const forbiddenKey of [
      "userId",
      "ObjectId",
      "providerAccountId",
      "accessToken",
      "refreshToken",
      "sessionToken",
      "AUTH_SECRET",
      "DATABASE_URL",
    ]) {
      expect(accountDataSummaryCardSource).not.toContain(forbiddenKey);
    }
  });

  it("links to every user-owned data management area", () => {
    for (const route of [
      "routes.SKIN_PROFILE",
      "routes.ROUTINES",
      "routes.TODAY_LOG",
      "routes.JOURNAL",
      "routes.SAVED_PRODUCTS",
    ]) {
      expect(settingsComponentSource).toContain(route);
    }

    for (const copy of [
      "Quản lý hồ sơ da",
      "Quản lý routine",
      "Mở routine hôm nay",
      "Mở nhật ký da",
      "Xem sản phẩm đã lưu",
    ]) {
      expect(settingsComponentSource).toContain(copy);
    }
  });

  it("explains stored data without overstating MVP privacy scope", () => {
    for (const copy of [
      "app_user_profiles",
      "danh tính Auth.js",
      "Hồ sơ da",
      "Routine",
      "Ghi nhận routine",
      "Nhật ký da",
      "Sản phẩm đã lưu",
      "Danh mục sản phẩm và thành phần",
      "Dữ liệu dùng chung",
      "Xuất dữ liệu",
      "Khu vực cần thận trọng",
    ]) {
      expect(settingsComponentSource).toContain(copy);
    }

    for (const forbiddenScope of [
      "PDF",
      "CSV",
      "GDPR compliance",
      "medical diagnosis",
      "skin score",
      "marketplace",
      "notifications",
    ]) {
      expect(settingsComponentSource).not.toContain(forbiddenScope);
    }
  });

  it("supports MVP-safe account deletion request with explicit confirmation", () => {
    expect(settingsComponentSource).toContain("Yêu cầu xóa tài khoản");
    expect(settingsComponentSource).toContain("Gửi yêu cầu xóa tài khoản");
    expect(settingsComponentSource).toContain("Đã gửi yêu cầu");
    expect(settingsComponentSource).toContain('type="checkbox"');
    expect(settingsComponentSource).toContain("isConfirmed");
    expect(settingsComponentSource).toContain(
      "không phải thao tác xóa tự động ngay lập tức",
    );
    expect(settingsClientSource).toContain(
      'fetch("/api/account/deletion-request"',
    );
    expect(settingsClientSource).toContain('method: "POST"');
  });

  it("provides retry, sign-in recovery, and disabled-action descriptions", () => {
    for (const requiredSource of [
      "reloadKey",
      "setReloadKey((current) => current + 1)",
      "Thử lại",
      "Về dashboard",
      "SETTINGS_SIGN_IN_HREF",
      "Đăng nhập lại",
      "APP_DATA_DELETE_CONFIRMATION_ID",
      "ACCOUNT_DELETE_CONFIRMATION_ID",
      "aria-describedby={APP_DATA_DELETE_CONFIRMATION_ID}",
    ]) {
      expect(settingsComponentSource).toContain(requiredSource);
    }
  });

  it("does not import repositories, MongoDB, or server-only auth helpers", () => {
    for (const forbiddenImport of [
      "repository",
      "mongodb",
      "server-only",
      "getCurrentUser",
      "@/auth",
      "next-auth",
    ]) {
      expect(combinedSource).not.toContain(forbiddenImport);
    }
  });
});
