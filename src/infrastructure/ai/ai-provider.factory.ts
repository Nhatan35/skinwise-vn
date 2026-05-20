import "server-only";

import { AIProviderConfigurationError } from "@/infrastructure/ai/ai-provider.errors";
import type { AIProvider } from "@/infrastructure/ai/ai-provider";
import { MockAIProvider } from "@/infrastructure/ai/mock-ai-provider";

function normalizeProviderName(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export function getAIProvider(): AIProvider {
  const providerName = normalizeProviderName(process.env.AI_PROVIDER);

  if (!providerName || providerName === "mock") {
    return new MockAIProvider();
  }

  if (providerName === "openai") {
    throw new AIProviderConfigurationError(
      "OpenAI provider is not implemented yet.",
    );
  }

  if (providerName === "gemini") {
    throw new AIProviderConfigurationError(
      "Gemini provider is not implemented yet.",
    );
  }

  throw new AIProviderConfigurationError(
    `Unsupported AI provider: ${providerName}.`,
  );
}
