import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const middlewareSource = readFileSync(
  resolve(process.cwd(), "src/middleware.ts"),
  "utf8",
);

describe("auth middleware foundation", () => {
  it("matches only dashboard routes", () => {
    expect(middlewareSource).toContain('matcher: ["/dashboard/:path*"]');
  });

  it("does not protect Auth.js routes or the public home page", () => {
    expect(middlewareSource).not.toContain('"/api/auth"');
    expect(middlewareSource).not.toContain('"/api/auth/:path*"');
    expect(middlewareSource).not.toContain('matcher: ["/"]');
  });

  it("does not import full server auth runtime", () => {
    expect(middlewareSource).not.toContain("@/auth");
    expect(middlewareSource).not.toContain("./auth");
  });

  it("does not import MongoDB helpers", () => {
    expect(middlewareSource).not.toContain("@/infrastructure/database/mongodb");
    expect(middlewareSource).not.toContain("getMongoClientPromise");
  });
});
