import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const proxySource = readFileSync(
  resolve(process.cwd(), "src/proxy.ts"),
  "utf8",
);

describe("auth proxy foundation", () => {
  it("matches protected dashboard and onboarding routes", () => {
    expect(proxySource).toContain(
      'matcher: ["/dashboard/:path*", "/onboarding/:path*"]',
    );
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
