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
const settingsClientPath = join(
  projectRoot,
  "src/modules/settings/settings.client.ts",
);

const settingsPageSource = readFileSync(settingsPagePath, "utf8");
const settingsComponentSource = readFileSync(settingsComponentPath, "utf8");
const settingsClientSource = readFileSync(settingsClientPath, "utf8");
const combinedSource = `${settingsComponentSource}\n${settingsClientSource}`;

describe("Settings data control UI", () => {
  it("adds the protected Settings dashboard page and renders the data control center", () => {
    expect(existsSync(settingsPagePath)).toBe(true);
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
    expect(settingsComponentSource).toContain("App role");
    expect(settingsComponentSource).toContain("Onboarding");
    expect(settingsComponentSource).toContain(
      "Trạng thái yêu cầu xóa tài khoản",
    );
    expect(settingsComponentSource).not.toContain("provider account");
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
      "Quản lý Skin Profile",
      "Quản lý Routines",
      "Mở Today Log",
      "Mở Skin Journal",
      "Mở Saved Products",
    ]) {
      expect(settingsComponentSource).toContain(copy);
    }
  });

  it("explains stored data without overstating MVP privacy scope", () => {
    for (const copy of [
      "app_user_profiles",
      "Auth.js identity",
      "Skin profile",
      "Routines",
      "Routine logs",
      "Skin journal",
      "Saved products",
      "Product and ingredient catalogue",
      "Shared app data",
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
