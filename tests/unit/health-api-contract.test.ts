import { describe, expect, it } from "vitest";

import * as healthRoute from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("exports GET as a function", () => {
    expect(typeof healthRoute.GET).toBe("function");
  });

  it("does not expose unsupported HTTP method handlers", () => {
    expect("POST" in healthRoute).toBe(false);
    expect("PUT" in healthRoute).toBe(false);
    expect("PATCH" in healthRoute).toBe(false);
    expect("DELETE" in healthRoute).toBe(false);
  });

  it("returns a safe public health response", async () => {
    const response = await healthRoute.GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
    expect(body.app).toBe("SkinWise VN");
    expect(body.version).toBe("v1.22");
    expect(typeof body.timestamp).toBe("string");
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
    expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
    expect(body.checks?.app).toBe("ok");
  });

  it("does not expose sensitive data", async () => {
    const response = await healthRoute.GET();
    const body = await response.json();

    const serializedBody = JSON.stringify(body).toLowerCase();

    const forbiddenStrings = [
      "secret",
      "auth_secret",
      "mongodb_uri",
      "auth_google_secret",
      "google_client_secret",
      "ai_api_key",
      "openai_api_key",
      "token",
      "accesstoken",
      "refreshtoken",
      "userid",
      "email",
      "password",
      "rawdocument",
      "process.env",
    ];

    for (const forbidden of forbiddenStrings) {
      expect(serializedBody).not.toContain(forbidden);
    }
  });
});
