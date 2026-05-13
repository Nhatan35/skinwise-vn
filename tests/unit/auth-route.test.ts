import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const routeSource = readFileSync(
  resolve(process.cwd(), "src/app/api/auth/[...nextauth]/route.ts"),
  "utf8",
);

describe("Auth.js route foundation", () => {
  it("uses the Node.js runtime", () => {
    expect(routeSource).toContain('export const runtime = "nodejs"');
  });

  it("imports handlers from the server auth runtime", () => {
    expect(routeSource).toContain('import { handlers } from "@/auth"');
  });

  it("exports GET and POST from handlers", () => {
    expect(routeSource).toContain("export const { GET, POST } = handlers");
  });

  it("does not use the SkinWise response wrapper", () => {
    expect(routeSource).not.toContain("data:");
    expect(routeSource).not.toContain("error:");
    expect(routeSource).not.toContain("NextResponse.json");
  });

  it("does not query database or AppUserProfile directly", () => {
    expect(routeSource).not.toContain("getMongoDb");
    expect(routeSource).not.toContain("getCollection");
    expect(routeSource).not.toContain("AppUserProfile");
    expect(routeSource).not.toContain("app_user_profiles");
  });
});
