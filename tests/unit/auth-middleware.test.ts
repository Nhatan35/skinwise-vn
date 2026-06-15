import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const proxySource = readFileSync(
  resolve(process.cwd(), "src/proxy.ts"),
  "utf8",
);

describe("auth proxy foundation", () => {
  it("matches protected admin, dashboard, onboarding, Skin Profile, Routines, Routine Logs, Journal, Products, Product Match, Saved Products, Insights, Ingredients, and Settings routes", () => {
    expect(proxySource).toContain('"/admin/:path*"');
    expect(proxySource).toContain('"/dashboard/:path*"');
    expect(proxySource).toContain('"/onboarding/:path*"');
    expect(proxySource).toContain('"/skin-profile/:path*"');
    expect(proxySource).toContain('"/routines/:path*"');
    expect(proxySource).toContain('"/routine-logs/:path*"');
    expect(proxySource).toContain('"/journal/:path*"');
    expect(proxySource).toContain('"/products/:path*"');
    expect(proxySource).toContain('"/product-match/:path*"');
    expect(proxySource).toContain('"/saved-products/:path*"');
    expect(proxySource).toContain('"/insights/:path*"');
    expect(proxySource).toContain('"/ingredients/:path*"');
    expect(proxySource).toContain('"/settings/:path*"');
  });

  it("does not protect Auth.js routes or the public home page", () => {
    expect(proxySource).not.toContain('"/api/auth"');
    expect(proxySource).not.toContain('"/api/auth/:path*"');
    expect(proxySource).not.toContain('matcher: ["/"]');
  });

  it("does not import full server auth runtime", () => {
    expect(proxySource).not.toContain("@/auth");
    expect(proxySource).not.toContain("./auth");
  });

  it("does not import MongoDB helpers", () => {
    expect(proxySource).not.toContain("@/infrastructure/database/mongodb");
    expect(proxySource).not.toContain("getMongoClientPromise");
  });

  it("exports the Auth.js wrapper through the Next.js proxy convention", () => {
    expect(proxySource).toContain("export const proxy = auth");
    expect(proxySource).not.toContain("export default auth");
  });
});
