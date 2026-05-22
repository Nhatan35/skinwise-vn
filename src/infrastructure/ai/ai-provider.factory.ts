import "server-only";

import { AIProviderConfigurationError } from "@/infrastructure/ai/ai-provider.errors";
import type { AIProvider } from "@/infrastructure/ai/ai-provider";
import { MockAIProvider } from "@/infrastructure/ai/mock-ai-provider";
import { ValidatedAIProvider } from "@/infrastructure/ai/validated-ai-provider";

function normalizeProviderName(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export function getAIProvider(): AIProvider {
  const providerName = normalizeProviderName(process.env.AI_PROVIDER);
  let rawProvider: AIProvider;

  if (!providerName || providerName === "mock") {
    rawProvider = new MockAIProvider();
  } else if (providerName === "openai") {
    throw new AIProviderConfigurationError(
      "OpenAI provider is not implemented yet.",
    );
  } else if (providerName === "gemini") {
    throw new AIProviderConfigurationError(
      "Gemini provider is not implemented yet.",
    );
  } else {
    throw new AIProviderConfigurationError(
      `Unsupported AI provider: ${providerName}.`,
    );
  }

  return new ValidatedAIProvider(rawProvider);
}
