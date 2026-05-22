import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  AIProviderConfigurationError,
  AIProviderResponseError,
} from "@/infrastructure/ai";
import {
  classifyRoutineAnalysisProviderFailure,
  RoutineAnalysisProviderMappingError,
} from "@/modules/ai-analysis/ai-provider-failure-observability";

describe("classifyRoutineAnalysisProviderFailure", () => {
  it("classifies AI provider configuration errors", () => {
    expect(
      classifyRoutineAnalysisProviderFailure(
        new AIProviderConfigurationError("OpenAI provider is not configured."),
      ),
    ).toBe("provider_configuration_error");
  });

  it("classifies AI provider response and validation errors", () => {
    expect(
      classifyRoutineAnalysisProviderFailure(
        new AIProviderResponseError("Invalid routine analysis output."),
      ),
    ).toBe("provider_response_error");
  });

  it("classifies explicit provider mapping errors", () => {
    expect(
      classifyRoutineAnalysisProviderFailure(
        new RoutineAnalysisProviderMappingError(),
      ),
    ).toBe("provider_mapping_error");
  });

  it("classifies unknown Error values as unexpected provider errors", () => {
    expect(
      classifyRoutineAnalysisProviderFailure(
        new Error("secret provider error"),
      ),
    ).toBe("provider_unexpected_error");
  });

  it("classifies non-Error thrown values without throwing", () => {
    const thrownValues: unknown[] = [
      "string error",
      null,
      undefined,
      { message: "object error" },
    ];

    for (const thrownValue of thrownValues) {
      expect(() =>
        classifyRoutineAnalysisProviderFailure(thrownValue),
      ).not.toThrow();
      expect(classifyRoutineAnalysisProviderFailure(thrownValue)).toBe(
        "provider_unexpected_error",
      );
    }
  });
});
