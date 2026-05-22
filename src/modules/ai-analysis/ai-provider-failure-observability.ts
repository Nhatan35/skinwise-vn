import {
  AIProviderConfigurationError,
  AIProviderResponseError,
} from "@/infrastructure/ai/ai-provider.errors";

export type RoutineAnalysisProviderFailureReason =
  | "provider_configuration_error"
  | "provider_response_error"
  | "provider_mapping_error"
  | "provider_unexpected_error";

export class RoutineAnalysisProviderMappingError extends Error {
  constructor(message = "Routine Analysis provider mapping failed.") {
    super(message);
    this.name = "RoutineAnalysisProviderMappingError";
  }
}

export function classifyRoutineAnalysisProviderFailure(
  error: unknown,
): RoutineAnalysisProviderFailureReason {
  if (error instanceof AIProviderConfigurationError) {
    return "provider_configuration_error";
  }

  if (error instanceof AIProviderResponseError) {
    return "provider_response_error";
  }

  if (error instanceof RoutineAnalysisProviderMappingError) {
    return "provider_mapping_error";
  }

  return "provider_unexpected_error";
}
