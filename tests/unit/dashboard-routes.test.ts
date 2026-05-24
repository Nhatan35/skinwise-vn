import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  redirect: vi.fn((url: string): never => {
    throw new Error(`redirect:${url}`);
  }),
}));

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: mocks.getCurrentUser,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import DashboardLayout, { dynamic } from "@/app/(dashboard)/layout";

describe("dashboard protected route behavior", () => {
  beforeEach(() => {
    mocks.getCurrentUser.mockReset();
    mocks.redirect.mockClear();
  });

  it("marks the protected dashboard route group as request-time dynamic", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("redirects unauthenticated users to the Auth.js default sign-in route", async () => {
    mocks.getCurrentUser.mockResolvedValue(null);

    await expect(
      DashboardLayout({ children: "Protected content" }),
    ).rejects.toThrow("redirect:/api/auth/signin?callbackUrl=/dashboard");
    expect(mocks.redirect).toHaveBeenCalledWith(
      "/api/auth/signin?callbackUrl=/dashboard",
    );
  });

  it("renders the dashboard shell for authenticated users", async () => {
    mocks.getCurrentUser.mockResolvedValue({
      email: "an@example.com",
      id: "auth-user-id",
      name: "An",
    });

    await expect(
      DashboardLayout({ children: "Protected content" }),
    ).resolves.toBeTruthy();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
});
